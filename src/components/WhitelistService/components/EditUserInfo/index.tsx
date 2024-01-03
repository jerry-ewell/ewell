import { Form, Input } from 'antd';
import { ModalWhiteListProps, ProjectWhiteListItem } from '../../types';
import { StrategyType } from '../../types/contract';
import CommonModal from '../CommonModal';
import ModalFooter from '../ModalFooter';
import TagSelect from '../TagSelect';
import './styled.less';

const { Item: FormItem } = Form;
const { TextArea } = Input;
interface EditUserInfoProps extends ModalWhiteListProps {
  editInfo?: ProjectWhiteListItem;
  loading?: boolean;
  strategyType?: StrategyType;
  onFinish?: (v: any) => any;
}

export default function EditUserInfo({ strategyType, editInfo, onFinish, loading, ...props }: EditUserInfoProps) {
  return (
    <CommonModal width={600} {...props} title={'Edit Information'} closable={false} leftElement={false}>
      <Form
        initialValues={{
          tagId: editInfo?.tagInfo?.tagHash ?? '',
          address: editInfo?.address ?? '',
        }}
        layout="vertical"
        className="edit-white-modal"
        name="edit_white_modal"
        onFinish={onFinish}
        autoComplete="off">
        <FormItem label="Address" name="address">
          <TextArea style={{ resize: 'none' }} />
        </FormItem>
        {strategyType === StrategyType.Price && <TagSelect className="tool-whitelist-tag" />}
        <ModalFooter onCancel={props?.onCancel} loading={loading} />
      </Form>
    </CommonModal>
  );
}
