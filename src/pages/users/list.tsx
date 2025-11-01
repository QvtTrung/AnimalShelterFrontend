import React, { useState, useEffect } from "react";
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
import { CrudSort, HttpError } from "@refinedev/core";
import { Table, Space, Tag, Input, Select, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { IUser } from "../../interfaces";

// Debounce hook
function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export const UserList: React.FC = () => {
  // useTable provides tableProps + setFilters + setSorters
  const { tableProps, setFilters, setSorters } = useTable<IUser>({
    syncWithLocation: true,
    pagination: {
      mode: "server",
      pageSize: 10,
      currentPage: 1,
    },
  });

  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();

  // Debounced search
  const debouncedSearch = useDebounce(searchValue, 500);

  // Apply filters (name debounced; other filters immediate via setFilters)
  useEffect(() => {
    setFilters((prev = []) => {
      // remove old email and name filters
      const withoutEmailName = prev.filter(
        (f: any) =>
          f.field !== "email" &&
          f.field !== "first_name" &&
          f.field !== "last_name"
      );

      const newFilters: any[] = [...withoutEmailName];

      if (debouncedSearch.trim()) {
        // Add filters for email, first_name, and last_name
        newFilters.push({
          field: "email",
          operator: "contains",
          value: debouncedSearch.trim(),
        });
        newFilters.push({
          field: "first_name",
          operator: "contains",
          value: debouncedSearch.trim(),
        });
        newFilters.push({
          field: "last_name",
          operator: "contains",
          value: debouncedSearch.trim(),
        });
      }

      // keep other existing filters (status/role) managed by handlers
      return newFilters;
    });
  }, [debouncedSearch, setFilters]);

  // Handlers for status/role (update filters immediately)
  const handleStatusChange = (val?: string) => {
    setStatus(val);
    setFilters((prev = []) => {
      const withoutStatus = prev.filter((f: any) => f.field !== "status");
      if (!val) return withoutStatus;
      return [
        ...withoutStatus,
        { field: "status", operator: "eq", value: val },
      ];
    });
  };

  const handleRoleChange = (val?: string) => {
    setRole(val);
    setFilters((prev = []) => {
      const withoutRole = prev.filter((f: any) => f.field !== "role");
      if (!val) return withoutRole;
      return [...withoutRole, { field: "role", operator: "eq", value: val }];
    });
  };

  // Table change -> handle sorting and filters
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // Handle sorting
    const sortArr = Array.isArray(sorter) ? sorter : [sorter];
    const validSorters: CrudSort[] = sortArr
      .filter((s) => s && s.field && s.order)
      .map((s) => ({
        field: s.field as string,
        order: s.order === "ascend" ? "asc" : "desc",
      }));

    setSorters(validSorters);

    // Handle filters
    const newFilters: any[] = [];

    // Process email filter
    if (filters.email && filters.email.length > 0) {
      newFilters.push({
        field: "email",
        operator: "contains",
        value: filters.email[0],
      });
    }

    // Process first_name filter
    if (filters.first_name && filters.first_name.length > 0) {
      newFilters.push({
        field: "first_name",
        operator: "contains",
        value: filters.first_name[0],
      });
    }

    // Process last_name filter
    if (filters.last_name && filters.last_name.length > 0) {
      newFilters.push({
        field: "last_name",
        operator: "contains",
        value: filters.last_name[0],
      });
    }

    // Process role filter
    if (filters.role && filters.role.length > 0) {
      newFilters.push({
        field: "role",
        operator: "eq",
        value: filters.role[0],
      });
    }

    // Process status filter
    if (filters.status && filters.status.length > 0) {
      newFilters.push({
        field: "status",
        operator: "eq",
        value: filters.status[0],
      });
    }

    setFilters(newFilters);
  };

  return (
    <List headerButtons={<CreateButton type="primary" />}>
      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by email, first name, or last name"
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: 300 }}
        />

        <Select
          placeholder="Status"
          allowClear
          style={{ width: 160 }}
          value={status}
          onChange={(v) => handleStatusChange(v as string | undefined)}
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />

        <Select
          placeholder="Role"
          allowClear
          style={{ width: 160 }}
          value={role}
          onChange={(v) => handleRoleChange(v as string | undefined)}
          options={[
            { value: "Administrator", label: "Administrator" },
            { value: "Staff", label: "Staff" },
            { value: "User", label: "User" },
          ]}
        />
      </Space>

      <Table
        {...tableProps}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{
          ...tableProps.pagination,
          position: ["bottomCenter"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      >
        <Table.Column<IUser>
          dataIndex="email"
          title="Email"
          render={(v) => <TextField value={v ?? "-"} />}
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                placeholder="Search email"
                value={props.selectedKeys[0]}
                onChange={(e) =>
                  props.setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() => props.confirm()}
                style={{ width: 188, marginBottom: 8, display: "block" }}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IUser>
          dataIndex="first_name"
          title="First Name"
          render={(v) => <TextField value={v ?? "-"} />}
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                placeholder="Search first name"
                value={props.selectedKeys[0]}
                onChange={(e) =>
                  props.setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() => props.confirm()}
                style={{ width: 188, marginBottom: 8, display: "block" }}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IUser>
          dataIndex="last_name"
          title="Last Name"
          render={(v) => <TextField value={v ?? "-"} />}
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                placeholder="Search last name"
                value={props.selectedKeys[0]}
                onChange={(e) =>
                  props.setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() => props.confirm()}
                style={{ width: 188, marginBottom: 8, display: "block" }}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IUser>
          dataIndex="phone_number"
          title="Phone Number"
          render={(v) => <TextField value={v ?? "-"} />}
        />
        <Table.Column<IUser>
          dataIndex="role"
          title="Role"
          render={(value) => {
            // If role is available, display it
            return value || "Not assigned";
          }}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: 200 }}
                placeholder="Select role"
                allowClear
                options={[
                  { value: "Administrator", label: "Administrator" },
                  { value: "Staff", label: "Staff" },
                  { value: "User", label: "User" },
                ]}
                onChange={(value) => {
                  props.setSelectedKeys(value ? [value] : []);
                  props.confirm();
                }}
                value={props.selectedKeys[0]}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IUser>
          dataIndex="status"
          title="Status"
          render={(value) => {
            let color = "default";
            if (value === "active") color = "green";
            else if (value === "inactive") color = "red";

            return <Tag color={color}>{value}</Tag>;
          }}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: 200 }}
                placeholder="Select status"
                allowClear
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                onChange={(value) => {
                  props.setSelectedKeys(value ? [value] : []);
                  props.confirm();
                }}
                value={props.selectedKeys[0]}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IUser>
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
