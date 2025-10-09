# 🎓 EDUKKARE Backend API

Backend API para o Sistema Inteligente de Gestão da Educação Infantil - EDUKKARE

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Autenticação](#autenticação)
- [Estrutura do Banco](#estrutura-do-banco)

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma ORM** - ORM para banco de dados
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Multer** - Upload de arquivos

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run prisma:generate

# Criar banco de dados
npm run prisma:migrate

# Popular banco com dados de exemplo
npm run seed
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base):

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
JWT_SECRET=edukkare-secret-key-2025
JWT_EXPIRATION=7d
UPLOAD_PATH=./uploads
```

## 🎯 Scripts

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Gerar Prisma Client
npm run prisma:generate

# Criar migração
npm run prisma:migrate

# Abrir Prisma Studio (GUI do banco)
npm run prisma:studio

# Popular banco com dados
npm run seed
```

## 🔌 API Endpoints

### Autenticação

#### POST `/api/auth/register`
Registrar novo usuário

**Body:**
```json
{
  "email": "professor@edukkare.com",
  "password": "123456",
  "name": "Nome do Professor",
  "role": "PROFESSOR"
}
```

**Roles disponíveis:** `PROFESSOR`, `COORDENADOR`, `GESTOR`, `ADMIN`

#### POST `/api/auth/login`
Fazer login

**Body:**
```json
{
  "email": "admin@edukkare.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@edukkare.com",
      "name": "Administrador",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET `/api/auth/me`
Obter dados do usuário logado (requer autenticação)

**Headers:**
```
Authorization: Bearer {token}
```

---

### Alunos

#### GET `/api/students`
Listar alunos

**Query params:**
- `classId` - Filtrar por turma
- `shift` - Filtrar por turno (MANHA, TARDE, INTEGRAL)
- `active` - Filtrar por status (true/false)

#### GET `/api/students/:id`
Obter aluno por ID (inclui avaliações, evidências e insights)

#### POST `/api/students`
Criar novo aluno

**Body:**
```json
{
  "name": "João da Silva",
  "birthDate": "2022-05-15",
  "responsavel": "Maria da Silva",
  "telefone": "(85) 98765-4321",
  "email": "maria@email.com",
  "shift": "MANHA",
  "classId": 1
}
```

#### PUT `/api/students/:id`
Atualizar aluno

#### DELETE `/api/students/:id`
Remover aluno

---

### Avaliações

#### GET `/api/evaluations`
Listar avaliações

**Query params:**
- `studentId` - Filtrar por aluno
- `activityId` - Filtrar por atividade
- `teacherId` - Filtrar por professor
- `startDate` - Data inicial (YYYY-MM-DD)
- `endDate` - Data final (YYYY-MM-DD)

#### GET `/api/evaluations/:id`
Obter avaliação por ID

#### POST `/api/evaluations`
Criar avaliação

**Body:**
```json
{
  "studentId": 1,
  "activityId": 1,
  "bnccCodeId": 1,
  "level": "REALIZOU",
  "percentage": 85,
  "observations": "Aluno demonstrou excelente desenvolvimento..."
}
```

**Níveis disponíveis:**
- `NAO_REALIZOU` (0-33%)
- `PARCIALMENTE` (34-66%)
- `REALIZOU` (67-100%)

#### PUT `/api/evaluations/:id`
Atualizar avaliação

#### DELETE `/api/evaluations/:id`
Remover avaliação

---

### Evidências (Upload)

#### GET `/api/evidences`
Listar evidências

**Query params:**
- `studentId` - Filtrar por aluno
- `type` - Filtrar por tipo (FOTO, AUDIO, VIDEO, NOTA)
- `evaluationId` - Filtrar por avaliação

#### POST `/api/evidences/upload`
Upload de evidência (foto, áudio ou vídeo)

**Form Data:**
- `file` - Arquivo (multipart/form-data)
- `studentId` - ID do aluno
- `evaluationId` - ID da avaliação (opcional)
- `transcription` - Transcrição do áudio (opcional)
- `aiAnalysis` - Análise da IA em JSON (opcional)

**Tipos aceitos:**
- Imagens: JPG, PNG, GIF
- Áudio: MP3, WAV, M4A
- Vídeo: MP4, MOV

**Tamanho máximo:** 50MB

#### GET `/api/evidences/:id`
Obter evidência por ID

#### DELETE `/api/evidences/:id`
Remover evidência

---

### Dashboard

#### GET `/api/dashboard/metrics`
Obter métricas gerais do sistema

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 3245,
    "totalEvaluations": 1567,
    "totalEvidences": 892,
    "bnccCoverage": 87,
    "weeklyActivities": 156,
    "avgDevelopment": 78
  }
}
```

#### GET `/api/dashboard/evolution`
Obter evolução mensal

**Query params:**
- `months` - Número de meses (padrão: 6)

#### GET `/api/dashboard/student/:studentId`
Obter progresso detalhado de um aluno

---

### Health Check

#### GET `/api/health`
Verificar status da API

---

## 🔐 Autenticação

A API usa JWT (JSON Web Token) para autenticação. Após fazer login, inclua o token no header de todas as requisições protegidas:

```
Authorization: Bearer {seu-token-aqui}
```

## 📊 Estrutura do Banco

### Principais Tabelas

- **users** - Usuários do sistema (professores, gestores, admin)
- **students** - Alunos matriculados
- **classes** - Turmas
- **bncc_codes** - Códigos BNCC (Base Nacional Comum Curricular)
- **activities** - Atividades pedagógicas
- **evaluations** - Avaliações dos alunos
- **evidences** - Evidências (fotos, áudios, vídeos)
- **ai_insights** - Insights gerados pela IA
- **dashboard_metrics** - Métricas do dashboard

### Relacionamentos

- Aluno → Turma → Professor
- Avaliação → Aluno + Atividade + Código BNCC + Professor
- Evidência → Aluno + Professor + Avaliação (opcional)
- Insight IA → Aluno (opcional)

## 👥 Credenciais Padrão

Após executar `npm run seed`:

```
Admin: admin@edukkare.com / 123456
Professor 1: maria.silva@edukkare.com / 123456
Professor 2: joao.santos@edukkare.com / 123456
```

## 🛠️ Desenvolvimento

```bash
# Visualizar banco de dados
npm run prisma:studio

# Criar nova migração
npm run prisma:migrate

# Resetar banco (cuidado!)
npx prisma migrate reset
```

## 📝 Exemplo de Uso

```javascript
// 1. Fazer login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@edukkare.com',
    password: '123456'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// 2. Listar alunos
const studentsResponse = await fetch('http://localhost:3000/api/students', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const students = await studentsResponse.json();
console.log(students);
```

## 🌐 Produção

Para deploy em produção:

1. Configure as variáveis de ambiente
2. Execute `npm run build`
3. Execute `npm start`
4. Configure um processo manager (PM2, systemd, etc)

## 📄 Licença

MIT

---

**Desenvolvido para EDUKKARE - Eusébio/CE** 🎓

