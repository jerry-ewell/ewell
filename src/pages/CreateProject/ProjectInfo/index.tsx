import React from 'react';
import FormItem, { FormItemProps, FormFields } from 'components/FormItem';
import { Form } from 'antd';
import { getInputOptions } from 'components/FormItem/utils';
import { urlValidator } from 'pages/CreateProjectOld/validate';
import ButtonGroup from '../components/ButtonGroup';
import './styles.less';

const formList: FormItemProps[] = [
  getInputOptions({
    label: 'Project Name',
    name: '1',
    tooltip: 'test',
  }),
  {
    type: 'textArea',
    label: 'Summary Project Description (20-500 character)',
    name: '2',
  },
  {
    type: 'textArea',
    label: 'Project Description (300-20000 character)',
    name: '3',
  },
  {
    type: 'fileUpload',
    label: 'Logo',
    name: 'community',
    childrenProps: {
      // style: {
      //   height: 0,
      // },
    },
  },
  {
    type: 'fileUpload',
    label: 'Project Images',
    name: 'projectImg',
    childrenProps: {
      // style: {
      //   height: 0,
      // },
    },
  },
  {
    type: 'fieldsGroup',
    label: 'Other Community',
    name: 'community',
    fieldsList: [
      getInputOptions({
        label: 'Facebook',
        name: 'facebook',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
      getInputOptions({
        label: 'Telegram',
        name: 'Telegram',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
      getInputOptions({
        label: 'X',
        name: 'X',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
      getInputOptions({
        label: 'Github',
        name: 'Github',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
      getInputOptions({
        label: 'Discord',
        name: 'Discord',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
      getInputOptions({
        label: 'Reddit',
        name: 'Reddit',
        required: false,
        rules: [{ validator: urlValidator }],
      }),
    ],
  },
];

const ProjectInfo: React.FC = () => {
  return (
    <div className="project-info">
      <Form layout="vertical" name="projectInfo">
        {FormFields(formList)}
      </Form>
      <ButtonGroup />
    </div>
  );
};
export default ProjectInfo;
