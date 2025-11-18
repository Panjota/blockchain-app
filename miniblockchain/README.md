# MiniBlockchain

Implementação educacional de blockchain em Python para demonstrar conceitos fundamentais da tecnologia blockchain.

**Instituição:** Universidade do Estado do Amazonas (UEA)  
**Disciplina:** Tópicos Especiais 4  
**Curso:** Engenharia de Computação

## Visão Geral

MiniBlockchain é uma implementação simplificada de blockchain desenvolvida do zero em Python, utilizando apenas bibliotecas padrão. O projeto demonstra os conceitos fundamentais de blockchain de forma clara e didática.

## Conceitos Demonstrados

- **Bloco**: Estrutura de dados que armazena transações e metadados
- **Hash Criptográfico**: SHA-256 para identificação única e segurança
- **Encadeamento**: Imutabilidade através de referências criptográficas
- **Proof of Work**: Mecanismo de consenso baseado em trabalho computacional
- **Validação**: Verificação de integridade da cadeia

## Estrutura

```
miniblockchain/
├── miniblockchain.py        # Implementação principal
├── test_miniblockchain.py   # Suite de testes (12 testes)
└── README.md                # Este arquivo
```

## Requisitos

- Python 3.8+
- Apenas bibliotecas padrão (hashlib, json, time, typing)

## Instalação e Uso

### Executar Demonstração

```bash
python3 miniblockchain.py
```

**Saída:**
```
Iniciando demonstração MiniBlockchain

Blockchain criada com bloco gênesis
Transações adicionadas: 2
Bloco 1 minerado: 000f4c0739fd688c...
Transações adicionadas: 2
Bloco 2 minerado: 0002f7df97d0f512...

Validação da blockchain: ✓ Válida

Estatísticas:
  Total de blocos: 3
  Total de transações: 4
  Dificuldade: 3

Saldos:
  Alice: -45.0
  Bob: 25.0
  Carlos: 15.0
  Diana: 5.0

Blockchain salva em 'blockchain_demo.json'
```

### Executar Testes

```bash
python3 test_miniblockchain.py
```

**Resultado:** 12/12 testes passando ✅

## Uso em Código

```python
from miniblockchain import MiniBlockchain

# Criar blockchain
blockchain = MiniBlockchain(dificuldade=3)

# Adicionar transações
blockchain.adicionar_transacao("Alice", "Bob", 50)
blockchain.adicionar_transacao("Bob", "Carlos", 25)

# Minerar bloco
bloco = blockchain.minerar_transacoes_pendentes("Minerador1")

# Validar
valida, erro = blockchain.validar_cadeia()
print(f"Blockchain válida: {valida}")

# Consultar saldo
saldo = blockchain.obter_saldo("Alice")
print(f"Saldo de Alice: {saldo}")

# Salvar
blockchain.salvar_em_arquivo("blockchain.json")
```

## Arquitetura

### Classe Bloco

Representa um bloco individual na blockchain.

```python
class Bloco:
    index: int              # Posição na cadeia
    timestamp: float        # Momento de criação
    dados: Any             # Transações armazenadas
    hash_anterior: str     # Hash do bloco anterior
    nonce: int            # Número para PoW
    hash: str             # Hash único do bloco
```

**Métodos:**
- `calcular_hash()` - Gera hash SHA-256 do bloco
- `minerar_bloco(dificuldade)` - Executa Proof of Work
- `to_dict()` - Serializa para dicionário

### Classe MiniBlockchain

Gerencia a cadeia de blocos completa.

```python
class MiniBlockchain:
    cadeia: List[Bloco]                # Lista de blocos
    dificuldade: int                   # Nível de dificuldade
    transacoes_pendentes: List[Dict]   # Pool de transações
```

**Métodos principais:**
- `adicionar_transacao(remetente, destinatario, valor)` - Adiciona transação
- `minerar_transacoes_pendentes(minerador)` - Minera novo bloco
- `validar_cadeia()` - Valida integridade
- `obter_saldo(endereco)` - Calcula saldo
- `salvar_em_arquivo(caminho)` - Persiste em JSON
- `carregar_de_arquivo(caminho)` - Carrega de JSON

## Explicação dos Conceitos

### 1. Bloco

Estrutura que armazena dados e metadados:

```json
{
  "index": 1,
  "timestamp": 1699999999.123,
  "dados": [{"remetente": "Alice", "destinatario": "Bob", "valor": 50}],
  "hash_anterior": "000abc123...",
  "nonce": 8546,
  "hash": "000def456..."
}
```

### 2. Hash Criptográfico (SHA-256)

Função que gera "impressão digital" única:

- **Determinístico**: Mesma entrada sempre gera mesmo hash
- **Unidirecional**: Impossível reverter hash para dados originais
- **Sensível**: Pequena mudança → hash completamente diferente
- **Resistente a colisões**: Impossível encontrar duas entradas com mesmo hash

**Exemplo:**
```
hash("Hello") → 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
hash("Hellp") → 9d1e6d8...  (completamente diferente)
```

### 3. Encadeamento Criptográfico

Cada bloco contém o hash do anterior, criando cadeia imutável:

```
Bloco 0 (Gênesis)          Bloco 1                Bloco 2
┌────────────────┐        ┌────────────────┐      ┌────────────────┐
│ Hash: 000abc...│   ───> │ Hash: 000def...│ ───> │ Hash: 000ghi...│
│ Prev: 0        │        │ Prev: 000abc...│      │ Prev: 000def...│
└────────────────┘        └────────────────┘      └────────────────┘
```

**Imutabilidade:** Modificar um bloco altera seu hash, quebrando o encadeamento.

### 4. Proof of Work (Mineração)

Algoritmo que requer trabalho computacional:

1. Pegar transações pendentes
2. Criar bloco candidato
3. Encontrar nonce que gere hash com N zeros iniciais
4. Adicionar bloco à cadeia

**Exemplo:**
```python
# Dificuldade 3: hash deve começar com "000"
nonce = 0
while not hash.startswith("000"):
    nonce += 1
    hash = calcular_hash()
# Após milhares de tentativas: hash = "000abc123..."
```

### 5. Validação

Verifica integridade da blockchain:

- ✓ Hash de cada bloco está correto?
- ✓ Hash anterior aponta para bloco correto?
- ✓ Proof of Work é válido?

## Performance

| Operação | Tempo | Complexidade |
|----------|-------|--------------|
| Criar bloco | < 1 ms | O(1) |
| Calcular hash | < 1 ms | O(1) |
| Minerar (dif. 3) | 50-500 ms | O(2^d) |
| Validar cadeia | ~10 ms | O(n) |
| Consultar saldo | variável | O(n×m) |

## Análise Crítica

### Vantagens

✅ **Educacional** - Código claro e didático  
✅ **Segurança** - SHA-256 como Bitcoin  
✅ **Imutabilidade** - Encadeamento detecta adulterações  
✅ **Modularidade** - Fácil de estender  
✅ **Testável** - 100% cobertura de testes  

### Limitações

❌ **Escalabilidade** - < 1 tx/s (Bitcoin: ~7 tx/s)  
❌ **Consumo de energia** - PoW intensivo  
❌ **Sem rede P2P** - Single-node  
❌ **Sem assinatura digital** - Falta autenticação criptográfica  
❌ **Validação simplificada** - Não verifica saldo antes  
❌ **Sem smart contracts** - Apenas transações simples  

### Comparação com Blockchains Reais

| | MiniBlockchain | Bitcoin | Ethereum |
|---|---|---|---|
| **Consenso** | PoW simples | PoW SHA-256 | PoS |
| **TPS** | < 1 | ~7 | ~15-30 |
| **Tempo de Bloco** | Variável | ~10 min | ~12 seg |
| **Smart Contracts** | Não | Limitado | Sim |
| **Rede P2P** | Não | Sim | Sim |
| **Uso** | Educacional | Pagamentos | dApps |

## Casos de Uso

### ✅ Apropriado Para

- Educação e treinamento
- Demonstrações em aula
- Prototipagem de conceitos
- Base para projetos acadêmicos

### ❌ NÃO Use Para

- Aplicações de produção
- Transações financeiras reais
- Dados sensíveis
- Sistemas críticos

## Testes

```bash
python3 test_miniblockchain.py
```

**12 testes implementados:**

1. ✓ Criação de bloco
2. ✓ Hash determinístico
3. ✓ Hash sensível a mudanças
4. ✓ Mineração (Proof of Work)
5. ✓ Criação da blockchain
6. ✓ Adição de transações
7. ✓ Mineração de transações
8. ✓ Encadeamento de blocos
9. ✓ Validação da cadeia
10. ✓ Detecção de adulteração
11. ✓ Cálculo de saldo
12. ✓ Persistência em arquivo

**Resultado:** 12/12 passando (100%) ✅

## Trabalhos Futuros

Extensões possíveis:

1. Rede P2P entre múltiplos nós
2. Assinatura digital (ECDSA)
3. Smart contracts básicos
4. Merkle trees para eficiência
5. Proof of Stake como alternativa
6. Interface gráfica
7. Otimizações de performance

## Referências

1. **Nakamoto, S.** (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*.  
   https://bitcoin.org/bitcoin.pdf

2. **Buterin, V.** (2014). *Ethereum White Paper*.  
   https://ethereum.org/en/whitepaper/

3. **NIST** (2015). *Secure Hash Standard (SHS)* - FIPS PUB 180-4.

4. **Antonopoulos, A. M.** (2017). *Mastering Bitcoin* (2nd ed.). O'Reilly Media.

5. **Zheng, Z. et al.** (2017). *Overview of Blockchain Technology*. IEEE Big Data.

## Licença

Projeto educacional desenvolvido para fins acadêmicos na UEA.

---

**Versão:** 1.0  
**Status:** Completo e Testado ✅  
**Testes:** 12/12 passando  
**Ano:** 2024
