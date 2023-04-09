import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { EditorState } from 'prosemirror-state';
import Editor from '@/components/Form/Editor';
import style from '@/styles/Home.module.css';

const Home = () => {
  const [/* editorValue */, setEditorValue] = useState<EditorState>();

  return (
    <div className={style.main}>
      <header>
        <div className={style.headerContents}>
          <button type="button">下書き</button>
          <button type="button">公開</button>
        </div>
      </header>
      <div>
        <h3>〜調子〜</h3>
        <div>アイコン選択</div>
      </div>
      <div>
        <h3>〜今日の学び〜</h3>
        <Editor setEditorValue={setEditorValue} />
      </div>
      <div>
        <h3>〜1日を振り返って〜</h3>
        <Editor setEditorValue={setEditorValue} />
      </div>
    </div>
  );
};

export default Home;
