import { Button, Modal } from 'antd';
import './styles.less';
import closeSvg from 'assets/images/close.svg';

type TWelcomeContentProps = {
  onCancel: () => void;
  onAccept: () => void;
};
const WelcomeContent = ({ onCancel, onAccept }: TWelcomeContentProps) => {
  return (
    <div className="terms-frame">
      <div className="terms-header">
        Welcome
        <img className="terms-close" src={closeSvg} alt="" onClick={onCancel} />
      </div>
      <div className="terms-content">
        <div>By connecting your wallet and using EWELL, you agree to our Terms of Service and Privacy Policy</div>
        <div>I have read and accept the Terms of Service and Privacy Policy</div>
      </div>
      <div className="terms-footer">
        <div className="terms-btn">
          <Button onClick={onCancel} block>
            Cancel
          </Button>
        </div>
        <div className="terms-btn">
          <Button onClick={onAccept} block>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

type TShowWelcomeModalProps = {
  onCancel?: () => void;
  onAccept?: () => void;
};

export const showWelcomeModal = ({ onCancel: _onCancel, onAccept: _onAccept }: TShowWelcomeModalProps) => {
  let modal: any;
  const onCancel = () => {
    console.log('modal', modal);
    _onCancel && _onCancel();
    modal?.destroy();
  };

  const onAccept = () => {
    _onAccept && _onAccept();
    modal?.destroy();
  };

  modal = Modal.confirm({
    footer: null,
    icon: <></>,
    title: null,
    centered: true,
    className: 'welcome-modal',
    content: <WelcomeContent onCancel={onCancel} onAccept={onAccept}></WelcomeContent>,
  });
};
