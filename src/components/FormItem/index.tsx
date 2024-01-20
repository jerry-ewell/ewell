import {
  // Input,
  Form,
  Select,
  FormItemProps as antFormItemProps,
  // DatePicker,
  TimePicker,
  Flex,
  InputNumber,
  // Upload,
  // Button,
} from 'antd';
import { Input, DatePickerForPC, DatePickerForMobile } from 'aelf-design';
import { memo } from 'react';
import CityCascader from './components/CityCascader';
import FormGroup from './components/FormGroup';
import FormRadioAndInput from './components/FormRadioAndInput';
import FormTree from './components/FormTree';
import Upload from '../Upload';
import {
  cityCascaderProps,
  datePickerProps,
  rowProps,
  fileUploadProps,
  groupProps,
  idCardUploadProps,
  inputProps,
  passwordProps,
  radioInputProps,
  selectProps,
  textAreaProps,
  treeProps,
  searchSelectProps,
  timePickerProps,
  customizeProps,
  inputNumberProps,
  inlineFieldProps,
  FieldsGroupProps,
  pureTextProps,
} from './types';
export type FormItemProps = (
  | inputProps
  | textAreaProps
  | groupProps
  | treeProps
  | passwordProps
  | selectProps
  | cityCascaderProps
  | datePickerProps
  | fileUploadProps
  | idCardUploadProps
  | radioInputProps
  | rowProps
  | searchSelectProps
  | timePickerProps
  | customizeProps
  | inputNumberProps
  | inlineFieldProps
  | pureTextProps
  | FieldsGroupProps
) &
  antFormItemProps;

function getChildren(type: FormItemProps['type'], childrenProps: FormItemProps['childrenProps']) {
  switch (type) {
    case 'input':
      return <Input {...(childrenProps as inputProps['childrenProps'])} />;
    case 'group':
      return <FormGroup {...(childrenProps as groupProps['childrenProps'])} />;
    case 'textArea':
      return <Input.TextArea {...(childrenProps as textAreaProps['childrenProps'])} />;
    case 'tree':
      return <FormTree {...(childrenProps as treeProps['childrenProps'])} />;
    case 'password':
      return <Input.Password autoComplete="new-password" {...(childrenProps as passwordProps['childrenProps'])} />;
    case 'select': {
      const { list, ...props } = childrenProps as selectProps['childrenProps'];
      return (
        <Select {...props}>
          {list?.map(({ title, value }) => {
            return (
              <Select.Option key={value || title} value={value || title}>
                {title}
              </Select.Option>
            );
          })}
        </Select>
      );
    }
    case 'cityCascader':
      return <CityCascader {...(childrenProps as any)} />;
    case 'datePicker': {
      const customFormat = (value) => `${value.format('YYYY-MM-DD HH:mm:ss [UTC] Z')}`;
      return (
        <DatePickerForPC
          style={{ width: '100%' }}
          format={customFormat}
          {...(childrenProps as datePickerProps['childrenProps'])}
        />
      );
    }
    case 'timePicker':
      return <TimePicker style={{ width: '100%' }} {...(childrenProps as timePickerProps['childrenProps'])} />;
    case 'radioInput':
      return <FormRadioAndInput {...(childrenProps as radioInputProps['childrenProps'])} />;
    case 'row':
      return <div {...(childrenProps as rowProps['childrenProps'])} />;
    case 'fileUpload':
      return <Upload {...(childrenProps as fileUploadProps['childrenProps'])}></Upload>;
    case 'searchSelect': {
      const { list, ...props } = childrenProps as selectProps['childrenProps'];
      return (
        <Select {...props} showSearch>
          {list?.map(({ title, value }) => {
            return (
              <Select.Option key={value || title} value={value || title}>
                {title}
              </Select.Option>
            );
          })}
        </Select>
      );
    }
    case 'inputNumber':
      return <InputNumber {...childrenProps} />;
    case 'pureText': {
      const { text, ...props } = childrenProps;
      return <div {...props}>{text}</div>;
    }
  }
}
const FormItem = memo(({ type, childrenProps, ...props }: Omit<FormItemProps, 'inlineFieldProps'>) => {
  if (type === 'customize') return <Form.Item {...props}>{props.children}</Form.Item>;
  const children = getChildren(type, childrenProps);
  return type === 'pureText' ? <>{children}</> : <Form.Item {...props}>{children}</Form.Item>;
});

export const FormFields = (formJson: FormItemProps[]) => {
  return formJson.map((field, index) => {
    if (field.type === 'inlineField') {
      const { type, inlineFieldList, flexProps, ...props } = field;
      return (
        <Form.Item {...props} key={`${index}-${type}`}>
          <Flex align="center" {...flexProps}>
            {inlineFieldList.map((field, index) => (
              <FormItem key={index} noStyle {...field} />
            ))}
          </Flex>
        </Form.Item>
      );
    }

    if (field.type === 'fieldsGroup') {
      const { type, fieldsList, ...props } = field;
      return (
        <Form.Item {...props} key={`${index}-${type}`}>
          {fieldsList.map((field, index) => (
            <FormItem key={index} {...field} />
          ))}
        </Form.Item>
      );
    }

    return <FormItem key={index} {...field} />;
  });
};

export default FormItem;
