# Separação entre User e Teacher

## 📋 Resumo das Alterações

Foi removida completamente a ligação entre a tabela `users` e a tabela `teachers`. Agora, a tabela `classes` se relaciona **APENAS** com `teachers`.

## 🔄 Mudanças Realizadas

### 1. Schema do Banco (Prisma)

**Antes:**
```prisma
model Class {
  teacherId        Int
  teacher          User      @relation(fields: [teacherId], references: [id])
  teacherProfileId Int?
  teacherProfile   Teacher?  @relation(fields: [teacherProfileId], references: [id])
}
```

**Depois:**
```prisma
model Class {
  teacherId  Int       // ID do professor da tabela teachers
  teacher    Teacher   @relation(fields: [teacherId], references: [id])
}
```

### 2. Migration SQL

Criada a migration `20251105_remove_user_class_relation` que:
- Remove a coluna `teacherProfileId` (não é mais necessária)
- Recria a foreign key de `teacherId` para apontar para a tabela `teachers` em vez de `users`

### 3. Controller de Classes (Backend)

**Mudanças:**
- ✅ Removida validação e referência à tabela `users`
- ✅ Apenas valida e busca professores na tabela `teachers`
- ✅ Métodos `create` e `update` agora trabalham apenas com `teacherId` (da tabela `teachers`)
- ✅ Métodos `list` e `getById` retornam apenas dados de `teacher` (da tabela `teachers`)

### 4. Frontend (App.tsx)

**Mudanças:**
- ✅ Removidas referências a `teacherProfile` e `users`
- ✅ Carrega apenas professores da tabela `teachers`
- ✅ Dropdown de seleção mostra apenas professores ativos da tabela `teachers`
- ✅ Envia `teacherId` (da tabela `teachers`) ao salvar turma
- ✅ Exibe nome e especialização do professor (da tabela `teachers`) no card da turma

## 🎯 Resultado

Agora há uma **separação clara** entre:
- **User**: Usuários do sistema (para login e autenticação)
- **Teacher**: Professores (dados acadêmicos e pedagógicos)
- **Class**: Turmas (vinculadas apenas a Teacher)

## 🚀 Como Aplicar as Mudanças

### Local (SQLite ou PostgreSQL)
```bash
cd backend
npx prisma migrate dev --name remove_user_class_relation
```

### Railway (PostgreSQL)
1. Acesse o Railway Dashboard
2. Vá até o serviço do Backend
3. Execute a migration manualmente ou faça deploy que ela será aplicada automaticamente

## ✅ Vantagens dessa Separação

1. **Clareza conceitual**: Users são para autenticação, Teachers são para dados pedagógicos
2. **Flexibilidade**: Professores podem existir sem ter acesso ao sistema
3. **Manutenção**: Mais fácil gerenciar dados de professores separadamente
4. **Escalabilidade**: Permite diferentes tipos de usuários sem misturar com dados de professor

## 📝 Nota Importante

Se houver turmas existentes no banco com `teacherId` apontando para a tabela `users`, será necessário:
1. Criar registros correspondentes na tabela `teachers`
2. Atualizar os `teacherId` das turmas para apontarem para os novos registros em `teachers`
3. Ou limpar as turmas e recriá-las com professores da tabela `teachers`

