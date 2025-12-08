import React from "react";
import { useList, useUpdate } from "@refinedev/core";
import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Typography, Select, Form } from "antd";
import { EyeOutlined, CheckOutlined } from "@ant-design/icons";
import type { INotification } from "../../interfaces";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text } = Typography;

export const NotificationList: React.FC = () => {
  const { tableProps, searchFormProps } = useTable<INotification>({
    syncWithLocation: true,
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

      if (params.type) {
        filters.push({
          field: "type",
          operator: "eq",
          value: params.type,
        });
      }

      if (params.is_read !== undefined) {
        filters.push({
          field: "is_read",
          operator: "eq",
          value: params.is_read === "true",
        });
      }

      return filters;
    },
  });

  const { mutate: markAsRead } = useUpdate();

  const handleMarkAsRead = (id: string) => {
    markAsRead({
      resource: "notifications",
      id,
      values: {
        is_read: true,
        read_at: new Date().toISOString(),
      },
      mutationMode: "optimistic",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "adoption":
        return "purple";
      case "rescue":
        return "blue";
      case "report":
        return "orange";
      case "system":
        return "green";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "adoption":
        return "Nhận nuôi";
      case "rescue":
        return "Cứu hộ";
      case "report":
        return "Báo cáo";
      case "system":
        return "Hệ thống";
      default:
        return type;
    }
  };

  return (
    <List title="Thông báo">
      <Form {...searchFormProps} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="type" label="Loại">
          <Select
            allowClear
            placeholder="Lọc theo loại"
            style={{ width: 150 }}
          >
            <Select.Option value="adoption">Nhận nuôi</Select.Option>
            <Select.Option value="rescue">Cứu hộ</Select.Option>
            <Select.Option value="report">Báo cáo</Select.Option>
            <Select.Option value="system">Hệ thống</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="is_read" label="Trạng thái">
          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            style={{ width: 150 }}
          >
            <Select.Option value="false">Chưa đọc</Select.Option>
            <Select.Option value="true">Đã đọc</Select.Option>
          </Select>
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
          dataIndex="is_read"
          title="Trạng thái"
          render={(value) => (
            <Tag color={value ? "green" : "orange"}>
              {value ? "Đã đọc" : "Chưa đọc"}
            </Tag>
          )}
          width={120}
        />
        <Table.Column
          dataIndex="type"
          title="Loại"
          render={(value) => (
            <Tag color={getTypeColor(value)}>{getTypeLabel(value)}</Tag>
          )}
          width={120}
        />
        <Table.Column
          dataIndex="title"
          title="Tiêu đề"
          render={(value, record: INotification) => (
            <div>
              <Text strong={!record.is_read}>{value}</Text>
            </div>
          )}
        />
        <Table.Column
          dataIndex="message"
          title="Nội dung"
          render={(value) => (
            <Text ellipsis={{ tooltip: value }} style={{ maxWidth: 300 }}>
              {value}
            </Text>
          )}
        />
        <Table.Column
          dataIndex="date_created"
          title="Thời gian"
          render={(value) => (
            <Text type="secondary">{dayjs(value).fromNow()}</Text>
          )}
          width={150}
        />
        <Table.Column
          title="Hành động"
          dataIndex="actions"
          render={(_, record: INotification) => (
            <Space>
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                href={`/notifications/show/${record.id}`}
              >
                Xem
              </Button>
              {!record.is_read && (
                <Button
                  type="link"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleMarkAsRead(record.id)}
                >
                  Đánh dấu đã đọc
                </Button>
              )}
            </Space>
          )}
          width={200}
        />
      </Table>
    </List>
  );
};
