/* eslint-disable import/no-extraneous-dependencies */
import { FC, useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { menuBar } from 'prosemirror-menu';
import { history } from 'prosemirror-history';
import { defaultMarkdownSerializer } from 'prosemirror-markdown';
import 'prosemirror-menu/style/menu.css';
import 'prosemirror-view/style/prosemirror.css';
// eslint-disable-next-line import/no-named-as-default
import schema from '@/const/Editor/schema';
import { buildInputRules } from '@/const/Editor/inputrules';
import { buildMenuItems } from '@/const/Editor/menu';
import { buildKeymap } from '@/const/Editor/keymap';
import { parser } from '@/const/Editor/parser';
import style from './index.module.css';

type Props = {
  editorValue: string
  setEditorValue: (value: string) => void
  isEdit: boolean
};

const Editor: FC<Props> = ({
  editorValue,
  setEditorValue,
  isEdit,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editorState = EditorState.create({
      doc: parser.parse(editorValue) ?? undefined,
      plugins: isEdit
        ? [
          keymap(buildKeymap(schema)),
          keymap(baseKeymap),
          buildInputRules(schema),
          menuBar({
            content: buildMenuItems(schema).fullMenu,
            floating: true,
          }),
          history(),
        ] : undefined,
    });
    const view = new EditorView(contentRef.current, {
      state: editorState,
      dispatchTransaction(tr) {
        const newState = view.state.apply(tr);
        view.updateState(newState);
        setEditorValue(defaultMarkdownSerializer.serialize(newState.doc));
      },
      editable: () => isEdit,
    });

    view.focus();
    return () => { view.destroy(); };
    // NOTE: 第2引数を指定した場合にstylesheet関連でエラーが出るためeditorValueは含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  return (
    <div ref={contentRef} className={style.editor} />
  );
};

export default Editor;
