import { Typography, Tag, Collapse, Table, message } from "antd";
import { Request } from "../lib/apiRequest";

export async function objectVersions(props) {
  const { token, handleFile, setAnswers } = props;
  const res = await Request({
    url: `http://tisdev/tiscode/cgi/tiscode.sh/onetis/rtb/request/taskobject?wspace=${token.wspace}&mode=object&object=${token.object}`,
  });

  if (res?.type === "error") {
    setAnswers([{ error: res?.message }]);
  } else {
    if (res?.all_object?.length === 1) {
      const obj = res?.all_object?.[0];
      const file =
        "/rtb/" +
        token?.area?.toLowerCase() +
        "/source/" +
        obj?.pmod +
        "/" +
        obj?.object;
      setAnswers([
        {
          message: (
            <>
              <Typography.Text>
                Current version of object{" "}
                <Typography.Link onClick={() => handleFile("read", file)}>
                  {obj?.object}
                </Typography.Link>{" "}
                is {obj?.version} in RTB workspace {token?.area}
              </Typography.Text>
            </>
          ),
          response: (
            <>
              Other versions of this object are:
              <div>
                {obj?.otherVersions?.split(",")?.map((ver) => {
                  return (
                    <Typography.Link>
                      <Tag color="geekblue">{ver}</Tag>
                    </Typography.Link>
                  );
                })}
              </div>
            </>
          ),
          loaded: true,
        },
      ]);
    } else {
      const items = res?.all_object?.map((object, index) => {
        return {
          key: `${index + 1}`,
          extra: <Tag color="green">{object?.version}</Tag>,
          label: <>{object?.object}</>,
          children: (
            <>
              Other versions of this object are:
              <div>
                {object?.otherVersions?.split(",")?.map((ver) => {
                  return (
                    <Typography.Link>
                      <Tag color="geekblue">{ver}</Tag>
                    </Typography.Link>
                  );
                })}
              </div>
            </>
          ),
        };
      });
      setAnswers([
        {
          message: "Multiple objects found for the query",
          response: <Collapse items={items} />,
          loaded: true,
        },
      ]);
    }
  }
}
export async function objectViewer(props) {
  const { token, setAnswers } = props;
  const res = await Request({
    url: `http://tisdev/tiscode/cgi/tiscode.sh/onetis/rtb/request/taskobject?mode=objectviewer&object=${token.object}`,
  });

  if (res?.type === "error") {
    setAnswers([{ error: res?.message }]);
  } else {
    setAnswers([
      {
        message: (
          <>
            This is a quick view of the object branching. For detailed object
            viewer, please go to{" "}
            <a href="http://tisdev/apps/connect/rtb" target="_blank">
              RTB Search
            </a>{" "}
            in the{" "}
            <a href="http://tisdev/apps/connect" target="_blank">
              TIS Connect App
            </a>{" "}
          </>
        ),
        response: (
          <Table
            size="small"
            pagination={{ pageSize: 10 }}
            columns={[
              { key: "1", title: "Ver", dataIndex: "version", width: 54 },
              { key: "2", title: "Prev", dataIndex: "prev_version", width: 54 },
              { key: "3", title: "Area", dataIndex: "wspace_id", width: 54 },
              { key: "4", title: "Task", dataIndex: "task_num", width: 54 },
              { key: "5", title: "Stat", dataIndex: "peer_status", width: 80 },
            ]}
            dataSource={res?.object_viewer ?? []}
          />
        ),
        loaded: true,
      },
    ]);
  }
}
export async function taskList(props) {
  const { token, setAnswers } = props;
  const res = await Request({
    url: `http://tisdev/tiscode/cgi/tiscode.sh/onetis/rtb/request/taskobject?mode=task&object=${token.task}`,
  });

  if (res?.type === "error") {
    setAnswers([{ error: res?.message }]);
  } else {
    const task = res?.tasks?.[0];
    const objects = task?.all_version?.map((obj) => {
      return {
        object: obj?.object,
        version: obj?.version,
        prev_version: obj?.prev_version,
        module: obj?.module,
      };
    });
    const taskDetails = [
      { attr: <strong>Task Number</strong>, value: task?.task_num },
      { attr: <strong>Task Status</strong>, value: task?.task_status },
      { attr: <strong>Workspace</strong>, value: task?.wspace_id },
      { attr: <strong>Description</strong>, value: task?.summary },
      { attr: <strong>Manager</strong>, value: task?.manager },
      { attr: <strong>Programmers</strong>, value: task?.programmer },
    ];
    setAnswers([
      {
        message: "Task Details",
        response: (
          <>
            <Table
              columns={[
                { key: "1", dataIndex: "attr", width: 100 },
                { key: "2", dataIndex: "value" },
              ]}
              dataSource={taskDetails}
              showHeader={false}
              size="small"
            />
            <Typography.Title level={5}>
              Objects checked out in this task
            </Typography.Title>
            <Table
              columns={[
                { key: "1", title: "Object", dataIndex: "object" },
                {
                  key: "2",
                  title: "Ver",
                  dataIndex: "version",
                  width: 54,
                },
                {
                  key: "2",
                  title: "Prev",
                  dataIndex: "prev_version",
                  width: 54,
                },
                { key: "2", title: "Module", dataIndex: "module" },
              ]}
              dataSource={objects}
              size="small"
              pagination={{ pageSize: 5 }}
            />
          </>
        ),
        loaded: true,
      },
    ]);
  }
}
