import { useCallback, useMemo, useState } from 'react';
import Editor from '@/components/Form/Editor';
import Condition from '@/components/Form/Condition';
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
  const [isEdit, setIsEdit] = useState<boolean>(true);

  const setTodayLearningHandler = useCallback((value: string) => {
    setEditorValue((prev) => ({ ...prev, todayLearning: value }));
  }, []);

  const setReflectionHandler = useCallback((value: string) => {
    setEditorValue((prev) => ({ ...prev, reflection: value }));
  }, []);

  const onClickPreviewButtonHandler = useCallback(() => { setIsEdit((prev) => !prev); }, []);

  const previewButtonName = useMemo(() => (isEdit ? 'プレビュー' : '編集'), [isEdit]);

  return (
    <div className={style.main}>
      <header>
        <div className={style.headerContents}>
          <button
            type="button"
            onClick={onClickPreviewButtonHandler}
          >
            {previewButtonName}
          </button>
          <button type="button">公開</button>
        </div>
      </header>
      <div>
        <h3>〜調子〜</h3>
        <Condition />
      </div>
      <div>
        <h3>〜今日の学び〜</h3>
        <Editor
          editorValue={editorValue.todayLearning}
          setEditorValue={setTodayLearningHandler}
          isEdit={isEdit}
        />
      </div>
      <div>
        <h3>〜1日を振り返って〜</h3>
        <Editor
          editorValue={editorValue.reflection}
          setEditorValue={setReflectionHandler}
          isEdit={isEdit}
        />
      </div>
    </div>
  );
};

export default Home;
