import { useCallback, useState } from 'react';
import Editor from '@/components/Form/Editor';
import style from '@/styles/Home.module.css';

type EditorValueType = {
  todayLearning: string
  reflection: string
};

const initEditorValue: EditorValueType = {
  todayLearning: '',
  reflection: '',
};

const Home = () => {
  const [editorValue, setEditorValue] = useState<EditorValueType>(initEditorValue);

  const setTodayLearningHandler = useCallback((value: string) => {
    setEditorValue((prev) => ({ ...prev, todayLearning: value }));
  }, []);

  const setReflectionHandler = useCallback((value: string) => {
    setEditorValue((prev) => ({ ...prev, reflection: value }));
  }, []);

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
        <Editor
          editorValue={editorValue.todayLearning}
          setEditorValue={setTodayLearningHandler}
        />
      </div>
      <div>
        <h3>〜1日を振り返って〜</h3>
        <Editor
          editorValue={editorValue.reflection}
          setEditorValue={setReflectionHandler}
        />
      </div>
    </div>
  );
};

export default Home;
