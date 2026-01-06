# 🛠️ Guia de Atualização e Validação do Projeto

## 🔄 Atualizar pacotes principais

1. 📦 `bun install next@latest react@latest react-dom@latest`
2. 🔍 `ncu`
3. ⚙️ `ncu -u`
4. 📥 `bun install`

---

## 🧩 Dependências opcionais (se necessário)

### 📘 Tipos

1. 🧠 `bun install --save-dev @types/node@latest @types/react@latest @types/react-dom@latest`

### ☁️ Cloudflare

1. 🌐 `bun install --save-dev @cloudflare/next-on-pages @cloudflare/workers-types`

### 🎨 Formatação e estilo

1. ✨ `bun install --save-dev prettier prettier-plugin-tailwindcss`
2. 🧹 `bun install --save-dev eslint-config-prettier eslint-plugin-prettier prettier`

### Testes

1. `bun install -D @playwright/test @commitlint/config-conventional @commitlint/cli @storybook/nextjs`
2. `npx playwright install`
3. `bun install -D @commitlint/config-conventional @commitlint/cli`
4. `echo npx --no -- commitlint --edit $1 > .husky/commit-msg`

---

## ✅ Validação de arquivos

### 🔎 Lint

1. 🧪 `bun run lint`
2. 🛠️ `bun run lint:fix`

### 📏 Formatação

1. 🔍 `bun run format:check`
2. 🎯 `bun run format`

### 🐈 Github

1. git add .
2. git commit -m 'exemplo'
3. git push
