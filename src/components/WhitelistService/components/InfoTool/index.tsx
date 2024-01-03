import { Input } from 'antd';
import { StrategyType } from '../../types/contract';
import { forwardRef, ReactNode, useCallback, useImperativeHandle, useState } from 'react';
import { useDebounce, useSetState, useUpdateEffect } from 'react-use';
import TagSelect from '../TagSelect';

const { Search } = Input;

export type FilterTool = {
  tag?: string;
  search?: string;
};

const InfoTool = forwardRef(
  (
    {
      initState,
      onReset,
      getStateInfo,
      strategyType,
      expandAction,
    }: {
      initState?: any;
      strategyType?: StrategyType;
      onReset?: () => void;
      getStateInfo?: (v: any) => void;
      expandAction?: ReactNode;
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
    useUpdateEffect(() => {
      getStateInfo?.(state);
    }, [getStateInfo, state]);

    const [search, setSearch] = useState<string>();

    useDebounce(() => {
      setState({ search });
    }, 300);

    return (
      <div className="filter-action-wrapper">
        {strategyType === StrategyType.Price && (
          <div className="filter-select">
            <TagSelect
              value={state?.tag}
              showAll
              style={{ width: 200 }}
              getPopupContainer={(props) => props?.parentNode ?? document.body}
              className="tool-whitelist-tag"
              onChange={tagSelectChange}
            />
          </div>
        )}
        <Search
          className="search-wrapper"
          placeholder="Address"
          enterButton="Search"
          value={search ?? state?.search}
          onChange={(v) => {
            setSearch(v.target.value);
          }}
          onSearch={(v) => {
            setState({ search: v });
            onReset?.();
          }}
        />
        {expandAction}
      </div>
    );
  },
);

export default InfoTool;
