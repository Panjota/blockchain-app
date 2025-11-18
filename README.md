# Aplicação Blockchain - Projeto Educacional

Projeto completo de infraestrutura blockchain desenvolvido como trabalho acadêmico da disciplina Tópicos Especiais 4 da Universidade do Estado do Amazonas (UEA).

## 📋 Visão Geral do Projeto

Este projeto implementa uma **infraestrutura completa de blockchain** com os seguintes componentes:

### 1. Infraestrutura Blockchain Local (Backend)
- Blockchain funcional baseada em princípios do Ethereum
- Supply total de **1.000.000 tokens**
- Sistema de economia de tokens
- API REST completa
- Persistência de dados em JSON

### 2. Aplicação Web (Frontend)
- Interface moderna em React + TypeScript
- Sistema de cadastro de usuários (saldo inicial: 10 tokens)
- Login e autenticação
- Funcionalidade de transferência entre usuários
- Dashboard com estatísticas da rede

### 3. MiniBlockchain Educacional
- Implementação educacional de blockchain do zero em Python
- Demonstra conceitos fundamentais (bloco, hash, encadeamento, PoW)
- Código profissional e bem documentado
- Análise crítica de vantagens e limitações

## 🚀 Estrutura do Projeto

```
blockchain-app/
├── backend/                    # Servidor Python Flask
│   ├── blockchain/            # Lógica da blockchain
│   ├── api/                   # Endpoints REST
│   ├── database/              # Armazenamento
│   ├── utils/                 # Utilitários
│   └── main.py                # Ponto de entrada
│
├── frontend/                   # Interface React TypeScript
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── contexts/          # Contextos (Auth)
│   │   ├── services/          # Serviços de API
│   │   └── App.tsx            # App principal
│   └── package.json
│
├── miniblockchain/            # Implementação educacional
│   ├── miniblockchain.py      # Implementação principal
│   ├── test_miniblockchain.py # Suite de testes
│   └── README.md              # Documentação completa
│
└── README.md                  # Este arquivo
```

## 🎯 Objetivos e Requisitos Cumpridos

### ✅ Requisito 1: Infraestrutura de Blockchain
- [x] Blockchain local baseada em Ethereum/similar
- [x] Supply total de 1.000.000 tokens
- [x] Sistema de economia de tokens funcional
- [x] Persistência de dados

### ✅ Requisito 2: Aplicação Web
- [x] Cadastro de usuário com saldo inicial de 10 tokens
- [x] Sistema de login e autenticação
- [x] Funcionalidade de transferência entre usuários
- [x] Interface moderna e responsiva

### ✅ Requisito 3: Explicação de Conceitos
- [x] Conceito de bloco (estrutura, campos, função)
- [x] Hash criptográfico (SHA-256, propriedades)
- [x] Encadeamento criptográfico (imutabilidade)

### ✅ Requisito 4: Como Blocos São Adicionados
- [x] Processo completo de mineração demonstrado
- [x] Proof of Work implementado
- [x] Validação de integridade

### ✅ Requisito 5: MiniBlockchain em Python
- [x] Implementação completa do zero
- [x] Apenas bibliotecas padrão Python
- [x] Código profissional com documentação
- [x] 100% testado (12/12 testes)

### ✅ Requisito 6: Análise Crítica
- [x] Vantagens identificadas e documentadas
- [x] 10 limitações com soluções reais
- [x] Comparação com Bitcoin, Ethereum, Hyperledger
- [x] Casos de uso apropriados

## 🏃 Início Rápido

### Pré-requisitos
- Python 3.8+
- Node.js 16+
- npm ou yarn

### 1. Executar Backend

```bash
# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
cd backend
python main.py
```

Backend disponível em: `http://127.0.0.1:5000`

### 2. Executar Frontend

```bash
# Instalar dependências
cd frontend
npm install

# Iniciar desenvolvimento
npm run dev
```

Frontend disponível em: `http://localhost:3000`

### 3. Executar MiniBlockchain

```bash
cd miniblockchain

# Executar demonstração
python3 miniblockchain.py

# Executar testes
python3 test_miniblockchain.py
```

## 📚 Documentação

### Backend (Aplicação Web)

**Arquitetura:**
- `backend/blockchain/blockchain.py` - Blockchain principal
- `backend/blockchain/token_economy.py` - Sistema de tokens (1.000.000 supply)
- `backend/blockchain/block.py` - Estrutura de blocos
- `backend/api/auth.py` - Autenticação (cadastro, login)
- `backend/api/wallet.py` - Transferências e saldos

**API Endpoints:**
- `POST /register` - Cadastrar novo usuário
- `POST /login` - Fazer login
- `POST /transfer` - Transferir tokens
- `GET /balance/<username>` - Consultar saldo
- `GET /network/stats` - Estatísticas da rede

### Frontend (Interface Web)

**Tecnologias:**
- React 18 + TypeScript
- Vite (build tool)
- React Router (navegação)
- Axios (HTTP client)

**Componentes principais:**
- `Login.tsx` - Tela de login
- `Register.tsx` - Cadastro de usuário
- `Dashboard.tsx` - Painel principal (saldo, transferências)
- `NetworkStats.tsx` - Estatísticas da blockchain

### MiniBlockchain (Educacional)

**📖 Documentação completa:** [miniblockchain/README.md](./miniblockchain/README.md)

**Recursos:**
- Implementação do zero em Python puro
- Explicação de todos os conceitos fundamentais
- Análise crítica de vantagens e limitações
- Comparação com blockchains reais
- 12 testes automatizados (100% aprovação)
- Código profissional com documentação completa

## 🧪 Testes e Validação

### Backend
```bash
cd backend
python -m pytest  # Se testes estiverem configurados
```

### MiniBlockchain
```bash
cd miniblockchain
python3 test_miniblockchain.py
```

**Resultado:** 12/12 testes passando ✅
- Criação de blocos
- Hash criptográfico
- Encadeamento
- Proof of Work
- Validação
- Detecção de adulteração
- Sistema de transações
- Persistência

## 🔍 Conceitos Demonstrados

### Bloco
Estrutura fundamental que contém: index, timestamp, dados, hash anterior, nonce, hash

### Hash Criptográfico (SHA-256)
Função que gera identificador único: determinístico, unidirecional, sensível a mudanças

### Encadeamento
Cada bloco contém hash do anterior, criando cadeia imutável

### Proof of Work
Algoritmo de consenso que requer trabalho computacional para minerar blocos

### Validação
Verificação de integridade: hash correto, encadeamento íntegro, PoW válido

## 📊 Características Técnicas

### Sistema de Tokens
- **Supply Total**: 1.000.000 tokens
- **Saldo Inicial**: 10 tokens por usuário
- **Reserva**: Tokens não distribuídos na conta "NETWORK"
- **Validação**: Verificação de saldo antes de transações

### Performance
- **Backend**: Flask com CORS
- **Frontend**: React com hot reload
- **Blockchain**: Mineração com dificuldade ajustável
- **Persistência**: JSON para dados e blockchain

### Segurança
- Senhas com hash SHA-256
- Validação de transações
- Integridade da blockchain verificável
- Detecção de adulterações

## 🎓 Uso Educacional

Este projeto é ideal para:

- ✅ Aprender fundamentos de blockchain
- ✅ Entender Proof of Work
- ✅ Experimentar com transações
- ✅ Analisar estruturas de dados
- ✅ Estudar criptografia (SHA-256)
- ✅ Desenvolver aplicações descentralizadas
- ✅ Compreender limitações e trade-offs

## ⚠️ Limitações e Avisos

**Este projeto é educacional. NÃO use em produção.**

Limitações conhecidas:
- Não é uma rede P2P (single-node)
- Sem assinatura digital criptográfica
- Escalabilidade limitada
- Validação simplificada
- Não adequado para dados reais/sensíveis

Para aplicações reais, use blockchains estabelecidas:
- **Bitcoin** - Transferências de valor
- **Ethereum** - Smart contracts
- **Hyperledger** - Soluções empresariais

## 🛠️ Tecnologias Utilizadas

### Backend
- Python 3.8+
- Flask (web framework)
- Flask-CORS
- Hashlib (SHA-256)
- JSON (persistência)

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- CSS Modules

### MiniBlockchain
- Python puro (sem dependências externas)
- Bibliotecas padrão: hashlib, json, time, typing

## 📖 Recursos Adicionais

- [miniblockchain/README.md](./miniblockchain/README.md) - Documentação completa do MiniBlockchain

## 👥 Autores

**Projeto desenvolvido por:** Equipe UEA - Tópicos Especiais 4  
**Instituição:** Universidade do Estado do Amazonas  
**Curso:** Engenharia de Computação  
**Ano:** 2024

## 📝 Licença

Projeto desenvolvido para fins educacionais como parte do currículo acadêmico da UEA.

---

## 🎯 Resumo Executivo

Este projeto oferece uma implementação completa de blockchain em três camadas:

1. **Aplicação Web Funcional** - Sistema completo com backend e frontend
2. **Infraestrutura Blockchain** - 1.000.000 tokens, cadastro, login, transferências
3. **MiniBlockchain Educacional** - Implementação didática dos conceitos fundamentais

**Status:** ✅ Todos os requisitos cumpridos e validados  
**Testes:** ✅ 12/12 passando (100%)  
**Documentação:** ✅ Completa e acadêmica

Para começar, escolha um dos componentes acima e siga as instruções de instalação correspondentes.
