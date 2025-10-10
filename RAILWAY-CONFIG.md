# ⚙️ Configuração Detalhada do Railway

## 🎯 URL do seu Deploy:
**Frontend:** https://amiable-art-production-2b3f.up.railway.app

---

## 📝 **Passo a Passo para Corrigir "Erro ao conectar com o servidor"**

### **Problema Identificado:**
O frontend não consegue se conectar ao backend. Isso acontece porque:
1. O frontend pode estar tentando se conectar ao backend local (localhost:3000)
2. As variáveis de ambiente não estão configuradas corretamente

---

## ✅ **SOLUÇÃO - Configurar Variáveis de Ambiente**

### **1. Backend no Railway**

Acesse: **Railway Dashboard → Seu Projeto → Backend Service → Variables**

Configure estas variáveis:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=edukkare-super-secret-key-production-2025-xyz
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

**IMPORTANTE:**
- ✅ `DATABASE_URL` deve ter `${{Postgres.DATABASE_URL}}` (Railway preenche automaticamente)
- ✅ `JWT_SECRET` deve ser uma string aleatória e segura
- ✅ `CORS_ORIGIN=*` permite requisições de qualquer origem (para teste)

---

### **2. Frontend no Railway**

**Primeiro, descubra a URL do Backend:**
1. Railway Dashboard → Backend Service → Settings
2. Em "Networking", clique em "Generate Domain" (se ainda não tiver)
3. Copie a URL (ex: `edukkare-backend-production.up.railway.app`)

**Depois, configure as variáveis do Frontend:**

Railway Dashboard → Frontend Service → Variables

```env
VITE_API_URL=https://SEU-BACKEND-URL.railway.app/api
```

**Exemplo:**
```env
VITE_API_URL=https://edukkare-backend-production-2b3f.up.railway.app/api
```

⚠️ **ATENÇÃO:**
- NÃO esqueça o `/api` no final
- Use `https://` (não `http://`)
- Copie a URL EXATA do seu backend

---

### **3. Redeploy (Forçar Rebuild)**

Após configurar as variáveis:

1. **Frontend:**
   - Railway Dashboard → Frontend Service
   - Clique nos 3 pontinhos (⋮) → "Redeploy"

2. **Backend:**
   - Railway Dashboard → Backend Service
   - Clique nos 3 pontinhos (⋮) → "Redeploy"

---

## 🔍 **Como Descobrir a URL do Backend:**

### **Opção 1: Pelo Dashboard**
1. Railway Dashboard
2. Clique no serviço **Backend**
3. Vá em **Settings** → **Networking**
4. A URL estará lá (ou clique em "Generate Domain")

### **Opção 2: Pelos Logs**
1. Railway Dashboard → Backend Service → **Logs**
2. Procure por: `🚀 Servidor rodando em https://...`

---

## 🧪 **Testar a Conexão**

### **1. Testar o Backend:**
Abra no navegador:
```
https://SEU-BACKEND-URL.railway.app/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-09T...",
  "service": "EDUKKARE API"
}
```

### **2. Testar o Login:**
```
https://SEU-FRONTEND-URL.railway.app
```

Faça login com:
- **Email:** admin@edukkare.com
- **Senha:** 123456

---

## ⚠️ **Erros Comuns e Soluções:**

### ❌ "Erro ao conectar com o servidor"
**Causa:** VITE_API_URL incorreta ou ausente
**Solução:** 
1. Verifique a variável VITE_API_URL no frontend
2. Confirme que a URL do backend está correta
3. Redeploy o frontend

### ❌ "CORS Error" no navegador
**Causa:** Backend não aceita requisições do frontend
**Solução:**
1. Adicione `CORS_ORIGIN=*` no backend
2. Ou configure CORS_ORIGIN com a URL do frontend:
   ```
   CORS_ORIGIN=https://seu-frontend.railway.app
   ```

### ❌ "Migration failed" no Backend
**Causa:** PostgreSQL não está conectado ou DATABASE_URL errada
**Solução:**
1. Verifique se o PostgreSQL está adicionado ao projeto
2. Confirme que DATABASE_URL=${{Postgres.DATABASE_URL}}

### ❌ Página em branco
**Causa:** Build do frontend falhou ou variável de ambiente incorreta
**Solução:**
1. Veja os logs: Railway → Frontend → Logs
2. Procure por erros de build
3. Confirme que VITE_API_URL está configurada

---

## 📊 **Verificar Logs em Tempo Real:**

### **Backend:**
```
Railway Dashboard → Backend Service → Logs
```

Procure por:
- ✅ `✅ Conectado ao banco de dados`
- ✅ `🚀 Servidor rodando em...`
- ❌ Erros de conexão com o banco
- ❌ Erros de migration

### **Frontend:**
```
Railway Dashboard → Frontend Service → Logs
```

Procure por:
- ✅ Build bem-sucedido
- ❌ Erros de variáveis de ambiente
- ❌ Erros de build do Vite

---

## 🔄 **Estrutura de URLs Correta:**

```
Backend:  https://backend-url.railway.app
Frontend: https://frontend-url.railway.app

Requisições do Frontend:
  - Login:      POST https://backend-url.railway.app/api/auth/login
  - Students:   GET  https://backend-url.railway.app/api/students
  - Activities: GET  https://backend-url.railway.app/api/activities
```

---

## 💡 **Dica Pro:**

Para facilitar, você pode usar um domínio customizado no Railway:
1. Railway → Service → Settings → Networking
2. "Add Custom Domain"
3. Configure: `backend.seudominio.com` e `app.seudominio.com`

---

## 🎯 **Checklist Final:**

- [ ] Backend tem PostgreSQL conectado
- [ ] Backend tem DATABASE_URL=${{Postgres.DATABASE_URL}}
- [ ] Backend tem JWT_SECRET configurado
- [ ] Backend gerou um domínio público
- [ ] Frontend tem VITE_API_URL com a URL do backend + /api
- [ ] Ambos fizeram redeploy após configurar variáveis
- [ ] /api/health do backend retorna {"status":"ok"}
- [ ] Login no frontend funciona

---

Se ainda tiver problemas, copie e cole os **logs** do Backend e Frontend do Railway aqui! 🚀

