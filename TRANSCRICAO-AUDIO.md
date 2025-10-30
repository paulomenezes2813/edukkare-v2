# 🎤 Transcrição de Áudio

## 📋 Como Funciona

O sistema de transcrição de áudio tem **dois modos de operação**:

### 1️⃣ **Modo Manual** (Padrão)
- A professora grava o áudio
- Sistema mostra um campo de texto para **digitar manualmente** o que foi falado
- **Não requer configuração adicional**

### 2️⃣ **Modo Automático** (Requer OpenAI API)
- A professora grava o áudio
- Sistema **transcreve automaticamente** usando IA (OpenAI Whisper)
- Professora pode **editar** a transcrição se necessário

---

## 🔧 Como Ativar a Transcrição Automática

### **Passo 1: Obter Chave da OpenAI**

1. Acesse: https://platform.openai.com/api-keys
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Copie a chave (começa com `sk-...`)

### **Passo 2: Configurar no Railway**

#### **Backend:**
1. Acesse o Railway Dashboard
2. Selecione o serviço **Backend** (edukkare-v2-production)
3. Vá em **Variables**
4. Adicione:
   - **Nome:** `OPENAI_API_KEY`
   - **Valor:** Cole sua chave (`sk-...`)
5. O Railway fará redeploy automático

Pronto! Agora as transcrições serão automáticas! ✨

---

## 💰 Custos da OpenAI Whisper

- **Modelo:** Whisper-1
- **Custo:** $0.006 por minuto de áudio
- **Exemplo:** 100 gravações de 30 segundos = **$0.30** (30 centavos de dólar)

Muito acessível para uso educacional! 📚

---

## 🧪 Testando

### **Sem API Key (Manual):**
```
Mensagem no textarea:
"[Digite aqui o que foi falado no áudio]

Para transcrição automática, configure a variável OPENAI_API_KEY..."
```

### **Com API Key (Automático):**
```
Mensagem no textarea:
"A criança demonstrou interesse pela atividade..."
(Transcrição real do áudio)
```

---

## 📝 Notas

- A transcrição é em **português brasileiro**
- Funciona com qualquer formato de áudio (webm, mp3, wav, etc)
- A professora **sempre pode editar** a transcrição, mesmo no modo automático
- O áudio é **salvo** no servidor para registro

---

## 🎯 Recomendação

Para escolas que fazem **muitas gravações diárias**, recomendamos ativar a transcrição automática.

Para uso **esporádico**, o modo manual funciona perfeitamente! 👍

