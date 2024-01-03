import React, { useState } from 'react';
import { Form, Input, Select } from 'antd';
import { usePriceToken } from '../../hooks/usePriceToken';
const { Item: FormItem } = Form;
const { Option } = Select;

interface CustomFormItemValue {
  amount?: number;
  symbol?: string;
}

interface CustomFormItemProps {
  value?: CustomFormItemValue;
  onChange?: (value: CustomFormItemValue) => void;
  chainId?: number;
  whitelistHash?: string;
}

const CustomFormItem: React.FC<CustomFormItemProps> = ({ value = {}, onChange, chainId, whitelistHash }) => {
  const [amount, setAmount] = useState(0);
  const [symbol, setSymbol] = useState<string>();
  const symbolList = usePriceToken(chainId, whitelistHash);
  const triggerChange = (changedValue: { amount?: number; symbol?: string }) => {
    onChange?.({ amount, symbol, ...value, ...changedValue });
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value || '0', 10);
    if (Number.isNaN(amount)) {
      return;
    }
    if (!('amount' in value)) {
      setAmount(newAmount);
    }
    triggerChange({ amount: newAmount });
  };

  const onSymbolChange = (newSymbol: string) => {
    if (!(' symbol' in value)) {
      setSymbol(newSymbol);
    }
    triggerChange({ symbol: newSymbol });
  };

  return (
    <>
      <FormItem label="币种">
        <Select value={value.symbol || symbol} style={{ width: 80, margin: '0 8px' }} onChange={onSymbolChange}>
          {/* <Option value="rmb">RMB</Option>
          <Option value="dollar">Dollar</Option> */}
          {symbolList?.map((token, index) => (
            <Option key={token?.symbol ?? index} value={token?.symbol}>
              {token?.symbol ?? ''}
            </Option>
          ))}
        </Select>
      </FormItem>
      <FormItem label="金额">
        <Input type="text" value={value.amount || amount} onChange={onAmountChange} />
      </FormItem>
    </>
  );
};

export default CustomFormItem;
