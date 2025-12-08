import React from "react";
import {
  List,
  useTable,
  DateField,
  TagField,
  TextField,
} from "@refinedev/antd";
import { Table, Space, Select, DatePicker, Form, Button } from "antd";
import type { BaseRecord } from "@refinedev/core";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface ActivityLog extends BaseRecord {
  id: string;
  action: string;
  actor_id?: string;
  actor_name?: string;
  target_type?: string;
  target_id?: string;
  description: string;
  details?: Record<string, any>;
  date_created: string;
}

const ActivityList: React.FC = () => {
  const { tableProps, searchFormProps, filters } = useTable<ActivityLog>({
    resource: "activities",
    sorters: {
      initial: [
        {
          field: "date_created",
          order: "desc",
        },
      ],
    },
    onSearch: (params: any) => {
      const filters: any[] = [];

      if (params.action) {
        filters.push({
          field: "action",
          operator: "eq",
          value: params.action,
        });
      }

      if (params.target_type) {
        filters.push({
          field: "target_type",
          operator: "eq",
          value: params.target_type,
        });
      }

      if (params.dateRange) {
        filters.push({
          field: "date_created",
          operator: "gte",
          value: params.dateRange[0].toISOString(),
        });
        filters.push({
          field: "date_created",
          operator: "lte",
          value: params.dateRange[1].toISOString(),
        });
      }

      return filters;
    },
  });

  const getActionColor = (action: string) => {
    const colorMap: Record<string, string> = {
      user_registered: "blue",
      report_created: "orange",
      adoption_requested: "green",
      report_claimed: "purple",
      rescue_status_updated: "cyan",
      adoption_status_updated: "magenta",
    };
    return colorMap[action] || "default";
  };

  const getTargetTypeColor = (targetType: string) => {
    const colorMap: Record<string, string> = {
      user: "blue",
      report: "orange",
      adoption: "green",
      rescue: "purple",
      pet: "cyan",
    };
    return colorMap[targetType] || "default";
  };

  return (
    <List>
      <Form {...searchFormProps} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="action" label="Action">
          <Select
            allowClear
            placeholder="Filter by action"
            style={{ width: 200 }}
          >
            <Select.Option value="user_registered">
              User Registered
            </Select.Option>
            <Select.Option value="report_created">Report Created</Select.Option>
            <Select.Option value="adoption_requested">
              Adoption Requested
            </Select.Option>
            <Select.Option value="report_claimed">Report Claimed</Select.Option>
            <Select.Option value="rescue_status_updated">
              Rescue Status Updated
            </Select.Option>
            <Select.Option value="adoption_status_updated">
              Adoption Status Updated
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="target_type" label="Target Type">
          <Select
            allowClear
            placeholder="Filter by target type"
            style={{ width: 150 }}
          >
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="report">Report</Select.Option>
            <Select.Option value="adoption">Adoption</Select.Option>
            <Select.Option value="rescue">Rescue</Select.Option>
            <Select.Option value="pet">Pet</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="dateRange" label="Date Range">
          <RangePicker />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Lọc
            </Button>
            <Button
              onClick={() => {
                searchFormProps.form?.resetFields();
                searchFormProps.form?.submit();
              }}
            >
              Xóa lọc
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="date_created"
          title="Date"
          render={(value) => (
            <DateField value={value} format="YYYY-MM-DD HH:mm:ss" />
          )}
          sorter
          defaultSortOrder="descend"
        />

        <Table.Column
          dataIndex="action"
          title="Action"
          render={(value) => (
            <TagField
              value={value.replace(/_/g, " ")}
              color={getActionColor(value)}
            />
          )}
        />

        <Table.Column
          dataIndex="actor_name"
          title="Actor"
          render={(value) => <TextField value={value || "System"} />}
        />

        <Table.Column
          dataIndex="target_type"
          title="Target Type"
          render={(value) =>
            value ? (
              <TagField value={value} color={getTargetTypeColor(value)} />
            ) : (
              "-"
            )
          }
        />

        <Table.Column dataIndex="description" title="Description" ellipsis />

        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: ActivityLog) => (
            <Space>
              <a href={`/activities/show/${record.id}`}>View Details</a>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default ActivityList;
