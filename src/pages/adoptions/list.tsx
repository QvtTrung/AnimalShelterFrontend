import React, { useState } from "react";
import {
  List,
  TextField,
  useTable,
  EditButton,
  ShowButton,
  CreateButton,
} from "@refinedev/antd";
import { CrudSort } from "@refinedev/core";

import { Table, Space, Tag, Select } from "antd";

import type { IAdoption } from "../../interfaces";

export const AdoptionList = () => {
  const { tableProps, setFilters, setSorters } = useTable<IAdoption>({
    syncWithLocation: true,
    pagination: {
      mode: "server",
      pageSize: 10,
    },
    sorters: {
      initial: [
        {
          field: "date_created",
          order: "desc",
        },
      ],
    },
    meta: {
      fields: ["*", "pet_id.*", "user_id.*"],
    },
  });

  // Filter states
  const [status, setStatus] = useState<string | undefined>();

  // Status filter handler
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "blue";
      case "confirming":
        return "orange";
      case "confirmed":
        return "cyan";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Status mapping
  const statusMap: Record<string, string> = {
    pending: "Chờ xử lý",
    confirming: "Đang xác nhận",
    confirmed: "Đã xác nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  return (
    <List
      title="Nhận nuôi"
      createButtonProps={{
        children: "Tạo Đơn nhận nuôi",
      }}
    >
      <Space wrap style={{ marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 160 }}
          value={status}
          onChange={(v) => handleStatusChange(v as string | undefined)}
          options={[
            { value: "pending", label: "Chờ xử lý" },
            { value: "confirming", label: "Đang xác nhận" },
            { value: "confirmed", label: "Đã xác nhận" },
            { value: "completed", label: "Hoàn thành" },
            { value: "cancelled", label: "Đã hủy" },
          ]}
        />
      </Space>

      <Table
        {...tableProps}
        rowKey="id"
        onChange={(pagination, filters, sorter, extra) => {
          // Handle sorting
          const sortArr = Array.isArray(sorter) ? sorter : [sorter];
          const validSorters: CrudSort[] = sortArr
            .filter((s) => s && s.field && s.order)
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
            `${range[0]}-${range[1]} trong ${total} mục`,
        }}
      >
        <Table.Column
          dataIndex={["pet_id", "name"]}
          title="Tên thú cưng"
          render={(value, record: IAdoption) => {
            const pet =
              typeof record.pet_id === "object" ? record.pet_id : null;
            return pet?.name || "-";
          }}
        />
        <Table.Column
          dataIndex={["pet_id", "species"]}
          title="Loài"
          render={(value, record: IAdoption) => {
            const pet =
              typeof record.pet_id === "object" ? record.pet_id : null;
            return pet?.species || "-";
          }}
        />
        <Table.Column
          dataIndex={["pet_id", "status"]}
          title="Trạng thái thú cưng"
          render={(value, record: IAdoption) => {
            const pet =
              typeof record.pet_id === "object" ? record.pet_id : null;
            const status = pet?.status;
            let color = "default";
            if (status === "available") color = "green";
            else if (status === "pending") color = "orange";
            else if (status === "adopted") color = "blue";

            // Pet status mapping
            const petStatusMap: Record<string, string> = {
              available: "Có sẵn",
              pending: "Chờ xử lý",
              adopted: "Đã nhận nuôi",
              archived: "Đã lưu trữ",
            };

            return status ? (
              <Tag color={color}>{petStatusMap[status] || status}</Tag>
            ) : (
              "-"
            );
          }}
        />
        <Table.Column
          dataIndex={["user_id", "first_name"]}
          title="Người nhận nuôi"
          render={(_, record: IAdoption) => {
            const user =
              typeof record.user_id === "object" ? record.user_id : null;
            if (!user) return "-";
            return (
              `${user.first_name || ""} ${user.last_name || ""}`.trim() || "-"
            );
          }}
        />
        <Table.Column
          dataIndex={["user_id", "email"]}
          title="Email"
          render={(value, record: IAdoption) => {
            const user =
              typeof record.user_id === "object" ? record.user_id : null;
            return user?.email || "-";
          }}
        />
        <Table.Column
          dataIndex="status"
          title="Trạng thái nhận nuôi"
          render={(value) => (
            <Tag color={getStatusColor(value)}>
              {statusMap[value] || value?.toUpperCase()}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="appointment_date"
          title="Ngày hẹn"
          sorter
          render={(value) =>
            value ? new Date(value).toLocaleDateString() : "-"
          }
        />
        <Table.Column
          dataIndex="date_created"
          title="Ngày yêu cầu"
          sorter
          render={(value) =>
            value ? new Date(value).toLocaleDateString() : "-"
          }
        />
        <Table.Column
          title="Thao tác"
          dataIndex="actions"
          render={(_, record: IAdoption) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
