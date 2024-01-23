import { useEffect, useState } from 'react';
import { Flex } from 'antd';
import { Button, Typography, FontWeightEnum, Modal, HashAddress } from 'aelf-design';
import { InfoCircleOutlined } from '@ant-design/icons';
import { wallet } from 'assets/images';
import { NumberFormat } from 'utils/format';
import { success } from 'assets/images';
// import SuccessModal from '../SuccessModal';

const { Text, Title } = Typography;

interface ConfrimInfo {
  supply?: number;
  contractAddress?: string;
  balance?: number;
  transactionFee?: number;
}

interface ITransferModalProps {
  open: boolean;
  info: ConfrimInfo;
  onCancel: () => void;
  onOk: () => void;
}

export function ComfirmModal({ open, info, onCancel, onOk }: ITransferModalProps) {
  return (
    <>
      <Modal title="Confirm Transfer" footer={null} centered open={open} onCancel={onCancel}>
        <Flex vertical gap={24}>
          <Flex gap={8} justify="center" align="baseline">
            <Title fontWeight={FontWeightEnum.Medium} level={4}>
              {NumberFormat(363604, 8)}
            </Title>
            <Title fontWeight={FontWeightEnum.Medium}>PIGE</Title>
          </Flex>
          <Flex vertical gap={8}>
            <Flex>
              <InfoCircleOutlined style={{ margin: '4px 4px 0 0' }} />
              <Text size="small">Confirm the transfer of the following assets to the EWELL contract address:</Text>
            </Flex>
            <Flex className="modal-box-data-wrapper" justify="space-between">
              <Text fontWeight={FontWeightEnum.Medium}>Contract Address</Text>
              <HashAddress
                className="hash-address-small"
                preLen={8}
                endLen={9}
                address="ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF"
              />
            </Flex>
          </Flex>
          <Flex vertical gap={8}>
            <Flex justify="space-between">
              <Flex gap={8}>
                <img src={wallet} style={{ width: 20, height: 20 }} alt="" />
                <Text fontWeight={FontWeightEnum.Bold}>Balance</Text>
              </Flex>
              <Flex>
                <Text fontWeight={FontWeightEnum.Bold}>{NumberFormat(100000)} PIGE</Text>
              </Flex>
            </Flex>
            <Flex vertical gap={8}>
              <Flex justify="space-between">
                <Text>Estimated Transaction Fee</Text>
                <Flex gap={8} align="baseline">
                  <Text>0.3604 ELF</Text>
                  <Text size="small">$ 0.19</Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex justify="center">
            <Button className="modal-single-button" type="primary" onClick={onOk}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}

interface SuccessInfo {
  transactionId?: string;
  supply?: number;
}

interface ISuccessModalProps extends Omit<ITransferModalProps, 'info'> {
  info?: SuccessInfo;
}

export function SuccessModal({ open, info, onCancel, onOk }: ISuccessModalProps) {
  return (
    <Modal title="Transfer Successfully" open={open} onCancel={onCancel} footer={null} centered>
      <Flex vertical gap={24}>
        <Flex vertical gap={8} align="center">
          <img className="success-icon" src={success} alt="success" style={{ width: 48, height: 48 }} />
          <Flex vertical>
            <Flex gap={8} align="baseline" justify="center">
              <Title fontWeight={FontWeightEnum.Medium} level={4}>
                {NumberFormat(info?.supply || '')}
              </Title>
              <Title fontWeight={FontWeightEnum.Medium}>PIGE</Title>
            </Flex>
          </Flex>
          <Text className="text-center" fontWeight={FontWeightEnum.Bold}>
            Congratulations, transfer successfully!
          </Text>
          <Text className="text-center">
            The token has been transferred to the contract, the project has been created, and you can view the project
            now!
          </Text>
        </Flex>
        <Flex className="modal-box-data-wrapper" justify="space-between">
          <Text>Transaction ID</Text>
          <HashAddress className="hash-address-small" preLen={8} endLen={9} address={info?.transactionId || ''} />
        </Flex>
        <Flex justify="center">
          <Button className="modal-single-button" type="primary" onClick={onOk}>
            View Project
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
