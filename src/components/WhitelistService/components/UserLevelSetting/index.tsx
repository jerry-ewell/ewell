import { Button, Col, message, Row, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useWhiteList } from '../../context/useWhiteList';
import { MODAL_ACTION_TYPE, PaginationPage, ToolItemInstance, UserLevelItem, UserLevelSettingProps } from '../../types';
import { useCallback, useMemo, useRef, useState } from 'react';
import CommonModal from '../CommonModal';
import CommonTable, { CommonTableInstance } from '../CommonTable';
import { fetchUserLevelList } from '../../hooks/fetchUserLevelList';
import { getSkipCount } from '../../utils';
import { useEffectOnce } from 'react-use';
import { removeTagInfo } from '../../hooks/managersAction';
import AddUserLevel from '../AddUserLevel';
import { StrategyType } from '../../types/contract';
import RangeInput, { RangInputState } from '../RangeInput';
import { messageHTML } from 'utils/aelfUtils';

const commonName = 'user-level-setting';

export default function UserLevelSetting({ whiteListModal, customizeAddTagFormItem }: UserLevelSettingProps) {
  const [{ userLevelList, chainId, contract, whitelistInfo }, { handleModalAction, dispatch }] = useWhiteList();
  const RangeInputRef = useRef<ToolItemInstance>();
  const tableRef = useRef<CommonTableInstance>();
  const [search, setSearch] = useState<RangInputState>();
  const [loadingIndex, setLoadingIndex] = useState<string>();
  const [pageState, setPage] = useState<PaginationPage>({
    pageSize: 999,
    page: 1,
  });

  console.log(userLevelList, 'userLevelList===');
  const [addShow, setAddShow] = useState<boolean>();

  const getList = useCallback(
    (data?: any, page?: number, pageSize?: number, isUpdater?: boolean) => {
      fetchUserLevelList(
        dispatch,
        {
          chainId,
          projectId: whitelistInfo?.projectId,
          whitelistHash: whitelistInfo?.whitelistHash,
          priceMin: data?.min,
          priceMax: data?.max,
        },
        page,
        pageSize,
        isUpdater,
      );
    },
    [dispatch, chainId, whitelistInfo],
  );

  const actionHandler = useCallback(
    async (record) => {
      console.log(record, 'actionHandler==record===');
      if (!contract) return message.error('no contract');
      setLoadingIndex(record?.tagHash);
      const res = await removeTagInfo(
        {
          whitelistId: whitelistInfo?.whitelistHash ?? '',
          projectId: whitelistInfo?.projectId ?? '',
          tagId: record?.tagHash,
        },
        contract,
      );
      console.log(res, 'actionHandler===');
      setLoadingIndex(undefined);
      if (res?.error) return message.error(res?.error?.message || 'error');
      res?.TransactionId && messageHTML(res?.TransactionId);
      getList(search, 0, pageState.pageSize, true);
      setPage((v) => ({ page: 0, pageSize: v.pageSize }));
    },
    [contract, getList, pageState.pageSize, search, whitelistInfo?.projectId, whitelistInfo?.whitelistHash],
  );

  const columns: ColumnsType<UserLevelItem> = useMemo(() => {
    const arr: any[] = [];
    if (whitelistInfo?.strategyType !== StrategyType.Basic) {
      arr.push({
        title: 'name',
        dataIndex: 'name',
      });
    }
    if (whitelistInfo?.strategyType === StrategyType.Price) {
      arr.push({
        title: '售价',
        dataIndex: 'price',
        render: (_: any, record: UserLevelItem) =>
          `${record?.priceTagInfo?.price ?? '--'} ${record?.priceTagInfo?.symbol ?? '--'}`,
      });
    }

    return [
      ...arr,
      {
        title: '操作',
        dataIndex: 'action',
        render: (_, record) => {
          return (
            <Button
              loading={loadingIndex === record?.tagHash}
              type="link"
              disabled={(!!loadingIndex && loadingIndex !== record?.tagHash) || (record?.addressCount ?? 0) !== 0}
              onClick={() => actionHandler(record)}>
              删除
            </Button>
          );
        },
      },
    ];
  }, [actionHandler, loadingIndex, whitelistInfo?.strategyType]);

  // const pageChange = useCallback(
  //   (page, pageSize) => {
  //     setPage({ page, pageSize });
  //     getList(search, page - 1, pageSize);
  //   },
  //   [getList, search],
  // );
  const dataSource = useMemo(() => {
    if (!userLevelList?.items) return [];
    const skipCount = getSkipCount(pageState?.pageSize, pageState?.page - 1);
    return userLevelList?.items?.slice(skipCount, skipCount + pageState?.pageSize);
  }, [pageState?.page, pageState?.pageSize, userLevelList?.items]);
  console.log(userLevelList, dataSource, 'dataSource===');

  useEffectOnce(() => {
    getList();
  });

  const addTagHandler = useCallback(() => {
    setAddShow((v) => v || !v);
  }, []);

  const addSuccess = useCallback(() => {
    setAddShow(false);
    getList(search, 0, pageState.pageSize, true);
  }, [getList, pageState.pageSize, search]);

  return (
    <CommonModal
      closable={false}
      {...whiteListModal}
      title={whiteListModal?.title ?? '用户等级设置'}
      leftCallBack={() => {
        handleModalAction(MODAL_ACTION_TYPE.HIDE);
        whiteListModal?.leftCallBack?.();
      }}>
      <Row justify="space-between" align="middle" className={`${commonName}-tool`}>
        <Col className={`${commonName}-title`}>用户等级列表</Col>
        <Col className={`${commonName}-action`}>
          <Space>
            <RangeInput ref={RangeInputRef} />
            <Button
              onClick={() => {
                tableRef?.current?.onResetPage();
                const searchVal = RangeInputRef?.current?.getState();
                setSearch(searchVal);
                setPage((v) => ({ page: 0, pageSize: v.pageSize }));
                getList(searchVal, 0, pageState.pageSize, true);
              }}>
              搜索
            </Button>
            <span className="add-tag-btn">
              <Button
                disabled={(userLevelList?.totalCount ?? 0) >= 10}
                onClick={addTagHandler}
                className="add-btn"
                type="primary">
                新增
              </Button>
              <br />
              <span>{'最多可设置10个用户等级 '}</span>
            </span>
          </Space>
        </Col>
      </Row>
      <CommonTable
        ref={tableRef}
        pagination={{
          // total: userLevelList?.totalCount ?? 0,
          // onChange: pageChange,
          showQuickJumper: false,
          showSizeChanger: false,
          defaultPageSize: 999,
        }}
        columns={columns}
        dataSource={dataSource}
        rowKey="tagHash"
      />
      {addShow && (
        <AddUserLevel
          policyType={whitelistInfo?.strategyType ?? StrategyType.Basic}
          customizeAddTagFormItem={customizeAddTagFormItem}
          whitelistId={whitelistInfo?.whitelistHash ?? undefined}
          projectId={whitelistInfo?.projectId ?? undefined}
          chainId={chainId}
          onBack={addSuccess}
          contract={contract}
        />
      )}
    </CommonModal>
  );
}
