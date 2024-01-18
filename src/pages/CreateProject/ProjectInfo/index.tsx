import React, { useCallback, useState } from 'react';
import { useLocalStorage, useSessionStorage } from 'react-use';
import { FormItemProps, FormFields } from 'components/FormItem';
import { Form, Button } from 'antd';
import { getInputOptions } from 'components/FormItem/utils';
import { urlValidator } from 'pages/CreateProjectOld/validate';
import CustomMark from '../components/CustomMark';
import { CreateStepPorps } from '../types';
import ButtonGroup from '../components/ButtonGroup';
import './styles.less';
import storages from '../storages';
import { Upload, IUploadProps } from 'aelf-design';
import { useAWSUploadService } from 'hooks/useAWSUploadService';
import { UploadFile } from 'antd/lib';

const formList: FormItemProps[] = [
  getInputOptions({
    label: 'Project Name:',
    name: 'projectName',
    tooltip: 'test',
    childrenProps: {
      maxLength: 40,
      showCount: true,
    },
  }),
  {
    type: 'textArea',
    label: 'Summary Project Description (20-500 character):',
    name: 'projectSummmary',
    rules: [
      { required: true, message: 'required' },
      { min: 20, message: 'Please enter the necessary information' },
    ],
    childrenProps: {
      autoSize: true,
      maxLength: 500,
    },
  },
  {
    type: 'textArea',
    label: 'Project Description (300-20000 character):',
    name: 'projectDescription',
    rules: [
      { required: true, message: '' },
      { min: 300, max: 20000, message: '300-20000' },
    ],
    childrenProps: {
      autoSize: false,
    },
  },
  {
    type: 'fileUpload',
    label: 'LogoUrl:',
    name: 'logoUrl',
    // required: true,
    childrenProps: {
      // style: {
      //   height: 0,
      // },
    },
  },
  {
    type: 'fileUpload',
    label: 'Project Images:',
    name: 'projectImgs',
    // required: true,
    childrenProps: {
      // style: {
      //   height: 0,
      // },
    },
  },
  getInputOptions({
    label: 'Official Website:',
    name: 'website',
    tooltip: 'test',
    rules: [{ required: true, message: 'sdssds' }, { validator: urlValidator }],
  }),
  {
    type: 'fieldsGroup',
    label: 'Other Community',
    fieldsList: [
      getInputOptions({
        label: 'Facebook:',
        name: 'facebook',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
      getInputOptions({
        label: 'Telegram:',
        name: 'telegram',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
      getInputOptions({
        label: 'X:',
        name: 'x',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
      getInputOptions({
        label: 'Github:',
        name: 'github',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
      getInputOptions({
        label: 'Discord:',
        name: 'discord',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
      getInputOptions({
        label: 'Reddit:',
        name: 'reddit',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
    ],
  },
];

const ProjectInfo: React.FC<CreateStepPorps> = ({ onNext, onPre }) => {
  const [additional, setAdditional] = useLocalStorage(storages.AdditionalInformation, {});
  const { awsUploadFile } = useAWSUploadService();
  const onFinish = useCallback(
    (value: any) => {
      console.log('projectInfo', value);
      setAdditional(value);
      // onNext();
    },
    [setAdditional, onNext],
  );

  const onUploadChange: IUploadProps['onChange'] = (info) => {
    console.log('onUploadChange', info);
    // eslint-disable-next-line no-debugger
    // setFilelist(info.fileList.filter((file: UploadFile) => file?.status === 'done'));
    // if (info.file.status === 'done') {
    //   setFilelist(info.fileList);
    // }
    setFilelist(info.fileList);
  };
  const [fileList, setFilelist] = useState<any[]>([]);

  const onCustomRequest: IUploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      console.log('customRequest', file);
      // eslint-disable-next-line no-debugger
      const uploadFIle = await awsUploadFile(file as File);
      // eslint-disable-next-line no-debugger
      console.log('awsUploadFile', uploadFIle);
      onSuccess?.({ url: uploadFIle });
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="project-info">
      <Form
        layout="vertical"
        name="projectInfo"
        initialValues={additional}
        requiredMark={CustomMark}
        scrollToFirstError
        onFinish={onFinish}
        validateTrigger="onSubmit">
        {FormFields(formList)}
        {/* TODO: 列表回显 */}
        <Form.Item label="testupload" name="testFile" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload name="file" customRequest={onCustomRequest} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
      {/* <ButtonGroup /> */}
      {/* <Upload name="file" fileList={fileList} customRequest={onCustomRequest} onChange={onUploadChange} /> */}
    </div>
  );
};
export default ProjectInfo;
