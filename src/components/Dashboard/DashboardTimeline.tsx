import React from "react";
import { Card, Tag, Typography, Space, List, Button } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  SafetyOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

interface DashboardTimelineProps {
  recentReports: any[];
  recentRescues: any[];
  recentAdoptions: any[];
  onShowReport?: (id: string) => void;
  onShowRescue?: (id: string) => void;
  onShowAdoption?: (id: string) => void;
  onReportClick?: (id: string) => void; // For navigating to map
  onRescueClick?: (id: string) => void; // For navigating to map
}

export const DashboardTimeline: React.FC<DashboardTimelineProps> = ({
  recentReports,
  recentRescues,
  recentAdoptions,
  onShowReport,
  onShowRescue,
  onShowAdoption,
  onReportClick,
  onRescueClick,
}) => {
  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "assigned":
      case "in_progress":
        return "blue";
      case "resolved":
      case "success":
      case "approved":
        return "green";
      case "cancelled":
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockCircleOutlined style={{ color: "#f59e0b" }} />;
      case "assigned":
      case "in_progress":
        return <ExclamationCircleOutlined style={{ color: "#3b82f6" }} />;
      case "resolved":
      case "success":
      case "approved":
        return <CheckCircleOutlined style={{ color: "#10b981" }} />;
      case "cancelled":
      case "rejected":
        return <CloseCircleOutlined style={{ color: "#ef4444" }} />;
      default:
        return <ClockCircleOutlined style={{ color: "#9ca3af" }} />;
    }
  };

  // Combine and sort all activities
  const allActivities = [
    ...recentReports.map((r) => ({
      type: "report",
      id: r.id,
      title: r.title,
      status: r.status,
      urgency_level: r.urgency_level,
      date: r.date_created,
      onClick: onReportClick, // For map navigation
      onViewClick: onShowReport, // For show page
    })),
    ...recentRescues.map((r) => ({
      type: "rescue",
      id: r.id,
      title: r.title,
      status: r.status,
      date: r.date_created,
      onClick: onRescueClick, // For map navigation
      onViewClick: onShowRescue, // For show page
    })),
    ...recentAdoptions.map((a) => ({
      type: "adoption",
      id: a.id,
      title: `Adoption Request #${a.id.substring(0, 8)}`,
      status: a.status,
      date: a.date_created,
      onClick: undefined, // Adoptions don't have map markers
      onViewClick: onShowAdoption, // For show page
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "report":
        return <FileTextOutlined style={{ color: "#ff6b35" }} />;
      case "rescue":
        return <SafetyOutlined style={{ color: "#3b82f6" }} />;
      case "adoption":
        return <HeartOutlined style={{ color: "#ec4899" }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "report":
        return "Report";
      case "rescue":
        return "Rescue";
      case "adoption":
        return "Adoption";
      default:
        return "Activity";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "report":
        return "#ff6b35";
      case "rescue":
        return "#3b82f6";
      case "adoption":
        return "#ec4899";
      default:
        return "#9ca3af";
    }
  };

  return (
    <Card
      title={
        <Space>
          <ClockCircleOutlined
            style={{ color: "#f59e0b", fontSize: "1.25rem" }}
          />
          <Title
            level={4}
            style={{ margin: 0, fontFamily: "Inter, sans-serif" }}
          >
            Timeline
          </Title>
        </Space>
      }
      style={{
        borderRadius: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "1px solid #f3f4f6",
        backgroundColor: "#ffffff",
        height: "100%",
      }}
      headStyle={{
        background: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 24px",
        fontFamily: "Inter, sans-serif",
      }}
      bodyStyle={{
        padding: "16px",
        maxHeight: "500px",
        overflowY: "auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <List
        dataSource={allActivities.slice(0, 10)}
        renderItem={(item, index) => (
          <div
            key={item.id}
            style={{
              position: "relative",
              paddingLeft: "32px",
              paddingBottom:
                index === allActivities.slice(0, 10).length - 1 ? "0" : "20px",
            }}
          >
            {/* Timeline dot */}
            <div
              style={{
                position: "absolute",
                left: "0",
                top: "4px",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                border: `2px solid ${getTypeColor(item.type)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                zIndex: 2,
              }}
            >
              {getTypeIcon(item.type)}
            </div>

            {/* Timeline line */}
            {index !== allActivities.slice(0, 10).length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: "11px",
                  top: "28px",
                  bottom: "0",
                  width: "2px",
                  backgroundColor: "#e5e7eb",
                  zIndex: 1,
                }}
              />
            )}

            {/* Content */}
            <div
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                padding: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "8px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div style={{ flex: 1, minWidth: "0" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <Tag
                      color={getTypeColor(item.type)}
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {getTypeLabel(item.type).toUpperCase()}
                    </Tag>
                    <Tag
                      color={getStatusColor(item.status)}
                      icon={getStatusIcon(item.status)}
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {item.status?.toUpperCase()}
                    </Tag>
                  </div>
                  <Text
                    strong
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      color: "#111827",
                      marginBottom: "4px",
                      fontFamily: "Inter, sans-serif",
                      cursor: item.onClick ? "pointer" : "default",
                    }}
                    onClick={() => item.onClick?.(item.id)}
                  >
                    {item.title}
                  </Text>
                  {item.type === "report" && (item as any).urgency_level && (
                    <Tag
                      color={
                        (item as any).urgency_level === "critical"
                          ? "red"
                          : (item as any).urgency_level === "high"
                          ? "orange"
                          : (item as any).urgency_level === "medium"
                          ? "yellow"
                          : "green"
                      }
                      style={{
                        fontSize: "0.7rem",
                        margin: 0,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {(item as any).urgency_level?.toUpperCase()}
                    </Tag>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  type="secondary"
                  style={{
                    fontSize: "0.75rem",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <ClockCircleOutlined style={{ marginRight: "4px" }} />
                  {dayjs(item.date).fromNow()}
                </Text>
                {item.onViewClick && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => item.onViewClick?.(item.id)}
                    style={{
                      padding: "0 8px",
                      height: "auto",
                      fontSize: "0.75rem",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    View
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      />
    </Card>
  );
};
