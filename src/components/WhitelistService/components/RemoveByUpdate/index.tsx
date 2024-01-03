import { Form, message } from 'antd';
import { DraggerProps } from 'antd/lib/upload/Dragger';
import { useWhiteList } from '../../context/useWhiteList';
import { removeFromWhiteList } from '../../hooks/managersAction';
import { MODAL_ACTION_TYPE } from '../../types';
import { StrategyType } from '../../types/contract';
import { parseCSV } from '../../utils/parseCSV';
import { useCallback } from 'react';
import UploadFile from '../UploadFile';
import ModalFooter from '../ModalFooter';
import { useRefreshState } from 'components/WhitelistService/context/hooks';
import { messageHTML } from 'utils/aelfUtils';

interface RemoveByUpdateProps {
  whitelistId?: string;
  contract?: any;
  policyType?: StrategyType;
  draggerProps?: DraggerProps;
  // onBack: () => void;
}

export default function RemoveByUpdate({ whitelistId, contract, draggerProps }: RemoveByUpdateProps) {
  const [, { handleModalAction }] = useWhiteList();
  const [form] = Form.useForm();
  const updater = useRefreshState();
  const onFinish = useCallback(
    async (values: any) => {
      if (!whitelistId) {
        message.error('Did not get to a valid whitelist id');
        return;
      }
      // if (!contract) return message.error('no contract');
      console.log('Received values of form:', values);
      const { address } = values ?? {};
      let strArr: string[] = [];

      try {
        const parseRes = await parseCSV({
          file: address[0].originFileObj,
        });
        strArr = parseRes as string[];
      } catch (e) {
        console.error(e);
      }

      const rmList = strArr?.reduce((prev: string[], addr: string) => {
        if (addr) return [...prev, addr];
        return prev;
      }, []);
      if (!rmList?.length) {
        message.error('no valid address');
        return;
      }
      console.log(rmList, strArr, 'rmList===');
      const res = await removeFromWhiteList(
        {
          whitelistId,
          addressList: { value: rmList },
        },
        contract,
      );
      if (res?.error) return message.error(res?.error?.message || 'error');
      res?.TransactionId && messageHTML(res?.TransactionId);
      form.resetFields();
      updater();
      handleModalAction(MODAL_ACTION_TYPE.HIDE);
    },
    [contract, form, handleModalAction, updater, whitelistId],
  );
  return (
    <Form form={form} className="remove-whitelist-upload" onFinish={onFinish} autoComplete="off">
      <UploadFile {...draggerProps} />
      <ModalFooter
        onCancel={() => {
          handleModalAction(MODAL_ACTION_TYPE.HIDE);
        }}
      />
    </Form>
  );
}
