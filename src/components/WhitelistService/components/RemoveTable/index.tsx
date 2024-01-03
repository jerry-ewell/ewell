import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import CommonTable, { CommonTableInstance } from '../CommonTable';
import { useWhiteList } from '../../context/useWhiteList';
import { removeFromWhiteList } from '../../hooks/managersAction';
import { StrategyType } from '../../types/contract';
import { PaginationPage, ProjectWhiteListItem, ToolItemInstance } from '../../types';
import InfoTool from '../InfoTool';
import { Button, message } from 'antd';
import { getSkipCount } from '../../utils';
import { useMobile } from 'contexts/useStore/hooks';
import { useWhiteListInfoByContract } from 'components/WhitelistService/hooks/fetchWhiteListInfo';
import { basicWhiteListView } from 'components/WhitelistService/context/actions';
import { useRefreshState } from 'components/WhitelistService/context/hooks';
import { messageHTML } from 'utils/aelfUtils';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface RemoveTableProps {
  contract?: any;
  whitelistId?: string;
}

export default function RemoveTable({ contract, whitelistId }: RemoveTableProps) {
  const tableRef = useRef<CommonTableInstance>();
  const tool = useRef<ToolItemInstance>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const isMobile = useMobile();
  const [pageState, setPage] = useState<PaginationPage>({
    pageSize: 10,
    page: 1,
  });
  const [{ whitelistInfoList, whitelistInfo, initRemoveTool }, { dispatch }] = useWhiteList();

  useWhiteListInfoByContract();
  const updater = useRefreshState();

  // const getList = useCallback(
  //   (filterTool?: FilterTool, page?: number, pageSize?: number, isUpdater?: boolean) => {
  //     // fetchListFilter(
  //     //   'projectWhiteList',
  //     //   dispatch,
  //     //   formatObjEmpty({
  //     //     chainId,
  //     //     projectId: whitelistInfo?.projectId ?? '',
  //     //     whitelistHash: whitelistInfo?.whitelistHash,
  //     //     tagHash: filterTool?.tag === 'ALL' ? '' : filterTool?.tag,
  //     //     address: filterTool?.search,
  //     //   }),
  //     //   page,
  //     //   pageSize,
  //     //   isUpdater,
  //     // );
  //   },
  //   [chainId, dispatch, whitelistInfo],
  // );

  const removeHandler = useCallback(async () => {
    if (!whitelistId) return;
    setLoading(true);
    // const rmList: string[] = [];
    // selectedRowKeys?.forEach((item) => {
    //   if (!item) return;
    //   const [address] = (item as string)?.split('&');
    //   if (address) rmList.push(address);
    // });

    const res = await removeFromWhiteList(
      {
        whitelistId,
        addressList: {
          value: selectedRowKeys as string[],
        },
      },
      contract,
    );
    setLoading(false);
    console.log(res, 'removeFromWhiteList');

    if (res?.error) return message.error(res?.error?.message || 'error');
    res?.TransactionId && messageHTML(res?.TransactionId);
    setSelectedRowKeys([]);
    updater();
    // getList(initRemoveTool, 0, pageState?.pageSize, true);
  }, [contract, selectedRowKeys, updater, whitelistId]);
  const [loading, setLoading] = useState(false);

  const onSelectChange = useCallback((newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
    console.log('newSelectedRowKeys changed: ', newSelectedRowKeys, selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection: TableRowSelection<DataType> = useMemo(
    () => ({
      // columnTitle: (
      //   <>
      //     <Checkbox>Check all</Checkbox>
      //   </>
      // ),
      columnWidth: 80,
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
      type: 'checkbox',
      fixed: true,
      // selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
    }),
    [onSelectChange, selectedRowKeys],
  );
  const columns: ColumnsType<ProjectWhiteListItem> = useMemo(() => {
    const arr = [];
    if (whitelistInfo?.strategyType !== StrategyType.Basic) {
      arr.push({
        title: 'tagName',
        dataIndex: 'tagName',
      });
    }
    if (whitelistInfo?.strategyType === StrategyType.Price) {
      arr.push({
        title: 'Price',
        dataIndex: 'price',
        render: (_: any, record: ProjectWhiteListItem) =>
          `${record?.tagInfo?.priceTagInfo?.price ?? '--'} ${record?.tagInfo?.priceTagInfo?.symbol ?? '--'}`,
      });
    }
    return [
      ...arr,
      {
        title: 'Address',
        dataIndex: 'address',
      },
    ];
  }, [whitelistInfo?.strategyType]);

  // useEffectOnce(() => {
  //   getList();
  // });

  const getStateInfo = useCallback(
    (v: any) => {
      setPage((v) => ({ page: 0, pageSize: v.pageSize }));
      // getList(v, 0, pageState?.pageSize, true);
      dispatch(
        basicWhiteListView.updateState.actions({
          initRemoveTool: {
            search: v?.search,
          },
        }),
      );
    },
    [dispatch],
  );

  // const dataSource = useMemo(() => {
  //   if (!whitelistInfoList?.items) return [];
  //   const skipCount = getSkipCount(pageState?.pageSize, pageState?.page - 1);
  //   return whitelistInfoList?.items?.slice(skipCount, skipCount + pageState?.pageSize);
  // }, [pageState?.page, pageState?.pageSize, whitelistInfoList?.items]);

  const dataSource = useMemo(() => {
    if (!whitelistInfoList?.items) return [];
    const skipCount = getSkipCount(pageState?.pageSize, pageState?.page - 1);
    const list = whitelistInfoList?.items?.filter((user) => {
      if (initRemoveTool?.search) {
        return user?.address === initRemoveTool?.search;
      }
      return true;
    });
    return list?.slice(skipCount, skipCount + pageState?.pageSize);
  }, [pageState?.page, pageState?.pageSize, initRemoveTool?.search, whitelistInfoList?.items]);

  const removeBtn = useMemo(
    () => (
      <Button
        danger
        type="primary"
        disabled={!(selectedRowKeys.length > 0 && whitelistId && contract)}
        className="remove-action"
        loading={loading}
        onClick={removeHandler}>
        Remove
      </Button>
    ),
    [whitelistId, contract, loading, removeHandler, selectedRowKeys.length],
  );

  return (
    <div className="remove-whitelist-table-wrapper">
      {/* {whitelistInfo?.strategyType !== StrategyType.Basic && ( */}
      <InfoTool
        ref={tool}
        initState={initRemoveTool}
        strategyType={whitelistInfo?.strategyType ?? StrategyType.Basic}
        onReset={() => {
          setSelectedRowKeys([]);
          tableRef?.current?.onResetPage();
        }}
        getStateInfo={getStateInfo}
        expandAction={removeBtn}
      />
      {/* )} */}

      <CommonTable
        ref={tableRef}
        scroll={{ x: isMobile ? 500 : undefined, y: isMobile ? 240 : 550 }}
        pagination={{
          total: whitelistInfoList?.totalCount ?? 0,
          onChange: (page, pageSize) => {
            setPage({ page, pageSize });
            // getList(tool.current?.getState(), page - 1, pageSize);
          },
        }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        rowKey="address"
      />
    </div>
  );
}
