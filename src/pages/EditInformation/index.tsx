import { Form, message } from 'antd';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };
import './styles.less';
import '../CreateProjectOld/stylesOld.less';
import { InformationForm } from 'pages/CreateProjectOld/components/AdditionalInformation';
import { useProjectInfoByChain } from 'hooks/project';
import { useProjectById } from 'contexts/useProject/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useProjectInfo } from 'contexts/useProjectInfo';
import { useIDOContract } from 'hooks/useContract';
import { useActiveWeb3React } from 'hooks/web3';
import { unifyProjectToApi } from 'utils/project';
import { useProject } from 'contexts/useProject';
export default function EditInformation() {
  const [from] = Form.useForm();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const infoByList = useProjectById(projectId || '');
  const [infoByChain] = useProjectInfoByChain(projectId);
  const [{ idoInfo }] = useProjectInfo();
  const { account } = useActiveWeb3React();
  const idoContract = useIDOContract();
  const projectInfo = useMemo(
    () => ({ ...idoInfo, ...infoByList, ...infoByChain }),
    [idoInfo, infoByChain, infoByList],
  );
  const [loading, setLoading] = useState<boolean>();

  const [, { setProjectMap }] = useProject();

  useEffect(() => {
    if (!projectInfo?.additionalInfo) return;
    const fromValues = from.getFieldsValue();
    const isUpdate = !!Object.keys(projectInfo?.additionalInfo || {}).filter(
      (k) => projectInfo.additionalInfo[k] !== fromValues[k],
    ).length;
    isUpdate && from.setFieldsValue(projectInfo.additionalInfo);
  }, [from, projectInfo.additionalInfo]);

  // account no permission
  if (account && projectInfo && projectInfo?.creator !== account) return <Navigate to={`/project/${projectId}`} />;

  return (
    <div className="edit-information">
      <h2>Change additional project information</h2>
      <InformationForm
        form={from}
        {...layout}
        disabled={!account}
        name="information"
        autoComplete="off"
        className="vertical-form"
        onFinish={async (v) => {
          if (!account) return;
          setLoading(true);
          try {
            const req = await idoContract?.callSendMethod('UpdateAdditionalInfo', account, {
              projectId,
              additionalInfo: { data: v },
            });
            if (req.error) {
              message.error(req.error.message);
            } else {
              const project = unifyProjectToApi(projectInfo);
              setProjectMap({
                [project.projectId]: { ...project, additionalInfo: { ...v, ...project.additionalInfo } },
              });
              navigate(-1);
            }
          } catch (error) {
            console.debug(error, '=====UpdateAdditionalInfo');
          }
          setLoading(false);
        }}
        onPre={() => navigate(-1)}
        loading={loading}
      />
    </div>
  );
}
