import { Form, Upload, UploadProps } from 'antd';
import { DraggerProps } from 'antd/lib/upload/Dragger';
import { useCallback, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import IconFont from 'components/IconFont';
import { Icons } from 'constants/iconfont';

const { Dragger } = Upload;

interface UploadFileProps extends DraggerProps {
  name?: string;
  label?: string;
}

export default function UploadFile({ name = 'address', label = '', ...draggerProps }: UploadFileProps) {
  const props: UploadProps = {
    name: 'file',
    action: '',
    beforeUpload() {
      return false;
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    ...draggerProps,
  };
  const normFile = useCallback((e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  }, []);

  const UploadFormat = useMemo(() => (isMobile ? Upload : Dragger), []);

  return (
    <div>
      <Form.Item
        label={label}
        name={name}
        valuePropName="fileList"
        className="upload-file-wrapper"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: 'Missing' }]}>
        <UploadFormat {...props} accept="text/csv" maxCount={1}>
          <IconFont className="upload-icon" type={Icons.uploadIcon} />
          <p className="upload-text">Upload the file/ Drop it here</p>
          <p className="upload-hint">Please enter addresses (max 100 addresses each time, separated with “,”)</p>
          <p className="support">Format:.csv</p>
        </UploadFormat>
      </Form.Item>
    </div>
  );
}
