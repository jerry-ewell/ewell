import { useState } from 'react';
import { Flex } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HashAddress, Search, Pagination } from 'aelf-design';
import BaseBreadcrumb from 'components/BaseBreadcrumb';
import CommonTable from 'components/CommonTable';
import UpdateWhitelistUsersButton from 'components/UpdateWhitelistUsersButton';
import './styles.less';

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
    render: (address) => <HashAddress address={address} />,
  },
  {
    title: 'Add Time',
    dataIndex: 'time',
    key: 'time',
  },
];

const data: any[] = [
  {
    key: '1',
    order: '1',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    time: '03:06:32  28/07/2023',
  },
  {
    key: '2',
    order: '2',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    time: '03:06:32  28/07/2023',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    time: '03:06:32  28/07/2023',
  },
  {
    key: '4',
    order: '4',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    time: '03:06:32  28/07/2023',
  },
  {
    key: '5',
    order: '5',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    time: '03:06:32  28/07/2023',
  },
  {
    key: '6',
    order: '6',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    time: '03:06:32  28/07/2023',
  },
  {
    key: '7',
    order: '7',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    time: '03:06:32  28/07/2023',
  },
  {
    key: '8',
    order: '8',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    time: '03:06:32  28/07/2023',
  },
];

export default function WhitelistUsers() {
  const [isTableLoading, setIsTableLoading] = useState(false);

  return (
    <div className="common-page1 min-height-container whitelist-users-wrapper">
      <BaseBreadcrumb />
      <Flex vertical gap={24}>
        <span className="title">Whitelist Users</span>
        <Flex justify="space-between" align="center">
          <UpdateWhitelistUsersButton
            buttonProps={{
              className: 'remove-button',
              type: 'primary',
              danger: true,
              children: 'Remove',
            }}
            modalTitle="Remove Whitelisted Users"
          />
          <Search inputClassName="address-search" placeholder="Address" />
        </Flex>
        <Flex vertical gap={16}>
          <CommonTable loading={isTableLoading} columns={columns} dataSource={data} />
          <Flex justify="space-between" align="center">
            <span>Number of Participants Users: 23</span>
            <Pagination current={1} total={90} showSizeChanger={false} />
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
