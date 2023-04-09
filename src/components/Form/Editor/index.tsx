/* eslint-disable import/no-extraneous-dependencies */
import {
  Dispatch, FC, SetStateAction, useEffect, useRef,
} from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
// eslint-disable-next-line import/no-named-as-default
import schema from '@/const/Editor/schema';
import style from './index.module.css';

type Props = {
  setEditorValue: Dispatch<SetStateAction<EditorState | undefined>>
};

const Editor: FC<Props> = ({ setEditorValue }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editorState = EditorState.create({ schema });
    const view = new EditorView(contentRef.current, {
      state: editorState,
      dispatchTransaction(tr) {
        const newState = view.state.apply(tr);
        view.updateState(newState);
        setEditorValue(newState);
      },
    });

    return () => { view.destroy(); };
  }, [setEditorValue]);

  return (
    <div ref={contentRef} className={style.editor} />
  );
};

export default Editor;
