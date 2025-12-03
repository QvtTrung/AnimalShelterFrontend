import React, { useEffect } from "react";
import { useShow, useUpdate, useNavigation } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Typography, Tag, Descriptions, Button, Space, Card } from "antd";
import { CheckOutlined, ArrowRightOutlined } from "@ant-design/icons";
import type { INotification } from "../../interfaces";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export const NotificationShow: React.FC = () => {
  const { query: queryResult } = useShow<INotification>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { mutate: markAsRead } = useUpdate();
  const { show } = useNavigation();

  // Automatically mark as read when viewing
  useEffect(() => {
    if (record && !record.is_read) {
      markAsRead({
        resource: "notifications",
        id: record.id,
        values: {
          is_read: true,
          read_at: new Date().toISOString(),
        },
        mutationMode: "optimistic",
      });
    }
  }, [record]);

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

  const handleGoToRelated = () => {
    if (record?.related_id && record?.type) {
      const resourceMap: Record<string, string> = {
        adoption: "adoptions",
        rescue: "rescues",
        report: "reports",
      };

      const resource = resourceMap[record.type];
      if (resource) {
        show(resource, record.related_id);
      }
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Loại">
          <Tag color={getTypeColor(record?.type || "")}>
            {getTypeLabel(record?.type || "")}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={record?.is_read ? "green" : "orange"}>
            {record?.is_read ? "Đã đọc" : "Chưa đọc"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tiêu đề">
          <Text strong>{record?.title}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Nội dung">
          <Card
            size="small"
            style={{ backgroundColor: "#fafafa", border: "none" }}
          >
            <Text>{record?.message}</Text>
          </Card>
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian tạo">
          {record?.date_created
            ? dayjs(record.date_created).format("DD/MM/YYYY HH:mm:ss")
            : "N/A"}
          <Text type="secondary" style={{ marginLeft: 8 }}>
            ({dayjs(record?.date_created).fromNow()})
          </Text>
        </Descriptions.Item>
        {record?.is_read && record?.read_at && (
          <Descriptions.Item label="Thời gian đọc">
            {dayjs(record.read_at).format("DD/MM/YYYY HH:mm:ss")}
            <Text type="secondary" style={{ marginLeft: 8 }}>
              ({dayjs(record.read_at).fromNow()})
            </Text>
          </Descriptions.Item>
        )}
      </Descriptions>

      {record?.related_id && (
        <Space style={{ marginTop: 16 }}>
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={handleGoToRelated}
          >
            Đi tới {getTypeLabel(record.type || "")} liên quan
          </Button>
        </Space>
      )}
    </Show>
  );
};
