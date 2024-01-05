import { Button, Col, Row } from 'antd';
import { useMobile } from 'contexts/useStore/hooks';

interface IModalFooter {
  onCancel?: (e?: any) => void;
  loading?: boolean;
  onConfirm?: (e?: any) => void;
}

export default function ModalFooter({ onCancel, loading, onConfirm }: IModalFooter) {
  const isMobile = useMobile();
  return (
    <Row justify="space-between" gutter={isMobile ? 0 : 20} className="form-button-wrapper">
      <Col flex={1}>
        <Button
          type="default"
          onClick={(e) => {
            onCancel?.(e);
          }}>
          Back
        </Button>
      </Col>
      <Col flex={1}>
        <Button
          onClick={() => {
            onConfirm?.();
          }}
          loading={loading}
          type="primary"
          htmlType="submit">
          Confirm
        </Button>
      </Col>
    </Row>
  );
}
