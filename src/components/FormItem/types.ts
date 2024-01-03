import type { CascaderProps, DatePickerProps, InputProps, RadioProps, RowProps, SelectProps, UploadProps } from 'antd';
import type { PasswordProps, TextAreaProps } from 'antd/lib/input';
import type { FormTreeProps } from './components/FormTree';
import type { CommonSelectItem } from 'components/CommonSelect';

export type inputProps = {
  type: 'input';
  childrenProps?: InputProps;
};
export type passwordProps = {
  type: 'password';
  childrenProps?: PasswordProps;
};
export type textAreaProps = {
  type: 'textArea';
  childrenProps?: TextAreaProps;
};

export type groupProps = {
  type: 'group';
  childrenProps: {
    disabled?: boolean;
    radioList: RadioProps[];
  };
};

export type treeProps = {
  type: 'tree';
  childrenProps?: FormTreeProps;
};

export type selectProps = {
  type: 'select';
  childrenProps: {
    list: CommonSelectItem[];
  } & SelectProps<any>;
};

export type cityCascaderProps = {
  type: 'cityCascader';
  childrenProps?: CascaderProps<any>;
};

export type datePickerProps = {
  type: 'datePicker';
  childrenProps?: DatePickerProps;
};
export type timePickerProps = {
  type: 'timePicker';
  childrenProps?: timePickerProps;
};
export type fileUploadProps = {
  type: 'fileUpload';
  childrenProps?: UploadProps;
};

export type idCardUploadProps = {
  type: 'idCardUpload';
  childrenProps?: UploadProps;
};
export type radioInputProps = {
  type: 'radioInput';
  childrenProps?: InputProps;
};

export type rowProps = {
  type: 'row';
  childrenProps: RowProps;
};

export type searchSelectProps = {
  type: 'searchSelect';
  childrenProps: {
    list: CommonSelectItem[];
  } & SelectProps<any>;
};

export type customizeProps = {
  type: 'customize';
  children?: JSX.Element;
  childrenProps?: any;
};
