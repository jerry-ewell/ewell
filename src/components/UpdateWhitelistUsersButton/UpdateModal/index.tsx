import { useState } from 'react';
import clsx from 'clsx';
import { Flex, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Modal, IModalProps, Upload, Input } from 'aelf-design';
import './styles.less';

const { TextArea } = Input;

interface IUpdateModalProps {
  modalTitle: string;
  modalOpen: boolean;
  onModalCancel: () => void;
  onModalSubmit: () => void;
}

enum UpdateWay {
  UPLOAD = 'upload',
  PASTE = 'paste',
}

export default function UpdateModal({ modalTitle, modalOpen, onModalCancel, onModalSubmit }: IUpdateModalProps) {
  const [currentUpdateWay, setCurrentUpdateWay] = useState<UpdateWay>(UpdateWay.UPLOAD);

  return (
    <Modal
      className="update-modal"
      width={668}
      title={modalTitle}
      footer={null}
      centered
      open={modalOpen}
      onCancel={onModalCancel}>
      <Flex vertical gap={24}>
        <div>
          <span>
            Please enter the user's address, support batch user input separate addressed with special characters. If
            your list exists CSV or EXCEL, please click the corresponding button in the upper right corner to upload the
            file.
          </span>
          <Space className="download-template cursor-pointer" size={8} align="center">
            <DownloadOutlined />
            <span>Download the template</span>
          </Space>
        </div>
        <Flex className="update-way-radio-wrapper cursor-pointer">
          <Flex
            className={clsx('radio-item', { 'radio-item-active': currentUpdateWay === UpdateWay.UPLOAD })}
            justify="center"
            align="center"
            onClick={() => setCurrentUpdateWay(UpdateWay.UPLOAD)}>
            Upload CSV/EXCEL
          </Flex>
          <Flex
            className={clsx('radio-item', {
              'radio-item-active': currentUpdateWay === UpdateWay.PASTE,
            })}
            justify="center"
            align="center"
            onClick={() => setCurrentUpdateWay(UpdateWay.PASTE)}>
            Paste Address
          </Flex>
        </Flex>
        {currentUpdateWay === UpdateWay.UPLOAD && <Upload className="address-upload" tips="Browse your file here" />}
        {currentUpdateWay === UpdateWay.PASTE && <TextArea className="paste-address-textarea" />}
        <Flex gap={16} justify="center">
          <Button className="modal-footer-button" onClick={onModalCancel}>
            Cancel
          </Button>
          <Button className="modal-footer-button" onClick={onModalSubmit}>
            Submit
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
