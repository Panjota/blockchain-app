"""
MiniBlockchain - Implementação Educacional de Blockchain em Python
"""

import hashlib
import json
import time
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime


class Bloco:
    """
    Representa um bloco individual na blockchain.
    
    Um bloco contém um conjunto de dados (transações), um timestamp,
    um hash do bloco anterior e seu próprio hash calculado.
    
    Attributes:
        index (int): Posição do bloco na cadeia
        timestamp (float): Momento de criação do bloco (Unix timestamp)
        dados (Any): Dados armazenados no bloco (geralmente lista de transações)
        hash_anterior (str): Hash SHA-256 do bloco anterior
        nonce (int): Número usado no processo de Proof of Work
        hash (str): Hash SHA-256 deste bloco
    """
    
    def __init__(self, index: int, timestamp: float, dados: Any, hash_anterior: str):
        """
        Inicializa um novo bloco.
        
        Args:
            index: Posição do bloco na cadeia (0 para bloco gênesis)
            timestamp: Momento de criação do bloco
            dados: Dados a serem armazenados (transações, mensagens, etc)
            hash_anterior: Hash do bloco anterior na cadeia
        """
        self.index = index
        self.timestamp = timestamp
        self.dados = dados
        self.hash_anterior = hash_anterior
        self.nonce = 0
        self.hash = self.calcular_hash()
    
    def calcular_hash(self) -> str:
        """
        Calcula o hash SHA-256 do bloco.
        
        O hash é calculado a partir da concatenação de todos os
        atributos do bloco, garantindo unicidade e integridade.
        
        Returns:
            str: Hash hexadecimal de 64 caracteres
        """
        conteudo_bloco = f"{self.index}{self.timestamp}{self.dados}{self.hash_anterior}{self.nonce}"
        return hashlib.sha256(conteudo_bloco.encode()).hexdigest()
    
    def minerar_bloco(self, dificuldade: int) -> int:
        """
        Executa o algoritmo de Proof of Work.
        
        Incrementa o nonce até encontrar um hash que satisfaça
        o critério de dificuldade (número de zeros iniciais).
        
        Args:
            dificuldade: Número de zeros necessários no início do hash
            
        Returns:
            int: Número de iterações realizadas
        """
        prefixo_alvo = "0" * dificuldade
        iteracoes = 0
        
        while self.hash[:dificuldade] != prefixo_alvo:
            self.nonce += 1
            self.hash = self.calcular_hash()
            iteracoes += 1
        
        return iteracoes
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Converte o bloco para formato de dicionário.
        
        Returns:
            Dict contendo todos os atributos do bloco
        """
        return {
            'index': self.index,
            'timestamp': self.timestamp,
            'dados': self.dados,
            'hash_anterior': self.hash_anterior,
            'nonce': self.nonce,
            'hash': self.hash
        }
    
    def __repr__(self) -> str:
        """Representação string do bloco."""
        return f"Bloco(index={self.index}, hash={self.hash[:16]}...)"


class MiniBlockchain:
    """
    Gerencia a cadeia de blocos completa.
    
    A blockchain mantém uma lista ordenada de blocos, onde cada
    bloco contém o hash do anterior, criando uma cadeia imutável.
    
    Attributes:
        cadeia (List[Bloco]): Lista de blocos na cadeia
        dificuldade (int): Nível de dificuldade para mineração
        transacoes_pendentes (List[Dict]): Transações aguardando mineração
    """
    
    def __init__(self, dificuldade: int = 3):
        """
        Inicializa uma nova blockchain.
        
        Args:
            dificuldade: Nível de dificuldade para Proof of Work (padrão: 3)
        """
        self.cadeia: List[Bloco] = []
        self.dificuldade = dificuldade
        self.transacoes_pendentes: List[Dict] = []
        self._criar_bloco_genesis()
    
    def _criar_bloco_genesis(self) -> None:
        """
        Cria o bloco gênesis (primeiro bloco da cadeia).
        
        O bloco gênesis é único pois não possui bloco anterior,
        sendo representado com hash_anterior = "0".
        """
        bloco_genesis = Bloco(
            index=0,
            timestamp=time.time(),
            dados="Bloco Gênesis",
            hash_anterior="0"
        )
        bloco_genesis.minerar_bloco(self.dificuldade)
        self.cadeia.append(bloco_genesis)
    
    def obter_ultimo_bloco(self) -> Bloco:
        """
        Retorna o último bloco da cadeia.
        
        Returns:
            Bloco: Último bloco adicionado à cadeia
        """
        return self.cadeia[-1]
    
    def adicionar_transacao(self, remetente: str, destinatario: str, valor: float) -> None:
        """
        Adiciona uma transação ao pool de transações pendentes.
        
        Args:
            remetente: Endereço de quem envia
            destinatario: Endereço de quem recebe
            valor: Quantidade a ser transferida
        """
        transacao = {
            'remetente': remetente,
            'destinatario': destinatario,
            'valor': valor,
            'timestamp': time.time()
        }
        self.transacoes_pendentes.append(transacao)
    
    def minerar_transacoes_pendentes(self, endereco_minerador: str) -> Optional[Bloco]:
        """
        Minera as transações pendentes em um novo bloco.
        
        Este método:
        1. Cria um novo bloco com as transações pendentes
        2. Executa Proof of Work
        3. Adiciona o bloco à cadeia
        4. Limpa as transações pendentes
        
        Args:
            endereco_minerador: Endereço que receberá recompensa (se aplicável)
            
        Returns:
            Optional[Bloco]: Bloco minerado, ou None se não houver transações
        """
        if not self.transacoes_pendentes:
            return None
        
        novo_bloco = Bloco(
            index=len(self.cadeia),
            timestamp=time.time(),
            dados=self.transacoes_pendentes.copy(),
            hash_anterior=self.obter_ultimo_bloco().hash
        )
        
        novo_bloco.minerar_bloco(self.dificuldade)
        self.cadeia.append(novo_bloco)
        self.transacoes_pendentes = []
        
        return novo_bloco
    
    def validar_cadeia(self) -> Tuple[bool, Optional[str]]:
        """
        Valida a integridade de toda a blockchain.
        
        Verificações realizadas:
        1. Hash de cada bloco está correto
        2. Hash anterior de cada bloco coincide com hash do bloco anterior
        3. Proof of Work de cada bloco é válido
        
        Returns:
            Tuple[bool, Optional[str]]: (é_valida, mensagem_erro)
        """
        for i in range(1, len(self.cadeia)):
            bloco_atual = self.cadeia[i]
            bloco_anterior = self.cadeia[i - 1]
            
            # Verificar hash do bloco
            if bloco_atual.hash != bloco_atual.calcular_hash():
                return False, f"Hash do bloco {i} foi corrompido"
            
            # Verificar encadeamento
            if bloco_atual.hash_anterior != bloco_anterior.hash:
                return False, f"Encadeamento quebrado no bloco {i}"
            
            # Verificar proof of work
            prefixo_alvo = "0" * self.dificuldade
            if bloco_atual.hash[:self.dificuldade] != prefixo_alvo:
                return False, f"Proof of Work inválido no bloco {i}"
        
        return True, None
    
    def obter_saldo(self, endereco: str) -> float:
        """
        Calcula o saldo de um endereço percorrendo toda a blockchain.
        
        Args:
            endereco: Endereço para calcular saldo
            
        Returns:
            float: Saldo calculado
        """
        saldo = 0.0
        
        for bloco in self.cadeia:
            if isinstance(bloco.dados, list):
                for transacao in bloco.dados:
                    if isinstance(transacao, dict):
                        if transacao.get('destinatario') == endereco:
                            saldo += transacao.get('valor', 0)
                        if transacao.get('remetente') == endereco:
                            saldo -= transacao.get('valor', 0)
        
        return saldo
    
    def obter_historico_transacoes(self, endereco: str) -> List[Dict]:
        """
        Retorna o histórico de transações de um endereço.
        
        Args:
            endereco: Endereço para consultar histórico
            
        Returns:
            List[Dict]: Lista de transações envolvendo o endereço
        """
        historico = []
        
        for bloco in self.cadeia:
            if isinstance(bloco.dados, list):
                for transacao in bloco.dados:
                    if isinstance(transacao, dict):
                        if (transacao.get('remetente') == endereco or 
                            transacao.get('destinatario') == endereco):
                            historico.append({
                                'bloco': bloco.index,
                                'transacao': transacao,
                                'timestamp': transacao.get('timestamp')
                            })
        
        return historico
    
    def obter_estatisticas(self) -> Dict[str, Any]:
        """
        Retorna estatísticas da blockchain.
        
        Returns:
            Dict contendo métricas da blockchain
        """
        total_transacoes = sum(
            len(bloco.dados) if isinstance(bloco.dados, list) else 0 
            for bloco in self.cadeia
        )
        
        return {
            'total_blocos': len(self.cadeia),
            'transacoes_pendentes': len(self.transacoes_pendentes),
            'total_transacoes': total_transacoes,
            'dificuldade': self.dificuldade
        }
    
    def salvar_em_arquivo(self, caminho_arquivo: str) -> bool:
        """
        Persiste a blockchain em arquivo JSON.
        
        Args:
            caminho_arquivo: Caminho do arquivo de destino
            
        Returns:
            bool: True se salvamento foi bem-sucedido
        """
        try:
            dados = {
                'dificuldade': self.dificuldade,
                'cadeia': [bloco.to_dict() for bloco in self.cadeia],
                'transacoes_pendentes': self.transacoes_pendentes,
                'timestamp_salvamento': time.time()
            }
            
            with open(caminho_arquivo, 'w', encoding='utf-8') as arquivo:
                json.dump(dados, arquivo, indent=2, ensure_ascii=False)
            
            return True
        except Exception:
            return False
    
    def carregar_de_arquivo(self, caminho_arquivo: str) -> bool:
        """
        Carrega blockchain de um arquivo JSON.
        
        Args:
            caminho_arquivo: Caminho do arquivo de origem
            
        Returns:
            bool: True se carregamento foi bem-sucedido
        """
        try:
            with open(caminho_arquivo, 'r', encoding='utf-8') as arquivo:
                dados = json.load(arquivo)
            
            self.dificuldade = dados.get('dificuldade', 3)
            self.transacoes_pendentes = dados.get('transacoes_pendentes', [])
            self.cadeia = []
            
            # Reconstruir blocos
            for bloco_dict in dados.get('cadeia', []):
                bloco = Bloco(
                    index=bloco_dict['index'],
                    timestamp=bloco_dict['timestamp'],
                    dados=bloco_dict['dados'],
                    hash_anterior=bloco_dict['hash_anterior']
                )
                bloco.nonce = bloco_dict['nonce']
                bloco.hash = bloco_dict['hash']
                self.cadeia.append(bloco)
            
            return True
        except Exception:
            return False
    
    def exibir_cadeia(self) -> str:
        """
        Retorna uma representação textual da blockchain.
        
        Returns:
            str: Representação formatada da cadeia
        """
        resultado = []
        resultado.append("=" * 80)
        resultado.append("BLOCKCHAIN")
        resultado.append("=" * 80)
        
        for bloco in self.cadeia:
            resultado.append(f"\nBloco #{bloco.index}")
            resultado.append(f"  Timestamp: {datetime.fromtimestamp(bloco.timestamp).isoformat()}")
            resultado.append(f"  Hash Anterior: {bloco.hash_anterior}")
            resultado.append(f"  Hash: {bloco.hash}")
            resultado.append(f"  Nonce: {bloco.nonce}")
            
            if isinstance(bloco.dados, str):
                resultado.append(f"  Dados: {bloco.dados}")
            elif isinstance(bloco.dados, list):
                resultado.append(f"  Transações: {len(bloco.dados)}")
                for idx, tx in enumerate(bloco.dados, 1):
                    if isinstance(tx, dict):
                        resultado.append(f"    {idx}. {tx.get('remetente')} → "
                                       f"{tx.get('destinatario')}: {tx.get('valor')}")
        
        resultado.append("\n" + "=" * 80)
        return "\n".join(resultado)


def demonstracao_basica():
    """
    Demonstra o uso básico da blockchain.
    
    Esta função cria uma blockchain, adiciona transações,
    minera blocos e valida a integridade.
    """
    print("Iniciando demonstração MiniBlockchain\n")
    
    # Criar blockchain
    blockchain = MiniBlockchain(dificuldade=3)
    print(f"Blockchain criada com bloco gênesis")
    
    # Adicionar transações
    blockchain.adicionar_transacao("Alice", "Bob", 50)
    blockchain.adicionar_transacao("Bob", "Carlos", 25)
    print(f"Transações adicionadas: 2")
    
    # Minerar bloco
    bloco = blockchain.minerar_transacoes_pendentes("Minerador1")
    if bloco:
        print(f"Bloco {bloco.index} minerado: {bloco.hash[:16]}...")
    
    # Adicionar mais transações
    blockchain.adicionar_transacao("Carlos", "Diana", 10)
    blockchain.adicionar_transacao("Diana", "Alice", 5)
    print(f"Transações adicionadas: 2")
    
    # Minerar segundo bloco
    bloco = blockchain.minerar_transacoes_pendentes("Minerador2")
    if bloco:
        print(f"Bloco {bloco.index} minerado: {bloco.hash[:16]}...")
    
    # Validar blockchain
    valida, erro = blockchain.validar_cadeia()
    print(f"\nValidação da blockchain: {'✓ Válida' if valida else f'✗ Inválida - {erro}'}")
    
    # Exibir estatísticas
    stats = blockchain.obter_estatisticas()
    print(f"\nEstatísticas:")
    print(f"  Total de blocos: {stats['total_blocos']}")
    print(f"  Total de transações: {stats['total_transacoes']}")
    print(f"  Dificuldade: {stats['dificuldade']}")
    
    # Exibir saldos
    print(f"\nSaldos:")
    for usuario in ["Alice", "Bob", "Carlos", "Diana"]:
        saldo = blockchain.obter_saldo(usuario)
        print(f"  {usuario}: {saldo}")
    
    # Salvar blockchain
    if blockchain.salvar_em_arquivo("blockchain_demo.json"):
        print(f"\nBlockchain salva em 'blockchain_demo.json'")
    
    return blockchain


if __name__ == "__main__":
    demonstracao_basica()
