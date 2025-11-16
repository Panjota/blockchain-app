# Blockchain App Frontend (React + TypeScript)

Este é o frontend da aplicação blockchain, refatorado para usar React com TypeScript.

## Tecnologias

- **React 18** - Library de interface do usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Ferramenta de build e desenvolvimento
- **React Router** - Roteamento para aplicações React
- **Axios** - Cliente HTTP para comunicação com o backend

## Estrutura do Projeto

```
frontend-react/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Dashboard.tsx
│   ├── services/           # Serviços para comunicação com API
│   │   ├── auth.ts
│   │   └── wallet.ts
│   ├── types/              # Definições de tipos TypeScript
│   │   └── index.ts
│   ├── styles/             # Arquivos CSS
│   │   ├── index.css
│   │   └── App.css
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Ponto de entrada
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Instalação e Execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar em modo desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

### 3. Build para produção

```bash
npm run build
```

### 4. Visualizar build de produção

```bash
npm run preview
```

## Funcionalidades

- **Autenticação**: Login e registro de usuários
- **Dashboard**: Visualização de saldo e histórico de transações
- **Transferências**: Envio de fundos entre usuários
- **Roteamento**: Navegação protegida baseada em autenticação

## Configuração do Backend

O frontend está configurado para se comunicar com o backend em `http://localhost:5000` através de um proxy configurado no Vite.

### API Endpoints

- `POST /api/register` - Registro de usuário
- `POST /api/login` - Login de usuário
- `POST /api/transfer` - Transferência de fundos

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linting do código

## Desenvolvimento

### Adicionando Novos Componentes

1. Crie o arquivo na pasta `src/components/`
2. Use TypeScript e interfaces definidas em `src/types/`
3. Importe e use nos componentes pai

### Adicionando Novos Serviços

1. Crie o arquivo na pasta `src/services/`
2. Use Axios para comunicação HTTP
3. Defina tipos de retorno em `src/types/`

### Estilização

- CSS modules ou CSS global em `src/styles/`
- Classes CSS organizadas por componente
- Design responsivo incluído
