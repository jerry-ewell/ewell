import React, { useCallback, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { FormItemProps, FormFields } from 'components/FormItem';
import { Form, Button, GetProp, message } from 'antd';
import { getInputOptions, normFile } from 'components/FormItem/utils';
import { urlValidator } from 'pages/CreateProjectOld/validate';
import CustomMark from '../components/CustomMark';
import { CreateStepPorps } from '../types';
import ButtonGroup from '../components/ButtonGroup';
import './styles.less';
import storages from '../storages';
import { Upload, IUploadProps } from 'aelf-design';
import { useAWSUploadService } from 'hooks/useAWSUploadService';
import { emitLoading } from 'utils/events';
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
      maxLength: 500,
      autoSize: { minRows: 3, maxRows: 5 },
    },
  },
  {
    type: 'textArea',
    label: 'Project Description (300-20000 character):',
    name: 'projectDescription',
    rules: [
      { required: true, message: 'Please enter the necessary information' },
      { min: 300, max: 20000, message: '300-20000' },
    ],
    childrenProps: {
      autoSize: { minRows: 3, maxRows: 5 },
    },
  },
  {
    type: 'fileUpload',
    label: 'LogoUrl:',
    name: 'logoUrl',
    valuePropName: 'fileList',
    getValueFromEvent: normFile,
    childrenProps: {
      maxFileCount: 1,
      fileLimit: '10M',
      accept: '.jpg,.jpeg.,.png',
    },
  },
  {
    type: 'fileUpload',
    label: 'Project Images:',
    name: 'projectImgs',
    required: true,
    valuePropName: 'fileList',
    getValueFromEvent: normFile,
    childrenProps: {
      maxFileCount: 5,
      fileLimit: '10M',
      accept: '.jpg,.jpeg.,.png',
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
        label: 'Medium:',
        name: 'medium',
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
        label: 'Telegram:',
        name: 'telegram',
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
      const { projectImgs, logoUrl } = value;

      if (!logoUrl || logoUrl.length <= 0) {
        message.warning('Please upload logo image.');
        return;
      }

      if (!projectImgs || projectImgs.length < 3) {
        message.warning('Please upload 3 to 5 project images.');
        return;
      }

      setAdditional(value);
      onNext?.();
    },
    [setAdditional, onNext],
  );

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
        <Form.Item>
          <Button htmlType="submit">submit</Button>
        </Form.Item>
      </Form>
      {/* <ButtonGroup /> */}
      {/* <Upload name="file" fileList={fileList} customRequest={onCustomRequest} onChange={onUploadChange} /> */}
    </div>
  );
};
export default ProjectInfo;
