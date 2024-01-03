import { Input } from 'antd';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { useSetState } from 'react-use';
import { isValidNumber } from 'utils/reg';

export type RangInputState = {
  min?: string;
  max?: string;
};

export interface RangeInputProps {
  initState?: any;
  // onValueChange?: (min?: number | string, max?: number | string) => void;
}

const RangeInput = forwardRef(({ initState }: RangeInputProps, ref) => {
  const [state, setState] = useSetState<RangInputState>(initState);

  const minHandler = useCallback(
    (e) => {
      if (e.target.value && !isValidNumber(e.target.value)) return;
      setState({ min: e.target.value });
    },
    [setState],
  );

  const maxHandler = useCallback(
    (e) => {
      if (e.target.value && !isValidNumber(e.target.value)) return;
      setState({ max: e.target.value });
    },
    [setState],
  );

  const onSetState = useCallback(
    (v: any) => {
      setState(v);
    },
    [setState],
  );
  const getState = useCallback(() => state, [state]);
  useImperativeHandle(ref, () => ({
    getState,
    onSetState,
  }));
  return (
    <div className="flex-between-center range-wrapper">
      <Input placeholder="Min" value={state?.min} onChange={minHandler} />
      <span className="text">-</span>
      <Input placeholder="Max" value={state?.max} onChange={maxHandler} />
    </div>
  );
});

export default RangeInput;
