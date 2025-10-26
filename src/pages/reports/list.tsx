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

import type { IReport } from "../../interfaces";

export const ReportList = () => {
  const { tableProps } = useTable<IReport>({
    meta: {
      select: "*, reporter_user.first_name, reporter_user.last_name"
    }
  });

  return (
    <List
      createButtonProps={{
        children: "Create Report",
      }}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column dataIndex="species" title="Species" />
        <Table.Column 
          dataIndex={["reporter_user", "first_name"]} 
          title="Reporter First Name" 
        />
        <Table.Column 
          dataIndex={["reporter_user", "last_name"]} 
          title="Reporter Last Name" 
        />
        <Table.Column
          dataIndex="type"
          title="Type"
        />
        <Table.Column
          dataIndex="urgency_level"
          title="Urgency Level"
          render={(value) => {
            let color = "default";
            if (value === "high") color = "red";
            else if (value === "medium") color = "orange";
            else if (value === "low") color = "green";

            return <Tag color={color}>{value}</Tag>;
          }}
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value) => {
            let color = "default";
            if (value === "pending") color = "orange";
            else if (value === "assigned") color = "blue";
            else if (value === "resolved") color = "green";

            return <Tag color={color}>{value}</Tag>;
          }}
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