import { useState } from 'react';
import { Flex } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HashAddress, Search, Pagination, Typography, FontWeightEnum } from 'aelf-design';
import BaseBreadcrumb from 'components/BaseBreadcrumb';
import CommonTable from 'components/CommonTable';
import './styles.less';

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
  const [isTableLoading, setIsTableLoading] = useState(false);

  return (
    <div className="common-page1 min-height-container participant-list-wrapper">
      <BaseBreadcrumb />
      <Flex className="header" justify="space-between">
        <Flex vertical>
          <Title level={5} fontWeight={FontWeightEnum.Medium}>
            Participants Users
          </Title>
          <Flex gap={8}>
            <Text>Contract Address: </Text>
            <HashAddress address="ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF" />
          </Flex>
        </Flex>
        <Search inputClassName="address-search" placeholder="Address" />
      </Flex>
      <CommonTable className="table" loading={isTableLoading} columns={columns} dataSource={data} />
      <Flex justify="space-between" align="center">
        <Flex gap={16}>
          <Text size="small">
            Number of Participants Users:{' '}
            <Text size="small" fontWeight={FontWeightEnum.Medium}>
              23
            </Text>
          </Text>
          <Text size="small">
            Total ELF:{' '}
            <Text size="small" fontWeight={FontWeightEnum.Medium}>
              120,000,000,000
            </Text>
          </Text>
        </Flex>
        <Pagination current={1} total={90} showSizeChanger={false} />
      </Flex>
    </div>
  );
}
