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

import type { IPet } from "../../interfaces";

export const PetList = () => {
  const { tableProps } = useTable<IPet>();

  return (
    <List
      createButtonProps={{
        children: "Create Pet",
      }}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="species" title="Species" />
        <Table.Column
          dataIndex="age"
          title="Age"
          render={(value, record: IPet) => `${value} ${record.age_unit}`}
        />
        <Table.Column
          dataIndex="size"
          title="Size"
          render={(value) => (
            <Tag
              color={
                value === "small"
                  ? "green"
                  : value === "medium"
                  ? "blue"
                  : "red"
              }
            >
              {value}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value) => {
            let color = "default";
            if (value === "available") color = "green";
            else if (value === "pending") color = "orange";
            else if (value === "adopted") color = "blue";
            else if (value === "archived") color = "gray";

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
