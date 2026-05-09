# Plano de SEO — referência

Documento único de prioridades, glossário e decisões. Detalhes de modelagem: `seo-standardization.md`, `blog-structure.md`.

---

## Decisões fixas (site atual)

### Idioma — sem i18n

- O site **não terá outras línguas** e **não há campos de locale / idioma no CMS**.
- No Next.js, `lang="pt-BR"`, `openGraph.locale` e textos de fallback são **fixos** (pt-BR / `pt_BR` onde aplicável).
- O Strapi **não** guarda locale nem URL canónica global: o canónico de cada página vem de **`SITE_URL` + pathname** (ver abaixo).

### Twitter / X

- Não há perfil Twitter/X da marca: **não** existem campos `twitter:site` / `twitter:creator`.
- Mantêm-se no CMS **`twitterCard`**, **`twitterImage`**, e textos OG (`ogTitle`, `ogDescription`) para **pré-visualização quando alguém partilha links** nessas redes.

### URL canónica (implementado no Next)

- **`metadataBase`** e **`alternates.canonical`** usam a origem de `getSiteUrl()` / `SITE_URL` e o path atual (`x-pathname` definido no middleware em desenvolvimento).
- **Não** há `canonicalUrl` no Default SEO nem no componente `shared.seo`.

### Google Search Console (A4)

- Variável **`GOOGLE_SITE_VERIFICATION`** (servidor, opcional): valor da meta tag de verificação.
- Se vazia, **não** se emite `verification.google` no metadata.
- Definir **só em produção** (Vercel) quando tiverem o código no Search Console.

---

## Glossário

| Termo | Significado breve |
|--------|-------------------|
| **Meta title / description** | Título e resumo nos resultados de pesquisa. |
| **Open Graph** | Metadados para pré-visualização em redes (Facebook, LinkedIn, etc.). |
| **Twitter card** | Tipo de cartão e metadados para pré-visualização no X. |
| **`og:type`** | `website` para páginas institucionais; **`article`** quando existir blog (fase futura). |
| **Canónico** | URL oficial da página para motores de busca. |
| **JSON-LD** | Dados estruturados (ex.: `Physician` no layout). |

---

## Campos no CMS (resumo)

### Default SEO (single type)

- Obrigatórios: `defaultTitle`, `description`, `siteName`
- Opcionais: `keywords`, `ogTitle`, `ogDescription`, `twitterCard`, `openGraphImage`, `twitterImage`

### `shared.seo` (artigos — blog)

- Alinhado ao default: `defaultTitle`, `description`, `siteName`, `keywords`, `openGraphImage`, `twitterImage`, `ogTitle`, `ogDescription`, `twitterCard`
- **Sem** `locale`, **sem** `canonicalUrl`

---

## Fases

### Feito (site sem blog)

- Metadata a partir do CMS + canónico automático + verificação Google opcional via env.
- JSON-LD com `siteOrigin` alinhado a `SITE_URL`.

### Fase blog (quando existir no Next)

- **Índice** `/blog`: metadata própria (listagem de artigos); indexável; incluir **`/blog`** no **sitemap** além de cada **`/blog/[slug]`**.
- **Público** `/blog/[slug]`: metadata por artigo, **`og:type: article`**, JSON-LD **`Article`**, canónico e indexação normais; listagens só `status: published`.
- **Preview** `/blog/preview/[slug]`: artigos `status: preview`; **`noindex, nofollow`**; opcional header **`X-Robots-Tag: noindex, nofollow`**; opcional **redirect 308** para a URL pública se o artigo já estiver `published`.
- **Navegação**: link para **`/blog`** no header (desktop + menu mobile) e no footer — **sem** links públicos para `/blog/preview/...`.
- **Sitemap**: URLs públicas **`/blog`** + artigos; **excluir** `/blog/preview/*`.
- **`robots.txt`**: em produção, **`Disallow: /blog/preview/`** (reforço).
- **Manifest / PWA**: sem rotas de preview.
- **CMS**: token só no servidor para ler preview; API pública só `published`. Detalhes: `blog-structure.md` e `MarinnaDermato/docs/blog.md`.

### Aprimorar depois

- i18n real, OG por muitas páginas institucionais, auditoria CWV dedicada, guidelines editoriais.

---

## Próximos passos operacionais

1. **Produção:** definir `GOOGLE_SITE_VERIFICATION` na Vercel após registo no Search Console.
2. **Strapi Cloud:** após deploy do schema, rever entradas antigas de Default SEO (remover atributos obsoletos se o Admin mostrar avisos) e republicar.
3. **Artigos:** ao criar/editar, não preencher locale/canonical — já não existem no modelo.
