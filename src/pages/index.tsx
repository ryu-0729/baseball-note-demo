import { useCallback, useMemo, useState } from 'react';
import Editor from '@/components/Form/Editor';
import Condition from '@/components/Form/Condition';
import { ConditionType } from '@/components/utils/ConditionButton';
import style from '@/styles/Home.module.css';

const templateTitles = [
  'チームの良かった所',
  'チームの課題',
  '自分の良かった所',
  '自分の課題',
];

type InitTemplateType = {
  [key: number]: string
};
const initTemplate: InitTemplateType = {};
templateTitles.forEach((_, index) => {
  initTemplate[index] = '';
});

const Home = () => {
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [condition, setCondition] = useState<ConditionType>('normal');
  const [templateValue, setTemplateValue] = useState<InitTemplateType>(initTemplate);

  const setTemplateValueHandler = useCallback((value: string, index: number) => {
    setTemplateValue((prev) => ({ ...prev, [index]: value }));
  }, []);

  const templateEditor = useMemo(() => (
    templateTitles.map((title, index) => {
      const customTitle = `〜${title}〜`;
      return (
        <div key={title}>
          <h3>{customTitle}</h3>
          <Editor
            editorValue={templateValue[index]}
            setEditorValue={setTemplateValueHandler}
            isEdit={isEdit}
            index={index}
          />
        </div>
      );
    })
  ), [templateValue, isEdit, setTemplateValueHandler]);

  const onClickPreviewButtonHandler = useCallback(() => { setIsEdit((prev) => !prev); }, []);

  const previewButtonName = useMemo(() => (isEdit ? 'プレビュー' : '編集'), [isEdit]);

  const onClickConditionButtonHandler = useCallback((selectCondition: ConditionType) => {
    setCondition(() => selectCondition);
  }, []);

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
      <div className={style.condition}>
        <h3>〜調子〜</h3>
        <Condition
          isEdit={isEdit}
          condition={condition}
          onClickConditionHandler={onClickConditionButtonHandler}
        />
      </div>
      {templateEditor}
    </div>
  );
};

export default Home;
