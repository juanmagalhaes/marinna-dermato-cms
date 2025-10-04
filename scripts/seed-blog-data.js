#!/usr/bin/env node

/**
 * Script to seed initial blog data
 * Run with: node scripts/seed-blog-data.js
 */

const { Strapi } = require('@strapi/strapi');

async function seedBlogData() {
  const strapi = new Strapi({
    appDir: process.cwd(),
    distDir: './dist',
  });

  try {
    await strapi.load();

    console.log('🌱 Seeding blog data...');

    // Create categories
    const categories = [
      {
        name: 'Dermatologia Clínica',
        slug: 'dermatologia-clinica',
        description: 'Artigos sobre dermatologia clínica e diagnósticos',
        color: '#3B82F6',
      },
      {
        name: 'Cuidados com a Pele',
        slug: 'cuidados-com-a-pele',
        description: 'Dicas e cuidados para manter a pele saudável',
        color: '#10B981',
      },
      {
        name: 'Tratamentos',
        slug: 'tratamentos',
        description: 'Informações sobre tratamentos dermatológicos',
        color: '#F59E0B',
      },
      {
        name: 'Tratamento Capilar',
        slug: 'tratamento-capilar',
        description: 'Tratamentos para cabelo e couro cabeludo',
        color: '#8B5CF6',
      },
      {
        name: 'Prevenção',
        slug: 'prevencao',
        description: 'Dicas de prevenção e proteção da pele',
        color: '#EF4444',
      },
    ];

    console.log('📂 Creating categories...');
    for (const categoryData of categories) {
      const existing = await strapi.entityService.findMany('api::category.category', {
        filters: { slug: categoryData.slug },
      });

      if (existing.length === 0) {
        await strapi.entityService.create('api::category.category', {
          data: categoryData,
        });
        console.log(`✅ Created category: ${categoryData.name}`);
      } else {
        console.log(`⏭️  Category already exists: ${categoryData.name}`);
      }
    }

    // Create tags
    const tags = [
      {
        name: 'minoxidil',
        slug: 'minoxidil',
        description: 'Artigos sobre minoxidil e tratamento capilar',
        color: '#8B5CF6',
      },
      {
        name: 'queda de cabelo',
        slug: 'queda-de-cabelo',
        description: 'Informações sobre queda de cabelo e alopecia',
        color: '#F97316',
      },
      {
        name: 'tratamento capilar',
        slug: 'tratamento-capilar',
        description: 'Tratamentos para cabelo e couro cabeludo',
        color: '#EC4899',
      },
      {
        name: 'acne',
        slug: 'acne',
        description: 'Artigos relacionados a acne',
        color: '#06B6D4',
      },
      {
        name: 'protetor solar',
        slug: 'protetor-solar',
        description: 'Informações sobre proteção solar',
        color: '#84CC16',
      },
      {
        name: 'envelhecimento',
        slug: 'envelhecimento',
        description: 'Cuidados anti-idade',
        color: '#F59E0B',
      },
      {
        name: 'pele oleosa',
        slug: 'pele-oleosa',
        description: 'Cuidados para pele oleosa',
        color: '#10B981',
      },
      {
        name: 'pele seca',
        slug: 'pele-seca',
        description: 'Cuidados para pele seca',
        color: '#EF4444',
      },
    ];

    console.log('🏷️  Creating tags...');
    for (const tagData of tags) {
      const existing = await strapi.entityService.findMany('api::tag.tag', {
        filters: { slug: tagData.slug },
      });

      if (existing.length === 0) {
        await strapi.entityService.create('api::tag.tag', {
          data: tagData,
        });
        console.log(`✅ Created tag: ${tagData.name}`);
      } else {
        console.log(`⏭️  Tag already exists: ${tagData.name}`);
      }
    }

    // Create sample article
    console.log('📝 Creating sample article...');
    const existingArticle = await strapi.entityService.findMany('api::article.article', {
      filters: { slug: 'minoxidil-queda-cabelo-inicio' },
    });

    if (existingArticle.length === 0) {
      const articleData = {
        title: 'Não Tome Minoxidil Antes de Saber Disso: Entenda a Queda Inicial',
        slug: 'minoxidil-queda-cabelo-inicio',
        excerpt: 'Descubra por que o cabelo cai no início do uso do minoxidil e como lidar com essa fase natural do tratamento.',
        status: 'published',
        publishedAt: new Date().toISOString(),
        seo: {
          defaultTitle: 'Minoxidil: Queda de Cabelo no Início do Tratamento',
          titleTemplate: '%s | Dra. Marinna - Dermatologista',
          description: 'Entenda por que o cabelo cai no início do uso do minoxidil e como lidar com essa fase natural do tratamento capilar.',
          siteName: 'Dra. Marinna - Dermatologista',
          locale: 'pt_BR',
          keywords: 'minoxidil, queda cabelo, tratamento capilar, dermatologia, alopecia',
          ogTitle: 'Minoxidil: Queda de Cabelo no Início do Tratamento - Dra. Marinna',
          ogDescription: 'Entenda por que o cabelo cai no início do uso do minoxidil e como lidar com essa fase natural do tratamento capilar.',
          twitterCard: 'summary_large_image',
        },
        blocks: [
          {
            __component: 'article.text-block',
            content: '<h2>Por que o Cabelo Cai no Início do Minoxidil?</h2><p>Muitas pessoas ficam assustadas quando começam a usar minoxidil e notam uma queda acentuada de cabelo nas primeiras semanas. Mas calma! Isso é completamente normal e faz parte do processo de renovação capilar.</p><p>O minoxidil funciona estimulando o crescimento de novos fios, mas para isso acontecer, ele precisa "limpar" os fios antigos que já estavam em fase de queda. É como uma renovação completa do seu cabelo.</p>',
            alignment: 'left',
            padding: 'medium',
          },
          {
            __component: 'article.video-block',
            videoType: 'instagram',
            videoUrl: 'https://www.instagram.com/share/BB1HafqNQr',
            caption: 'Assista ao vídeo completo sobre minoxidil e queda de cabelo no Instagram da Dra. Marinna',
            alignment: 'center',
            size: 'large',
          },
          {
            __component: 'article.text-block',
            content: '<h3>O que Acontece Durante a Fase de Queda?</h3><p>Durante as primeiras 2-8 semanas de uso do minoxidil, você pode notar:</p><ul><li><strong>Queda temporária aumentada:</strong> Os fios antigos caem mais rapidamente</li><li><strong>Fios mais finos:</strong> Alguns fios podem parecer mais fracos</li><li><strong>Irritação leve:</strong> Pequena coceira ou descamação no couro cabeludo</li><li><strong>Mudança na textura:</strong> O cabelo pode parecer diferente temporariamente</li></ul>',
            alignment: 'left',
            padding: 'medium',
          },
          {
            __component: 'article.text-block',
            content: '<h3>Por que Não Devemos Parar o Tratamento?</h3><p>É fundamental <strong>não interromper</strong> o uso do minoxidil durante essa fase. A queda inicial é um sinal de que o medicamento está funcionando! Se você parar agora, perderá todo o progresso e terá que recomeçar o processo.</p><p>Lembre-se: essa é uma fase temporária. Após 3-6 meses de uso consistente, você começará a ver os novos fios crescendo mais fortes e saudáveis.</p>',
            alignment: 'left',
            padding: 'medium',
          },
          {
            __component: 'article.quote-block',
            quote: 'A queda inicial do minoxidil é um sinal de que o tratamento está funcionando. É como renovar um jardim - às vezes precisamos remover as plantas antigas para que as novas cresçam mais bonitas.',
            author: 'Dra. Marinna Sampaio Campos',
            source: 'Dermatologista CRM 123456',
            style: 'highlighted',
            alignment: 'center',
          },
          {
            __component: 'article.text-block',
            content: '<h3>Dicas para Lidar com a Fase de Queda</h3><ol><li><strong>Seja paciente:</strong> Lembre-se que é temporário</li><li><strong>Use produtos suaves:</strong> Evite shampoos agressivos</li><li><strong>Mantenha a consistência:</strong> Use o minoxidil todos os dias</li><li><strong>Proteja do sol:</strong> Use chapéu ou protetor solar no couro cabeludo</li><li><strong>Consulte seu dermatologista:</strong> Em caso de dúvidas ou irritação excessiva</li></ol>',
            alignment: 'left',
            padding: 'medium',
          },
          {
            __component: 'article.text-block',
            content: '<h3>Quando Procurar um Dermatologista?</h3><p>Procure um dermatologista se você notar:</p><ul><li>Irritação severa ou alergia</li><li>Queda excessiva por mais de 3 meses</li><li>Nenhuma melhora após 6 meses de uso</li><li>Outros sintomas como coceira intensa ou feridas</li></ul><p>O acompanhamento médico é essencial para o sucesso do tratamento e para identificar possíveis efeitos colaterais.</p>',
            alignment: 'left',
            padding: 'medium',
          },
        ],
      };

      await strapi.entityService.create('api::article.article', {
        data: articleData,
      });
      console.log('✅ Created sample article: Não Tome Minoxidil Antes de Saber Disso');
    } else {
      console.log('⏭️  Sample article already exists');
    }

    console.log('🎉 Blog data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding blog data:', error);
    process.exit(1);
  } finally {
    await strapi.destroy();
  }
}

// Run the seeding function
seedBlogData();
