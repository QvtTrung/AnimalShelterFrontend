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
  DateField,
} from "@refinedev/antd";
import { useMany, CrudSort } from "@refinedev/core";

import {
  Table,
  Space,
  Tag,
  Form,
  Select,
  Input,
  Avatar,
  Badge,
  DatePicker,
  Button,
  InputNumber,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { IRescue } from "../../interfaces";

const { RangePicker } = DatePicker;

// Debounce hook
function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export const RescueList = () => {
  // useTable provides tableProps + setFilters + setSorters
  const { tableProps, setFilters, setSorters } = useTable<IRescue>({
    syncWithLocation: true,
    pagination: {
      mode: "server",
      pageSize: 10,
      currentPage: 1,
    },
    sorters: {
      initial: [
        {
          field: "date_created",
          order: "desc",
        },
      ],
    },
  });

  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[any, any] | undefined>();
  const [minParticipants, setMinParticipants] = useState<number | undefined>();
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>();

  // Debounced search
  const debouncedSearch = useDebounce(searchValue, 500);

  // Get user IDs from all rescues to fetch user details
  const participantIds =
    tableProps?.dataSource
      ?.flatMap(
        (rescue: IRescue) => rescue.participants?.map((p) => p.users_id) || []
      )
      .filter(
        (id: any, index: number, arr: any[]) => arr.indexOf(id) === index
      ) || [];

  // Get report IDs from all rescues to fetch report details
  const reportIds =
    tableProps?.dataSource
      ?.flatMap(
        (rescue: IRescue) => rescue.reports?.map((r) => r.reports_id) || []
      )
      .filter(
        (id: any, index: number, arr: any[]) => arr.indexOf(id) === index
      ) || [];

  // Fetch user details
  const {
    result: { data: userData },
  } = useMany({
    resource: "users",
    ids: participantIds,
    queryOptions: {
      enabled: participantIds.length > 0,
    },
  });

  // Fetch report details
  const {
    result: { data: reportData },
  } = useMany({
    resource: "reports",
    ids: reportIds,
    queryOptions: {
      enabled: reportIds.length > 0,
    },
  });

  // Apply filters (name debounced only)
  useEffect(() => {
    setFilters((prev = []) => {
      // remove old name filter
      const withoutName = prev.filter((f: any) => f.field !== "title");

      const newFilters: any[] = [...withoutName];

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

  // Handlers for status/date range/participants (update filters immediately)
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

  const handleDateRangeChange = (dates: [any, any] | null) => {
    if (dates) {
      const [start, end] = dates;
      setDateRange([start, end]);
      setFilters((prev = []) => {
        const without = prev.filter((f: any) => f.field !== "date_created");
        return [
          ...without,
          {
            field: "date_created",
            operator: "gte",
            value: start.format("YYYY-MM-DD"),
          },
          {
            field: "date_created",
            operator: "lte",
            value: end.format("YYYY-MM-DD"),
          },
        ];
      });
    } else {
      setDateRange(undefined);
      setFilters((prev = []) =>
        prev.filter((f: any) => f.field !== "date_created")
      );
    }
  };

  const handleMinParticipantsChange = (val?: number | null) => {
    const v = val ?? undefined;
    setMinParticipants(v);
    setFilters((prev = []) => {
      const without = prev.filter(
        (f: any) =>
          !(f.field === "required_participants" && f.operator === "gte")
      );
      if (v === undefined) return without;
      return [
        ...without,
        { field: "required_participants", operator: "gte", value: v },
      ];
    });
  };

  const handleMaxParticipantsChange = (val?: number | null) => {
    const v = val ?? undefined;
    setMaxParticipants(v);
    setFilters((prev = []) => {
      const without = prev.filter(
        (f: any) =>
          !(f.field === "required_participants" && f.operator === "lte")
      );
      if (v === undefined) return without;
      return [
        ...without,
        { field: "required_participants", operator: "lte", value: v },
      ];
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

    if (validSorters.length) setSorters(validSorters);
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "blue";
      case "in_progress":
        return "orange";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Helper function to get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <List headerButtons={<CreateButton type="primary" />}>
      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by title"
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: 240 }}
        />

        <RangePicker
          placeholder={["Start date", "End date"]}
          format="DD/MM/YYYY"
          style={{ width: 240 }}
          onChange={handleDateRangeChange}
        />

        <Select
          placeholder="Status"
          allowClear
          style={{ width: 160 }}
          value={status}
          onChange={handleStatusChange}
          options={[
            { label: "Planned", value: "planned" },
            { label: "In Progress", value: "in_progress" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
        />

        <InputNumber
          placeholder="Min participants"
          min={1}
          style={{ width: 150 }}
          value={minParticipants}
          onChange={handleMinParticipantsChange}
        />

        <InputNumber
          placeholder="Max participants"
          min={1}
          style={{ width: 150 }}
          value={maxParticipants}
          onChange={handleMaxParticipantsChange}
        />
      </Space>

      <Table
        {...tableProps}
        rowKey="id"
        dataSource={tableProps.dataSource ?? []}
        // DO NOT override onChange unless you call tableProps.onChange!
        // But we need sorting → so we wrap it
        onChange={(pagination, filters, sorter, extra) => {
          // Let Refine handle pagination & filters
          tableProps.onChange?.(pagination, filters, sorter, extra);
          handleTableChange(pagination, filters, sorter);
        }}
        pagination={{
          ...tableProps.pagination,
          position: ["bottomCenter"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 1200 }}
        style={{ tableLayout: "fixed" }}
      >
        <Table.Column
          dataIndex="title"
          title="Title"
          width={200}
          sorter
          ellipsis={{ showTitle: false }}
          render={(value, record: IRescue) => (
            <div title={value}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                {value}
              </div>
              <Tag color={getStatusColor(record.status || "")}>
                {record.status?.toUpperCase()}
              </Tag>
            </div>
          )}
        />
        <Table.Column
          dataIndex="required_participants"
          title="Participants"
          render={(value, record: IRescue) => {
            const participantsCount = (record as any).participants?.length || 0;
            const requiredCount = value || 0;
            return (
              <Badge
                count={`${participantsCount}/${requiredCount}`}
                style={{
                  backgroundColor:
                    participantsCount >= requiredCount ? "#52c41a" : "#faad14",
                }}
              >
                <Avatar icon={<UserOutlined />} />
              </Badge>
            );
          }}
        />
        <Table.Column
          dataIndex="reports"
          title="Reports"
          render={(value: any[], record: IRescue) => {
            const reportsCount = value?.length || 0;
            if (reportsCount === 0) return "-";

            // Get the highest urgency level among reports
            let highestUrgency = "low";
            value?.forEach((reportItem: any) => {
              const report = reportData?.find(
                (r: any) => r.id === reportItem.reports_id
              );
              if (report) {
                if (report.urgency_level === "high") highestUrgency = "high";
                else if (
                  report.urgency_level === "medium" &&
                  highestUrgency !== "high"
                )
                  highestUrgency = "medium";
              }
            });

            return (
              <Space>
                <Badge
                  count={reportsCount}
                  style={{ backgroundColor: getUrgencyColor(highestUrgency) }}
                >
                  <Avatar icon={<FileTextOutlined />} />
                </Badge>
                <Tag color={getUrgencyColor(highestUrgency)}>
                  {highestUrgency.toUpperCase()}
                </Tag>
              </Space>
            );
          }}
        />
        <Table.Column
          dataIndex="description"
          title="Description"
          width={250}
          ellipsis={{ showTitle: false }}
          render={(value) => (
            <div title={value} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value || '-'}
            </div>
          )}
        />
        <Table.Column
          dataIndex="date_created"
          title="Date Created"
          sorter
          render={(value) => <DateField value={value} format="DD/MM/YYYY" />}
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
