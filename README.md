# Projeto Portfólio Palico

Portfólio pessoal full-stack: página pública com grade de projetos, uma página própria pra cada projeto (capa, descrição, cor ou imagem de fundo escolhida por você, e uma linha do tempo de posts), e um painel administrativo pra gerenciar tudo. Serve tanto pra uso pessoal quanto como base pra qualquer pessoa clonar e adaptar do seu jeito.

<img width="150" height="150" alt="Image" src="https://github.com/user-attachments/assets/e0da5a2d-bb22-465a-bfa6-4dd5ec4b0ba0" />

## Funcionalidades

- Grade de projetos na home (pública, sem necessidade de login)
- Página individual por projeto, com posts/atualizações em ordem cronológica
- Cada post é uma sequência livre de blocos - texto, imagem, gif, vídeo (arquivo ou link do YouTube/Vimeo) e links - nenhum tipo é obrigatório e não há limite de blocos
- Painel administrativo protegido por login (JWT) pra criar, editar e excluir projetos e posts
- Formulário de contato público

## Stack

- **Front-end:** React (Create React App), React Router, Axios
- **Back-end:** Node.js, Express, JWT, bcrypt, multer
- **Banco de dados:** PostgreSQL

## Pré-requisitos

- Node.js 18+ e npm
- PostgreSQL instalado e rodando (local ou remoto)
- Um cliente gráfico de banco de dados   | [DBeaver](https://dbeaver.io/) é o usado nos passos abaixo, mas qualquer um serve

---

## Instalação (do zero)

### 1. Clonar o repositório

```bash
git clone https://github.com/Marc-V-z/Portif-lio
cd Portif-lio
```

### 2. Criar o banco de dados

No DBeaver, conecte no seu servidor PostgreSQL (com o usuário que você já usa pra administrar seu Postgres local). Crie um banco novo: botão direito em **Databases** → **Create New Database** → dê o nome que quiser, por exemplo `portfolio`.

### 3. Rodar o schema

Com o banco novo selecionado, abra **SQL Editor → New SQL Script**, cole o conteúdo de [`back-end/models/schema.sql`](back-end/models/schema.sql) e rode tudo de uma vez com **Execute SQL Script** (ícone de "play" com várias linhas, ou `Alt+X`). Isso cria as tabelas `admins`, `projects`, `posts`, `post_media` e `contacts`.

```sql
DROP TABLE IF EXISTS post_media, posts, projects, admins, contacts CASCADE;

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  cover_image VARCHAR(255),
  cover_fit VARCHAR(20) DEFAULT 'cover',
  theme_color VARCHAR(20),
  theme_image VARCHAR(255),
  page_bg_color VARCHAR(20),
  page_bg_image VARCHAR(255),
  page_bg_repeat BOOLEAN DEFAULT false,
  github_link VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(150),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE post_media (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### 4. Configurar o back-end

```bash
cd back-end
npm install
```

Crie um arquivo `.env` dentro de `back-end/` com:

```
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_HOST=localhost
DB_NAME=portfolio
DB_PORT=5432
JWT_SECRET=uma_string_aleatoria_e_longa
PORT=5000
```

Pra gerar um `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Criar seu usuário administrador

Não existe cadastro predefinido, crie seu próprio personalizado! O login é criado por um script:

```bash
node seed.js seuemail@exemplo.com suaSenha
```

Isso grava (ou, se já existir, atualiza a senha de) uma linha na tabela `admins`. É esse email/senha que você vai usar em `/admin/login`. Rodar de novo com o **mesmo email** troca a senha; com um email diferente, cria outro admin.

### 6. Configurar o front-end

```bash
cd ../front-end
npm install
```

Por padrão o front-end conversa com `http://localhost:5000`. Se seu back-end estiver em outro endereço, crie `front-end/.env.local`:

```
REACT_APP_API_URL=http://seu-back-end:porta
```

---

## Iniciando o projeto

Sempre em dois terminais separados:

```bash
# terminal 1 — back-end
cd back-end
node server.js
```

```bash
# terminal 2 — front-end
cd front-end
npm start
```

O site abre em `http://localhost:3000`. O painel administrativo fica em `http://localhost:3000/admin/login`.

## Parando o projeto

`Ctrl+C` em cada um dos dois terminais.

---

## Usando o painel administrativo

**Logar:** vá em `/admin/login` e entre com o email/senha criados no passo 5 da instalação.

**Criar um projeto:** `/admin` → **Novo projeto**. Preencha o *slug* (parte da URL, `meu-jogo` vira `/projeto/meu-jogo`, precisa ser único), título, descrição, capa, e opcionalmente uma imagem ou cor de fundo pra página do projeto.

**Adicionar posts:** dentro da tela de edição de um projeto, em **Posts** → **Novo post**. Cada post é uma lista de blocos, clique em **+ Adicionar bloco** quantas vezes quiser e escolha o tipo de cada um (texto, imagem, gif, vídeo ou link). Pra vídeo, prefira colar um link do YouTube/Vimeo; upload direto de arquivo tem limite de 20MB.

**Editar ou excluir:** os botões correspondentes aparecem ao lado de cada projeto/post no painel. Excluir um projeto apaga também todos os posts dele.

**Trocar sua senha:** rode `node seed.js seuemail@exemplo.com novaSenha` de novo, usando o mesmo email.

---

## Variáveis de ambiente

### `back-end/.env`

| Variável | Descrição |
|---|---|
| `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `DB_PORT` | Credenciais de conexão com o Postgres |
| `JWT_SECRET` | Chave usada pra assinar os tokens de login (mantenha em segredo, nunca comite no git) |
| `PORT` | Porta em que o back-end sobe (padrão 5000) |

### `front-end/.env.local` (opcional)

| Variável | Descrição |
|---|---|
| `REACT_APP_API_URL` | Endereço do back-end, se não for `http://localhost:5000` |

---

## Estrutura do projeto

```
back-end/
  middleware/   # verificação de token JWT
  models/       # schema.sql  (estrutura do banco)
  routes/       # rotas da API (auth, projects, posts, upload, contact)
  uploads/      # arquivos de mídia enviados (criado automaticamente)
  seed.js       # cria/atualiza o admin
  server.js

front-end/
  src/
    api/        # cliente axios
    context/    # contexto de autenticação
    components/ # peças reutilizáveis (card, bloco de post, etc.)
    pages/      # telas (home, projeto, admin)
```

---

## Solução de problemas

**Erro "too many connections" / requisições falhando de forma intermitente:** seu Postgres tem um limite baixo de conexões simultâneas (comum em serviços de hospedagem gratuitos). Em `back-end/db.js`, limite o pool:

```javascript
const pool = new Pool({
  // ...demais opções
  max: 5,
  idleTimeoutMillis: 10000,
});
```

E evite deixar um cliente de banco (como o DBeaver) conectado sem necessidade enquanto o back-end estiver rodando.

**Back-end não conecta ao banco:** confirme que o serviço do PostgreSQL está rodando e que os valores em `.env` batem com o banco que você criou.

**Imagem não aparece:** confira se `back-end/server.js` está servindo a pasta de uploads (`app.use("/uploads", ...)`) e se o front-end está montando a URL completa (`REACT_APP_API_URL` + caminho relativo) em vez de usar o caminho relativo puro.

---

## Licença

Sinta-se livre pra clonar, modificar e usar esse projeto como base pro seu próprio portfólio.
