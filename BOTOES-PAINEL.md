# Botões de Painel na Tela Principal

## ✅ Implementação Concluída

Foram adicionados dois botões na tela principal do aplicativo:

### 📊 Painel Gestor
- **Função**: Abre o menu lateral (sidebar) com acesso a todos os CRUDs
- **Ícone**: 📊
- **Cor**: Cinza (#64748b) que fica roxo ao hover (#8b5cf6)
- **Ação**: `setShowSidebar(true)`

### 👶 Painel Alunos  
- **Função**: Faz scroll suave até a seção de seleção de alunos
- **Ícone**: 👶
- **Cor**: Roxo (#8b5cf6) permanente, com fundo roxo claro ao hover
- **Ação**: Scroll suave para `[data-section="alunos"]`

## 🎨 Design

### Layout
- **Posicionamento**: No topo da tela principal, antes das atividades
- **Estrutura**: Dois botões lado a lado em flex
- **Responsivo**: `flex: 1 1 calc(50% - 0.5rem)` com `minWidth: 150px`
- **Espaçamento**: Gap de 1rem entre os botões

### Estilo
```css
{
  padding: '1.25rem 1.5rem',
  background: 'white',
  border: '2px solid #e2e8f0',
  borderRadius: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  fontSize: '1rem',
  fontWeight: '600'
}
```

### Efeitos Hover

**Painel Gestor:**
- Border muda para roxo (`#8b5cf6`)
- Box shadow aumenta
- Texto fica roxo

**Painel Alunos:**
- Border muda para roxo (`#8b5cf6`)  
- Box shadow aumenta
- Fundo fica roxo claro (`#f3f0ff`)

## 📱 Comportamento

### Painel Gestor
1. Ao clicar, abre o menu lateral (sidebar)
2. O menu mostra todos os itens de gerenciamento:
   - Alunos
   - Professores
   - Usuários
   - Escolas
   - Atividades
   - Turmas
   - Avatares

### Painel Alunos
1. Ao clicar, faz scroll suave até a seção de alunos
2. Utiliza `scrollIntoView({ behavior: 'smooth', block: 'start' })`
3. A seção tem o atributo `data-section="alunos"` para identificação

## 🎯 Objetivo

Facilitar a navegação e dar acesso rápido:
- **Professores**: podem acessar rapidamente a lista de alunos
- **Gestores**: podem acessar facilmente os CRUDs administrativos

## 📍 Localização no Código

**Arquivo**: `frontend/src/App.tsx`
**Linha**: ~3111-3193

Os botões estão dentro do `<main>` da tela principal, logo após o header e antes da seleção de atividades.

## 🚀 Benefícios

1. **UX Melhorada**: Navegação mais intuitiva
2. **Acesso Rápido**: Gestores acessam CRUDs com 1 clique
3. **Moderno**: Design clean e profissional
4. **Responsivo**: Adapta-se a diferentes tamanhos de tela
5. **Interativo**: Feedback visual ao hover

## ✨ Resultado

A tela principal agora tem dois botões elegantes e funcionais que melhoram significativamente a experiência do usuário, proporcionando acesso rápido tanto para professores (painel alunos) quanto para gestores (painel administrativo).

