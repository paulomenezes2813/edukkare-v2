# 🚀 Configuração Completa do EDUKKARE no Railway

## 📊 **Dados do PostgreSQL Railway**

```
Host:     shortline.proxy.rlwy.net
Port:     37997
Database: railway
User:     postgres
Password: OPEgcWuobjNSGEZOabUHysEnAPpWeVwK
```

**DATABASE_URL Completa:**
```
postgresql://postgres:OPEgcWuobjNSGEZOabUHysEnAPpWeVwK@shortline.proxy.rlwy.net:37997/railway
```

---

## ⚙️ **Configurações do Railway**

### **🗄️ PostgreSQL (Já configurado)**
✅ Banco de dados já está criado e rodando

---

### **🖥️ Backend - Variáveis de Ambiente**

Vá para: **Railway → Backend Service → Variables**

Configure estas variáveis:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=edukkare-production-secret-key-2025-xyz-abc
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

⚠️ **IMPORTANTE:** 
- Use `${{Postgres.DATABASE_URL}}` - Railway substitui automaticamente!
- Não cole a URL manualmente no Railway!

---

### **🌐 Frontend - Variáveis de Ambiente**

**Passo 1:** Gerar domínio do Backend
```
Railway → Backend Service → Settings → Networking → Generate Domain
```

**Passo 2:** Copiar a URL gerada
Exemplo: `edukkare-backend-production-2b3f.up.railway.app`

**Passo 3:** Configurar Frontend
```
Railway → Frontend Service → Variables
```

Adicione:
```env
VITE_API_URL=https://SEU-BACKEND-URL.railway.app/api
```

**Exemplo real (substitua com sua URL):**
```env
VITE_API_URL=https://edukkare-backend-production-2b3f.up.railway.app/api
```

---

## 🔄 **Executar Migrations no Railway**

O Railway vai executar automaticamente ao fazer deploy, mas se precisar forçar:

### **Opção 1: Via Railway Dashboard**
```
Railway → Backend → Deploy → Redeploy
```

### **Opção 2: Via Logs (verificar execução)**
```
Railway → Backend → Logs
```

Procure por:
```
✅ Conectado ao banco de dados
🚀 Servidor rodando em...
```

---

## 🧪 **Testar Localmente com o Banco do Railway**

O arquivo `.env` já foi atualizado! Agora você pode:

### **1. Rodar Migrations:**
```bash
cd /Users/paulomenezes/Documents/edukkare/Edukkare-V2/backend
npx prisma migrate dev --name init
```

### **2. Popular o Banco (Seed):**
```bash
npm run seed
```

### **3. Iniciar Backend:**
```bash
npm run dev
```

Deve conectar ao PostgreSQL do Railway! 🎉

---

## 🌐 **URLs do Projeto**

### **Frontend (Railway):**
```
https://amiable-art-production-2b3f.up.railway.app
```

### **Backend (Railway - você precisa gerar):**
```
Railway → Backend → Settings → Generate Domain
```

Vai gerar algo como:
```
https://edukkare-backend-production-xyz.up.railway.app
```

---

## ✅ **Checklist de Deploy:**

### **Backend:**
- [ ] DATABASE_URL=${{Postgres.DATABASE_URL}} configurada
- [ ] JWT_SECRET configurada
- [ ] NODE_ENV=production
- [ ] PORT=3000
- [ ] Domínio público gerado
- [ ] Logs mostram "Conectado ao banco de dados"
- [ ] Teste: https://seu-backend.railway.app/api/health

### **Frontend:**
- [ ] VITE_API_URL configurada com URL do backend
- [ ] URL termina com /api
- [ ] Redeploy após configurar variável
- [ ] Teste: https://amiable-art-production-2b3f.up.railway.app

---

## 🔍 **Verificar se está Funcionando**

### **1. Backend Health Check:**
```
https://seu-backend.railway.app/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-09...",
  "service": "EDUKKARE API"
}
```

### **2. Frontend Login:**
```
https://amiable-art-production-2b3f.up.railway.app
```

**Credenciais:**
- Email: admin@edukkare.com
- Senha: 123456

---

## 🆘 **Solução de Problemas**

### ❌ "Cannot connect to database" no Railway
**Solução:**
1. Verifique se usou `${{Postgres.DATABASE_URL}}` (não a URL direta!)
2. Confirme que o PostgreSQL está rodando
3. Redeploy o backend

### ❌ "Erro ao conectar com o servidor" no Frontend
**Solução:**
1. Verifique VITE_API_URL no frontend
2. Confirme que tem `/api` no final
3. Teste a URL do backend manualmente
4. Redeploy frontend após configurar

### ❌ "Migration failed"
**Solução:**
```bash
# Rode localmente primeiro:
cd backend
npx prisma migrate deploy
npm run seed
```

Depois faça push pro GitHub e redeploy.

---

## 🎯 **Próximos Passos:**

1. **Gere o domínio do Backend:**
   ```
   Railway → Backend → Settings → Networking → Generate Domain
   ```

2. **Copie a URL e configure no Frontend:**
   ```
   Railway → Frontend → Variables → VITE_API_URL
   ```

3. **Redeploy ambos:**
   ```
   Railway → Backend → Redeploy
   Railway → Frontend → Redeploy
   ```

4. **Teste o sistema:**
   ```
   https://amiable-art-production-2b3f.up.railway.app
   ```

---

## 📝 **Comandos Úteis**

### **Conectar ao banco do Railway via psql:**
```bash
psql "postgresql://postgres:OPEgcWuobjNSGEZOabUHysEnAPpWeVwK@shortline.proxy.rlwy.net:37997/railway"
```

### **Ver tabelas:**
```sql
\dt
```

### **Ver dados dos usuários:**
```sql
SELECT * FROM users;
```

### **Sair:**
```
\q
```

---

## 🔐 **Segurança**

⚠️ **Importante:**
1. Nunca commite o arquivo `.env` no Git
2. O `.gitignore` já está configurado para ignorá-lo
3. Use variáveis de ambiente no Railway
4. Altere a senha padrão do admin após primeiro login

---

## 💰 **Custos Estimados (Railway)**

- **PostgreSQL:** ~$5/mês
- **Backend:** ~$5/mês
- **Frontend:** ~$5/mês
- **Total:** ~$15/mês
- **Crédito Grátis:** $5/mês (suficiente para testes)

---

**Está tudo pronto! Agora é só:**
1. Gerar domínio do backend no Railway
2. Configurar VITE_API_URL no frontend
3. Fazer redeploy de ambos
4. Testar! 🚀

