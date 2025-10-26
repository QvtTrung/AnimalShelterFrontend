import {
  List,
  TextField,
  useTable,
  EditButton,
  ShowButton,
  CreateButton,
  FilterDropdown,
  useSelect,
} from "@refinedev/antd";

import { Table, Space, Tag, Form, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import type { IRescue } from "../../interfaces";

export const RescueList = () => {
  const { tableProps } = useTable<IRescue>();

  return (
    <List
      createButtonProps={{
        children: "Create Rescue",
      }}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column 
          dataIndex="required_participants" 
          title="Required Participants" 
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value) => {
            let color = "default";
            if (value === "planned") color = "blue";
            else if (value === "in_progress") color = "orange";
            else if (value === "completed") color = "green";
            else if (value === "cancelled") color = "red";

            return <Tag color={color}>{value}</Tag>;
          }}
        />
        <Table.Column
          dataIndex="date_created"
          title="Date Created"
          render={(value) => value ? new Date(value).toLocaleDateString() : "-"}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};