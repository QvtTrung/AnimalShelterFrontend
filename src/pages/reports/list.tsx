import React, { useState, useEffect } from "react";
import { List, useTable, EditButton, ShowButton } from "@refinedev/antd";
import { CrudSort } from "@refinedev/core";
import { Table, Space, Tag, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { IReport } from "../../interfaces";

// Debounce hook
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export const ReportList = () => {
  const { tableProps, setFilters, setSorters } = useTable<IReport>({
    syncWithLocation: true,
    pagination: {
      mode: "server",
      pageSize: 10,
      currentPage: 1,
    },
    meta: {
      select: "*, user_created_user.first_name, user_created_user.last_name",
    },
  });

  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [urgency, setUrgency] = useState<string | undefined>();

  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    setFilters((prev = []) => {
      const withoutTitle = prev.filter((f: any) => f.field !== "title");
      const newFilters: any[] = [...withoutTitle];
      if (debouncedSearch.trim()) {
        newFilters.push({
          field: "title",
          operator: "contains",
          value: debouncedSearch.trim(),
        });
      }
      return newFilters;
    });
  }, [debouncedSearch, setFilters]);

  const handleStatusChange = (val?: string) => {
    setStatus(val);
    setFilters((prev = []) => {
      const without = prev.filter((f: any) => f.field !== "status");
      const newF: any[] = [...without];
      if (val) newF.push({ field: "status", operator: "eq", value: val });
      return newF;
    });
  };

  const handleTypeChange = (val?: string) => {
    setType(val);
    setFilters((prev = []) => {
      const without = prev.filter((f: any) => f.field !== "type");
      const newF: any[] = [...without];
      if (val) newF.push({ field: "type", operator: "eq", value: val });
      return newF;
    });
  };

  const handleUrgencyChange = (val?: string) => {
    setUrgency(val);
    setFilters((prev = []) => {
      const without = prev.filter((f: any) => f.field !== "urgency_level");
      const newF: any[] = [...without];
      if (val)
        newF.push({ field: "urgency_level", operator: "eq", value: val });
      return newF;
    });
  };

  const handleTableChange = (_p: any, _f: any, sorter: any) => {
    const arr = Array.isArray(sorter) ? sorter : [sorter];
    const valid: CrudSort[] = arr
      .filter((s) => s && s.field && s.order)
      .map((s) => ({
        field: s.field as string,
        order: s.order === "ascend" ? "asc" : "desc",
      }));
    setSorters(valid);
  };

  // Status mapping
  const statusMap: Record<string, string> = {
    pending: "Chờ xử lý",
    assigned: "Đã gán",
    resolved: "Đã giải quyết",
  };

  // Type mapping
  const typeMap: Record<string, string> = {
    abuse: "Bị ngược đãi",
    abandonment: "Bị bỏ rơi",
    injured_animal: "Động vật bị thương",
    other: "Khác",
  };

  // Urgency mapping
  const urgencyMap: Record<string, string> = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
    critical: "Nghiêm trọng",
  };

  return (
    <List title="Báo cáo" createButtonProps={{ children: "Tạo báo cáo" }}>
      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm theo tiêu đề"
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: 240 }}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 160 }}
          value={status}
          onChange={handleStatusChange}
          options={[
            { value: "pending", label: "Chờ xử lý" },
            { value: "assigned", label: "Đã gán" },
            { value: "resolved", label: "Đã giải quyết" },
          ]}
        />
        <Select
          placeholder="Loại"
          allowClear
          style={{ width: 160 }}
          value={type}
          onChange={handleTypeChange}
          options={[
            { value: "abuse", label: "Bị ngược đãi" },
            { value: "abandonment", label: "Bị bỏ rơi" },
            { value: "injured_animal", label: "Động vật bị thương" },
            { value: "other", label: "Khác" },
          ]}
        />
        <Select
          placeholder="Mức độ khẩn cấp"
          allowClear
          style={{ width: 160 }}
          value={urgency}
          onChange={handleUrgencyChange}
          options={[
            { value: "low", label: "Thấp" },
            { value: "medium", label: "Trung bình" },
            { value: "high", label: "Cao" },
            { value: "critical", label: "Nghiêm trọng" },
          ]}
        />
      </Space>

      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          ...tableProps.pagination,
          position: ["bottomCenter"],
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
        onChange={(p, f, s, e) => {
          tableProps.onChange?.(p, f, s, e);
          handleTableChange(p, f, s);
        }}
        scroll={{ x: 1000 }}
        style={{ tableLayout: "fixed" }}
      >
        {/* TITLE */}
        <Table.Column
          title="Tiêu đề"
          dataIndex="title"
          width={150}
          sorter
          ellipsis={{ showTitle: false }}
          render={(value) => (
            <div
              title={value}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </div>
          )}
        />

        {/* DESCRIPTION */}
        <Table.Column
          title="Mô tả"
          dataIndex="description"
          width={200}
          ellipsis={{ showTitle: false }}
          render={(value) => (
            <div
              title={value}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {value || "-"}
            </div>
          )}
        />

        {/* SPECIES */}
        <Table.Column title="Loài" dataIndex="species" width={100} sorter />

        {/* LOCATION */}
        <Table.Column
          title="Vị trí"
          dataIndex="location"
          width={150}
          ellipsis={{ showTitle: false }}
          sorter
          render={(value) => (
            <div
              title={value}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {value || "-"}
            </div>
          )}
        />

        {/* TYPE */}
        <Table.Column
          title="Loại"
          align="center"
          dataIndex="type"
          width={120}
          sorter
          render={(value) => {
            const colors: Record<string, string> = {
              abuse: "red",
              abandonment: "orange",
              injured_animal: "blue",
              other: "gray",
            };
            return (
              <Tag color={colors[value] || "default"}>
                {typeMap[value] || value}
              </Tag>
            );
          }}
        />

        {/* URGENCY */}
        <Table.Column
          align="center"
          title="Mức độ khẩn cấp"
          dataIndex="urgency_level"
          width={100}
          sorter
          render={(value) => {
            const colors: Record<string, string> = {
              critical: "red",
              high: "orange",
              medium: "yellow",
              low: "green",
            };
            return (
              <Tag color={colors[value] || "default"}>
                {urgencyMap[value] || value}
              </Tag>
            );
          }}
        />

        {/* STATUS */}
        <Table.Column
          align="center"
          title="Trạng thái"
          dataIndex="status"
          width={100}
          sorter
          render={(value) => {
            const colors: Record<string, string> = {
              pending: "orange",
              assigned: "blue",
              resolved: "green",
            };
            return (
              <Tag color={colors[value] || "default"}>
                {statusMap[value] || value}
              </Tag>
            );
          }}
        />

        {/* CREATED */}
        <Table.Column
          title="Ngày tạo"
          dataIndex="date_created"
          width={120}
          sorter
          render={(value) => new Date(value).toLocaleDateString()}
        />

        {/* ACTIONS */}
        <Table.Column
          title="Hành động"
          width={100}
          render={(_, record: any) => (
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
