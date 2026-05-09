import type { Schema, Struct } from '@strapi/strapi';

export interface ArticleImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_article_image_blocks';
  info: {
    description: 'Imagem com legenda, alinhamento, tamanho e link opcional';
    displayName: 'Bloco de imagem';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'full-width']
    > &
      Schema.Attribute.DefaultTo<'center'>;
    alt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    caption: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    customMaxWidth: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 64;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.String;
    size: Schema.Attribute.Enumeration<['small', 'medium', 'large', 'full']> &
      Schema.Attribute.DefaultTo<'medium'>;
  };
}

export interface ArticleQuoteBlock extends Struct.ComponentSchema {
  collectionName: 'components_article_quote_blocks';
  info: {
    description: 'Cita\u00E7\u00E3o com autor, fonte, estilo e alinhamento';
    displayName: 'Bloco de cita\u00E7\u00E3o';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'center'>;
    author: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    quote: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    source: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    style: Schema.Attribute.Enumeration<['default', 'highlighted', 'minimal']> &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface ArticleTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_article_text_blocks';
  info: {
    description: 'Texto rico (TinyMCE), mesmo editor usado nos tratamentos';
    displayName: 'Bloco de texto';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    backgroundColor: Schema.Attribute.String;
    content: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<'global::tinymce-html'>;
    padding: Schema.Attribute.Enumeration<
      ['none', 'small', 'medium', 'large']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
  };
}

export interface ArticleVideoBlock extends Struct.ComponentSchema {
  collectionName: 'components_article_video_blocks';
  info: {
    description: 'V\u00EDdeo incorporado (Instagram, YouTube, Vimeo ou URL de arquivo)';
    displayName: 'Bloco de v\u00EDdeo';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'full-width']
    > &
      Schema.Attribute.DefaultTo<'center'>;
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    caption: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    muted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    size: Schema.Attribute.Enumeration<['small', 'medium', 'large', 'full']> &
      Schema.Attribute.DefaultTo<'medium'>;
    thumbnail: Schema.Attribute.Media<'images'>;
    videoType: Schema.Attribute.Enumeration<
      ['instagram', 'youtube', 'vimeo', 'upload']
    > &
      Schema.Attribute.Required;
    videoUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedAboutPreview extends Struct.ComponentSchema {
  collectionName: 'components_shared_about_previews';
  info: {
    description: 'T\u00EDtulo, texto e imagem da se\u00E7\u00E3o Sobre na p\u00E1gina inicial';
    displayName: 'Pr\u00E9via \u2014 Sobre';
    icon: 'user';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedAddress extends Struct.ComponentSchema {
  collectionName: 'components_shared_addresses';
  info: {
    description: 'Logradouro, n\u00FAmero, bairro, cidade, estado, CEP e coordenadas';
    displayName: 'Endere\u00E7o';
    icon: 'location-arrow';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
    neighborhood: Schema.Attribute.String & Schema.Attribute.Required;
    number: Schema.Attribute.String & Schema.Attribute.Required;
    state: Schema.Attribute.String & Schema.Attribute.Required;
    street: Schema.Attribute.String & Schema.Attribute.Required;
    zip: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heroes';
  info: {
    description: 'Destaque principal: t\u00EDtulo, subt\u00EDtulo, bot\u00F5es e imagem de fundo';
    displayName: 'Hero (destaque)';
    icon: 'picture';
  };
  attributes: {
    ctaLabel: Schema.Attribute.String & Schema.Attribute.Required;
    ctaTarget: Schema.Attribute.String & Schema.Attribute.Required;
    heroImage: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHighlight extends Struct.ComponentSchema {
  collectionName: 'components_shared_highlights';
  info: {
    description: 'Card com t\u00EDtulo, descri\u00E7\u00E3o e \u00EDcone (lista na home)';
    displayName: 'Card de destaque';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLocationBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_location_blocks';
  info: {
    description: 'URL ou c\u00F3digo para incorporar o mapa (Google Maps, etc.)';
    displayName: 'Bloco de localiza\u00E7\u00E3o';
    icon: 'location-arrow';
  };
  attributes: {
    mapEmbedUrl: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    description: 'Imagem, v\u00EDdeo ou documento \u00FAnico';
    displayName: 'Arquivo de m\u00EDdia';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedPhone extends Struct.ComponentSchema {
  collectionName: 'components_shared_phones';
  info: {
    description: 'N\u00FAmero e r\u00F3tulo (ex.: Consult\u00F3rio, WhatsApp)';
    displayName: 'Telefone';
    icon: 'phone';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    number: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    description: 'T\u00EDtulo e corpo de texto em destaque';
    displayName: 'Cita\u00E7\u00E3o';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: 'Conte\u00FAdo em editor rich text do Strapi';
    displayName: 'Texto formatado';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Metadados para Google e redes (t\u00EDtulo, descri\u00E7\u00E3o, imagens Open Graph)';
    displayName: 'SEO';
  };
  attributes: {
    defaultTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    keywords: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    ogDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    openGraphImage: Schema.Attribute.Media<'images'>;
    siteName: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    twitterCard: Schema.Attribute.Enumeration<
      ['summary', 'summary_large_image']
    > &
      Schema.Attribute.DefaultTo<'summary_large_image'>;
    twitterImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: 'V\u00E1rias imagens em sequ\u00EAncia (slider)';
    displayName: 'Carrossel de imagens';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_socials';
  info: {
    description: 'Links para Instagram, Facebook, LinkedIn e site';
    displayName: 'Redes sociais';
    icon: 'link';
  };
  attributes: {
    doctoralia: Schema.Attribute.String;
    googleBusiness: Schema.Attribute.String;
    instagram: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'article.image-block': ArticleImageBlock;
      'article.quote-block': ArticleQuoteBlock;
      'article.text-block': ArticleTextBlock;
      'article.video-block': ArticleVideoBlock;
      'shared.about-preview': SharedAboutPreview;
      'shared.address': SharedAddress;
      'shared.hero': SharedHero;
      'shared.highlight': SharedHighlight;
      'shared.location-block': SharedLocationBlock;
      'shared.media': SharedMedia;
      'shared.phone': SharedPhone;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.social': SharedSocial;
    }
  }
}
