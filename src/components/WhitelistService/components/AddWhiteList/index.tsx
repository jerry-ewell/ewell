import { Form, message } from 'antd';
import { addToWhiteList } from '../../hooks/managersAction';
import { AddRmWhiteProps, ADD_RM_TYPE, MODAL_ACTION_TYPE } from '../../types';
import { StrategyType } from '../../types/contract';
import { useCallback, useState } from 'react';
import { useWhiteList } from '../../context/useWhiteList';
import UploadFile from '../UploadFile';
import { parseCSV } from '../../utils/parseCSV';
import CommonModal from '../CommonModal';
import { USER_ADDRESS_REG } from '../../utils/reg';
import TagSelect from '../TagSelect';
import TextArea from 'antd/lib/input/TextArea';
import ModalFooter from '../ModalFooter';
import { messageHTML } from 'utils/aelfUtils';
import { useRefreshState } from 'components/WhitelistService/context/hooks';

interface AddWhiteListProps extends AddRmWhiteProps {
  addType?: ADD_RM_TYPE;
  contract?: any;
}

export default function AddWhiteList({ addType, whiteListModal, draggerProps }: AddWhiteListProps) {
  const [{ whitelistId, tagInfoList, contract, whitelistInfo }, { handleModalAction }] = useWhiteList();
  const [loading, setLoading] = useState<boolean>();
  const [form] = Form.useForm();
  const updater = useRefreshState();
  const onFinish = useCallback(
    async (values: any) => {
      try {
        console.log('Received values of form:parseRes ', values);

        if (!whitelistId) {
          message.error('Did not get to a valid whitelist id');
          return;
        }
        if (!contract) {
          message.error('Did not get to a valid contract');
          return;
        }
        const { address, tagId } = values ?? {};
        let strArr: string[] = [];
        if (typeof address === 'string') {
          strArr = address?.split(',');
        } else {
          const parseRes = await parseCSV({
            file: address[0].originFileObj,
          });

          strArr = parseRes as string[];
        }

        const addressList = strArr?.reduce((prev: string[], addr: string) => {
          if (addr && !prev.includes(addr)) return [...prev, addr];
          return prev;
        }, []);
        if (!addressList?.length) {
          message.error('no valid address');
          return;
        }
        if (addressList?.length > 100) return message.error('Up to 100 addresses at a time');
        setLoading(true);
        const res = await addToWhiteList(
          {
            whitelistId: whitelistId ?? '',
            extraInfoIdList: {
              value: [
                {
                  addressList: {
                    value: addressList,
                  },
                  id: tagId,
                },
              ],
            },
          },
          contract,
        );
        console.log(res, 'addToWhiteList===');
        setLoading(false);
        if (res?.error) return message.error(res?.error?.message || 'error');
        res?.TransactionId && messageHTML(res?.TransactionId);
        form.resetFields();
        handleModalAction(MODAL_ACTION_TYPE.HIDE);
        updater();
      } catch (e) {
        console.error(e, 'AddWhiteList onFinish');
        message.error('Submission Failed');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contract, form, handleModalAction, whitelistId],
  );

  console.log(whiteListModal, tagInfoList, 'whiteListModal===');
  return (
    <CommonModal
      leftElement={false}
      {...whiteListModal}
      onCancel={(e) => {
        handleModalAction(MODAL_ACTION_TYPE.HIDE);
        whiteListModal?.onCancel?.(e);
      }}>
      <Form form={form} className="add-white-modal" name="add_white_modal" onFinish={onFinish} autoComplete="off">
        {/* {whitelistInfo?.strategyType === StrategyType.Price && (
          <div className="pricing-policy-tag">
            <Form.Item name="tagId" label="标签" rules={[{ required: true, message: 'Missing tag' }]}>
              <Select className="add-whitelist-tag" options={tagInfoList ?? []} />
            </Form.Item>
          </div>
        )} */}

        {whitelistInfo?.strategyType === StrategyType.Price && (
          <div className="pricing-policy-tag">
            <TagSelect />
          </div>
        )}
        {(!addType || addType === ADD_RM_TYPE.Alone) && (
          <Form.Item name="address" label="" rules={[{ required: true, pattern: USER_ADDRESS_REG }]}>
            <TextArea
              style={{ resize: 'none' }}
              placeholder="Please enter addresses (max 100 addresses each time, separated with “,”)"
              className="add-whitelist-input add-whitelist-address"
            />
          </Form.Item>
        )}
        {(!addType || addType === ADD_RM_TYPE.Batch) && (
          <Form.Item label="">
            <UploadFile {...draggerProps} />
          </Form.Item>
        )}
        <ModalFooter
          onCancel={() => {
            handleModalAction(MODAL_ACTION_TYPE.HIDE);
          }}
          loading={loading}
        />
      </Form>
    </CommonModal>
  );
}
