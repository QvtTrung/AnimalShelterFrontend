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

  return (
    <List
      createButtonProps={{
        children: "Create Adoption",
      }}
    >
      <Space wrap style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by Status"
          allowClear
          style={{ width: 160 }}
          value={status}
          onChange={(v) => handleStatusChange(v as string | undefined)}
          options={[
            { value: "pending", label: "Pending" },
            { value: "confirming", label: "Confirming" },
            { value: "confirmed", label: "Confirmed" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
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
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      >
        <Table.Column
          dataIndex={["pet_id", "name"]}
          title="Pet Name"
          render={(value, record: IAdoption) => {
            const pet =
              typeof record.pet_id === "object" ? record.pet_id : null;
            return pet?.name || "-";
          }}
        />
        <Table.Column
          dataIndex={["pet_id", "species"]}
          title="Species"
          render={(value, record: IAdoption) => {
            const pet =
              typeof record.pet_id === "object" ? record.pet_id : null;
            return pet?.species || "-";
          }}
        />
        <Table.Column
          dataIndex={["pet_id", "status"]}
          title="Pet Status"
          render={(value, record: IAdoption) => {
            const pet =
              typeof record.pet_id === "object" ? record.pet_id : null;
            const status = pet?.status;
            let color = "default";
            if (status === "available") color = "green";
            else if (status === "pending") color = "orange";
            else if (status === "adopted") color = "blue";

            return status ? <Tag color={color}>{status}</Tag> : "-";
          }}
        />
        <Table.Column
          dataIndex={["user_id", "first_name"]}
          title="Adopter"
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
          title="Adoption Status"
          render={(value) => (
            <Tag color={getStatusColor(value)}>{value?.toUpperCase()}</Tag>
          )}
        />
        <Table.Column
          dataIndex="appointment_date"
          title="Appointment"
          sorter
          render={(value) =>
            value ? new Date(value).toLocaleDateString() : "-"
          }
        />
        <Table.Column
          dataIndex="date_created"
          title="Request Date"
          sorter
          render={(value) =>
            value ? new Date(value).toLocaleDateString() : "-"
          }
        />
        <Table.Column
          title="Actions"
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
