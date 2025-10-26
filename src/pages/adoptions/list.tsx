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

import type { IAdoption } from "../../interfaces";

export const AdoptionList = () => {
  const { tableProps } = useTable<IAdoption>({
    meta: {
      select: "*, pets.name, user.first_name, user.last_name"
    }
  });

  return (
    <List
      createButtonProps={{
        children: "Create Adoption",
      }}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column 
          dataIndex={["pets", "name"]} 
          title="Pet Name" 
        />
        <Table.Column 
          dataIndex={["user", "first_name"]} 
          title="Adopter First Name" 
        />
        <Table.Column 
          dataIndex={["user", "last_name"]} 
          title="Adopter Last Name" 
        />
        <Table.Column
          dataIndex="approval_date"
          title="Approval Date"
          render={(value) => value ? new Date(value).toLocaleDateString() : "-"}
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