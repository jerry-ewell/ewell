import { Modal, ModalProps, Flex, Button } from 'antd';
import { success } from 'assets/images';
import './styles.less';

interface ISuccessModalProps {
  modalProps: ModalProps;
  data: {
    amountList: {
      amount: string;
      symbol: string;
    }[];
    description: string;
    boxData: {
      label: string;
      value: string;
    };
  };
}

export default function SuccessModal({ modalProps, data: { amountList, description, boxData } }: ISuccessModalProps) {
  return (
    <Modal {...modalProps} wrapClassName={`success-modal-wrapper ${modalProps.wrapClassName}`} footer={null}>
      <Flex vertical gap={24}>
        <Flex vertical align="center">
          <img className="success-icon" src={success} alt="success" />
          <Flex gap={2}>
            {amountList.map((item, index) => (
              <Flex key={index} gap={8} align="baseline">
                <span className="amount">{item.amount}</span>
                <span className="symbol">{item.symbol}</span>
              </Flex>
            ))}
          </Flex>
          <span className="description">{description}</span>
        </Flex>
        <Flex className="box-data" justify="space-between">
          <span>{boxData.label}</span>
          <span>{boxData.value}</span>
        </Flex>
        <Button onClick={modalProps.onOk}>OK</Button>
      </Flex>
    </Modal>
  );
}
