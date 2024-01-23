import { StepProps } from 'antd';
import { getInputOptions, normFile } from 'components/FormItem/utils';
import { FormItemProps, FormFields } from 'components/FormItem';
import { urlValidator } from 'pages/CreateProjectOld/validate';

export const stepsItems: StepProps[] = [
  {
    title: 'Trading Pair',
  },
  {
    title: 'Project Information',
  },
  {
    title: 'IDO Information',
  },
  {
    title: 'Preview & Transfer',
  },
];

export const ProjectInfoFromJson: FormItemProps[] = [
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
