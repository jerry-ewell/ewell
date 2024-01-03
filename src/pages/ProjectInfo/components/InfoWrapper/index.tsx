import IDOInfoPage from 'components/IDOInfoPage';
import { useProjectInfo } from 'contexts/useProjectInfo';
import SymbolInfo from 'components/SymbolInfo';
import { useMobile } from 'contexts/useStore/hooks';
import ActionCard from '../ActionCard';

export default function InfoWrapper() {
  const [{ idoInfo }] = useProjectInfo();

  const isMobile = useMobile();

  return (
    <>
      <div className="flex-1 project-left">
        <SymbolInfo symbolInfo={idoInfo} />
        {!isMobile && <IDOInfoPage idoInfo={idoInfo} />}
      </div>
      {isMobile && (
        <>
          <ActionCard />
          <IDOInfoPage idoInfo={idoInfo} />
        </>
      )}
    </>
  );
}
