# Scripts do Strapi CMS

Este diretório contém scripts úteis para gerenciar o Strapi CMS local.

## 📋 Scripts Disponíveis

### **Configuração e Permissões**
- `setup-api-permissions.js` - Configura permissões da API para todos os content types
- `fix-permissions.js` - Corrige permissões quando necessário
- `add-seo-permissions.js` - Adiciona permissões específicas para SEO

### **Importação de Dados**
- `import-from-cloud.js` - Importa todos os dados do Strapi Cloud para o local
- `import-home-page.js` - Importa página inicial específica do Cloud
- `import-seo-data.js` - Importa dados de SEO do Cloud
- `create-file-records.js` - Cria registros de imagens no banco local

### **Publicação de Conteúdo**
- `publish-content.js` - Publica todos os content types no banco local
- `publish-publications.js` - Publica publicações específicas

### **Verificação e Debug**
- `check-imported-data.js` - Verifica se os dados foram importados corretamente
- `check-images.js` - Lista e verifica imagens no banco
- `list-images.js` - Lista todas as imagens com detalhes
- `verify-permissions.js` - Verifica permissões da API

### **Seed Data**
- `seed.js` - Script original de seed data

## 🚀 Como Usar

### **Setup Inicial (primeira vez)**
```bash
# 1. Configurar permissões
node scripts/setup-api-permissions.js

# 2. Importar dados do Cloud
node scripts/import-from-cloud.js

# 3. Publicar conteúdo
node scripts/publish-content.js

# 4. Criar registros de imagens
node scripts/create-file-records.js
```

### **Sincronização com Cloud**
```bash
# Importar dados atualizados
node scripts/import-from-cloud.js

# Publicar novo conteúdo
node scripts/publish-content.js
```

### **Verificação**
```bash
# Verificar dados importados
node scripts/check-imported-data.js

# Listar imagens
node scripts/list-images.js

# Verificar permissões
node scripts/verify-permissions.js
```

## 📝 Notas

- Todos os scripts devem ser executados com o Strapi **parado**
- Os scripts usam a API interna do Strapi para acessar o banco de dados
- As imagens são referenciadas do Strapi Cloud (não são baixadas localmente)
- Sempre verifique os logs para confirmar que as operações foram bem-sucedidas

## 🔧 Troubleshooting

Se encontrar problemas:

1. **Verifique se o Strapi está parado** antes de executar os scripts
2. **Execute os scripts na ordem correta** (setup → import → publish)
3. **Verifique os logs** para identificar erros específicos
4. **Use os scripts de verificação** para diagnosticar problemas
