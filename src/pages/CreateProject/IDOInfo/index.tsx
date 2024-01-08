import React from 'react';
import { Button, Form, InputNumber, Space, Flex, DatePicker } from 'antd';
import { FormItemProps, FormFields } from 'components/FormItem';
import ButtonGroup from '../components/ButtonGroup';

const formList: FormItemProps[] = [
  {
    type: 'select',
    label: 'IDO Type',
    name: 'type',
    childrenProps: {
      disabled: true,
      list: [{ title: 'Fixed', value: 'Fixed' }],
      defaultValue: 'Fixed',
    },
  },
  {
    type: 'select',
    label: 'Token Unsold',
    name: 'isBurnRestToken',
    childrenProps: {
      list: [
        { title: 'Return', value: '0' },
        { title: 'Burn', value: '1' },
      ],
      defaultValue: '0',
    },
  },
  {
    type: 'inlineField',
    label: 'Sale Price',
    name: 'saleprice',
    inlineFieldList: [
      {
        type: 'inputNumber',
        childrenProps: {
          className: 'form-item-width-437 flex-grow',
        },
      },
      {
        type: 'pureText',
        childrenProps: {
          className: 'margin-left-8',
          text: 'PIGE = 1 ELF',
        },
      },
    ],
  },
  {
    type: 'inlineField',
    label: 'Supply',
    name: 'supply',
    inlineFieldList: [
      {
        type: 'inputNumber',
        childrenProps: {
          className: 'form-item-width-437 flex-grow',
        },
      },
      {
        type: 'pureText',
        childrenProps: {
          className: 'margin-left-8',
          text: 'PIGE',
        },
      },
    ],
  },
  {
    type: 'inlineField',
    label: 'Purchase Quantity',
    name: 'auantity',
    inlineFieldList: [
      {
        type: 'inputNumber',
        name: 'minValue',
        childrenProps: {
          style: {
            maxWidth: 188,
            flexGrow: 1,
          },
        },
      },
      {
        type: 'pureText',
        childrenProps: {
          text: 'ELF = ',
          style: {
            flex: 'none',
            margin: '0 8px',
          },
        },
      },
      {
        type: 'inputNumber',
        name: 'maxValue',
        childrenProps: {
          style: {
            maxWidth: 188,
            flexGrow: 1,
          },
        },
      },
      {
        type: 'pureText',
        childrenProps: {
          text: 'ELF',
          style: {
            flex: 'none',
            marginLeft: 8,
          },
        },
      },
    ],
  },
  {
    type: 'datePicker',
    label: 'IDO Starts At',
    name: 'timeStart',
    className: 'form-item-width-437',
    childrenProps: {},
  },
  {
    type: 'datePicker',
    label: 'IDO Ends At',
    name: 'timeEnd',
    className: 'form-item-width-437',
    childrenProps: {},
  },
  {
    type: 'datePicker',
    label: 'Token Distribution Time',
    name: 'distributionTime',
    className: 'form-item-width-437',
    childrenProps: {},
  },
  {
    type: 'group',
    label: 'Enable Whitelist',
    name: 'enabel',
    className: 'form-item-width-437',
    childrenProps: {
      radioList: [
        { value: true, children: 'Enable' },
        { value: false, children: 'Disable' },
      ],
    },
  },
  {
    type: 'textArea',
    label: 'Whitelist Tasks',
    name: 'whiteList',
  },
];
const IDOInfo: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('values', values);
  };

  return (
    <div className="form-page">
      <Form layout="vertical" name="IDO" initialValues={{}} onFinish={onFinish}>
        {FormFields(formList)}
        <Form.Item>
          <Button htmlType="submit">提交</Button>
          {/* <ButtonGroup /> */}
        </Form.Item>
      </Form>
    </div>
  );
};
export default IDOInfo;
