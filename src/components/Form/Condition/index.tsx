import { FC } from 'react';

import ConditionButton from '@/components/utils/ConditionButton';
import style from './index.module.css';

const Condition: FC = () => (
  <div className={style.root}>
    <ConditionButton iconType="veryGoodCondition" />
    <ConditionButton iconType="goodCondition" />
    <ConditionButton iconType="normal" />
    <ConditionButton iconType="poor" />
    <ConditionButton iconType="veryPoor" />
  </div>
);

export default Condition;
