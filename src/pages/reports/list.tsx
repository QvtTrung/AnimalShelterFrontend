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
      select: "*, user_created_user.first_name, user_created_user.last_name",
    },
  });

  return (
    <List
      createButtonProps={{
        children: "Create Report",
      }}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title="Title" width={120} />
        <Table.Column dataIndex="description" title="Description" width={120} />
        <Table.Column dataIndex="species" title="Species" width={80} />
        <Table.Column dataIndex="location" title="Location" width={200} />
        <Table.Column
          dataIndex={["user_created_user", "first_name"]}
          title="Reporter"
          render={(_, record) => {
            const firstName = record?.user_created_user?.first_name || "";
            const lastName = record?.user_created_user?.last_name || "";
            return `${firstName} ${lastName}`.trim() || "N/A";
          }}
        />
        <Table.Column
          dataIndex="type"
          title="Type"
          width={100}
          render={(value) => {
            let color = "default";
            if (value === "abuse") color = "red";
            else if (value === "abandonment") color = "orange";
            else if (value === "injured_animal") color = "blue";
            else if (value === "other") color = "gray";

            return <Tag color={color}>{value}</Tag>;
          }}
        />
        <Table.Column
          dataIndex="urgency_level"
          title="Urgency"
          width={50}
          render={(value) => {
            let color = "default";
            if (value === "critical") color = "red";
            else if (value === "high") color = "orange";
            else if (value === "medium") color = "yellow";
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
          dataIndex="date_created"
          title="Created"
          width={80}
          render={(value) => new Date(value).toLocaleDateString()}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          width={80}
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
