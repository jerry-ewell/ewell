import { Button, Form, Input, Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { useSetState } from 'react-use';

const { Search } = Input;

export type ToolItemInstance = {
  getState: () => any;
  onSetState: (v: any) => void;
};

const RMFilterTool = forwardRef(
  (
    {
      initState,
      selectOption,
      rmDisabled,
      rmLoading,
      actionHandle,
      onReset,
      getStateInfo,
    }: {
      initState?: any;
      selectOption?: DefaultOptionType[];
      rmDisabled?: boolean;
      rmLoading?: boolean;
      actionHandle: () => void;
      onReset?: () => void;
      getStateInfo?: (v: any) => void;
    },
    ref,
  ) => {
    const [state, setState] = useSetState<any>(initState);

    const tagSelectChange = useCallback(
      (v) => {
        setState({ tag: v });
        onReset?.();
      },
      [onReset, setState],
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

    // TODO can format use useImperativeHandle
    useEffect(() => {
      getStateInfo?.(state);
    }, [getStateInfo, state]);

    return (
      <div
        className="filter-action-wrapper"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <div className="filter-select">
          <Form.Item label="标签" style={{ marginBottom: 0 }}>
            <Select
              value={state?.tag}
              style={{ width: 200 }}
              getPopupContainer={(props) => props?.parentNode ?? document.body}
              className="remove-whitelist-tag"
              options={selectOption}
              onChange={tagSelectChange}
            />
          </Form.Item>
        </div>
        <Search
          style={{ width: 200 }}
          className="search-wrapper"
          placeholder="请输入用户地址关键字"
          enterButton="Search"
          onSearch={(v) => {
            setState({ search: v });
            onReset?.();
          }}
        />
        <Button
          danger
          type="primary"
          disabled={rmDisabled}
          className="remove-action"
          loading={rmLoading}
          onClick={actionHandle}>
          移除
        </Button>
      </div>
    );
  },
);

export default RMFilterTool;
