# Estrutura Modular - Guia de Referência Rápida

## 📂 Estrutura de Diretórios

```
frontend/src/
├── components/          # Componentes React reutilizáveis
│   ├── common/         # Componentes comuns (Modal, Button, Input, Select, Loading)
│   ├── layout/         # Componentes de layout (Sidebar, Header, Layout)
│   ├── students/       # Componentes de estudantes
│   ├── activities/     # Componentes de atividades
│   ├── teachers/       # Componentes de professores
│   ├── notes/          # Componentes de notas
│   ├── schools/        # Componentes de escolas
│   └── classes/        # Componentes de turmas
├── contexts/           # Contextos React (Auth, Menu, App)
├── hooks/              # Hooks customizados
├── pages/              # Páginas da aplicação
├── routes/             # Configuração de rotas
├── services/           # Serviços de API
├── types/               # Tipos TypeScript
└── utils/               # Utilitários e constantes
```

## 🎯 Componentes Disponíveis

### Componentes Comuns
- `<Modal />` - Modal reutilizável
- `<Button />` - Botão com variantes (primary, secondary, success, etc.)
- `<Input />` - Input com label e validação
- `<Select />` - Select com label e opções
- `<Loading />` - Spinner de loading

### Componentes de Entidades
- `<StudentCard />`, `<StudentList />`, `<StudentForm />`
- `<ActivityCard />`, `<ActivityList />`, `<ActivityForm />`
- `<TeacherCard />`, `<TeacherList />`, `<TeacherForm />`
- `<NoteCard />`, `<NoteList />`, `<NoteForm />`
- `<SchoolCard />`, `<SchoolList />`, `<SchoolForm />`
- `<ClassCard />`, `<ClassList />`, `<ClassForm />`

## 🔌 Hooks Disponíveis

- `useStudents()` - Gerenciar estudantes
- `useActivities()` - Gerenciar atividades
- `useRubrics()` - Gerenciar rubricas
- `useNotes()` - Gerenciar notas
- `useTeachers()` - Gerenciar professores
- `useUsers()` - Gerenciar usuários
- `useClasses()` - Gerenciar turmas
- `useSchools()` - Gerenciar escolas

## 🌐 Contextos Disponíveis

- `useAuth()` - Autenticação e usuário logado
- `useMenu()` - Menu e permissões
- `useApp()` - Estado global da aplicação

## 📄 Páginas Disponíveis

- `/` - Home
- `/login` - Login
- `/students` - Gerenciar estudantes
- `/activities` - Gerenciar atividades
- `/teachers` - Gerenciar professores
- `/notes` - Gerenciar notas
- `/schools` - Gerenciar escolas
- `/classes` - Gerenciar turmas
- `/users` - Gerenciar usuários
- `/training` - Centro de treinamento
- `/help` - Ajuda
- `/dashboard` - Dashboard principal
- `/monitoring` - Monitoramento
- `/pedagogical-dashboard` - Dashboard pedagógico
- `/integrated-management` - Gestão integrada
- `/notes-report` - Relatório de notas
- `/access` - Controle de acesso
- `/menu-access` - Gerenciamento de acesso ao menu
- `/rubrics` - Gerenciar rubricas
- `/avatars` - Gerenciar avatares

## 🎨 Constantes Disponíveis

```typescript
import { COLORS } from '../utils/constants';
import { getStudentAvatar, formatDate, formatFileSize } from '../utils/helpers';
import { isValidEmail, isValidPassword } from '../utils/validators';
```

## 📦 Exemplo de Uso Completo

```typescript
import { useStudents } from '../hooks/useStudents';
import { StudentList } from '../components/students/StudentList';
import { StudentForm } from '../components/students/StudentForm';
import { Button } from '../components/common/Button';
import { useState } from 'react';

function StudentsPage() {
  const { students, loading, createStudent, updateStudent, deleteStudent } = useStudents();
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  return (
    <div>
      <Button onClick={() => setShowForm(true)}>➕ Novo Aluno</Button>
      <StudentList
        students={students}
        loading={loading}
        onEdit={setEditingStudent}
        onDelete={deleteStudent}
      />
      <StudentForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={editingStudent ? updateStudent : createStudent}
        student={editingStudent}
      />
    </div>
  );
}
```

## ✅ Status da Refatoração

- ✅ Estrutura modular criada
- ✅ Componentes de entidades criados
- ✅ Hooks customizados implementados
- ✅ Contextos configurados
- ✅ Rotas configuradas
- ✅ Páginas criadas
- ✅ Documentação criada
- ⏳ Migração gradual do App.tsx (em andamento)
- ⏳ Testes unitários (próximo passo)

