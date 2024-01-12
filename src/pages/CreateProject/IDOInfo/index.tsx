import React, { useCallback, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { Button, Form, InputNumber, Space, Flex, DatePicker } from 'antd';
import { FormItemProps, FormFields } from 'components/FormItem';
import CustomMark from '../components/CustomMark';
import storages from '../storages';
import { minSubscriptionValidator, maxSubscriptionValidator } from '../validate';
import { CreateStepPorps } from '../types';
import ButtonGroup from '../components/ButtonGroup';

const formList: FormItemProps[] = [
  {
    type: 'select',
    label: 'IDO Type:',
    name: 'crowdFundingType',
    initialValue: 'Sell at the set price',
    required: true,
    childrenProps: {
      disabled: true,
      list: [{ title: 'Sell at the set price', value: 'Sell at the set price' }],
    },
  },
  {
    type: 'select',
    label: 'Token Unsold:',
    name: 'isBurnRestToken',
    initialValue: '0',
    required: true,
    childrenProps: {
      list: [
        { title: 'Return', value: '0' },
        { title: 'Burn', value: '1' },
      ],
    },
  },
  {
    type: 'inlineField',
    label: 'Sale Price:',
    required: true,
    inlineFieldList: [
      {
        type: 'inputNumber',
        name: 'preSalePrice',
        rules: [{ required: true, message: 'sds' }],
        childrenProps: {
          precision: 8,
          min: 0,
          className: 'flex-grow',
          controls: false,
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
    label: 'Supply:',
    required: true,
    inlineFieldList: [
      {
        type: 'inputNumber',
        name: 'crowdFundingIssueAmount',
        rules: [{ required: true, message: '' }],
        childrenProps: {
          precision: 0,
          min: 0,
          className: 'flex-grow',
          controls: false,
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
    label: 'Purchase Quantity:',
    // name: 'auantity',
    required: true,
    inlineFieldList: [
      {
        type: 'inputNumber',
        name: 'minSubscription',
        rules: [
          (form: any) => ({
            validator: (_, value) => minSubscriptionValidator(form, value),
          }),
        ],
        childrenProps: {
          precision: 0,
          min: 1,
          controls: false,
          style: {
            flexGrow: 1,
          },
        },
      },
      {
        type: 'pureText',
        childrenProps: {
          text: 'ELF To ',
          style: {
            flex: 'none',
            margin: '0 8px',
          },
        },
      },
      {
        type: 'inputNumber',
        name: 'maxSubscription',
        rules: [
          (form: any) => ({
            validator: (_, value) => maxSubscriptionValidator(form, value),
          }),
        ],
        childrenProps: {
          precision: 0,
          min: 1,
          controls: false,
          style: {
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
    label: 'IDO Starts At:',
    name: 'startTime',
    childrenProps: {
      showTime: true,
    },
  },
  {
    type: 'datePicker',
    label: 'IDO Ends At:',
    name: 'endTime',
    childrenProps: {
      disabled: true,
      showTime: true,
    },
  },
  {
    type: 'datePicker',
    label: 'Token Distribution Time:',
    name: 'tokenReleaseTime',
    childrenProps: {
      disabled: true,
      showTime: true,
    },
  },
  {
    type: 'group',
    label: 'Enable Whitelist:',
    name: 'isEnableWhitelist',
    initialValue: true,
    className: 'form-item-width-437',
    required: true,
    childrenProps: {
      radioList: [
        { value: true, children: 'Enable' },
        { value: false, children: 'Disable' },
      ],
    },
  },
];

const formWhitelist: FormItemProps[] = [
  {
    type: 'textArea',
    label: 'Whitelist Tasks:',
    name: 'whitelistId',
    rules: [
      {
        required: true,
        message: ' Whitelisting is enabled, whitelisting tasks cannot be empty, please enter an accessible link',
      },
    ],
    childrenProps: {
      maxLength: 20,
    },
  },
];

const IDOInfo: React.FC<CreateStepPorps> = ({ onNext }) => {
  const [form] = Form.useForm();
  const [showWhitelist, setShowWhiteList] = useState();
  const [panel, setPannel] = useLocalStorage(storages.ProjectPanel, {});

  const onFinish = useCallback(
    (values: any) => {
      console.log('values', values);
      setPannel(values);
      // onNext();
    },
    [onNext, setPannel],
  );

  const onValuesChange = (changedValues: any, allValues: any) => {
    console.log('changeValues', changedValues);
    console.log('allValues', allValues);
    const { isEnableWhitelist } = changedValues;

    isEnableWhitelist !== undefined && setShowWhiteList(isEnableWhitelist);
  };

  return (
    <div className="form-page">
      <Form
        form={form}
        layout="vertical"
        name="IDO"
        initialValues={{}}
        scrollToFirstError
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        requiredMark={CustomMark}>
        {FormFields(formList)}
        {showWhitelist && FormFields(formWhitelist)}
        <Form.Item>
          <Button htmlType="submit">提交</Button>
          {/* <ButtonGroup /> */}
        </Form.Item>
      </Form>
    </div>
  );
};
export default IDOInfo;
