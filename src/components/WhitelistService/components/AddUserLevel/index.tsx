import { Col, Form, Row, Button, message, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import { addExtraInfo } from '../../hooks/managersAction';
import { useHaveTagName } from '../../hooks/useHaveTagName';
import { CustomizeAddTagFormItem } from '../../types';
import { StrategyType } from '../../types/contract';
import { USER_ADDRESS_REG } from '../../utils/reg';
import { useCallback, useMemo, useState } from 'react';
import CommonModal from '../CommonModal';
import CustomFormItem from '../CustomFormItem';
import { encodeProtoToBase64, jsonToBase64 } from '../../utils';
import priceTag from '../../types/priceTag.json';
import { messageHTML } from 'utils/aelfUtils';
interface AddUserLevelProps {
  whitelistId?: string;
  projectId?: string;
  onBack?: () => void;
  policyType?: StrategyType;
  contract?: any;
  chainId?: number;
  customizeAddTagFormItem?: CustomizeAddTagFormItem[];
}

const { Item: FormItem } = Form;
export default function AddUserLevel({
  whitelistId,
  customizeAddTagFormItem,
  projectId,
  chainId,
  policyType,
  contract,
  onBack,
}: AddUserLevelProps) {
  const [loading, setLoading] = useState<boolean>();

  const [tagName, setTagName] = useState<string>();

  const isHas = useHaveTagName(tagName);
  const onFinish = useCallback(
    async (values: any) => {
      try {
        console.log('Received values of form:', values);
        if (isHas.validateStatus === 'error' || isHas.validateStatus === 'validating') return;
        if (!whitelistId) {
          message.error('Did not get to a valid whitelist id');
          return;
        }
        if (!projectId) {
          message.error('Did not get to a valid project id');
          return;
        }
        if (!contract) {
          return message.error('no contract');
        }
        const { address, tagName } = values ?? {};
        const strArr = address?.split(',');
        if (!tagName) {
          message.error('Did not get to a valid tagName');
          return;
        }
        const addressList = strArr?.reduce((prev: string[], addr: string) => {
          if (addr) return [...prev, addr];
          return prev;
        }, []);

        if (addressList?.length > 100) return message.error('每笔最多100条');
        const tagInfo = { ...values };
        delete tagInfo.tagName;
        delete tagInfo.address;
        let tagInfoForm = '{}';

        if (policyType === StrategyType.Price) {
          tagInfoForm = encodeProtoToBase64(priceTag, 'PriceTag', tagInfo?.price);
        } else {
          tagInfoForm = jsonToBase64(tagInfo);
        }
        setLoading(true);
        const res = await addExtraInfo(
          {
            whitelistId: whitelistId ?? '',
            projectId: projectId || '',
            tagInfo: {
              tagName: tagName ?? '',
              info: tagInfoForm,
            },
            addressList: {
              value: addressList,
            },
          },
          contract,
        );
        console.log(res, 'addExtraInfo===res');
        setLoading(false);
        if (res?.error) return message.error(res?.error?.message || 'error');
        res?.TransactionId && messageHTML(res?.TransactionId);
        onBack?.();
      } catch (e: any) {
        console.error(e);
      }
    },
    [contract, isHas.validateStatus, onBack, policyType, projectId, whitelistId],
  );

  const PriceItemValid: Rule[] = useMemo(
    () => [
      { required: true, message: 'Missing price' },
      () => ({
        validator(_, value) {
          for (const key in value) {
            if (!value?.[key]) {
              return Promise.reject(new Error(`missing ${key}`));
            }
          }
          return Promise.resolve();
        },
      }),
    ],
    [],
  );
  return (
    <CommonModal title={'新增用户等级'} leftElement={false} closable={false}>
      <Form
        className="add-white-modal"
        onValuesChange={(change) => {
          if (change?.tagName) setTagName(change?.tagName);
        }}
        name="add_white_modal"
        onFinish={onFinish}
        autoComplete="off">
        <FormItem
          className="pricing-policy-tag"
          name="tagName"
          label="标签"
          rules={[{ required: true, message: 'missing tabName' }]}
          validateStatus={isHas.validateStatus}
          help={isHas.errorMsg}>
          <Input placeholder="请输入" />
        </FormItem>

        {policyType == StrategyType.Price && (
          <FormItem name="price" rules={PriceItemValid} label="售价">
            <CustomFormItem chainId={chainId} whitelistHash={whitelistId} />
          </FormItem>
        )}
        {/* TODO */}
        {customizeAddTagFormItem?.map((node, index) => (
          <FormItem {...node} key={index}>
            {node?.customizeItem}
          </FormItem>
        ))}

        <FormItem name="address" label="新增白名单用户" rules={[{ required: false, pattern: USER_ADDRESS_REG }]}>
          <Input
            placeholder="请输入用户地址（以“,”作为用户地址之间的分隔符)"
            className="add-whitelist-input add-whitelist-address"
          />
        </FormItem>

        <Row justify="space-between" className="form-button-wrapper">
          <Col>
            <Button
              type="default"
              onClick={() => {
                onBack?.();
              }}>
              返回
            </Button>
          </Col>
          <Col>
            <Button loading={loading} type="primary" htmlType="submit">
              submit
            </Button>
          </Col>
        </Row>
      </Form>
    </CommonModal>
  );
}
