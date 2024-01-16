import { Flex } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HashAddress, Search, Table, Pagination } from 'aelf-design';
import BaseBreadcrumb from 'components/BaseBreadcrumb';
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
    title: 'ELF',
    dataIndex: 'elfCount',
    key: 'elfCount',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
];

const data: any[] = [
  {
    key: '1',
    order: '1',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    elfCount: '30,000,000,000',
    time: '03:06:32  28/07/2023',
  },
  {
    key: '2',
    order: '2',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    elfCount: '30,000,000,000',
    time: '03:06:32  28/07/2023',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    elfCount: '30,000,000,000',
    time: '03:06:32  28/07/2023',
  },
];

export default function ParticipantList() {
  return (
    <div className="common-page1 min-height-container participant-list-wrapper">
      <BaseBreadcrumb />
      <Flex className="header" justify="space-between">
        <Flex vertical>
          <span className="title">Participants Users</span>
          <Flex gap={8}>
            <span className="address-label">Contract Address: </span>
            <HashAddress address="ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF" />
          </Flex>
        </Flex>
        <Search inputClassName="address-search" placeholder="Address" />
      </Flex>
      <Table className="table" columns={columns} dataSource={data} />
      <Flex justify="space-between" align="center">
        <Flex gap={16}>
          <span>Number of Participants Users: 23</span>
          <span>Total ELF: 120,000,000,000</span>
        </Flex>
        <Pagination current={1} total={90} showSizeChanger={false} />
      </Flex>
    </div>
  );
}
