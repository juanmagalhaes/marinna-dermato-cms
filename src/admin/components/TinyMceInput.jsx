import * as React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Field, Flex } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

/**
 * Same-origin TinyMCE (GPL) from `public/tinymce` — copied by postinstall from
 * the `tinymce` npm package. Strapi CSP blocks external script URLs.
 */
const TINYMCE_SCRIPT_SRC = '/tinymce/tinymce.min.js';

/**
 * Mirrors `@strapi/admin` theme: `admin_app.theme.currentTheme` is
 * `'light' | 'dark' | 'system'`; `system` uses `prefers-color-scheme`.
 */
function useStrapiAdminDarkMode() {
  const currentTheme = useSelector(
    (state) => state?.admin_app?.theme?.currentTheme ?? 'system'
  );

  const [prefersDark, setPrefersDark] = React.useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setPrefersDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (currentTheme === 'dark') return true;
  if (currentTheme === 'light') return false;
  return prefersDark;
}

export const TinyMceInput = React.forwardRef((_props, _ref) => {
  const {
    name,
    value,
    onChange,
    intlLabel,
    disabled,
    attribute,
    error,
    required,
    hint,
  } = _props;

  const { formatMessage } = useIntl();
  const isDark = useStrapiAdminDarkMode();

  const labelText =
    intlLabel && typeof intlLabel === 'object' && intlLabel.id
      ? formatMessage(intlLabel)
      : intlLabel?.defaultMessage ?? name;

  const errorMessage =
    error && typeof error === 'object' && error.id
      ? formatMessage(error)
      : error;

  const handleEditorChange = (content) => {
    onChange({
      target: {
        name,
        type: attribute.type,
        value: content,
      },
    });
  };

  return (
    <Field.Root
      name={name}
      error={errorMessage}
      hint={hint}
      required={required}
    >
      <Flex direction="column" alignItems="stretch" gap={2}>
        <Field.Label>{labelText}</Field.Label>
        <Editor
          key={isDark ? 'tinymce-dark' : 'tinymce-light'}
          licenseKey="gpl"
          tinymceScriptSrc={TINYMCE_SCRIPT_SRC}
          value={value ?? ''}
          disabled={disabled}
          onEditorChange={handleEditorChange}
          init={{
            height: 440,
            menubar: 'edit insert view format table tools',
            plugins: 'lists link autolink code table help wordcount',
            toolbar:
              'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link table | code removeformat',
            skin: isDark ? 'oxide-dark' : 'oxide',
            content_css: isDark ? 'dark' : 'default',
            branding: false,
            promotion: false,
            relative_urls: false,
            convert_urls: false,
            entity_encoding: 'raw',
            readonly: disabled,
          }}
        />
        <Field.Hint />
        <Field.Error />
      </Flex>
    </Field.Root>
  );
});

TinyMceInput.displayName = 'TinyMceInput';
