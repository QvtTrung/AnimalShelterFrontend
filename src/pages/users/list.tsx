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

import type { IUser } from "../../interfaces";

export const UserList = () => {
  const { tableProps } = useTable<IUser>();

  return (
    <List
      createButtonProps={{
        children: "Create User",
      }}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="first_name" title="First Name" />
        <Table.Column dataIndex="last_name" title="Last Name" />
        <Table.Column dataIndex="phone_number" title="Phone Number" />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value) => {
            let color = "default";
            if (value === "active") color = "green";
            else if (value === "inactive") color = "red";

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