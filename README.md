# 🎓 EDUKKARE - Sistema Inteligente para Educação Infantil

Sistema completo para gestão da educação infantil com integração BNCC, captura de evidências e insights de IA.

## 📁 Estrutura do Projeto

```
Edukkare-V2/
├── backend/          # API REST (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   ├── prisma/       # Schema e migrations do banco de dados
│   └── uploads/      # Arquivos de evidências
│
└── frontend/         # Interface Web (React + TypeScript + Vite)
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── services/
    │   ├── types/
    │   └── hooks/
    └── public/
```

## 🚀 Tecnologias

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- SQLite
- JWT Authentication
- Multer (upload de arquivos)

### Frontend
- React 18 + TypeScript
- Vite
- React Router
- Axios
- TanStack Query

## 📦 Instalação e Execução

### 1️⃣ Backend

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar banco de dados
npm run prisma:generate
npm run prisma:migrate
npm run seed

# Iniciar servidor de desenvolvimento
npm run dev
```

O backend estará rodando em: **http://localhost:3000**

### 2️⃣ Frontend

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: **http://localhost:5173**

## 🔐 Credenciais de Acesso

Após executar o seed do banco de dados, use:

- **Admin:** `admin@edukkare.com` / `123456`
- **Professor 1:** `maria.silva@edukkare.com` / `123456`
- **Professor 2:** `joao.santos@edukkare.com` / `123456`

## 🔌 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Usuário logado

### Alunos
- `GET /api/students` - Listar alunos
- `GET /api/students/:id` - Detalhes do aluno
- `POST /api/students` - Criar aluno
- `PUT /api/students/:id` - Atualizar aluno
- `DELETE /api/students/:id` - Remover aluno

### Avaliações
- `GET /api/evaluations` - Listar avaliações
- `POST /api/evaluations` - Criar avaliação
- `PUT /api/evaluations/:id` - Atualizar avaliação
- `DELETE /api/evaluations/:id` - Remover avaliação

### Evidências
- `GET /api/evidences` - Listar evidências
- `POST /api/evidences/upload` - Upload de evidência
- `DELETE /api/evidences/:id` - Remover evidência

### Dashboard
- `GET /api/dashboard/metrics` - Métricas gerais
- `GET /api/dashboard/evolution` - Evolução mensal
- `GET /api/dashboard/student/:id` - Progresso do aluno

## 🎯 Funcionalidades

### ✅ Implementadas
- ✅ Autenticação JWT
- ✅ CRUD de alunos
- ✅ Sistema de avaliações
- ✅ Upload de evidências (foto, áudio, vídeo)
- ✅ Dashboard com métricas
- ✅ Integração BNCC
- ✅ API REST completa
- ✅ Frontend React moderno

### 🚧 Em Desenvolvimento
- 🚧 Análise de IA para evidências
- 🚧 Geração de relatórios
- 🚧 Módulo de planejamento
- 🚧 Comunicação com responsáveis
- 🚧 Aplicativo móvel

## 🛠️ Desenvolvimento

### Backend

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar nova migration
npm run prisma:migrate

# Visualizar banco de dados
npm run prisma:studio

# Build para produção
npm run build

# Iniciar produção
npm start
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linter
npm run lint
```

## 🌐 Ambiente de Produção

### Backend (.env)
```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
NODE_ENV=production
JWT_SECRET=your-secure-secret-key
JWT_EXPIRATION=7d
UPLOAD_PATH=./uploads
```

### Frontend (.env)
```env
VITE_API_URL=https://api.edukkare.com.br/api
```

## 📊 Banco de Dados

O sistema usa SQLite para desenvolvimento e pode ser facilmente migrado para PostgreSQL em produção.

### Principais Tabelas
- `users` - Usuários do sistema
- `students` - Alunos
- `classes` - Turmas
- `evaluations` - Avaliações
- `evidences` - Evidências
- `bncc_codes` - Códigos BNCC
- `activities` - Atividades
- `ai_insights` - Insights da IA

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Licença

MIT

## 👥 Equipe

**Desenvolvido para EDUKKARE - Eusébio/CE** 🎓

---

Para mais informações, consulte os READMEs específicos em cada pasta:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

