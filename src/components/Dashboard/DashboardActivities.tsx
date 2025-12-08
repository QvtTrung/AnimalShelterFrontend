import React, { useEffect, useState } from "react";
import { Card, Tag, Typography, Space, List, Spin, Empty } from "antd";
import {
  ClockCircleOutlined,
  UserAddOutlined,
  FileTextOutlined,
  SafetyOutlined,
  HeartOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCustom } from "@refinedev/core";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

interface ActivityLog {
  id: string;
  action: string;
  actor_name?: string;
  target_type?: string;
  target_id?: string;
  description: string;
  date_created: string;
}

interface DashboardActivitiesProps {
  limit?: number;
}

export const DashboardActivities: React.FC<DashboardActivitiesProps> = ({
  limit = 15,
}) => {
  const { query } = useCustom<ActivityLog[]>({
    url: `${import.meta.env.VITE_API_URL}/activities/recent`,
    method: "get",
    config: {
      query: {
        limit,
      },
    },
  });

  const { data, isLoading } = query;

  // Handle the response structure: { status, message, data: [...activities] }
  let activities: ActivityLog[] = [];
  if (data) {
    // Backend sends: { data: { status, message, data: [...activities] } }
    // So we need: data.data.data or just data.data if it's already unwrapped
    const responseData = (data as any).data || data;
    if (Array.isArray(responseData)) {
      activities = responseData;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      activities = responseData.data;
    }
  }

  const getActionIcon = (action: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      user_registered: <UserAddOutlined style={{ color: "#3b82f6" }} />,
      report_created: <FileTextOutlined style={{ color: "#f59e0b" }} />,
      adoption_requested: <HeartOutlined style={{ color: "#10b981" }} />,
      report_claimed: <SafetyOutlined style={{ color: "#8b5cf6" }} />,
      rescue_status_updated: <SyncOutlined style={{ color: "#06b6d4" }} />,
      adoption_status_updated: <SyncOutlined style={{ color: "#ec4899" }} />,
    };
    return iconMap[action] || <ClockCircleOutlined />;
  };

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

  const getActionLabel = (action: string) => {
    const labelMap: Record<string, string> = {
      user_registered: "New User",
      report_created: "New Report",
      adoption_requested: "Adoption Request",
      report_claimed: "Report Claimed",
      rescue_status_updated: "Rescue Updated",
      adoption_status_updated: "Adoption Updated",
    };
    return labelMap[action] || action.replace(/_/g, " ");
  };

  const getTargetLink = (targetType?: string, targetId?: string) => {
    if (!targetType || !targetId) return null;

    const routes: Record<string, string> = {
      user: "/users/show",
      report: "/reports/show",
      adoption: "/adoptions/show",
      rescue: "/rescues/show",
      pet: "/pets/show",
    };

    const route = routes[targetType];
    return route ? `${route}/${targetId}` : null;
  };

  if (isLoading) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!Array.isArray(activities) || activities.length === 0) {
    return (
      <Card>
        <Empty description="No recent activities" />
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <ClockCircleOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Recent Activities
          </Title>
        </Space>
      }
      extra={<a href="/activities">View All</a>}
    >
      <List
        dataSource={activities}
        renderItem={(activity: ActivityLog) => {
          const targetLink = getTargetLink(
            activity.target_type,
            activity.target_id
          );

          return (
            <div
              key={activity.id}
              style={{
                position: "relative",
                paddingLeft: "40px",
                paddingBottom: "20px",
                borderLeft: "2px solid #e5e7eb",
              }}
            >
              {/* Timeline dot */}
              <div
                style={{
                  position: "absolute",
                  left: "-10px",
                  top: "0",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  border: "2px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getActionIcon(activity.action)}
              </div>

              {/* Content */}
              <div style={{ paddingTop: "2px" }}>
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                  <Space wrap>
                    <Tag color={getActionColor(activity.action)}>
                      {getActionLabel(activity.action)}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {dayjs(activity.date_created).fromNow()}
                    </Text>
                  </Space>

                  <Text strong style={{ fontSize: "14px" }}>
                    {activity.actor_name || "System"}
                  </Text>

                  <Text style={{ fontSize: "13px", color: "#6b7280" }}>
                    {activity.description}
                  </Text>

                  {targetLink && (
                    <a href={targetLink} style={{ fontSize: "12px" }}>
                      View {activity.target_type} →
                    </a>
                  )}
                </Space>
              </div>
            </div>
          );
        }}
      />
    </Card>
  );
};

export default DashboardActivities;
