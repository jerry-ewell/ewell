import { Col, Empty, Input, Row, Select, SelectProps, Skeleton, Tabs } from 'antd';
import { request } from 'api';
import IconFont from 'components/IconFont';
import InfiniteList from 'components/InfiniteList';
import { ChainConstants } from 'constants/ChainConstants';
import { Icons } from 'constants/iconfont';
import { useProject } from 'contexts/useProject';
import { basicProjectView } from 'contexts/useProject/actions';
import { useMobile } from 'contexts/useStore/hooks';
import { useLockCallback } from 'hooks';
import useDebounce from 'hooks/useDebounce';
import useUrlSearchState from 'hooks/useUrlSearchState';
import { useActiveWeb3React } from 'hooks/web3';
import { useMemo } from 'react';
import { useDeepCompareEffect, useSetState } from 'react-use';
import ProjectCard from './components/ProjectCard';
import './styles.less';
const defaultActiveKey = '1';
const LOAD_NUMBER = 20;
const START_COUNT = 0;
const loaderList = Array(20).fill('');

function SelectRow({
  list,
  title,
  defaultValue,
  onChange,
}: {
  defaultValue?: any;
  title: string;
  list: { title: string; value: string }[];
  onChange?: SelectProps['onChange'];
}) {
  const isMobile = useMobile();
  return (
    <Col xs={24} sm={12} md={7} xl={7} xxl={7} className="select-col">
      {!isMobile && <div className="select-title">{title}</div>}
      <Select defaultValue={defaultValue} id={title} onChange={onChange}>
        {list?.map(({ title, value }) => {
          return (
            <Select.Option key={title} value={value}>
              {title}
            </Select.Option>
          );
        })}
      </Select>
    </Col>
  );
}
const filter = [
  { title: 'All', value: '0' },
  { title: 'Upcoming', value: '1' },
  { title: 'On-going', value: '2' },
  { title: 'Ended', value: '3' },
  { title: 'Canceled', value: '4' },
];

const sortBy = [
  { title: 'Earliest by start date', value: '0' },
  { title: 'Latest by start date', value: '1' },
  { title: 'Earliest by end date', value: '2' },
  { title: 'Latest by end date', value: '3' },
];
const defaultToolState = {
  order: '1',
  status: '0',
};
type ToolState = {
  status?: string;
  token?: string;
  order?: string;
  user?: string;
  isCanceled?: boolean;
};
export default function ProjectList() {
  const isMobile = useMobile();
  const { account } = useActiveWeb3React();
  const [{ activeKey }, setActiveKey] = useUrlSearchState();
  const [{ projectList, projectListTotal }, { dispatch }] = useProject();
  const [tool, setToolState] = useSetState<ToolState>(defaultToolState);
  const toolState = useDebounce(tool);
  const toolSearch: ToolState = useMemo(() => {
    const obj: any = { ...toolState, isCanceled: false };
    if (toolState?.status === '4') {
      obj.status = undefined;
      obj.isCanceled = true;
    } else if (toolState?.status === '0') {
      obj.isCanceled = undefined;
    }
    if (activeKey === '2') obj.user = account;
    return obj;
  }, [account, activeKey, toolState]);
  const getList = useLockCallback(
    async (add?: boolean, tool?: ToolState) => {
      const skipCount = add && projectList ? projectList.length : START_COUNT;
      const maxResultCount = skipCount + LOAD_NUMBER;
      const params: any = {
        chainId: ChainConstants.constants.CHAIN_GUID,
        skipCount: skipCount,
        maxResultCount: maxResultCount,
        ...tool,
      };
      const list = await request.project.getProjectList({ params });
      if (Array.isArray(list.items))
        dispatch(basicProjectView.setProjectList.actions(list.items, list.totalCount, add));
    },
    [dispatch, projectList],
  );
  useDeepCompareEffect(() => {
    if (activeKey === '2' && !account) return;
    getList(false, toolSearch);
  }, [toolSearch, activeKey, account]);
  const loading = !projectList;
  const list = loading ? loaderList : projectList;
  const tabItems = useMemo(() => {
    return [
      {
        key: '1',
        label: <div className="tab-title">Projects</div>,
      },
      {
        key: '2',
        label: <div className="tab-title">My projects</div>,
      },
    ];
  }, []);
  return (
    <div className="common-page project-list">
      <Tabs
        defaultActiveKey={defaultActiveKey}
        activeKey={activeKey}
        centered
        items={tabItems}
        onChange={(v) => {
          setActiveKey({ activeKey: v });
        }}
      />
      <InfiniteList
        loaded={!projectList || !projectListTotal || projectListTotal <= projectList.length}
        loadMoreData={() => getList(true, toolSearch)}
        id="project-list"
        dataLength={projectList?.length}>
        <Col span={24}>
          <Row gutter={[0, isMobile ? 15 : 24]} className="tool-row" style={{ marginLeft: 0, marginRight: 0 }}>
            <Col xs={24} md={10} xl={10} xxl={10} className="input-col">
              <Input
                allowClear
                placeholder="Please enter the token name or token symbol."
                suffix={<IconFont type={Icons.search} />}
                onChange={(v) => setToolState({ token: v.target.value })}
              />
            </Col>
            <SelectRow
              defaultValue={defaultToolState.status}
              title="Filter"
              list={filter}
              onChange={(v) => setToolState({ status: v })}
            />
            <SelectRow
              defaultValue={defaultToolState.order}
              title="Sort by"
              list={sortBy}
              onChange={(v) => setToolState({ order: v })}
            />
          </Row>
          {list && list.length ? (
            <Row gutter={[70, 0]} style={{ marginLeft: 0, marginRight: 0 }}>
              {list.map((item, k) => {
                return (
                  <Col key={k} xs={24} md={12} xl={8} xxl={8}>
                    <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
                      <ProjectCard item={item} key={k} />
                    </Skeleton>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Empty />
          )}
        </Col>
      </InfiniteList>
    </div>
  );
}
