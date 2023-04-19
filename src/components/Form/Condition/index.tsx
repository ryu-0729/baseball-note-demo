import { FC } from 'react';

import ConditionButton, { ConditionType } from '@/components/utils/ConditionButton';
import style from './index.module.css';

type Props = {
  isEdit: boolean
  condition: ConditionType
  onClickConditionHandler: (selectCondition: ConditionType) => void
};

const Condition: FC<Props> = ({
  isEdit,
  condition,
  onClickConditionHandler,
}) => {
  if (!isEdit) {
    return (
      <div className={style.preview}>
        <ConditionButton
          iconType={condition}
          isActive={false}
          onClickConditionButtonHandler={onClickConditionHandler}
        />
      </div>
    );
  }

  return (
    <div className={style.root}>
      <ConditionButton
        iconType="veryGoodCondition"
        isActive={condition === 'veryGoodCondition'}
        onClickConditionButtonHandler={onClickConditionHandler}
      />
      <ConditionButton
        iconType="goodCondition"
        isActive={condition === 'goodCondition'}
        onClickConditionButtonHandler={onClickConditionHandler}
      />
      <ConditionButton
        iconType="normal"
        isActive={condition === 'normal'}
        onClickConditionButtonHandler={onClickConditionHandler}
      />
      <ConditionButton
        iconType="poor"
        isActive={condition === 'poor'}
        onClickConditionButtonHandler={onClickConditionHandler}
      />
      <ConditionButton
        iconType="veryPoor"
        isActive={condition === 'veryPoor'}
        onClickConditionButtonHandler={onClickConditionHandler}
      />
    </div>
  );
};

export default Condition;
