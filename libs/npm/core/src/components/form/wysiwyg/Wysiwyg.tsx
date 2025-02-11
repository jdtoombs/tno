import 'react-quill/dist/quill.snow.css';

import { html_beautify } from 'js-beautify';
import { Sources } from 'quill';
import React from 'react';
import ReactQuill from 'react-quill';

import { CustomToolbar } from './CustomToolbar';
import * as styled from './styled';

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
];

export interface IWysiwygProps {
  /** Input id attribute. */
  id?: string;
  /** the field name that is being used within the WYSIWYG */
  name?: string;
  /** optional label to appear above the WYSIWYG */
  label?: string;
  /** whether or not it is a required field */
  required?: boolean;
  /** The value */
  value?: string;
  /** Whether to enable raw view */
  viewRaw?: boolean;
  /** Default height of component. */
  height?: string;
  /** className */
  className?: string;
  expandModal?: (show: boolean) => void;
  onChange?: (text: string) => void;
  onBlur?: (
    previousSelection: ReactQuill.Range,
    source: Sources,
    editor: ReactQuill.UnprivilegedEditor,
  ) => void;
}
/**
 * A WYSIWYG component.
 * @param props Component props.
 * @returns A component.
 */
export const Wysiwyg: React.FC<IWysiwygProps> = ({
  id,
  name,
  label,
  value,
  required,
  className,
  expandModal,
  onChange,
  onBlur,
}) => {
  const [toolBarNode, setToolBarNode] = React.useState();

  const [state, setState] = React.useState({
    html: '',
    text: value ?? '',
  });
  const [showRaw, setShowRaw] = React.useState(false);

  React.useEffect(() => {
    setState({
      ...state,
      html: value?.replace(/\n+/g, '<br>') ?? '',
    });
    // Only update when the value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // carry over editor value to raw html or v.v when toggling
  const syncViews = (htmlFromRaw: boolean) => {
    if (htmlFromRaw) setState({ ...state, html: state.text });
    else setState({ ...state, text: state.html });
  };

  // toggle raw html view
  const onClickRaw = () => {
    const fromRawHtml = showRaw;
    setShowRaw(!showRaw);
    syncViews(fromRawHtml);
  };

  const stripHtml = React.useCallback(() => {
    // strip html from string
    const doc = new DOMParser().parseFromString(
      state.text
        .replace(/<p\s*[^>]*>/g, '[p]')
        .replaceAll('</p>', '[/p]')
        .replace(/<br\s*\/?>/g, '[br]'),
      'text/html',
    );
    doc.body.textContent =
      doc.body.textContent
        ?.replaceAll('[p]', '<p>')
        .replaceAll('[/p]', '</p>')
        .replaceAll('[br]', '<br>') || '';
    setState({ ...state, html: doc.body.textContent });
    onChange?.(doc.body.textContent);
  }, [onChange, state]);

  const onClickFormatRaw = () => {
    const text = html_beautify(state.text);
    setState({ ...state, text });
    onChange?.(text);
  };

  const handleChange = (html: string) => {
    setState({ ...state, html: html });
    if (html === '<p><br></p>') {
      onChange?.('');
    } else {
      onChange?.(html);
    }
  };

  const modules = React.useMemo(() => {
    const config = {
      toolbar: {
        container: toolBarNode,
      },
    };

    return config;
  }, [toolBarNode]);

  return (
    <styled.Wysiwyg viewRaw={showRaw} className={className}>
      {label && <label className={required ? 'required' : ''}>{label}</label>}
      <CustomToolbar
        onClickRaw={onClickRaw}
        onClickRemoveFormat={stripHtml}
        onClickFormatRaw={onClickFormatRaw}
        onClickClear={() => setState({ ...state, html: '', text: '' })}
        onClickExpand={() => {
          if (expandModal) expandModal(true);
        }}
        innerRef={setToolBarNode}
      />
      {!!toolBarNode && (
        <>
          <ReactQuill
            className="editor"
            value={state.html}
            onChange={handleChange}
            theme="snow"
            modules={modules}
            formats={formats}
            onBlur={onBlur}
          />
          <textarea
            id={id}
            name={name}
            className="raw-editor"
            onChange={(e) => setState({ ...state, text: e.target.value })}
            value={state.text}
          />
        </>
      )}
    </styled.Wysiwyg>
  );
};
