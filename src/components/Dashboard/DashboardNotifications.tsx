import React from "react";
import { Card, Table, Tag, Typography, Button, Space } from "antd";
import { BellOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

interface DashboardNotificationsProps {
  notifications: any[];
}

export const DashboardNotifications: React.FC<DashboardNotificationsProps> = ({
  notifications,
}) => {
  const { list, show } = useNavigation();

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

  const columns: ColumnsType<any> = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>{getTypeLabel(type)}</Tag>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: any) => (
        <Text strong={!record.is_read}>{title}</Text>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (message: string) => <Text type="secondary">{message}</Text>,
    },
    {
      title: "Thời gian",
      dataIndex: "date_created",
      key: "date_created",
      width: 120,
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: "0.875rem" }}>
          {dayjs(date).fromNow()}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_read",
      key: "is_read",
      width: 100,
      align: "center",
      render: (isRead: boolean) =>
        !isRead ? (
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              margin: "0 auto",
            }}
          />
        ) : null,
    },
  ];

  return (
    <Card
      title={
        <Space>
          <BellOutlined style={{ color: "#8b5cf6", fontSize: "1.25rem" }} />
          <Title
            level={4}
            style={{ margin: 0, fontFamily: "Inter, sans-serif" }}
          >
            Thông báo gần đây
          </Title>
        </Space>
      }
      style={{
        borderRadius: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        height: "100%",
      }}
      bodyStyle={{
        padding: "16px",
      }}
      extra={
        <Button
          type="link"
          onClick={() => list("notifications")}
          style={{ padding: 0 }}
        >
          Xem tất cả
        </Button>
      }
    >
      <Table
        dataSource={notifications}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="small"
        onRow={(record) => ({
          onClick: () => show("notifications", record.id),
          style: {
            cursor: "pointer",
            backgroundColor: record.is_read ? "transparent" : "#f0f9ff",
          },
        })}
        locale={{ emptyText: "Không có thông báo mới" }}
      />
    </Card>
  );
};
