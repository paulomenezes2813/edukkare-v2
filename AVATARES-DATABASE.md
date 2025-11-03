# 🎨 Sistema de Avatares no Banco de Dados

## 📋 Visão Geral

O sistema de avatares foi implementado com estrutura de banco de dados relacional, permitindo gerenciamento centralizado e consistente dos avatares dos estudantes.

---

## 🗄️ Estrutura do Banco de Dados

### Tabela `avatars`

```sql
CREATE TABLE "avatars" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT NOT NULL,          -- Nome do arquivo (ex: "alice.png")
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "avatars_pkey" PRIMARY KEY ("id")
);
```

### Tabela `students` (atualizada)

```sql
ALTER TABLE "students" 
ADD COLUMN "avatarId" INTEGER;

ALTER TABLE "students" 
ADD CONSTRAINT "students_avatarId_fkey" 
FOREIGN KEY ("avatarId") REFERENCES "avatars"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;
```

---

## 🎭 Avatares Disponíveis

15 avatares foram criados e estão disponíveis:

1. alice.png
2. ana.png
3. arthur.png
4. davi.png
5. gabriel.png
6. heitor.png
7. helena.png
8. joao.png
9. laura.png
10. lucas.png
11. maria.png
12. miguel.png
13. pedro.png
14. sofia.png
15. valentina.png

---

## 🔄 Como Funciona

### 1. **Seed Automático**

Quando o seed é executado:
```bash
npx prisma db seed
```

- ✅ Cria 15 registros na tabela `avatars`
- ✅ Associa cada estudante a um avatar (distribuição cíclica)
- ✅ Exemplo: Estudante ID 1 → Avatar ID 1, Estudante ID 16 → Avatar ID 1

### 2. **Frontend Inteligente**

```typescript
const getStudentAvatar = (student: { id: number; avatar?: { avatar: string } }): string => {
  // Prioridade 1: Avatar do banco de dados
  if (student.avatar?.avatar) {
    return `/avatares_edukkare/${student.avatar.avatar}`;
  }
  
  // Fallback: Sistema cíclico baseado no ID
  const avatarIndex = student.id % AVATARS.length;
  return `/avatares_edukkare/${AVATARS[avatarIndex]}`;
};
```

### 3. **API Atualizada**

**Endpoint:** `GET /api/students`

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Maria Souza",
      "avatar": {
        "id": 1,
        "avatar": "alice.png"
      }
    }
  ]
}
```

---

## 🧪 Testando Localmente

### 1. **Aplicar Migration**

```bash
cd backend
npx prisma migrate dev
```

### 2. **Popular Avatares**

```bash
npx prisma db seed
```

**Saída esperada:**
```
✅ Avatares criados: 15
✅ Alunos criados com avatares associados
```

### 3. **Verificar no Prisma Studio**

```bash
npx prisma studio
```

- Abra a tabela `avatars` → deve ter 15 registros
- Abra a tabela `students` → todos devem ter `avatarId` preenchido

### 4. **Testar no Frontend**

```bash
cd ../frontend
npm run dev
```

Acesse `http://localhost:5173`:
- ✅ Grid de estudantes com avatares únicos
- ✅ Modais de câmera/foto/anotação com avatares
- ✅ Cada estudante mantém seu avatar em todas as telas

---

## 🚀 Deploy no Railway

### O que acontece automaticamente:

1. **Backend Deploy:**
   - `npm run start:migrate` executa migrations
   - Seed cria 15 avatares automaticamente
   - Associa avatares aos estudantes existentes

2. **Frontend Deploy:**
   - Avatares em `/public/avatares_edukkare/` são servidos
   - Frontend busca avatares do backend via API
   - Fallback funciona se avatar não existir

### Variáveis Necessárias:

- `DATABASE_URL` → Railway PostgreSQL
- `OPENAI_API_KEY` → Para transcrição de áudio

---

## 📊 Consultas Úteis

### Ver todos os avatares:
```sql
SELECT * FROM avatars;
```

### Ver estudantes com seus avatares:
```sql
SELECT 
  s.id, 
  s.name, 
  a.avatar 
FROM students s
LEFT JOIN avatars a ON s."avatarId" = a.id
ORDER BY s.name;
```

### Mudar avatar de um estudante:
```sql
UPDATE students 
SET "avatarId" = 5 
WHERE id = 1;
```

---

## 🔧 Gerenciamento de Avatares

### Adicionar novo avatar:

1. **Adicionar arquivo:** `frontend/public/avatares_edukkare/novo_avatar.png`

2. **Inserir no banco:**
```sql
INSERT INTO avatars (avatar) VALUES ('novo_avatar.png');
```

3. **Associar a estudante:**
```sql
UPDATE students SET "avatarId" = 16 WHERE id = 10;
```

### Trocar avatar de estudante (via API futura):

```typescript
PUT /api/students/:id
{
  "avatarId": 5
}
```

---

## 🎯 Benefícios

- ✅ **Centralizado:** Avatares gerenciados no banco de dados
- ✅ **Consistente:** Mesmo avatar em todas as telas
- ✅ **Escalável:** Fácil adicionar novos avatares
- ✅ **Flexível:** Cada estudante pode ter avatar único
- ✅ **Fallback:** Sistema cíclico se avatar não existir
- ✅ **Performático:** Avatares são servidos estaticamente

---

## 🐛 Troubleshooting

### Avatares não aparecem:
1. Verificar se `/public/avatares_edukkare/` existe no frontend
2. Verificar se tabela `avatars` tem registros no banco
3. Verificar se `students.avatarId` está preenchido

### Seed falha:
```bash
# Limpar e recriar banco
npx prisma migrate reset
```

### Avatar padrão aparece:
- Verificar se `student.avatar` está sendo incluído na query
- Verificar se relacionamento no Prisma está correto

---

## 📝 Próximos Passos

- [ ] Permitir upload de avatar personalizado via frontend
- [ ] Criar endpoint para trocar avatar do estudante
- [ ] Adicionar mais avatares ao sistema
- [ ] Permitir professor escolher avatar ao criar estudante

---

Criado em: 03/11/2025  
Última atualização: 03/11/2025

