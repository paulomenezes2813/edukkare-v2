# 🗄️ Configuração do PostgreSQL no Railway

## 📍 Como Encontrar a URL do Banco de Dados:

### **Método 1: Via Dashboard**
```
1. https://railway.app/dashboard
2. Clique no seu projeto EDUKKARE
3. Clique no serviço "Postgres" (ícone de banco de dados)
4. Vá na aba "Variables"
5. Procure por "DATABASE_URL"
6. Clique no ícone de "copiar" ao lado
```

### **Método 2: Via Connect Tab**
```
1. Railway → Projeto → Postgres
2. Clique na aba "Connect"
3. Copie a "Connection String"
```

---

## ⚙️ **Configurações COMPLETAS do Railway:**

### **🗄️ PostgreSQL (Banco de Dados)**
```
Service Name: Postgres
Type: Database
Version: PostgreSQL 15
```

**Variáveis Automáticas (Railway cria):**
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `DATABASE_URL` ← **ESSA É A PRINCIPAL!**

---

### **🖥️ Backend (API Node.js + Express)**

**Root Directory:** `backend`

**Build Command:** Automático (Railway detecta)

**Start Command:** `npm run start:migrate`

**Variables (Settings → Variables):**
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=edukkare-super-secret-production-2025-xyz
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

**⚠️ IMPORTANTE:**
- `${{Postgres.DATABASE_URL}}` - Railway substitui pela URL real do banco
- Não cole a URL manualmente, use essa sintaxe especial!

---

### **🌐 Frontend (React + Vite)**

**Root Directory:** `frontend`

**Build Command:** Automático

**Variables:**
```env
VITE_API_URL=https://SEU-BACKEND-URL.railway.app/api
```

**Como pegar a URL do Backend:**
```
1. Railway → Backend Service
2. Settings → Networking
3. Se não tiver domínio, clique "Generate Domain"
4. Copie a URL (ex: edukkare-backend-production-2b3f.up.railway.app)
5. Use: https://edukkare-backend-production-2b3f.up.railway.app/api
```

---

## 🔗 **Conectar Services:**

O Railway conecta automaticamente, mas verifique:

### **Backend → Postgres:**
```
Railway Dashboard → Backend → Variables

Verifique se existe:
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### **Frontend → Backend:**
```
Railway Dashboard → Frontend → Variables

Verifique:
VITE_API_URL=https://seu-backend.railway.app/api
```

---

## 🧪 **Testar Conexões:**

### **1. Testar PostgreSQL:**
```bash
# No terminal local (com psql instalado):
psql "COLA_AQUI_SUA_DATABASE_URL_DO_RAILWAY"

# Deve conectar ao banco
```

### **2. Testar Backend:**
```
Abra no navegador:
https://seu-backend.railway.app/api/health

Deve retornar:
{
  "status": "ok",
  "timestamp": "...",
  "service": "EDUKKARE API"
}
```

### **3. Testar Login:**
```
Abra:
https://amiable-art-production-2b3f.up.railway.app

Login:
- Email: admin@edukkare.com
- Senha: 123456
```

---

## 🔍 **Ver Logs do Banco de Dados:**

```
Railway → Postgres → Logs
```

Procure por:
- ✅ Conexões bem-sucedidas
- ❌ Erros de conexão
- 📊 Queries executadas

---

## 🛠️ **Comandos Úteis:**

### **Regenerar Schema no Railway:**
```bash
# Railway executa automaticamente ao fazer deploy:
npm run start:migrate

# Isso executa:
prisma migrate deploy && prisma db seed && node dist/server.js
```

### **Ver Tabelas no Banco:**
```
Railway → Postgres → Data (aba)
```

---

## ⚡ **Configuração EXPRESS do PostgreSQL:**

Se ainda não adicionou o PostgreSQL ao projeto:

### **1. Adicionar PostgreSQL:**
```
Railway → Seu Projeto
→ Clique "+ New"
→ "Database"
→ "Add PostgreSQL"
```

### **2. Linkar ao Backend:**
```
Railway → Backend → Settings → Variables
→ "+ New Variable"
→ "Add reference from Postgres"
→ Selecione DATABASE_URL
```

Isso cria automaticamente: `DATABASE_URL=${{Postgres.DATABASE_URL}}`

---

## 📊 **Exemplo de DATABASE_URL:**

```
postgresql://postgres:ABC123xyz@containers-us-west-56.railway.app:7890/railway
           │        │            │                                    │    │
           │        │            │                                    │    └─ Nome do banco
           │        │            │                                    └────── Porta
           │        │            └─────────────────────────────────────────── Host
           │        └──────────────────────────────────────────────────────── Senha
           └───────────────────────────────────────────────────────────────── Usuário
```

---

## ✅ **Checklist de Configuração:**

### **PostgreSQL:**
- [ ] Serviço PostgreSQL adicionado ao projeto
- [ ] DATABASE_URL está disponível nas variáveis

### **Backend:**
- [ ] Root Directory = `backend`
- [ ] DATABASE_URL=${{Postgres.DATABASE_URL}} configurada
- [ ] JWT_SECRET configurada
- [ ] NODE_ENV=production
- [ ] Domínio público gerado
- [ ] `/api/health` retorna OK

### **Frontend:**
- [ ] Root Directory = `frontend`
- [ ] VITE_API_URL aponta para o backend
- [ ] Login funciona

---

## 🆘 **Problemas Comuns:**

### ❌ "Cannot connect to database"
**Solução:**
```
1. Verifique: DATABASE_URL=${{Postgres.DATABASE_URL}}
2. Não cole a URL manualmente!
3. Use a sintaxe ${{...}} do Railway
4. Redeploy o backend
```

### ❌ "Migrations failed"
**Solução:**
```
Railway → Backend → Logs

Procure erros de migration
Se necessário, force rebuild:
→ Backend → Deploy → Redeploy
```

### ❌ Frontend não conecta
**Solução:**
```
1. Verifique VITE_API_URL no frontend
2. Deve ter /api no final
3. Deve ser https:// (não http://)
4. Redeploy frontend após mudar variável
```

---

## 📱 **URLs do Seu Projeto:**

**Frontend:**
```
https://amiable-art-production-2b3f.up.railway.app
```

**Backend (você precisa gerar):**
```
Railway → Backend → Settings → Networking → Generate Domain
```

**Exemplo de Backend:**
```
https://edukkare-backend-production-2b3f.up.railway.app
```

---

## 💡 **Dica PRO:**

Use nomes personalizados para facilitar:

```
Railway → Service → Settings → Service Name

Backend: edukkare-api
Frontend: edukkare-app
Postgres: edukkare-db
```

Depois os domínios ficam:
```
edukkare-api-production-2b3f.up.railway.app
edukkare-app-production-2b3f.up.railway.app
```

---

**Precisa de ajuda com alguma etapa específica?** 🚀

