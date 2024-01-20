import { Flex } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Button, Typography, FontWeightEnum, Table, HashAddress } from 'aelf-design';
import { UpdateType } from '../types';
import './styles.less';

interface IAddressValidationModalProps {
  updateType: UpdateType;
  modalOpen: boolean;
  onModalCancel: () => void;
  onModalConfirm: () => void;
}

const { Text, Title } = Typography;

const columns: ColumnsType<any> = [
  {
    title: 'No.',
    dataIndex: 'order',
    key: 'order',
    width: 66,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 236,
    render: (address) => <HashAddress preLen={8} endLen={9} hasCopy={false} address={address} />,
  },
  {
    title: 'Results',
    dataIndex: 'result',
    key: 'result',
    width: 151,
    render: (result) => <Text className="error-text">{result || '-'}</Text>,
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    key: 'reason',
    width: 167,
    render: (reason) => <Text>{reason || '-'}</Text>,
  },
];

const data: any[] = [
  {
    key: '1',
    order: '1',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Addable',
    reason: '',
  },
  {
    key: '2',
    order: '2',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
  {
    key: '3',
    order: '3',
    address: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
    result: 'Not Addable',
    reason: 'Already Exists',
  },
];

export default function AddressValidationModal({
  updateType,
  modalOpen,
  onModalCancel,
  onModalConfirm,
}: IAddressValidationModalProps) {
  return (
    <Modal
      className="whitelist-users-address-validation-modal"
      title={`${updateType === UpdateType.ADD ? 'Add Allowlist' : 'Remove Whitelisted'} Users`}
      width={668}
      footer={null}
      centered
      open={modalOpen}
      onCancel={onModalCancel}>
      <Flex vertical gap={24}>
        <Flex vertical gap={8}>
          <Title fontWeight={FontWeightEnum.Medium}>Address validation results</Title>
          <Flex className="info-wrapper" vertical>
            <Flex className="info-row" justify="space-between" align="center">
              <Text>Total number of attempts to whitelist</Text>
              <Text fontWeight={FontWeightEnum.Medium}>100</Text>
            </Flex>
            <Flex className="info-row" justify="space-between" align="center">
              <Text>
                Total number of whitelist users that can be {updateType === UpdateType.ADD ? 'added' : 'removed'}
              </Text>
              <Text fontWeight={FontWeightEnum.Medium}>90</Text>
            </Flex>
            <Flex className="info-row" justify="space-between" align="center">
              <Text>
                Total number of non-{updateType === UpdateType.ADD ? 'addable' : 'removable'} whitelisted users
              </Text>
              <Text className="error-text" fontWeight={FontWeightEnum.Medium}>
                10
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Table scroll={{ y: 400 - 55 - 20 }} dataSource={data} columns={columns} />
        <Flex className="footer-wrapper" gap={16} justify="center">
          <Button onClick={onModalCancel}>Back</Button>
          <Button type="primary" onClick={onModalConfirm}>
            Confirmation
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
