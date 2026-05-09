# Blog Structure - Dra. Marinna

Planeamento único para **CMS (Strapi)** e **webapp (Next.js)**. Alinhado ao SEO em `seo-plano-referencia.md` e `seo-standardization.md`.

---

## Guia rápido: Draft & Publish e o site

O modelo **Article** não usa campo editorial extra: só o **Draft & Publish** do Strapi.

### Abas **Draft** e **Published**

| Aba | O que é |
|-----|--------|
| **Draft** | Rascunho (**Save** grava aqui). |
| **Published** | Última versão **Publish** (live na API como `PUBLISHED`). |

### Onde isto aparece no Next.js

| URL | GraphQL | Quem vê |
|-----|---------|---------|
| `/blog`, `/blog/[slug]` | `articles_connection` + **`status: PUBLISHED`** | Público (sem token). |
| `/blog/preview/[slug]` | `articles_connection` + **`status: DRAFT`** (mesmo `slug`) | Servidor Next com **`STRAPI_API_TOKEN`**. |

**Fluxo:** edita na aba Draft → **Save** → abre `/blog/preview/[slug]` para homologar o rascunho (só enquanto **ainda não** houver versão Published com esse slug). **Publish** quando quiseres que `/blog/[slug]` exista. Se o artigo **já está publicado**, `/blog/preview/[slug]` **redireciona** para `/blog/[slug]` (URL canónica).

### Botões **Save**, **Publish**, menu **…**

| Ação | Efeito típico |
|------|----------------|
| **Save** | Grava o **Draft**. |
| **Publish** | Atualiza a versão **Published**. |
| **Unpublish** | Remove a versão publicada. |
| **Discard changes** | Descarta alterações não guardadas nesta sessão. |

---

## Resumo dos Content Types

| API | Nome | Função |
|-----|------|--------|
| `api::article.article` | Article | Post do blog (Draft & Publish); slug, excerpt, imagem, `seo`, `blocks`, categorias, tags. |
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
- `publishedAt` (datetime) — Data de publicação (uso editorial)
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

- `content` (custom field **TinyMCE** `global::tinymce-html`, mesmo padrão que `treatment.content`), `alignment`, `backgroundColor`, `padding`

**Migração a partir de `richtext`:** blocos antigos podem estar guardados no formato do editor Strapi. Após este schema, convém **rever e gravar de novo** o conteúdo dos blocos de texto no admin (ou migrar manualmente) para garantir HTML válido no TinyMCE.

### 2. Image Block (`article.image-block`)

- `image`, `caption`, `alignment`, `size`, `link`, `alt`

### 3. Video Block (`article.video-block`)

- `videoType`, `videoUrl`, `thumbnail`, `caption`, `alignment`, `size`, `autoplay`, `muted`

### 4. Quote Block (`article.quote-block`)

- `quote`, `author`, `source`, `style`, `alignment`

### Tipos TypeScript e ficheiros de schema (CMS)

Cada bloco tem **JSON** em `src/components/article/` (`text-block.json`, `image-block.json`, `video-block.json`, `quote-block.json`) e interfaces geradas em **`types/generated/components.d.ts`**:

- `ArticleTextBlock`
- **`ArticleImageBlock`** — `image` (media), `caption`, `alt`, `link`, `alignment`, `size` (`small` \| `medium` \| `large` \| `full`), `customMaxWidth` (opcional; CSS `max-width`, ex. `320px` ou `min(100%, 28rem)` — se preenchido, substitui `size`)
- **`ArticleVideoBlock`** — `videoType` (`instagram` \| `youtube` \| `vimeo` \| `upload`), `videoUrl`, `thumbnail`, `caption`, `alignment`, `size`, `autoplay`, `muted`
- `ArticleQuoteBlock`

O `Article` em `types/generated/contentTypes.d.ts` referencia estes `__component` na dynamic zone `blocks`.

---

## Shared: `shared.seo`

Igual ao padrão do site: `defaultTitle`, `description`, `siteName`, `keywords`, imagens OG/Twitter, `ogTitle`, `ogDescription`, `twitterCard`. Sem locale nem `canonicalUrl` no CMS.

---

## CMS: API, permissões e segurança

### Papel Public (anónimo)

- **`Article`**: permitir `find` / `findOne` **apenas** para registos **Published** no Strapi (Draft & Publish).
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

- Buscar artigo com GraphQL **`status: PUBLISHED`** (versão publicada).
- Metadata completa: `og:type: article`, JSON-LD `Article`, canónico, indexação normal.
- **404** se não existir ou `archived`.

### `/blog/preview/[slug]` — preview interno

- Buscar artigo com GraphQL **`status: DRAFT`** (token no servidor).
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

- Queries públicas: `status: PUBLISHED` no GraphQL.
- Função ou query dedicada para **preview** (servidor + token), nunca importada em Client Components.

---

## API REST (referência)

Os paths seguem o Strapi; exemplos conceituais:

- Listagem pública filtrada: apenas `published`.
- Detalhe por slug na rota pública: mesma regra.
- Preview: mesma `collection` com token e **`status: DRAFT`** no GraphQL.

---

## Usage Examples

### Criar artigo em homologação

```javascript
await strapi.entityService.create('api::article.article', {
  data: {
    title: 'Cuidados com a Pele no Verão',
    slug: 'cuidados-pele-verao',
    excerpt: 'Dicas essenciais...',
    // Homologação: só Save (Draft). Depois Publish no Strapi para o site público.
    seo: { /* shared.seo */ },
    blocks: [/* ... */],
  },
});
```

### Listar artigos só no ar (público)

```javascript
const articles = await strapi.entityService.findMany('api::article.article', {
  filters: {
    publishedAt: { $notNull: true },
  },
  // Preferir API Document Service / publicationState conforme a vossa versão Strapi
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

Cria categorias, tags e artigo de exemplo — após criar, **Publish** no admin se quiseres o artigo no site público.

---

## Checklist de implementação

| Área | Tarefa |
|------|--------|
| CMS | Draft & Publish; políticas Public + token para ler `DRAFT` no preview documentadas |
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
3. HTML do TinyMCE nos blocos de texto (mesmo fluxo que tratamentos): render com `CmsRichText` / parser seguro.
4. Imagens otimizadas (Next/Image) e lazy loading onde aplicável.
5. Embeds de vídeo conforme bloco.
6. SEO a partir de `shared.seo` + `og:type: article` para URLs públicas.
