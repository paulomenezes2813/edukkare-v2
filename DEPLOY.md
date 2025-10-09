# 🚀 Deploy EDUKKARE no Railway

## 📋 Pré-requisitos
- Conta no GitHub
- Conta no Railway (https://railway.app)
- Projeto commitado no Git

## 🔧 Passo a Passo

### 1. Preparar Repositório Git

```bash
cd /Users/paulomenezes/Documents/edukkare/Edukkare-V2
git init
git add .
git commit -m "Initial commit - EDUKKARE V2"
```

### 2. Criar Repositório no GitHub
1. Acesse https://github.com/new
2. Nome: `edukkare-v2`
3. Deixe privado ou público
4. NÃO adicione README, .gitignore ou licença
5. Clique em "Create repository"

### 3. Enviar Código para o GitHub

```bash
git remote add origin https://github.com/SEU_USUARIO/edukkare-v2.git
git branch -M main
git push -u origin main
```

### 4. Deploy no Railway

#### Backend:
1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha o repositório `edukkare-v2`
5. Selecione a pasta `backend` como Root Directory
6. Adicione o PostgreSQL:
   - Clique em "+ New"
   - Selecione "Database" → "PostgreSQL"
7. Configure as variáveis de ambiente (Settings → Variables):
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=seu-secret-super-seguro-aqui-2025
   JWT_EXPIRATION=7d
   NODE_ENV=production
   PORT=3000
   ```
8. O deploy será automático!

#### Frontend:
1. No mesmo projeto Railway, clique em "+ New"
2. Selecione "GitHub Repo" novamente
3. Escolha o mesmo repositório
4. Selecione a pasta `frontend` como Root Directory
5. Configure as variáveis:
   ```
   VITE_API_URL=${{BACKEND_SERVICE_URL}}/api
   ```
6. Deploy automático!

### 5. Configurar Domínio (Opcional)
1. No Railway, clique no serviço Backend
2. Settings → Networking → Generate Domain
3. Copie a URL gerada
4. Atualize a variável `VITE_API_URL` do Frontend com essa URL

## ✅ Verificar Deploy

### Backend:
```
https://seu-backend.railway.app/api/health
```

### Frontend:
```
https://seu-frontend.railway.app
```

## 🔐 Credenciais Padrão
- Email: admin@edukkare.com
- Senha: 123456

**⚠️ IMPORTANTE:** Altere a senha após o primeiro login!

## 📊 Monitoramento
- Logs: Railway Dashboard → Service → Logs
- Metrics: Railway Dashboard → Service → Metrics
- Database: Railway Dashboard → PostgreSQL → Data

## 🆘 Problemas Comuns

### "Migration failed"
```bash
# Execute localmente:
npm run prisma:migrate:deploy
```

### "Cannot connect to database"
- Verifique se a variável DATABASE_URL está correta
- Confirme que o PostgreSQL está rodando

### "Build failed"
- Verifique os logs no Railway
- Confirme que todas as dependências estão no package.json

## 💰 Custos
- Railway: $5/mês grátis (suficiente para testes)
- PostgreSQL: Incluído no plano free
- Após $5, ~$0.000231/min (~$10/mês para uso contínuo)

