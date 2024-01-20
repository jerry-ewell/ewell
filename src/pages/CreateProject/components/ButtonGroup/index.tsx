import React from 'react';
import { Button, IButtonProps } from 'aelf-design';
import { Flex } from 'antd';
import { whiteArrow, arrow, grayArrow } from 'assets/images/project';
import './index.less';
import clsx from 'clsx';

export interface IButtonGroup {
  disablePre?: boolean;
  disabledNext?: boolean;
  htmlType?: IButtonProps['htmlType'];
  nextText?: string;
  onPre?: () => void;
  onNext?: () => void;
}

const ButtonGroup: React.FC<IButtonGroup> = ({ onPre, onNext, disablePre, disabledNext, htmlType, nextText }) => {
  return (
    <Flex className="create-btn-group" justify="center">
      {onPre && (
        <Button className={clsx('group-btn pre-btn', { disabled: disablePre })} disabled={disablePre} onClick={onPre}>
          <img className="arrow-icon" src={arrow} alt="" />
          <span>Previous</span>
        </Button>
      )}
      {(onNext || htmlType) && (
        <Button
          className={clsx('group-btn', 'next-btn', { disabled: disabledNext })}
          disabled={disabledNext}
          htmlType="submit"
          onClick={onNext}>
          <span>{nextText || 'Next'}</span>
          <img className="arrow-icon" src={disabledNext ? grayArrow : whiteArrow} alt="" />
        </Button>
      )}
    </Flex>
  );
};
export default ButtonGroup;
