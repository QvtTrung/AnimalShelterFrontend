import React, { useState, useEffect } from "react";
import {
  List,
  TextField,
  useTable,
  EditButton,
  ShowButton,
  CreateButton,
} from "@refinedev/antd";
import { CrudSort, HttpError } from "@refinedev/core";
import { Table, Space, Tag, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { IPet } from "../../interfaces";

// Debounce hook
function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export const PetList: React.FC = () => {
  // useTable provides tableProps + setFilters + setSorters
  const { tableProps, setFilters, setSorters } = useTable<IPet>({
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
  const [species, setSpecies] = useState<string | undefined>();
  const [size, setSize] = useState<string | undefined>();

  // Debounced search
  const debouncedSearch = useDebounce(searchValue, 500);

  // Apply filters (name debounced; other filters immediate via setFilters)
  useEffect(() => {
    setFilters((prev = []) => {
      // remove old name filter
      const withoutName = prev.filter((f: any) => f.field !== "name");

      const newFilters: any[] = [...withoutName];

      if (debouncedSearch.trim()) {
        newFilters.push({
          field: "name",
          operator: "contains",
          value: debouncedSearch.trim(),
        });
      }

      // keep other existing filters (status/species/size) managed by handlers
      return newFilters;
    });
  }, [debouncedSearch, setFilters]);

  // Handlers for status/species/size (update filters immediately)
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

  const handleSpeciesChange = (val?: string) => {
    setSpecies(val);
    setFilters((prev = []) => {
      const withoutSpecies = prev.filter((f: any) => f.field !== "species");
      if (!val) return withoutSpecies;
      return [
        ...withoutSpecies,
        { field: "species", operator: "eq", value: val },
      ];
    });
  };

  const handleSizeChange = (val?: string) => {
    setSize(val);
    setFilters((prev = []) => {
      const withoutSize = prev.filter((f: any) => f.field !== "size");
      if (!val) return withoutSize;
      return [...withoutSize, { field: "size", operator: "eq", value: val }];
    });
  };

  // Table change -> handle sorting only since pagination is handled by Refine
  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    // Handle sorting
    const sortArr = Array.isArray(sorter) ? sorter : [sorter];
    const validSorters: CrudSort[] = sortArr
      .filter((s) => s && s.field && s.order)
      .map((s) => ({
        field: s.field as string,
        order: s.order === "ascend" ? "asc" : "desc",
      }));

    setSorters(validSorters);
  };

  return (
    <List headerButtons={<CreateButton type="primary" />}>
      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name"
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: 240 }}
        />

        <Select
          placeholder="Status"
          allowClear
          style={{ width: 160 }}
          value={status}
          onChange={(v) => handleStatusChange(v as string | undefined)}
          options={[
            { value: "available", label: "Available" },
            { value: "pending", label: "Pending" },
            { value: "adopted", label: "Adopted" },
            { value: "archived", label: "Archived" },
          ]}
        />

        <Select
          placeholder="Species"
          allowClear
          style={{ width: 160 }}
          value={species}
          onChange={(v) => handleSpeciesChange(v as string | undefined)}
          options={[
            { value: "dog", label: "Dog" },
            { value: "cat", label: "Cat" },
            { value: "bird", label: "Bird" },
            { value: "other", label: "Other" },
          ]}
        />

        <Select
          placeholder="Size"
          allowClear
          style={{ width: 160 }}
          value={size}
          onChange={(v) => handleSizeChange(v as string | undefined)}
          options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ]}
        />
      </Space>

      <Table
        {...tableProps}
        rowKey="id"
        // DO NOT override onChange unless you call tableProps.onChange!
        // But we need sorting → so we wrap it
        onChange={(pagination, filters, sorter, extra) => {
          // Let Refine handle pagination & filters
          tableProps.onChange?.(pagination, filters, sorter, extra);

          // Handle sorting manually (only if needed)
          const sortArr = Array.isArray(sorter) ? sorter : [sorter];
          const validSorters: CrudSort[] = sortArr
            .filter((s) => s.field && s.order)
            .map((s) => ({
              field: s.field as string,
              order: s.order === "ascend" ? "asc" : "desc",
            }));

          if (validSorters.length > 0) {
            setSorters(validSorters);
          }
        }}
        pagination={{
          ...tableProps.pagination,
          position: ["bottomCenter"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      >
        <Table.Column<IPet>
          dataIndex="name"
          title="Name"
          render={(v) => <TextField value={v ?? "-"} />}
          sorter
        />
        <Table.Column<IPet>
          dataIndex="species"
          title="Species"
          render={(v) => <TextField value={v ?? "-"} />}
        />
        <Table.Column<IPet>
          dataIndex="age"
          title="Age"
          render={(value, record) =>
            `${value ?? "-"} ${record?.age_unit ?? ""}`
          }
          sorter
        />
        <Table.Column<IPet>
          dataIndex="size"
          title="Size"
          render={(v) => (
            <Tag
              color={v === "small" ? "green" : v === "medium" ? "blue" : "red"}
            >
              {v}
            </Tag>
          )}
        />
        <Table.Column<IPet>
          dataIndex="status"
          title="Status"
          render={(v) => {
            const colorMap: Record<string, string> = {
              available: "green",
              pending: "orange",
              adopted: "blue",
              archived: "gray",
            };
            return <Tag color={colorMap[v] || "default"}>{v}</Tag>;
          }}
        />
        <Table.Column<IPet>
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
