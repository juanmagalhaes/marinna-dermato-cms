# Blog Structure - Dra. Marinna

Planeamento único para **CMS (Strapi)** e **webapp (Next.js)**. Alinhado ao SEO em `seo-plano-referencia.md` e `seo-standardization.md`.

---

## Ciclo de vida e URLs (decisão de produto)

Três estados visíveis no modelo editorial; **sem token na URL** — o slug em `/blog/preview/[slug]` é o definitivo.

| Estado `status` | Comportamento no site |
|-----------------|------------------------|
| **`draft`** | Não existe rota pública. Conteúdo só no admin. |
| **`preview`** | Apenas **`/blog/preview/[slug]`**. Homologação interna (ex.: partilha de link). |
| **`published`** | **`/blog/[slug]`** — listagens, SEO, sitemap, comportamento normal. |
| **`archived`** | Retirado do ar: **404** (ou redirecionamento futuro) em público e preview; permanece no CMS para histórico. |

### Regra operacional com Draft & Publish (Strapi)

- Enquanto **`preview`** ou **`draft`**: manter o documento **não publicado** no workflow nativo do Strapi (*Save* / draft), até validação interna.
- Ao passar a **`published`**: **Publicar** no Strapi e garantir `status: published`. Assim a **API pública anónima** não expõe rascunhos nem artigos em homologação.
- A rota de preview no Next obtém artigos em **`preview`** via **`STRAPI_API_TOKEN`** (ou token de leitura dedicado) **apenas no servidor**, com `publicationState`/filtros adequados à versão do Strapi (consultar [documentação Draft & Publish](https://docs.strapi.io)).

---

## Resumo dos Content Types

| API | Nome | Função |
|-----|------|--------|
| `api::article.article` | Article | Post do blog: slug, excerpt, imagem, `status`, `seo`, `blocks` (dynamic zone), categorias, tags. |
| `api::category.category` | Category | Organização; M2M com artigos. |
| `api::tag.tag` | Tag | Etiquetas; M2M com artigos. |

Componente partilhado: **`shared.seo`** nos artigos (e alinhado ao Default SEO do site).

---

## Content Types Created

### 1. Article (`api::article.article`)

**Artigo principal do blog (dynamic zone).**

#### Fields

- `title` (string, required) — Título
- `slug` (uid, required) — Slug da URL (`/blog/[slug]` e `/blog/preview/[slug]`)
- `excerpt` (text) — Resumo / lead
- `featuredImage` (media) — Imagem de destaque
- `publishedAt` (datetime) — Data de publicação (alinhada ao uso editorial; Strapi Draft & Publish também gere visibilidade na API)
- `status` (enumeration, required, default `draft`) — `draft` \| `preview` \| `published` \| `archived`
- `seo` (component `shared.seo`) — Metadata por artigo
- `blocks` (dynamic zone) — Blocos de conteúdo
- `categories` (relation M2M) — Categorias
- `tags` (relation M2M) — Tags

#### Slug

- Único entre artigos **efetivamente públicos** (`published`). Validar antes de publicar para evitar colisão.
- O mesmo slug serve em preview e, depois, na URL pública.

### 2. Category (`api::category.category`)

- `name`, `slug`, `description`, `color`, `articles`

### 3. Tag (`api::tag.tag`)

- `name`, `slug`, `description`, `color`, `articles`

---

## Dynamic Zone Components

### 1. Text Block (`article.text-block`)

- `content` (richtext), `alignment`, `backgroundColor`, `padding`

### 2. Image Block (`article.image-block`)

- `image`, `caption`, `alignment`, `size`, `link`, `alt`

### 3. Video Block (`article.video-block`)

- `videoType`, `videoUrl`, `thumbnail`, `caption`, `alignment`, `size`, `autoplay`, `muted`

### 4. Quote Block (`article.quote-block`)

- `quote`, `author`, `source`, `style`, `alignment`

### Tipos TypeScript e ficheiros de schema (CMS)

Cada bloco tem **JSON** em `src/components/article/` (`text-block.json`, `image-block.json`, `video-block.json`, `quote-block.json`) e interfaces geradas em **`types/generated/components.d.ts`**:

- `ArticleTextBlock`
- **`ArticleImageBlock`** — `image` (media), `caption`, `alt`, `link`, `alignment`, `size`
- **`ArticleVideoBlock`** — `videoType` (`instagram` \| `youtube` \| `vimeo` \| `upload`), `videoUrl`, `thumbnail`, `caption`, `alignment`, `size`, `autoplay`, `muted`
- `ArticleQuoteBlock`

O `Article` em `types/generated/contentTypes.d.ts` referencia estes `__component` na dynamic zone `blocks`.

---

## Shared: `shared.seo`

Igual ao padrão do site: `defaultTitle`, `description`, `siteName`, `keywords`, imagens OG/Twitter, `ogTitle`, `ogDescription`, `twitterCard`. Sem locale nem `canonicalUrl` no CMS.

---

## CMS: API, permissões e segurança

### Papel Public (anónimo)

- **`Article`**: permitir `find` / `findOne` **apenas** para registos que sejam **publicados no Strapi** e com **`status: published`**.
  - Se a UI de permissões do Strapi não permitir filtro composto, usar **policy customizada** ou **desativar** listagem pública de artigos e expor só via Next com token (BFF). Documentar a opção escolhida no deploy.
- **`Category` / `Tag`**: conforme necessidade de listagens públicas (só categorias/tags que tenham artigos `published`, se quiserem evitar páginas vazias).

### Preview / homologação

- Pedidos ao Strapi para artigos `preview` (e drafts) **só com token no servidor Next** — nunca expor o token ao browser.
- Variável de ambiente sugerida no webapp: `STRAPI_API_TOKEN` (ou nome já usado no projeto).

### Opcional (melhorias futuras)

- **Expiração de preview**: campo `previewExpiresAt` e validação na rota Next.
- **Regenerar contexto**: ao voltar de `published` para `preview` (raro), definir processo claro para slug e redirects.

---

## Webapp (Next.js) — comportamento por rota

Documentação detalhada: `MarinnaDermato/docs/blog.md`.

### `/blog` — página inicial do blog

- Listagem de artigos **`published`** (ver detalhes e navegação global em `MarinnaDermato/docs/blog.md`).
- **Sitemap:** incluir o path **`/blog`** além de cada **`/blog/[slug]`**.

### `/blog/[slug]` — artigo público

- Buscar artigo com **`status: published`** + critérios Strapi publicados.
- Metadata completa: `og:type: article`, JSON-LD `Article`, canónico, indexação normal.
- **404** se não existir ou `archived`.

### `/blog/preview/[slug]` — preview interno

- Buscar artigo com **`status: preview`** (token servidor).
- **`metadata.robots`**: `{ index: false, follow: false }`.
- **Opcional (recomendado)**: header de resposta **`X-Robots-Tag: noindex, nofollow`** (middleware ou `headers()` neste segmento — aceitar rota dinâmica se necessário).
- **Opcional**: se o artigo já estiver **`published`**, **redirecionar 308** para `/blog/[slug]` (evita duplicar conteúdo indexável).
- **404** para `draft`, `archived` ou slug inexistente.

### Listagens (`/blog`, destaques, etc.)

- Apenas artigos **`published`**. Nenhum link gerado para `/blog/preview/...` em UI pública.

### Sitemap

- Incluir **`/blog`** (índice) e **somente** URLs **`/blog/[slug]`** com `published`.
- **Não** incluir `/blog/preview/*`.

### `robots.txt`

- Em produção: **`Disallow: /blog/preview/`** como reforço (além do `noindex` na página). Ver `MarinnaDermato/docs/robots-urls.md`.

### Manifest / PWA

- Não referenciar rotas de preview no manifest.

### GraphQL / `lib/cms`

- Queries públicas: filtro `status: published` (+ publicação Strapi).
- Função ou query dedicada para **preview** (servidor + token), nunca importada em Client Components.

---

## API REST (referência)

Os paths seguem o Strapi; exemplos conceituais:

- Listagem pública filtrada: apenas `published`.
- Detalhe por slug na rota pública: mesma regra.
- Preview: mesma `collection` com auth e filtros `status: preview` + draft/publish conforme política.

---

## Usage Examples

### Criar artigo em homologação

```javascript
await strapi.entityService.create('api::article.article', {
  data: {
    title: 'Cuidados com a Pele no Verão',
    slug: 'cuidados-pele-verao',
    excerpt: 'Dicas essenciais...',
    status: 'preview',
    // Manter não publicado no Strapi até validação; depois Publish + status published
    seo: { /* shared.seo */ },
    blocks: [/* ... */],
  },
});
```

### Listar artigos só no ar (público)

```javascript
const articles = await strapi.entityService.findMany('api::article.article', {
  filters: {
    status: 'published',
    publishedAt: { $notNull: true },
  },
  publicationState: 'live', // conforme API Strapi em uso
  populate: { featuredImage: true, seo: true, categories: true, tags: true, blocks: { populate: '*' } },
  sort: { publishedAt: 'desc' },
});
```

*(Ajustar `publicationState` / filtros à versão exata do Strapi e às policies.)*

---

## Seeding

```bash
node scripts/seed-blog-data.js
```

Cria categorias, tags e artigo de exemplo — atualizar o seed para usar `status` coerente (`preview` ou `published`) quando o script for revisto.

---

## Checklist de implementação

| Área | Tarefa |
|------|--------|
| CMS | `status` com valor `preview`; políticas Public + token preview documentadas |
| CMS | Fluxo editorial: draft/preview sem Publish Strapi até `published` |
| Webapp | Rotas `app/blog/page.tsx`, `app/blog/[slug]`, `app/blog/preview/[slug]` |
| Webapp | **Navegação:** link `/blog` no header (desktop + mobile) e footer (`MarinnaDermato/docs/blog.md`) |
| Webapp | `STRAPI_API_TOKEN` só servidor; queries GraphQL/REST |
| Webapp | Renderizar dynamic zone (blocos) + rich text; tipos em `types/generated/components.d.ts` |
| Webapp | SEO índice `/blog` + artigo + JSON-LD `Article`; preview com `noindex` + opcional `X-Robots-Tag` |
| Webapp | Sitemap: `/blog` + slugs; sem preview; `robots.txt` com `Disallow: /blog/preview/` |
| Webapp | Sem links de preview na UI pública; manifest sem preview |

---

## Frontend Integration (resumo)

1. Artigos públicos a partir do CMS com filtro `published`.
2. Blocos dinâmicos mapeados para componentes React.
3. Rich text com estilos acessíveis (reutilizar padrões tipo `CmsRichText` onde fizer sentido).
4. Imagens otimizadas (Next/Image) e lazy loading onde aplicável.
5. Embeds de vídeo conforme bloco.
6. SEO a partir de `shared.seo` + `og:type: article` para URLs públicas.
