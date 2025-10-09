# ✅ Como Testar o EDUKKARE

## 🔍 Verificação Rápida

### 1. Verificar se os servidores estão rodando:

**Backend:**
```bash
curl http://localhost:3000/api/health
```
Deve retornar: `{"status":"ok","timestamp":"...","service":"EDUKKARE API"}`

**Frontend:**
```bash
curl -I http://localhost:5173
```
Deve retornar: `HTTP/1.1 200 OK`

---

## 🌐 Acessar no Navegador

### Passo 1: Abra o navegador

Acesse: **http://localhost:5173**

### Passo 2: Você deve ver:

✅ Uma tela bonita com:
- Logo 🎓 EDUKKARE
- Título "Sistema Inteligente para Educação Infantil"
- Mensagem verde "Frontend React está funcionando perfeitamente!"
- Botão "🚀 Acessar Sistema"
- Credenciais de teste

### Passo 3: Clique em "Acessar Sistema"

Você será redirecionado para a tela de login.

### Passo 4: Faça o login

Use as credenciais:
- **Email:** `admin@edukkare.com`
- **Senha:** `123456`

### Passo 5: Visualize o Dashboard

Você verá:
- Header colorido com seu nome
- Cards com métricas (Total de Alunos, Avaliações, etc.)
- Botões de ações rápidas

---

## ❌ Se a tela estiver branca

### Solução 1: Abra o Console do Navegador

Pressione `F12` ou `Cmd+Option+I` (Mac) para abrir as ferramentas de desenvolvedor.

Vá na aba "Console" e veja se há algum erro em vermelho.

### Solução 2: Force o Refresh

Pressione:
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

### Solução 3: Limpe o cache

No navegador:
1. Abra as ferramentas de desenvolvedor (F12)
2. Clique com botão direito no ícone de refresh
3. Selecione "Limpar cache e fazer hard refresh"

### Solução 4: Reinicie os servidores

```bash
# Parar tudo
pkill -f "vite"
pkill -f "nodemon"

# Backend
cd backend
npm run dev

# Frontend (em outro terminal)
cd frontend
npm run dev
```

---

## 📸 O que você deve ver

### Tela Inicial (/)
```
┌─────────────────────────────────┐
│           🎓                    │
│         EDUKKARE                │
│  Sistema Inteligente para...   │
│                                 │
│  ✅ Frontend funcionando!       │
│                                 │
│  [🚀 Acessar Sistema]           │
│                                 │
│  Credenciais: admin@...         │
└─────────────────────────────────┘
```

### Tela de Login (/login)
```
┌─────────────────────────────────┐
│           🎓 EDUKKARE           │
│   Sistema Inteligente para...  │
│                                 │
│  Email:  [____________]         │
│  Senha:  [____________]         │
│                                 │
│        [Entrar]                 │
│                                 │
│  Credenciais de teste:          │
│  admin@edukkare.com / 123456    │
└─────────────────────────────────┘
```

### Dashboard (/dashboard)
```
┌─────────────────────────────────┐
│  🎓 EDUKKARE    [Sair]          │
│  Olá, Administrador!            │
├─────────────────────────────────┤
│  Dashboard                      │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐      │
│  │👶 0 │ │📝 0 │ │📸 0 │      │
│  └─────┘ └─────┘ └─────┘      │
│                                 │
│  Ações Rápidas:                │
│  [👶 Ver Alunos] [📝 Aval...] │
└─────────────────────────────────┘
```

---

## 🐛 Problemas Comuns

### Erro: "Cannot GET /"
**Causa:** Frontend não está rodando  
**Solução:** `cd frontend && npm run dev`

### Erro: "Network Error" ao fazer login
**Causa:** Backend não está rodando  
**Solução:** `cd backend && npm run dev`

### Erro: "Invalid credentials"
**Causa:** Banco de dados não foi populado  
**Solução:** `cd backend && npm run seed`

### Porta já em uso
```bash
# Descobrir o processo
lsof -ti:5173  # Frontend
lsof -ti:3000  # Backend

# Matar o processo
kill -9 <PID>
```

---

## ✅ Checklist Final

- [ ] Backend rodando na porta 3000
- [ ] Frontend rodando na porta 5173
- [ ] Tela inicial carrega sem erros
- [ ] Pode navegar para /login
- [ ] Login funciona com as credenciais
- [ ] Dashboard carrega após login
- [ ] Pode fazer logout

Se todos os itens estiverem marcados, **PARABÉNS! 🎉** Sua aplicação está funcionando perfeitamente!

---

## 📞 URLs Importantes

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health
- **API Docs:** Veja backend/README.md

---

**Desenvolvido para EDUKKARE - Eusébio/CE** 🎓

