import { useCallback, useMemo, useState } from 'react';
import { Flex } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HashAddress, Search, Pagination, Typography, FontWeightEnum } from 'aelf-design';
import BaseBreadcrumb from 'components/BaseBreadcrumb';
import CommonTable from 'components/CommonTable';
import UpdateWhitelistUsersButton from 'components/UpdateWhitelistUsersButton';
import { UpdateType } from 'components/UpdateWhitelistUsersButton/types';
import { add, remove } from 'assets/images';
import './styles.less';
import { useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { useWallet } from 'contexts/useWallet/hooks';
import { useViewContract } from 'contexts/useViewContract/hooks';
import { DEFAULT_CHAIN_ID } from 'constants/network';

const { Title, Text } = Typography;

const columns: ColumnsType<any> = [
  {
    title: 'No.',
    dataIndex: 'order',
    key: 'order',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (address) => <HashAddress address={address} chain={DEFAULT_CHAIN_ID} />,
  },
  {
    title: 'Add Time',
    dataIndex: 'time',
    key: 'time',
  },
];

const DEFAULT_PAGE_SIZE = 10;
type TAddressItem = {
  key: string;
  order: string;
  address: string;
  time: string;
};
export default function WhitelistUsers() {
  const [isTableLoading, setIsTableLoading] = useState(true);
  const { whitelistId = '' } = useParams();
  const { wallet } = useWallet();
  const { getWhitelistUserAddressList } = useViewContract();
  const [pager, setPager] = useState({
    page: 1,
    total: 0,
  });
  const onPageChange = useCallback((page) => setPager((v) => ({ ...v, page })), []);
  const [totalAddressList, setTotalAddressList] = useState<TAddressItem[]>();
  const [userAddressList, setUserAddressList] = useState<string[]>();

  const curAddressList = useMemo(
    () => totalAddressList?.slice((pager.page - 1) * DEFAULT_PAGE_SIZE, pager.page * DEFAULT_PAGE_SIZE) || [],
    [pager.page, totalAddressList],
  );

  const getWhitelistInfo = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const addressList = await getWhitelistUserAddressList(whitelistId);
      const userList: TAddressItem[] = addressList.map((address, idx) => ({
        key: `${idx + 1}`,
        order: `${idx + 1}`,
        address,
        time: '03:06:32  28/07/2023',
      }));

      setUserAddressList(addressList);
      setTotalAddressList(userList);
      setPager({
        page: 1,
        total: addressList.length,
      });
    } catch (error) {
      console.log('getWhitelistInfo error', error);
    }
    setIsTableLoading(false);
  }, [getWhitelistUserAddressList, whitelistId]);

  useEffectOnce(() => {
    getWhitelistInfo();
  });

  return (
    <div className="common-page page-body whitelist-users-wrapper">
      <BaseBreadcrumb />
      <Flex vertical gap={24}>
        <Title level={5} fontWeight={FontWeightEnum.Medium}>
          Whitelist Users
        </Title>
        <Flex justify="space-between" align="center">
          <Flex gap={16}>
            <UpdateWhitelistUsersButton
              buttonProps={{
                className: 'update-button',
                icon: <img src={add} alt="add" />,
                children: 'Add',
              }}
              updateType={UpdateType.ADD}
              whitelistId={whitelistId}
              onSuccess={getWhitelistInfo}
            />
            <UpdateWhitelistUsersButton
              buttonProps={{
                className: 'update-button',
                icon: <img src={remove} alt="remove" />,
                children: 'Remove',
              }}
              updateType={UpdateType.REMOVE}
              whitelistId={whitelistId}
              onSuccess={getWhitelistInfo}
            />
          </Flex>
          <Search inputClassName="address-search" placeholder="Address" />
        </Flex>
        {!!pager.total && (
          <Flex vertical gap={16}>
            <CommonTable loading={isTableLoading} columns={columns} dataSource={curAddressList} />
            <Flex justify="space-between" align="center">
              <Text size="small">
                Number of Participants Users:{' '}
                <Text size="small" fontWeight={FontWeightEnum.Medium}>
                  {pager.total}
                </Text>
              </Text>
              <Pagination
                current={pager.page}
                total={pager.total}
                showSizeChanger={false}
                pageChange={onPageChange}
                pageSize={DEFAULT_PAGE_SIZE}
              />
            </Flex>
          </Flex>
        )}
      </Flex>
    </div>
  );
}
