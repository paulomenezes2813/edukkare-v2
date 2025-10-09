# 🎓 EDUKKARE Frontend

Frontend React + TypeScript + Vite para o Sistema Inteligente de Gestão da Educação Infantil - EDUKKARE

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool rápido
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **TanStack Query** - Gerenciamento de estado do servidor

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 🔌 Conexão com Backend

O frontend se conecta ao backend através da variável de ambiente `VITE_API_URL` configurada no arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📁 Estrutura de Pastas

```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── ...
├── services/       # Serviços de API
│   ├── api.ts
│   ├── auth.service.ts
│   ├── student.service.ts
│   └── dashboard.service.ts
├── hooks/          # Custom hooks
├── types/          # Tipos TypeScript
├── utils/          # Funções utilitárias
├── App.tsx         # Componente principal
└── main.tsx        # Entry point
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Token) para autenticação. O token é armazenado no localStorage após o login e é automaticamente incluído em todas as requisições através de um interceptor do Axios.

### Credenciais de Teste

- **Admin:** `admin@edukkare.com` / `123456`
- **Professor 1:** `maria.silva@edukkare.com` / `123456`
- **Professor 2:** `joao.santos@edukkare.com` / `123456`

## 🎨 Páginas Disponíveis

- **Login** (`/login`) - Autenticação de usuários
- **Dashboard** (`/dashboard`) - Visão geral do sistema
- Mais páginas em desenvolvimento...

## 🔧 Desenvolvimento

### Adicionar Nova Página

1. Criar arquivo em `src/pages/NomeDaPagina.tsx`
2. Adicionar rota em `src/App.tsx`
3. (Opcional) Criar serviço correspondente em `src/services/`

### Adicionar Novo Serviço

1. Criar arquivo em `src/services/nome.service.ts`
2. Importar `api` de `./api.ts`
3. Exportar objeto com métodos assíncronos

### Tipos TypeScript

Todos os tipos estão centralizados em `src/types/index.ts` para facilitar a manutenção.

## 🌐 Variáveis de Ambiente

- `VITE_API_URL` - URL base da API (padrão: `http://localhost:3000/api`)

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa linter

## 🎯 Próximos Passos

- [ ] Página de listagem de alunos
- [ ] Página de avaliações
- [ ] Upload de evidências
- [ ] Relatórios e dashboards avançados
- [ ] Temas claro/escuro
- [ ] Modo offline (PWA)

## 📄 Licença

MIT

---

**Desenvolvido para EDUKKARE - Eusébio/CE** 🎓
