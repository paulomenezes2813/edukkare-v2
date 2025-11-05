# 🚀 Como Rodar o Edukkare V2 Localmente

## ✅ **Aplicação Iniciada!**

Os servidores do Edukkare V2 estão rodando em background:

---

## 🌐 **URLs de Acesso:**

### **Frontend (Interface)**
```
http://localhost:5173
```
👉 **Abra esta URL no seu navegador para acessar a aplicação**

### **Backend (API)**
```
http://localhost:3000
```
🔧 **API REST - Documentação dos endpoints disponível**

---

## 🔐 **Credenciais de Login:**

### **Opção 1: Professora Maria**
```
Email: maria.silva@edukkare.com
Senha: 123456
```

### **Opção 2: Administrador**
```
Email: admin@edukkare.com
Senha: 123456
```

---

## 📋 **O Que Testar:**

### **1. Login**
- Acesse http://localhost:5173
- Faça login com as credenciais acima
- Veja a saudação "Olá, Professora Maria Silva"

### **2. Menu Lateral (☰)**
Clique no ícone de menu no canto superior esquerdo para acessar:
- 👤 **Alunos** - Ver/Editar/Criar alunos
- 👨‍🏫 **Professores** - Gerenciar professores
- 👥 **Usuários** - Gerenciar usuários do sistema
- 🏫 **Escolas** - Gerenciar escolas
- 📝 **Atividades** - Gerenciar atividades
- 🎓 **Turmas** - Gerenciar turmas (NOVO! Com professores da tabela Teachers)
- 🎭 **Avatares** - Gerenciar avatares dos alunos

### **3. Cadastro de Turmas (Integração com Teachers)**
1. Clique no menu → **🎓 Turmas**
2. Clique no botão **+** (flutuante)
3. **Veja o campo "Professor Responsável"**
4. Agora mostra professores da **tabela Teachers**!
5. Teste criar uma nova turma

### **4. Cadastro de Professores**
1. Menu → **👨‍🏫 Professores**
2. Clique no **+** para adicionar
3. Cadastre um novo professor
4. Volte para Turmas e veja o novo professor aparecendo no dropdown!

---

## 🛑 **Como Parar a Aplicação:**

Para parar os servidores, execute no terminal:

```bash
# Parar todos os processos Node
pkill -f "node.*dev"

# OU parar individualmente por porta
lsof -ti:3000 | xargs kill
lsof -ti:5173 | xargs kill
```

---

## 🔄 **Como Reiniciar:**

Se precisar reiniciar a aplicação:

```bash
# Parar tudo
pkill -f "node.*dev"

# Backend
cd backend && npm run dev &

# Frontend  
cd frontend && npm run dev &
```

---

## 🗄️ **Banco de Dados:**

### **Local:**
- **Tipo:** SQLite (se configurado) ou PostgreSQL
- **Arquivo:** `backend/prisma/dev.db` (SQLite)
- **Ver dados:** Use Prisma Studio:
  ```bash
  cd backend && npx prisma studio
  ```

### **Railway (Produção):**
- **Tipo:** PostgreSQL
- **URL:** Definida em `.env`
- **Migrations:** Aplicadas automaticamente no deploy

---

## 📊 **Verificar Status:**

### **Verificar se está rodando:**
```bash
# Backend (porta 3000)
curl http://localhost:3000/api/health

# Frontend (porta 5173)
curl http://localhost:5173
```

### **Ver logs:**
```bash
# Backend
tail -f backend/logs/* (se houver)

# Ou verificar no console onde iniciou
```

---

## ⚙️ **Variáveis de Ambiente:**

### **Backend (`backend/.env`):**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="sua_chave_secreta"
OPENAI_API_KEY="sk-..."
PORT=3000
```

### **Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🐛 **Troubleshooting:**

### **Erro: Porta já em uso**
```bash
# Ver o que está usando a porta
lsof -i :3000
lsof -i :5173

# Matar o processo
kill -9 <PID>
```

### **Erro: Módulos não encontrados**
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### **Erro: Migrations pendentes**
```bash
cd backend && npx prisma migrate dev
```

### **Erro: Prisma Client desatualizado**
```bash
cd backend && npx prisma generate
```

---

## 📚 **Documentação Adicional:**

- `CRUD-CLASSES.md` - Documentação do CRUD de Turmas
- `CRUD-AVATARES.md` - Documentação do CRUD de Avatares
- `CORRECOES-CRUDS.md` - Correções aplicadas nos CRUDs
- `DEPLOY.md` - Como fazer deploy no Railway

---

## 🎯 **Próximos Passos:**

1. ✅ Testar cadastro de turmas com professores da tabela Teachers
2. ✅ Verificar se os professores aparecem no dropdown
3. ✅ Criar uma turma e associar um professor
4. ✅ Editar uma turma e trocar o professor
5. ✅ Ver as turmas na listagem com informações do professor

---

## 🚀 **Deploy no Railway:**

Quando quiser fazer deploy das alterações:

```bash
git add -A
git commit -m "Sua mensagem"
git push
```

O Railway vai automaticamente:
1. Detectar o push
2. Fazer build do backend e frontend
3. Aplicar migrations
4. Deploy completo em 2-3 minutos

**URLs em Produção:**
- Frontend: https://edukkare.up.railway.app
- Backend: https://edukkare-v2-production.up.railway.app

---

**Documentado em:** 04/11/2025  
**Última atualização:** Integração com tabela Teachers

