# 🔥 FIGURINHAS PRO

Painel de figurinhas exclusivas para Instagram. Sistema completo com login, navegação por categorias e download/cópia de figurinhas.

## Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Banco de dados**: Supabase (PostgreSQL)
- **Autenticação**: JWT em cookies httpOnly
- **Estilo**: Tailwind CSS (tema dark laranja)
- **Hospedagem**: Vercel

---

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais:

- **NEXT_PUBLIC_SUPABASE_URL**: URL do seu projeto Supabase
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Chave anon pública do Supabase
- **SUPABASE_SERVICE_ROLE_KEY**: Chave service role (nunca exponha no frontend!)
- **JWT_SECRET**: String aleatória longa (mín. 32 chars)
- **SMTP_***: Credenciais de email para recuperação de senha

### 3. Criar tabela no Supabase

No painel do Supabase → SQL Editor, execute o conteúdo de:

```
supabase/schema.sql
```

### 4. Criar primeiro usuário

```bash
node scripts/criar-usuario.js
```

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Estrutura das figurinhas

As figurinhas ficam em `/figurinhas/` na raiz do projeto (NÃO em `/public/`).

O sistema lê as pastas dinamicamente e serve as imagens via `/api/imagem/...`.

```
figurinhas/
├── GRAU/          ← categoria
├── BOM DIA/       ← categoria
├── CHOFFER/       ← categoria com subpastas
│   ├── BOA NOITE/
│   ├── BOA TARDE/
│   └── BOM DIA/
└── ...
```

---

## Deploy na Vercel

1. Push para GitHub
2. Conecte o repositório na Vercel
3. Configure as variáveis de ambiente no painel da Vercel
4. Deploy!

> ⚠️ **Importante**: A pasta `/figurinhas/` precisa estar no repositório ou configurar um volume de armazenamento externo para produção.

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/login` | Tela de login |
| `/painel` | Painel principal (protegido) |
| `/perfil` | Perfil do usuário (protegido) |
| `/esqueci-senha` | Recuperação de senha |
| `/resetar-senha/[token]` | Redefinir senha |

## API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/login` | POST | Login |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/me` | GET | Usuário logado |
| `/api/auth/esqueci-senha` | POST | Envia email de recuperação |
| `/api/auth/resetar-senha` | POST | Redefine senha |
| `/api/usuario/senha` | PUT | Troca senha (logado) |
| `/api/figurinhas` | GET | Lista categorias |
| `/api/figurinhas/[categoria]` | GET | Figurinhas da categoria |
| `/api/figurinhas/[categoria]/[sub]` | GET | Figurinhas da subcategoria |
| `/api/imagem/[...path]` | GET | Serve imagem protegida |
