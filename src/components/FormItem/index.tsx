import { Input, Form, Select, FormItemProps as antFormItemProps, DatePicker, TimePicker } from 'antd';
import { memo } from 'react';
import CityCascader from './components/CityCascader';
import FormGroup from './components/FormGroup';
import FormRadioAndInput from './components/FormRadioAndInput';
import FormTree from './components/FormTree';
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
    case 'datePicker':
      return <DatePicker style={{ width: '100%' }} {...(childrenProps as datePickerProps['childrenProps'])} />;
    case 'timePicker':
      return <TimePicker style={{ width: '100%' }} {...(childrenProps as timePickerProps['childrenProps'])} />;
    case 'radioInput':
      return <FormRadioAndInput {...(childrenProps as radioInputProps['childrenProps'])} />;
    case 'row':
      return <div {...(childrenProps as rowProps['childrenProps'])} />;
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
  }
}
const FormItem = memo(({ type, childrenProps, ...props }: FormItemProps) => {
  if (type === 'customize') return <Form.Item {...props}>{props.children}</Form.Item>;
  const children = getChildren(type, childrenProps);
  return <Form.Item {...props}>{children}</Form.Item>;
});
export default FormItem;
