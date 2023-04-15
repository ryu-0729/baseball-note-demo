import { useState } from 'react';
import Editor from '@/components/Form/Editor';
import style from '@/styles/Home.module.css';

const Home = () => {
  const [editorValue, setEditorValue] = useState<string>('');

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
        <Editor editorValue={editorValue} setEditorValue={setEditorValue} />
      </div>
      <div>
        <h3>〜1日を振り返って〜</h3>
        <Editor editorValue={editorValue} setEditorValue={setEditorValue} />
      </div>
    </div>
  );
};

export default Home;
