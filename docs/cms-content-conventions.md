# Convenções de modelagem no Strapi (CMS)

Objetivo: o **Admin** mostrar nomes **legíveis em português** (em vez de chaves técnicas como `featuredImage` ou `sortOrder`) e alinhar com o que editores esperam ver.

## Collection types e single types

Em cada `schema.json` do content-type:

1. **`info.displayName`** — nome do tipo no menu (ex.: `Página inicial`, `Tratamento`).
2. **`info.description`** — uma frase curta sobre o que esse tipo representa (opcional mas recomendado).

## Campos (`attributes`)

No **mesmo** `schema.json`, use o bloco opcional **`config.metadatas`** com uma entrada por **nome do atributo** (a chave JSON do campo):

```json
"config": {
  "metadatas": {
    "slug": {
      "edit": {
        "label": "Slug (URL)",
        "description": "Explicação do que o campo altera no site, se útil."
      },
      "list": { "label": "Slug" }
    }
  }
}
```

- **`edit.label`** — rótulo no formulário de edição.
- **`edit.description`** — texto de ajuda abaixo do rótulo (recomendado para campos que impactam URL, SEO ou layout).
- **`list.label`** — cabeçalho na vista em lista do Content Manager.

Chaves suportadas em `edit` alinhadas ao Strapi: `label`, `description`, `placeholder`, `visible`, `editable`, `mainField` (relações). Em `list`: `label`, `searchable`, `sortable`.

## Componentes (`src/components/**/*.json`)

Aplicar o mesmo padrão:

- **`info.displayName`** e **`info.description`** no componente.
- **`config.metadatas`** por atributo, com `edit` / `list` como acima.

Exemplo: `shared.section-heading`, `shared.about-preview`.

## Novos tipos ou campos

Ao adicionar um **novo** content-type, componente ou campo:

1. Definir `info.displayName` (e `description` no tipo).
2. Acrescentar **desde o início** as entradas em `config.metadatas` para todos os atributos visíveis no Admin.
3. Preferir labels em **pt-BR** e consistentes com o site (título, resumo, imagem de capa, etc.).

## Configuração já guardada na base de dados

O Strapi guarda metadados do Content Manager na tabela de store. Se labels antigos continuarem a aparecer após alterar só o `schema.json`, o projeto pode incluir um **bootstrap** que reaplica `config.metadatas` do ficheiro (ver `src/index.js` no CMS). Reiniciar o servidor aplica a sincronização.

## Frontend (Next.js)

Textos com fallback vivem em `MarinnaDermato/src/data/fallbacks.ts` e são mesclados com a resposta GraphQL; campos novos na home devem ter default explícito lá e resolução em `getHomePage` / `getHomePageData` quando fizer sentido (strings vazias → fallback).
