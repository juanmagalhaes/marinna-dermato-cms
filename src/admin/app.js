import ptBR from './extensions/translations/pt-BR.json';
import { TinyMceInput } from './components/TinyMceInput';

export default {
  config: {
    locales: ['pt-BR'],
    translations: { 'pt-BR': ptBR },
  },
  register(app) {
    app.customFields.register({
      name: 'tinymce-html',
      type: 'text',
      intlLabel: {
        id: 'marinna.tinymce-html.label',
        defaultMessage: 'Texto rico (HTML)',
      },
      intlDescription: {
        id: 'marinna.tinymce-html.description',
        defaultMessage: 'Editor TinyMCE (modo GPL). Saída em HTML.',
      },
      components: {
        Input: async () => ({
          default: TinyMceInput,
        }),
      },
    });
  },
  bootstrap() {},
};
