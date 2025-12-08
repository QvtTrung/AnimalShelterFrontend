import React from "react";
import { Show, TextField, DateField, TagField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Card, Space, Tag } from "antd";

const { Title } = Typography;

interface ActivityLog {
  id: string;
  action: string;
  actor_id?: string;
  actor_name?: string;
  target_type?: string;
  target_id?: string;
  description: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  date_created: string;
}

const ActivityShow: React.FC = () => {
  const { query } = useShow<ActivityLog>({
    resource: "activities",
  });
  const { data, isLoading } = query;
  const record = data?.data;

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

  const renderTargetLink = (targetType?: string, targetId?: string) => {
    if (!targetType || !targetId) return "-";

    const routes: Record<string, string> = {
      user: "/users/show",
      report: "/reports/show",
      adoption: "/adoptions/show",
      rescue: "/rescues/show",
      pet: "/pets/show",
    };

    const route = routes[targetType];
    return route ? (
      <a
        href={`${route}/${targetId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View {targetType} →
      </a>
    ) : (
      targetId
    );
  };

  return (
    <Show isLoading={isLoading}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Descriptions title="Activity Information" bordered column={2}>
            <Descriptions.Item label="Action" span={2}>
              <Tag color={getActionColor(record?.action || "")}>
                {record?.action?.replace(/_/g, " ").toUpperCase()}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Date">
              <DateField
                value={record?.date_created}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Descriptions.Item>

            <Descriptions.Item label="Activity ID">
              <TextField value={record?.id} copyable />
            </Descriptions.Item>

            <Descriptions.Item label="Actor">
              <TextField value={record?.actor_name || "System"} />
            </Descriptions.Item>

            <Descriptions.Item label="Actor ID">
              {record?.actor_id ? (
                <a
                  href={`/users/show/${record.actor_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TextField value={record.actor_id} copyable />
                </a>
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Description" span={2}>
              <TextField value={record?.description} />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Target Information">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Target Type">
              {record?.target_type ? (
                <Tag color={getTargetTypeColor(record.target_type)}>
                  {record.target_type.toUpperCase()}
                </Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Target ID">
              {record?.target_id ? (
                <TextField value={record.target_id} copyable />
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Link" span={2}>
              {renderTargetLink(record?.target_type, record?.target_id)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {record?.details && Object.keys(record.details).length > 0 && (
          <Card title="Additional Details">
            <Descriptions bordered column={1}>
              {Object.entries(record.details).map(([key, value]) => (
                <Descriptions.Item key={key} label={key.replace(/_/g, " ")}>
                  {typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        )}

        {(record?.ip_address || record?.user_agent) && (
          <Card title="Technical Information">
            <Descriptions bordered column={1}>
              {record?.ip_address && (
                <Descriptions.Item label="IP Address">
                  <TextField value={record.ip_address} copyable />
                </Descriptions.Item>
              )}
              {record?.user_agent && (
                <Descriptions.Item label="User Agent">
                  <TextField value={record.user_agent} />
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}
      </Space>
    </Show>
  );
};

export default ActivityShow;
