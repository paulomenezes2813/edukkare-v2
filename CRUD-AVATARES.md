# 🎭 CRUD de Avatares - Edukkare V2

## 📋 Visão Geral

O CRUD de Avatares permite gerenciar as imagens de perfil usadas pelos alunos no sistema. Os avatares são armazenados na pasta `/public/avatares_edukkare/` e referenciados no banco de dados PostgreSQL.

## 🗄️ Estrutura do Banco de Dados

### Tabela `avatars`
```sql
model Avatar {
  id       Int       @id @default(autoincrement())
  avatar   String    @unique
  students Student[]
  
  @@map("avatars")
}
```

**Campos:**
- `id`: Identificador único do avatar (auto-incremento)
- `avatar`: Nome do arquivo de imagem (único)
- `students`: Relação com alunos que usam este avatar

### Relação com `students`
Os alunos possuem um campo `avatarId` (opcional) que faz referência ao avatar:
```sql
avatarId      Int?
avatar        Avatar?  @relation(fields: [avatarId], references: [id])
```

## 🔌 Endpoints da API

### Backend: `/api/avatars`

#### 1. **Listar Todos os Avatares**
```
GET /api/avatars
```
**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "avatar": "alice.png"
    },
    {
      "id": 2,
      "avatar": "pedro.png"
    }
  ]
}
```

#### 2. **Buscar Avatar por ID**
```
GET /api/avatars/:id
```
**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "avatar": "alice.png"
  }
}
```

#### 3. **Criar Novo Avatar**
```
POST /api/avatars
Content-Type: application/json
```
**Body:**
```json
{
  "avatar": "novo-avatar.png"
}
```
**Resposta:**
```json
{
  "success": true,
  "message": "Avatar criado com sucesso",
  "data": {
    "id": 16,
    "avatar": "novo-avatar.png"
  }
}
```

**Validações:**
- ✅ O campo `avatar` é obrigatório
- ✅ O nome do arquivo deve ser único (não pode duplicar)

#### 4. **Atualizar Avatar**
```
PUT /api/avatars/:id
Content-Type: application/json
```
**Body:**
```json
{
  "avatar": "avatar-atualizado.png"
}
```
**Resposta:**
```json
{
  "success": true,
  "message": "Avatar atualizado com sucesso",
  "data": {
    "id": 16,
    "avatar": "avatar-atualizado.png"
  }
}
```

**Validações:**
- ✅ Verifica se o avatar existe
- ✅ Não permite nomes duplicados

#### 5. **Excluir Avatar**
```
DELETE /api/avatars/:id
```
**Resposta:**
```json
{
  "success": true,
  "message": "Avatar excluído com sucesso"
}
```

**Validações:**
- ✅ Verifica se o avatar existe
- ❌ **NÃO permite excluir** se houver alunos usando este avatar
- Mensagem de erro: `"Não é possível excluir este avatar. Ele está sendo usado por X aluno(s)."`

## 🎨 Interface do Usuário

### Tela de Gerenciamento de Avatares

Acesse através do **menu lateral** → **🎭 Avatares**

#### Layout:
- **Grid Responsivo**: Os avatares são exibidos em cards com preview circular
- **Informações do Card**:
  - Imagem do avatar (circular, 5rem x 5rem)
  - Nome do arquivo
  - ID do avatar
  - Botões de **Editar** (✏️) e **Excluir** (🗑️)

#### Botão de Adicionar (+):
- Botão flutuante fixo no canto inferior direito
- Cor: Gradiente roxo/rosa
- Abre o modal de cadastro

### Modal de Cadastro/Edição

#### Campos:
1. **Nome do Arquivo** (obrigatório)
   - Exemplo: `maria.png`
   - Deve incluir a extensão (.png, .jpg, etc.)

2. **Preview**
   - Mostra a imagem em tempo real conforme você digita
   - Fallback para placeholder se a imagem não existir

#### Dica Importante:
```
💡 Primeiro faça upload da imagem para a pasta 
   /public/avatares_edukkare/ do projeto e depois 
   cadastre aqui com o mesmo nome.
```

## 📦 Como Adicionar Novos Avatares

### Passo a Passo:

1. **Prepare a imagem**
   - Resolução recomendada: 200x200px
   - Formato: PNG ou JPG
   - Nome: Use nomes descritivos (ex: `joao-novo.png`)

2. **Faça upload da imagem**
   - Coloque o arquivo em: `/public/avatares_edukkare/`
   - Você pode fazer isso via FTP, Git, ou interface do Railway

3. **Cadastre no sistema**
   - Acesse: Menu → Avatares
   - Clique no botão `+`
   - Digite o nome EXATO do arquivo (com extensão)
   - Confira o preview
   - Clique em "Cadastrar"

4. **Associe aos alunos**
   - Ao editar um aluno, selecione o avatar desejado no dropdown

## 🔐 Segurança

- Todas as rotas requerem autenticação (token JWT)
- Validações de integridade referencial (não permite excluir avatares em uso)
- Validações de unicidade (não permite nomes duplicados)

## 📂 Estrutura de Arquivos

```
backend/
  src/
    controllers/
      student.controller.ts  # Inclui relação com avatares
    routes/
      avatar.routes.ts      # ✨ CRUD completo de avatares

frontend/
  public/
    avatares_edukkare/      # 📁 Pasta com imagens dos avatares
      alice.png
      pedro.png
      maria.png
      ...
  src/
    App.tsx                 # ✨ Tela de gerenciamento de avatares
```

## 🚀 Deploy no Railway

### Variáveis de Ambiente
Não são necessárias variáveis específicas para avatares. As imagens são servidas estaticamente.

### Importante:
- As imagens em `/public/avatares_edukkare/` são servidas pelo Vite
- No build de produção, essas imagens são copiadas automaticamente
- Certifique-se de que a pasta existe e contém as imagens no repositório

## 🧪 Testes

### Testar Localmente:
1. Acesse: http://localhost:5173
2. Faça login
3. Abra o menu → Avatares
4. Teste criar, editar e excluir avatares
5. Teste associar avatares a alunos

### Testar no Railway:
1. Acesse: https://edukkare.up.railway.app
2. Faça login
3. Mesmos testes acima

## 💡 Dicas e Boas Práticas

1. **Nomes de Arquivo**:
   - Use nomes descritivos e únicos
   - Evite caracteres especiais
   - Use minúsculas e hifens: `joao-silva.png`

2. **Qualidade das Imagens**:
   - Mantenha resolução consistente
   - Otimize o tamanho dos arquivos (< 200KB)
   - Use formato PNG para melhor qualidade

3. **Gerenciamento**:
   - Antes de excluir um avatar, verifique se nenhum aluno está usando
   - Ao renomear, atualize tanto o arquivo quanto o registro no banco

## 🐛 Troubleshooting

### Imagem não aparece:
- ✅ Verifique se o arquivo existe em `/public/avatares_edukkare/`
- ✅ Confirme que o nome no banco corresponde exatamente ao nome do arquivo
- ✅ Verifique a extensão do arquivo (.png, .jpg)

### Erro ao excluir:
- Se aparecer "está sendo usado por X aluno(s)", você precisa:
  1. Remover o avatar dos alunos primeiro
  2. Ou escolher outro avatar para esses alunos

### Avatar não atualiza:
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se o Railway fez rebuild após adicionar novas imagens

---

## 📝 Resumo

O CRUD de Avatares está **totalmente funcional** e integrado ao PostgreSQL do Railway! 🎉

✅ Backend completo com validações
✅ Interface moderna e responsiva
✅ Integração com cadastro de alunos
✅ Preview de imagens em tempo real
✅ Proteção contra exclusão de avatares em uso

**Status:** 🟢 **Pronto para uso em produção!**

