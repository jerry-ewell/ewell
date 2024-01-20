import { useState } from 'react';
import clsx from 'clsx';
import { Flex, Space } from 'antd';
import { Button, Modal, Upload, Input, Typography, FontWeightEnum } from 'aelf-design';
import { download } from 'assets/images';
import { UpdateType } from '../types';
import './styles.less';

const { TextArea } = Input;
const { Text } = Typography;

interface IUpdateModalProps {
  updateType: UpdateType;
  modalOpen: boolean;
  onModalCancel: () => void;
  onModalSubmit: () => void;
}

enum UpdateWay {
  UPLOAD = 'upload',
  PASTE = 'paste',
}

export default function UpdateModal({ updateType, modalOpen, onModalCancel, onModalSubmit }: IUpdateModalProps) {
  const [currentUpdateWay, setCurrentUpdateWay] = useState<UpdateWay>(UpdateWay.PASTE);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleUpload = (info) => {
    console.log('info: ', info);
    setFileList(info.fileList);
  };

  return (
    <Modal
      className="update-whitelist-users-modal"
      width={668}
      title={`${updateType === UpdateType.ADD ? 'Add Allowlist' : 'Remove Whitelisted'} Users`}
      footer={null}
      centered
      open={modalOpen}
      onCancel={onModalCancel}>
      <Flex vertical gap={24}>
        <Text>
          Please enter the user's address, support batch user input separate addressed with special characters. If your
          list exists CSV or EXCEL, please click the corresponding button in the upper right corner to upload the file.
          <Space className="download-template cursor-pointer" size={8} align="center">
            <img src={download} alt="download" />
            <Text className="purple-text" fontWeight={FontWeightEnum.Medium}>
              Download the template
            </Text>
          </Space>
        </Text>
        <Flex className="update-way-radio-wrapper cursor-pointer">
          <Flex
            className={clsx('radio-item', { 'radio-item-active': currentUpdateWay === UpdateWay.UPLOAD })}
            justify="center"
            align="center"
            onClick={() => setCurrentUpdateWay(UpdateWay.UPLOAD)}>
            <Text>Upload CSV/EXCEL</Text>
          </Flex>
          <Flex
            className={clsx('radio-item', {
              'radio-item-active': currentUpdateWay === UpdateWay.PASTE,
            })}
            justify="center"
            align="center"
            onClick={() => setCurrentUpdateWay(UpdateWay.PASTE)}>
            <Text>Paste Address</Text>
          </Flex>
        </Flex>
        {currentUpdateWay === UpdateWay.UPLOAD && (
          <Upload className="address-upload" tips="Browse your file here" fileList={fileList} onChange={handleUpload} />
        )}
        {currentUpdateWay === UpdateWay.PASTE && (
          <TextArea className="paste-address-textarea" placeholder="placeholder" />
        )}
        <Flex gap={16} justify="center">
          <Button className="modal-footer-button" onClick={onModalCancel}>
            Cancel
          </Button>
          <Button className="modal-footer-button" type="primary" onClick={onModalSubmit}>
            Submit
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
