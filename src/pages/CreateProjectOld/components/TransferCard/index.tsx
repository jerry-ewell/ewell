import { Alert, Button, Col, message, Row } from 'antd';
import type BigNumber from 'bignumber.js';
import CommonLink from 'components/CommonLink';
import IconFont from 'components/IconFont';
import { Icons } from 'constants/iconfont';
import { useTokenContract } from 'hooks/useContract';
import { useActiveWeb3React } from 'hooks/web3';
import { useState } from 'react';
import { formatAddress, getExploreLink } from 'utils';
import { timesDecimals } from 'utils/calculate';
import './styles.less';
export default function TransferCard({
  transferBalance,
  pendingAddress,
  tokenSymbol,
  tokenDecimal,
  onGetBalance,
}: {
  transferBalance: BigNumber;
  pendingAddress?: string;
  tokenSymbol?: string;
  tokenDecimal?: string;
  onGetBalance: () => void;
}) {
  const [loading, setLoading] = useState<boolean>();
  const { account } = useActiveWeb3React();
  const isTransferred = transferBalance.lte(0);
  const tokenContract = useTokenContract();
  return (
    <div className="flex-column-center transfer-card">
      {isTransferred ? (
        <Alert
          message="Token transfer completed"
          type="success"
          showIcon
          icon={<IconFont type={Icons.successIcon} />}
        />
      ) : (
        <Alert
          message={`Please transfer ${transferBalance.toFixed()} ${tokenSymbol} to the contract address at:`}
          type="info"
          icon={<IconFont type={Icons.infoIcon} />}
          showIcon
        />
      )}
      <Row className="transfer-tip-row">
        <Col className="title">Contract address:</Col>
        <Col className="address">
          <CommonLink isTagA href={getExploreLink(pendingAddress ?? '', 'address')}>
            {formatAddress(pendingAddress)}
          </CommonLink>
        </Col>
      </Row>
      {!isTransferred && (
        <Button
          type="default"
          loading={loading}
          onClick={async () => {
            if (!account || loading) return;
            setLoading(true);
            const req = await tokenContract?.callSendMethod('Transfer', account, [
              pendingAddress,
              tokenSymbol,
              timesDecimals(transferBalance, tokenDecimal).toFixed(0),
            ]);
            if (req.error) {
              message.error(req.error.message);
            }
            onGetBalance();
            setLoading(false);
          }}>
          Transfer
        </Button>
      )}
    </div>
  );
}
