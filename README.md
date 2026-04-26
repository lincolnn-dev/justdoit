# JustDoIt

MVP inicial de um app web de tasks com foco em portfólio, leveza e arquitetura preparada para evoluir para clientes mobile e desktop.

## Stack

- `apps/web`: Next.js + React + TypeScript + Tailwind CSS + TanStack Query
- `apps/api`: NestJS + Fastify + MongoDB Atlas via Mongoose
- `packages/shared`: tipos e contratos compartilhados entre front e API

## Estrutura

```text
.
├── apps
│   ├── api
│   │   └── src
│   │       └── modules
│   │           ├── health
│   │           └── tasks
│   │               ├── application
│   │               ├── domain
│   │               ├── dto
│   │               └── infrastructure
│   └── web
│       └── src
│           ├── app
│           ├── components
│           ├── features
│           └── lib
├── packages
│   └── shared
│       └── src
│           └── task
└── .env.example
```

## Decisoes de arquitetura

- Dominio isolado no backend: regras de tarefa ficam em `domain` e `application`, sem depender de Nest ou Mongo.
- Contrato compartilhado: `packages/shared` centraliza tipos da entidade e DTOs para reduzir drift entre frontend e API.
- Infra desacoplada: repositório Mongo implementa uma interface de domínio, facilitando troca de persistência.
- API-first: a API Nest serve o web app agora e já fica pronta para clientes mobile e desktop depois.
- Complexidade contida: sem camadas extras desnecessárias para o MVP, mas com fronteiras claras para crescimento.

## Modelo de dados MongoDB

Colecao `tasks`:

```json
{
  "id": "uuid",
  "title": "Ship MVP",
  "description": "Keep the first release simple",
  "status": "pending",
  "priority": "medium",
  "createdAt": "2026-04-25T10:00:00.000Z",
  "updatedAt": "2026-04-25T10:00:00.000Z",
  "completedAt": null
}
```

Indices iniciais:

- `{ status: 1, createdAt: -1 }`
- `{ priorityRank: -1, createdAt: -1 }`
- `id` unico

## Fluxo principal

1. Usuário abre o dashboard e a UI busca `GET /api/tasks`.
2. Usuário cria uma task no card lateral.
3. A lista atualiza e permite filtrar por status e ordenar por criacao ou prioridade.
4. Cada item pode ser concluido, editado ou excluido.
5. Estados de loading, empty e error ficam visiveis sem poluir a interface.

## Endpoints

- `GET /api/health`
- `GET /api/tasks?status=all|pending|completed&sortBy=createdAt|priority`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`

## Plano de implementacao

1. Base do monorepo e contratos compartilhados.
2. API Nest modular com persistencia Mongo e validacao.
3. Dashboard web com listagem, criacao e estados de UX.
4. Mutacoes de editar, concluir e excluir.
5. Ajustes de refinamento visual, testes e deploy.

## Como rodar

### Opcao 1: Mongo local com Docker

1. Suba o banco com `docker compose up -d`.
2. O `.env` ja esta apontando para `mongodb://127.0.0.1:27017/justdoit`.
3. Rode a API com `npm run dev:api`.
4. Rode o frontend com `npm run dev:web`.

### Opcao 2: MongoDB Atlas

1. Instale dependencias com `npm install`.
2. Ajuste `MONGODB_URI` no `.env` para a string do Atlas.
3. Rode a API com `npm run dev:api`.
4. Rode o frontend com `npm run dev:web`.

### Comandos uteis do Docker

- Subir Mongo local: `docker compose up -d`
- Ver logs: `docker compose logs -f mongodb`
- Derrubar stack: `docker compose down`
- Derrubar e remover volume: `docker compose down -v`

### Fluxo de um comando

- Subir Mongo local + API + frontend: `npm run dev:local`
- Subir apenas API + frontend: `npm run dev`
- Subir Mongo local + build + API + frontend em modo producao: `npm run start:local`
- Subir API + frontend em modo producao usando build existente: `npm run start`
- Derrubar Mongo local: `npm run infra:down`

## Proximos passos naturais

- Adicionar autenticacao e multi-tenant por usuario.
- Extrair casos de uso e contratos para facilitar reaproveitamento com KMP.
- Incluir testes unitarios no dominio e testes de integracao na API.
