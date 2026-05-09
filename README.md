# Strapi CMS — Marinna Dermato

Projeto Strapi com conteúdo do site da Dra. Marinna. Inclui content types para Blog/SEO e padronizações específicas.

## Scripts

```
pnpm develop   # Dev com autoReload
pnpm start     # Produção
pnpm build     # Build do admin
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## Conteúdo e Modelagem

- Content Types:
  - `Article` (com Dynamic Zone: `article.text-block`, `image-block`, `video-block`, `quote-block`; ciclo de vida `draft` / `preview` / `published` / `archived` — ver `docs/blog-structure.md`)
  - `Category`, `Tag`
  - `Default SEO`
- Componentes:
  - `shared.seo` (metadados para artigos; sem locale/canonical no CMS)
  - Blocos `article.*`

**Plano de SEO:** `docs/seo-plano-referencia.md`  
**Padronização de campos:** `docs/seo-standardization.md`

## Integração com Frontend

- Webhooks apontam para o Next.js em `/api/revalidate`
- O frontend mescla dados do CMS com `FALLBACK_DATA` (merge profundo sem concatenar arrays)
- `robots.txt` usa host dinâmico via helper no frontend

Scripts úteis em `scripts/`:
- `setup-webhook.js`, `test-webhook.js`
- `seed-blog-data.js` (local): cria tags/categorias e um artigo exemplo

Importante (Cloud): seeding via REST pode exigir permissões e ter timeouts. Prefira criar o artigo pelo Admin quando necessário.

Troubleshooting Cloud:
- Erro de patch `node-schedule.patch`: regenere `pnpm-lock.yaml`
- 404/405 em novos CTs: publicar, revisar permissões (Public find/findOne)
- Relações manyToMany: usar `inversedBy`/`mappedBy` corretamente

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Documentação Strapi: https://docs.strapi.io

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
