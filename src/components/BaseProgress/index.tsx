import { Progress, ProgressProps } from 'antd';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { ZERO } from 'constants/misc';
import './styled.less';

export const percentFormat = (v: any) => {
  const val = ZERO.plus(v);
  if (val.isNaN() || val.lte(0)) return 0;
  if (!val.isFinite() || val.gt(100)) return 100;
  return v;
};

export default function BaseProgress({ ...props }: ProgressProps) {
  return (
    <div className={clsx('base-progress-wrapper')}>
      <span
        className={clsx(
          'progress-dot-wrapper',
          (props?.percent ?? 0) >= 100 && 'base-progress-max',
          (props?.percent ?? 0) > 0 && (props?.percent ?? 0) < 100 && 'base-progress-active',
        )}
        style={{ left: `${percentFormat(props?.percent)}%` }}></span>
      <Progress {...props} className={clsx('base-progress', props?.className)} />
    </div>
  );
}
export function ProjectProgress({ percent }: { percent: BigNumber }) {
  return (
    <BaseProgress
      strokeColor={percent.gte(100) ? '#D27974' : '#72DB8F'}
      trailColor="#CCCCCC"
      showInfo={false}
      strokeWidth={6}
      percent={percent.toNumber()}
    />
  );
}
