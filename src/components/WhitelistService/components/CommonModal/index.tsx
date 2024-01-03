import { Col, Modal, Row } from 'antd';
import clsx from 'clsx';
import { ModalWhiteListProps } from '../../types';
import './styled.less';

const ArrowOutlined = ({ deg = 45 }: { deg?: number }) => (
  <span style={{ transform: `rotate(${deg}deg)` }} className="arrow-outlined"></span>
);

export default function CommonModal({
  centered = true,
  leftElement,
  title,
  width,
  leftCallBack,
  className,
  onCancel,
  transitionName,
  closable = false,
  ...props
}: ModalWhiteListProps) {
  return (
    <Modal
      visible
      maskClosable={false}
      centered={centered}
      destroyOnClose
      footer={null}
      closable={closable}
      {...props}
      title={
        <>
          <Row justify="space-between">
            <Col
              className="common-modal-left-icon"
              flex={1}
              onClick={() => {
                if (typeof leftElement === 'boolean') return;
                // handleModalAction(MODAL_ACTION_TYPE.HIDE);
                leftCallBack?.();
              }}>
              {leftElement ? leftElement : typeof leftElement === 'undefined' ? <ArrowOutlined /> : null}
            </Col>
            <Col flex={5} style={{ textAlign: 'center' }}>
              {title}
            </Col>
            {<Col flex={1} />}
          </Row>
        </>
      }
      width={width ? width : '800px'}
      className={clsx('common-modal', 'whitelist-common-modal', className)}
      onCancel={(e) => {
        // handleModalAction(MODAL_ACTION_TYPE.HIDE);
        onCancel?.(e);
      }}
      transitionName={transitionName}
    />
  );
}
