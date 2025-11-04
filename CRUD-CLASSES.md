# 🎓 CRUD de Classes (Turmas) - Edukkare V2

**Data:** 03/11/2025  
**Commit:** 31c2591

---

## 📋 Visão Geral

O CRUD de Classes (Turmas) permite gerenciar as turmas escolares no sistema, incluindo informações sobre faixa etária, turno, ano letivo e professor responsável. As turmas são o ponto central de organização, conectando alunos, atividades e professores.

---

## 🗄️ Estrutura do Banco de Dados

### Tabela `classes`

```sql
model Class {
  id            Int       @id @default(autoincrement())
  name          String
  age_group     String    // "Berçário I", "Infantil II", etc
  shift         StudentShift  // MANHA, TARDE, INTEGRAL
  year          Int
  active        Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  teacherId     Int
  teacher       User      @relation(fields: [teacherId], references: [id])
  
  students      Student[]
  activities    Activity[]
  
  @@map("classes")
}
```

**Campos:**
- `id`: Identificador único (auto-incremento)
- `name`: Nome da turma (ex: "Infantil II - A")
- `age_group`: Faixa etária (ex: "3 a 4 anos")
- `shift`: Turno (enum: MANHA, TARDE, INTEGRAL)
- `year`: Ano letivo (ex: 2025)
- `active`: Status ativo/inativo (padrão: true)
- `teacherId`: ID do professor responsável

### Relações:
- **1:1 com User (Teacher)**: Cada turma tem um professor responsável
- **1:N com Student**: Uma turma pode ter vários alunos
- **1:N com Activity**: Uma turma pode ter várias atividades

---

## 🔌 Endpoints da API

### Backend: `/api/classes`

#### 1. **Listar Todas as Turmas**
```
GET /api/classes
```

**Query Parameters (opcionais):**
- `shift`: Filtrar por turno (MANHA, TARDE, INTEGRAL)
- `year`: Filtrar por ano
- `active`: Filtrar por status (true/false)

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Infantil II - A",
      "age_group": "Infantil II",
      "shift": "MANHA",
      "year": 2025,
      "active": true,
      "teacher": {
        "id": 2,
        "name": "Maria Silva",
        "email": "maria.silva@edukkare.com"
      },
      "_count": {
        "students": 15,
        "activities": 8
      },
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. **Buscar Turma por ID**
```
GET /api/classes/:id
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Infantil II - A",
    "age_group": "Infantil II",
    "shift": "MANHA",
    "year": 2025,
    "active": true,
    "teacher": {
      "id": 2,
      "name": "Maria Silva",
      "email": "maria.silva@edukkare.com"
    },
    "students": [
      {
        "id": 1,
        "name": "João Pedro",
        "avatar": {
          "id": 1,
          "avatar": "joao.png"
        }
      }
    ],
    "activities": [
      {
        "id": 1,
        "title": "Pintura com Texturas",
        "description": "..."
      }
    ]
  }
}
```

#### 3. **Criar Nova Turma**
```
POST /api/classes
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Infantil III - B",
  "age_group": "4 a 5 anos",
  "shift": "TARDE",
  "year": 2025,
  "teacherId": 3
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Turma criada com sucesso",
  "data": {
    "id": 4,
    "name": "Infantil III - B",
    "age_group": "4 a 5 anos",
    "shift": "TARDE",
    "year": 2025,
    "active": true,
    "teacher": {
      "id": 3,
      "name": "João Santos",
      "email": "joao.santos@edukkare.com"
    },
    "_count": {
      "students": 0,
      "activities": 0
    }
  }
}
```

**Validações:**
- ✅ `name` é obrigatório
- ✅ `age_group` é obrigatório
- ✅ `shift` é obrigatório (MANHA, TARDE ou INTEGRAL)
- ✅ `year` é obrigatório
- ✅ `teacherId` é obrigatório e deve existir no banco

#### 4. **Atualizar Turma**
```
PUT /api/classes/:id
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Infantil III - B (Atualizada)",
  "age_group": "4 a 5 anos",
  "shift": "INTEGRAL",
  "year": 2025,
  "teacherId": 2
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Turma atualizada com sucesso",
  "data": {
    "id": 4,
    "name": "Infantil III - B (Atualizada)",
    "age_group": "4 a 5 anos",
    "shift": "INTEGRAL",
    "year": 2025,
    "teacher": {
      "id": 2,
      "name": "Maria Silva",
      "email": "maria.silva@edukkare.com"
    }
  }
}
```

**Validações:**
- ✅ Verifica se a turma existe
- ✅ Se `teacherId` for informado, verifica se o professor existe
- ✅ Update parcial (só atualiza campos enviados)

#### 5. **Excluir Turma**
```
DELETE /api/classes/:id
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Turma excluída com sucesso"
}
```

**Erro - Turma com Alunos:**
```json
{
  "success": false,
  "message": "Não é possível excluir esta turma. Ela possui 15 aluno(s) matriculado(s)."
}
```

**Erro - Turma com Atividades:**
```json
{
  "success": false,
  "message": "Não é possível excluir esta turma. Ela possui 8 atividade(s) associada(s)."
}
```

**Validações:**
- ✅ Verifica se a turma existe
- ❌ **NÃO permite excluir** se houver alunos matriculados
- ❌ **NÃO permite excluir** se houver atividades associadas
- ✅ **Soft Delete** (marca `active: false`)

---

## 🎨 Interface do Usuário

### Tela de Gerenciamento de Turmas

Acesse através do **menu lateral** → **🎓 Turmas**

#### Layout:
- **Grid Responsivo**: Turmas exibidas em cards (min 300px)
- **Informações do Card**:
  - Nome da turma
  - Badge colorido do turno:
    - 🌅 Manhã (azul)
    - 🌆 Tarde (amarelo)
    - ⏰ Integral (roxo)
  - Faixa etária (👥)
  - Ano letivo (📅)
  - Professor responsável (👨‍🏫)
  - Quantidade de alunos (👦)
  - Quantidade de atividades (📚)
  - Botões de **Editar** (✏️) e **Excluir** (🗑️)

#### Botão de Adicionar (+):
- Botão flutuante fixo no canto inferior direito
- Cor: Gradiente roxo/rosa
- Abre o modal de cadastro

### Modal de Cadastro/Edição

#### Campos:
1. **Nome da Turma** (obrigatório)
   - Placeholder: "Ex: Infantil II - A"

2. **Faixa Etária** (obrigatório)
   - Placeholder: "Ex: 3 a 4 anos"

3. **Turno** (obrigatório)
   - Dropdown:
     - 🌅 Manhã
     - 🌆 Tarde
     - ⏰ Integral

4. **Ano** (obrigatório)
   - Tipo: number
   - Padrão: Ano atual

5. **Professor Responsável** (obrigatório)
   - Dropdown: Carrega todos os usuários com role "PROFESSOR"

#### Botões:
- **Cancelar**: Fecha o modal
- **Cadastrar/Salvar**: Salva as alterações

---

## 🔗 Integração com Outros CRUDs

### Students (Alunos)
- Ao criar/editar um aluno, seleciona a turma no dropdown `classId`
- Alunos exibem o nome da turma na listagem

### Activities (Atividades)
- Atividades podem ser associadas a turmas específicas
- Campo `classId` opcional

### Users (Professores)
- Professores são listados no dropdown de "Professor Responsável"
- Filtrados por `role === 'PROFESSOR'`

---

## 🧪 Como Testar

### **1. Criar Nova Turma**
1. Acesse: Menu → **🎓 Turmas**
2. Clique no botão **+** flutuante
3. Preencha:
   - Nome: "Teste Turma A"
   - Faixa Etária: "2 a 3 anos"
   - Turno: Manhã
   - Ano: 2025
   - Professor: Selecione um professor
4. Clique em "Cadastrar"
5. **Verifique:** "✅ Turma cadastrada com sucesso!"
6. **Confirme:** A turma aparece na listagem

### **2. Editar Turma**
1. Na listagem, clique em **✏️ Editar**
2. Altere o nome ou turno
3. Clique em "Salvar"
4. **Verifique:** "✅ Turma atualizada com sucesso!"
5. **Confirme:** As alterações foram salvas

### **3. Excluir Turma**
1. Na listagem, clique em **🗑️** (excluir)
2. Confirme a exclusão
3. **Casos possíveis:**
   - ✅ Turma vazia: "✅ Turma excluída com sucesso!"
   - ❌ Turma com alunos: "❌ Não é possível excluir esta turma. Ela possui X aluno(s) matriculado(s)."
   - ❌ Turma com atividades: "❌ Não é possível excluir esta turma. Ela possui X atividade(s) associada(s)."

---

## 📊 Resumo de Endpoints

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| GET | `/api/classes` | Listar todas as turmas | ✅ |
| GET | `/api/classes/:id` | Buscar turma por ID | ✅ |
| POST | `/api/classes` | Criar nova turma | ✅ |
| PUT | `/api/classes/:id` | Atualizar turma | ✅ |
| DELETE | `/api/classes/:id` | Excluir turma (soft delete) | ✅ |

---

## 🔐 Segurança

- ✅ Todas as rotas requerem autenticação (token JWT)
- ✅ Validações de integridade referencial
- ✅ Proteção contra exclusão de turmas com alunos/atividades
- ✅ Validação de campos obrigatórios
- ✅ Soft delete para preservar histórico

---

## 📂 Estrutura de Arquivos

```
backend/
  src/
    controllers/
      class.controller.ts      # ✨ NOVO - Controller completo
    routes/
      class.routes.ts          # ✨ NOVO - Rotas do CRUD
      index.ts                 # Registra as rotas de classes

frontend/
  src/
    App.tsx                    # ✨ CRUD completo implementado
```

---

## 🚀 Deploy no Railway

### Variáveis de Ambiente
Não são necessárias variáveis específicas para classes.

### Importante:
- As turmas são automaticamente criadas pelo seed (3 turmas padrão)
- Relações com professores (users) e alunos (students) já configuradas

---

## 💡 Features Implementadas

### Backend:
- ✅ CRUD completo (CREATE, READ, UPDATE, DELETE)
- ✅ Filtros por turno, ano e status
- ✅ Include de relações (teacher, students, activities)
- ✅ Contagem de alunos e atividades (`_count`)
- ✅ Validações de campos obrigatórios
- ✅ Proteção de integridade (não exclui com alunos/atividades)
- ✅ Soft delete (marca `active: false`)

### Frontend:
- ✅ Grid responsivo com cards informativos
- ✅ Badges coloridos por turno
- ✅ Modal de criação/edição
- ✅ Dropdown de professores (filtrado por role)
- ✅ Validação de campos
- ✅ Mensagens de sucesso/erro
- ✅ Integração completa com backend PostgreSQL
- ✅ Item no menu lateral

---

## 🎉 Resumo

**Status:** 🟢 **CRUD Completo e Funcional!**

✅ Backend com todos os endpoints  
✅ Frontend com interface moderna  
✅ Validações em ambos os lados  
✅ Proteção de integridade referencial  
✅ Soft delete implementado  
✅ Integrado ao PostgreSQL do Railway  

**Total de CRUDs Implementados:** 7
1. Students ✅
2. Teachers ✅
3. Users ✅
4. Schools ✅
5. Activities ✅
6. Avatars ✅
7. **Classes ✅** (NOVO!)

---

**Documentado em:** 03/11/2025

