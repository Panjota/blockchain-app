# Aplicação Blockchain

Este projeto implementa uma infraestrutura de blockchain local baseada em princípios similares ao Ethereum, permitindo registro de usuários, login e funcionalidades de transferência de fundos. A aplicação foi construída usando Python para o backend e React com TypeScript para o frontend.

## Objetivo

Desenvolver uma aplicação blockchain completa com:
- Infraestrutura blockchain funcional com supply total de 1.000.000 tokens
- Sistema de cadastro de usuários com saldo inicial de 10 tokens cada
- Interface moderna e responsiva para interação com a blockchain
- Persistência de dados em arquivos JSON
- API REST completa para comunicação frontend-backend

## Estrutura do Projeto

```
blockchain-app
├── backend/                   # Servidor Python Flask
│   ├── main.py               # Ponto de entrada da aplicação
│   ├── blockchain/           # Lógica da blockchain
│   │   ├── __init__.py
│   │   ├── block.py          # Classe Block
│   │   ├── blockchain.py     # Classe Blockchain principal
│   │   ├── token_economy.py  # Sistema de tokens e economia
│   │   └── transaction.py    # Classe Transaction
│   ├── api/                  # Endpoints da API REST
│   │   ├── __init__.py
│   │   ├── auth.py          # Autenticação de usuários
│   │   └── wallet.py        # Funcionalidades da carteira
│   ├── database/            # Armazenamento de dados
│   │   ├── __init__.py
│   │   └── storage.py       # Persistência em JSON
│   ├── utils/               # Funções utilitárias
│   │   ├── __init__.py
│   │   ├── crypto.py        # Operações criptográficas
│   │   └── validation.py    # Validação de entrada
│   └── data/                # Dados persistidos
│       ├── users.json       # Credenciais de usuários
│       ├── balances.json    # Saldos da blockchain
│       ├── blockchain.json  # Chain completa
│       └── transactions.json # Histórico de transações
├── frontend/                # Interface React TypeScript
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   │   ├── Dashboard.tsx    # Painel do usuário
│   │   │   ├── Home.tsx         # Página inicial
│   │   │   ├── Login.tsx        # Tela de login
│   │   │   ├── Register.tsx     # Tela de registro
│   │   │   └── NetworkStats.tsx # Estatísticas da rede
│   │   ├── contexts/        # Contextos React
│   │   │   └── AuthContext.tsx  # Contexto de autenticação
│   │   ├── services/        # Serviços de API
│   │   │   ├── auth.ts          # Serviço de autenticação
│   │   │   └── wallet.ts        # Serviço de carteira
│   │   ├── styles/          # Estilos CSS
│   │   │   ├── App.css
│   │   │   └── index.css
│   │   ├── types/           # Tipos TypeScript
│   │   │   └── index.ts
│   │   ├── App.tsx          # Componente principal
│   │   └── main.tsx         # Ponto de entrada
│   ├── package.json         # Dependências Node.js
│   ├── vite.config.ts       # Configuração Vite
│   └── tsconfig.json        # Configuração TypeScript
├── requirements.txt         # Dependências Python
└── README.md               # Documentação do projeto
```

## Configuração e Instalação

### Pré-requisitos
- Python 3.8+ instalado
- Node.js 16+ instalado
- npm ou yarn

### 1. Clonar o repositório
```bash
git clone <repository-url>
cd blockchain-app
```

### 2. Configurar Backend

Instalar dependências Python:
```bash
pip install -r requirements.txt
```

Iniciar o servidor backend:
```bash
cd backend
python main.py
```

O backend estará disponível em `http://127.0.0.1:5000`

### 3. Configurar Frontend

Navegar para o diretório frontend:
```bash
cd frontend
```

Instalar dependências:
```bash
npm install
```

Iniciar servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## Funcionalidades Implementadas

### Backend (Python Flask)
- **Blockchain completa** com estrutura de blocos e validação
- **Sistema de tokens** com supply total de 1.000.000
- **Economia de tokens** com distribuição inicial de 10 tokens por usuário
- **API REST** com endpoints para autenticação e transações
- **Persistência de dados** em arquivos JSON
- **Validação de transações** com verificação de saldos
- **Estatísticas da rede** em tempo real
- **CORS habilitado** para comunicação frontend-backend

### Frontend (React TypeScript)
- **Interface moderna** com React 18 e TypeScript
- **Autenticação completa** com contexto global
- **Dashboard do usuário** com saldo e histórico
- **Transferências de fundos** com validação em tempo real
- **Estatísticas da rede** com métricas da blockchain
- **Navegação protegida** baseada em autenticação
- **Design responsivo** para diferentes dispositivos
- **Estado reativo** com atualizações automáticas

### API Endpoints

#### Autenticação
- `POST /register` - Registro de novo usuário
- `POST /login` - Login de usuário

#### Carteira
- `POST /transfer` - Transferência de fundos
- `GET /balance/<username>` - Consulta de saldo

#### Rede
- `GET /network/stats` - Estatísticas da rede
- `GET /blockchain` - Visualização da blockchain completa

## Sistema de Tokens

### Características
- **Supply total**: 1.000.000 tokens na rede
- **Saldo inicial**: 10 tokens para cada usuário registrado
- **Reserva da rede**: Tokens não distribuídos ficam na conta "NETWORK"
- **Transferências validadas**: Verificação de saldo antes de cada transação
- **Persistência**: Saldos mantidos entre reinicializações

### Fluxo de Distribuição
1. Usuário se registra na aplicação
2. Sistema verifica se há tokens disponíveis na reserva
3. 10 tokens são transferidos da reserva para o usuário
4. Saldo atualizado na blockchain e persistido em arquivo

## Persistência de Dados

### Arquivos de Dados
- `data/users.json` - Credenciais de usuários (hash das senhas)
- `data/balances.json` - Saldos de todos os usuários
- `data/blockchain.json` - Blockchain completa com todos os blocos
- `data/transactions.json` - Histórico de transações (compatibilidade)

### Características
- **Auto-save**: Dados salvos automaticamente após cada operação
- **Auto-load**: Dados carregados na inicialização
- **Backup automático**: Persistência entre reinicializações
- **Tratamento de erros**: Fallback para dados vazios se arquivos corrompidos

## Executando a Aplicação

### Desenvolvimento
1. Iniciar backend: `cd backend && python main.py`
2. Iniciar frontend: `cd frontend && npm run dev`
3. Acessar: `http://localhost:3000`

### Produção
```bash
# Build do frontend
cd frontend
npm run build

# Executar backend
cd ../backend
python main.py
```

## Tecnologias Utilizadas

### Backend
- Python 3.8+
- Flask (Framework web)
- Flask-CORS (Suporte a CORS)
- JSON (Persistência de dados)
- Hashlib (Criptografia)

### Frontend
- React 18
- TypeScript
- Vite (Build tool)
- React Router (Roteamento)
- Axios (Cliente HTTP)
- CSS Modules