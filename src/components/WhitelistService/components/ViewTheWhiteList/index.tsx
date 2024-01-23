import { Button, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useWhiteList } from '../../context/useWhiteList';
import { removeFromWhiteList, updateWhitelistUserInfo } from '../../hooks/managersAction';
import { useManagerList } from '../../hooks/useManagerList';
import {
  MODAL_ACTION_TYPE,
  PaginationPage,
  ProjectWhiteListItem,
  ToolItemInstance,
  ViewTheWhiteListProps,
} from '../../types';
import { StrategyType } from '../../types/contract';
import { useCallback, useMemo, useRef, useState } from 'react';
import { getSkipCount } from '../../utils';
import CommonModal from '../CommonModal';
import CommonTable, { CommonTableInstance } from '../CommonTable';
import EditUserInfo from '../EditUserInfo';
import InfoTool from '../InfoTool';
import { useMobile } from 'contexts/useStore/hooks';
import { useWhiteListInfoByContract } from '../../hooks/fetchWhiteListInfo';
import { basicWhiteListView } from '../../context/actions';
import { useRefreshState } from 'components/WhitelistService/context/hooks';
import { messageHTML } from 'utils/aelfUtils';

export default function ViewTheWhiteList({ whiteListModal }: ViewTheWhiteListProps) {
  const [
    { chainId, whitelistInfo, whitelistInfoList, contract, initViewTool, account },
    { handleModalAction, dispatch },
  ] = useWhiteList();
  const [loading, setLoading] = useState<string | undefined>();
  const [editLoading, setEditLoading] = useState<boolean>();
  const [userModal, setUserModal] = useState<any | null>();
  const tool = useRef<ToolItemInstance>();
  const tableRef = useRef<CommonTableInstance>();
  const [pageState, setPage] = useState<PaginationPage>({
    pageSize: 10,
    page: 1,
  });
  const isMobile = useMobile();
  useWhiteListInfoByContract();
  const updater = useRefreshState();

  // const getList = useCallback(
  // (filterTool?: FilterTool, page?: number, pageSize?: number, isUpdater?: boolean) => {
  // if (whitelistInfo?.strategyType === StrategyType.Basic) {
  // fetchListFilterByContract();
  // }
  // fetchListFilter(
  //   'whitelistInfoList',
  //   dispatch,
  //   {
  //     chainId,
  //     projectId: whitelistInfo?.projectId ?? '',
  //     whitelistHash: whitelistInfo?.whitelistHash,
  //     tagHash: filterTool?.tag === 'ALL' ? '' : filterTool?.tag,
  //     address: filterTool?.search,
  //   },
  //   page,
  //   pageSize,
  //   isUpdater,
  // );
  // },
  //   [],
  // );
  const managerList = useManagerList(chainId, whitelistInfo?.whitelistHash ?? '', whitelistInfo?.projectId ?? '');

  const isManager = useMemo(() => managerList?.some((item) => item?.manager === account), [account, managerList]);
  const removeHandler = useCallback(
    async (record: any) => {
      if (!whitelistInfo?.whitelistHash) return message.error('Did not get to a valid whitelist id');
      if (!contract) return message.error('Did not get to a valid contract');
      setLoading(`remove${record?.key}`);
      // ajax request after empty completing

      const res = await removeFromWhiteList(
        {
          whitelistId: whitelistInfo?.whitelistHash,
          addressList: { value: [record?.address ?? ''] },
        },
        contract,
      );
      setLoading(undefined);

      if (res?.error) return message.error(res?.error?.message || 'error');
      res?.TransactionId && messageHTML(res?.TransactionId);
      // getList(initViewTool, 0, pageState?.pageSize, true);
      updater();
    },
    [contract, updater, whitelistInfo?.whitelistHash],
  );

  const actionBtnWrapper = useCallback(
    (_, record: any) => (
      <>
        <Button type="link" onClick={() => setUserModal(record)}>
          Edit
        </Button>
        <Button
          disabled={!!loading}
          loading={`remove${record?.key}` === loading}
          danger
          type="link"
          onClick={() => removeHandler(record)}>
          Remove
        </Button>
      </>
    ),
    [loading, removeHandler],
  );

  const getStateInfo = useCallback(
    (v: any) => {
      setPage((v) => ({ page: 0, pageSize: v.pageSize }));
      // getList(v, 0, pageState?.pageSize, true);
      dispatch(
        basicWhiteListView.updateState.actions({
          initViewTool: {
            search: v?.search,
          },
        }),
      );
    },
    [dispatch],
  );

  const columns: ColumnsType<any> = useMemo(() => {
    const arr: any = [];
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
    arr.push({
      title: 'Address',
      dataIndex: 'address',
      align: (isMobile ? 'left' : 'center') as any,
    });
    isManager &&
      arr.push({
        title: 'Operations',
        dataIndex: 'action',
        className: 'manager-action',
        fixed: (isMobile ? 'right' : undefined) as any,
        align: 'center' as any,
        width: isMobile ? '7.1429rem' : 200,
        render: actionBtnWrapper,
      });
    return arr;
  }, [actionBtnWrapper, isManager, isMobile, whitelistInfo?.strategyType]);

  const dataSource = useMemo(() => {
    if (!whitelistInfoList?.items) return [];
    const skipCount = getSkipCount(pageState?.pageSize, pageState?.page - 1);
    const list = whitelistInfoList?.items?.filter((user) => {
      if (initViewTool?.search) {
        return user?.address === initViewTool?.search;
      }
      return true;
    });
    return list?.slice(skipCount, skipCount + pageState?.pageSize);
  }, [pageState?.page, pageState?.pageSize, initViewTool?.search, whitelistInfoList?.items]);

  const modalDestroy = useCallback(() => {
    setUserModal(null);
  }, []);

  const editOk = useCallback(() => {
    modalDestroy();
  }, [modalDestroy]);

  const onFinish = useCallback(
    async (values: any) => {
      console.log(values, 'onFinish==');
      if (!whitelistInfo?.whitelistHash) return message.error('Did not get to a valid whitelist id');
      if (!contract) return message.error('Did not get to a valid contract');
      const { address, tagId } = values ?? {};
      if (!address) return message.error('Invalid address');
      setEditLoading(true);
      const res = await updateWhitelistUserInfo(
        {
          whitelistId: whitelistInfo?.whitelistHash ?? '',
          extraInfoList: {
            addressList: { value: [address] },
            oldAddressList: { value: [userModal?.address] },
            ...(whitelistInfo?.strategyType === StrategyType.Price ? { id: tagId } : {}),
          },
        },
        whitelistInfo?.strategyType ?? StrategyType.Basic,
        contract,
      );

      setEditLoading(false);
      if (res?.error) return message.error(res?.error?.message || 'error');
      res?.TransactionId && messageHTML(res?.TransactionId);
      editOk();
      updater();
      // getList(tool.current?.getState(), 0, pageState?.pageSize, true);
    },
    [contract, editOk, updater, whitelistInfo?.strategyType, whitelistInfo?.whitelistHash, userModal?.address],
  );

  return (
    <CommonModal
      closable={false}
      {...whiteListModal}
      title={whiteListModal?.title ?? '白名单详情页'}
      leftCallBack={() => {
        handleModalAction(MODAL_ACTION_TYPE.HIDE);
        whiteListModal?.leftCallBack?.();
      }}>
      <InfoTool
        ref={tool}
        strategyType={whitelistInfo?.strategyType ?? StrategyType.Basic}
        initState={initViewTool}
        onReset={() => {
          tableRef?.current?.onResetPage();
        }}
        getStateInfo={getStateInfo}
      />

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
        columns={columns}
        dataSource={dataSource ?? []}
      />
      {!!userModal && (
        <EditUserInfo
          strategyType={whitelistInfo?.strategyType}
          editInfo={userModal}
          loading={editLoading}
          onCancel={modalDestroy}
          onFinish={onFinish}
        />
      )}
    </CommonModal>
  );
}
