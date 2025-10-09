# 🚀 Início Rápido - EDUKKARE

## ✅ Status Atual

- ✅ Backend rodando em: **http://localhost:3000**
- ✅ Frontend rodando em: **http://localhost:5173**

## 🌐 Acessar a Aplicação

Abra no seu navegador:

```
http://localhost:5173
```

## 🔐 Login

Use uma das credenciais:

- **Email:** `admin@edukkare.com`
- **Senha:** `123456`

Ou:

- **Email:** `maria.silva@edukkare.com`
- **Senha:** `123456`

## 🛑 Parar os Servidores

### Parar Backend
```bash
# Encontrar processo
lsof -ti:3000

# Matar processo
kill -9 <PID>
```

### Parar Frontend
```bash
# Encontrar processo
lsof -ti:5173

# Matar processo
kill -9 <PID>
```

## 🔄 Reiniciar os Servidores

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

## 📁 Estrutura Organizada

```
Edukkare-V2/
│
├── backend/                    # API Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/        # Lógica de negócio
│   │   ├── services/           # Serviços
│   │   ├── routes/             # Rotas da API
│   │   ├── middlewares/        # Middlewares (auth, error, upload)
│   │   └── config/             # Configurações
│   ├── prisma/
│   │   ├── schema.prisma       # Schema do banco
│   │   ├── migrations/         # Migrations
│   │   └── seed.ts             # Dados de exemplo
│   └── uploads/                # Arquivos enviados
│
└── frontend/                   # React + TypeScript + Vite
    ├── src/
    │   ├── pages/              # Páginas (Login, Dashboard)
    │   ├── components/         # Componentes reutilizáveis
    │   ├── services/           # Serviços de API (axios)
    │   ├── types/              # Tipos TypeScript
    │   └── hooks/              # Custom hooks
    └── public/                 # Arquivos estáticos
```

## 🔧 Comandos Úteis

### Backend

```bash
# Ver banco de dados
cd backend
npm run prisma:studio

# Recriar banco de dados
npm run prisma:migrate

# Popular com dados de exemplo
npm run seed
```

### Frontend

```bash
# Build para produção
cd frontend
npm run build

# Preview da build
npm run preview
```

## 📊 API Endpoints

Base URL: `http://localhost:3000/api`

### Principais Endpoints

- **Health Check:** `GET /health`
- **Login:** `POST /auth/login`
- **Alunos:** `GET /students`
- **Dashboard:** `GET /dashboard/metrics`

Documentação completa em: [backend/README.md](./backend/README.md)

## 🎯 Próximos Passos

1. ✅ Acesse http://localhost:5173
2. ✅ Faça login com as credenciais
3. ✅ Explore o Dashboard
4. 🚧 Desenvolva novas páginas conforme necessário

## 💡 Dicas

- O backend tem **hot reload** (nodemon)
- O frontend tem **hot reload** (Vite HMR)
- Qualquer alteração nos arquivos será refletida automaticamente
- Use `Ctrl + C` no terminal para parar os servidores

## 🆘 Solução de Problemas

### Backend não inicia
```bash
cd backend
rm -rf node_modules
npm install
npm run prisma:generate
npm run dev
```

### Frontend não inicia
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Erro de CORS
Verifique se o backend está rodando na porta 3000 e o frontend na porta 5173.

### Erro de autenticação
Limpe o localStorage do navegador:
```javascript
// No console do navegador (F12)
localStorage.clear()
```

---

**EDUKKARE - Sistema completo e organizado!** 🎓

