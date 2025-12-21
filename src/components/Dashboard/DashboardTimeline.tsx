import React, { useState } from "react";
import { Card, Tag, Typography, Space, List, Button, Tabs } from "antd";
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
  onRescueClick?: (id: string, reports: any[]) => void; // For navigating to map with reports
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
  const [activeTab, setActiveTab] = useState("reports");

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

  const statusMapVietnamese: Record<string, string> = {
    pending: "Chờ xử lý",
    assigned: "Đã gán",
    resolved: "Đã giải quyết",
    in_progress: "Đang xử lý",
    success: "Thành công",
    cancelled: "Đã hủy",
    approved: "Đã duyệt",
    rejected: "Từ chối",
  };

  // Render Reports Tab
  const renderReportsTab = () => (
    <List
      dataSource={recentReports.slice(0, 10)}
      renderItem={(report, index) => (
        <div
          key={report.id}
          style={{
            position: "relative",
            paddingLeft: "32px",
            paddingBottom:
              index === recentReports.slice(0, 10).length - 1 ? "0" : "20px",
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
              border: "2px solid #ff6b35",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              zIndex: 2,
            }}
          >
            <FileTextOutlined style={{ color: "#ff6b35" }} />
          </div>

          {/* Timeline line */}
          {index !== recentReports.slice(0, 10).length - 1 && (
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
              borderRadius: "8px",
              padding: "12px",
              cursor: onReportClick ? "pointer" : "default",
              transition: "background-color 0.2s",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              if (onReportClick) {
                e.currentTarget.style.backgroundColor =
                  "rgba(249, 115, 22, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => {
              if (onReportClick) {
                onReportClick(report.id);
              }
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
                    color={getStatusColor(report.status)}
                    icon={getStatusIcon(report.status)}
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {statusMapVietnamese[report.status] || report.status}
                  </Tag>
                </div>
                <Text
                  strong
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    marginBottom: "4px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {report.title}
                </Text>
                {report.urgency_level && (
                  <Tag
                    color={
                      report.urgency_level === "critical"
                        ? "red"
                        : report.urgency_level === "high"
                        ? "orange"
                        : report.urgency_level === "medium"
                        ? "yellow"
                        : "green"
                    }
                    style={{
                      fontSize: "0.7rem",
                      margin: 0,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {report.urgency_level?.toUpperCase()}
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
                {dayjs(report.date_created).fromNow()}
              </Text>
              {onShowReport && (
                <Button
                  type="link"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowReport(report.id);
                  }}
                  style={{
                    padding: "0 8px",
                    height: "auto",
                    fontSize: "0.75rem",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Xem
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );

  // Render Rescues Tab
  const renderRescuesTab = () => (
    <List
      dataSource={recentRescues.slice(0, 10)}
      renderItem={(rescue, index) => (
        <div
          key={rescue.id}
          style={{
            position: "relative",
            paddingLeft: "32px",
            paddingBottom:
              index === recentRescues.slice(0, 10).length - 1 ? "0" : "20px",
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
              border: "2px solid #3b82f6",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              zIndex: 2,
            }}
          >
            <SafetyOutlined style={{ color: "#3b82f6" }} />
          </div>

          {/* Timeline line */}
          {index !== recentRescues.slice(0, 10).length - 1 && (
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
              borderRadius: "8px",
              padding: "12px",
              cursor: onRescueClick ? "pointer" : "default",
              transition: "background-color 0.2s",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              if (onRescueClick) {
                e.currentTarget.style.backgroundColor =
                  "rgba(59, 130, 246, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => {
              if (onRescueClick && rescue.reports) {
                onRescueClick(rescue.id, rescue.reports);
              }
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
                    color={getStatusColor(rescue.status)}
                    icon={getStatusIcon(rescue.status)}
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {statusMapVietnamese[rescue.status] || rescue.status}
                  </Tag>
                </div>
                <Text
                  strong
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    marginBottom: "4px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {rescue.title}
                </Text>
                {rescue.reports && rescue.reports.length > 0 && (
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "0.7rem",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {rescue.reports.length} report(s)
                  </Text>
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
                {dayjs(rescue.date_created).fromNow()}
              </Text>
              {onShowRescue && (
                <Button
                  type="link"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowRescue(rescue.id);
                  }}
                  style={{
                    padding: "0 8px",
                    height: "auto",
                    fontSize: "0.75rem",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Xem
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );

  // Render Adoptions Tab
  const renderAdoptionsTab = () => (
    <List
      dataSource={recentAdoptions.slice(0, 10)}
      renderItem={(adoption, index) => (
        <div
          key={adoption.id}
          style={{
            position: "relative",
            paddingLeft: "32px",
            paddingBottom:
              index === recentAdoptions.slice(0, 10).length - 1 ? "0" : "20px",
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
              border: "2px solid #8b5cf6",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              zIndex: 2,
            }}
          >
            <HeartOutlined style={{ color: "#8b5cf6" }} />
          </div>

          {/* Timeline line */}
          {index !== recentAdoptions.slice(0, 10).length - 1 && (
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
              borderRadius: "8px",
              padding: "12px",
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
                    color={getStatusColor(adoption.status)}
                    icon={getStatusIcon(adoption.status)}
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {statusMapVietnamese[adoption.status] || adoption.status}
                  </Tag>
                </div>
                <Text
                  strong
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    marginBottom: "4px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {adoption.pet_id?.name
                    ? `Adoption application for ${adoption.pet_id.name}`
                    : "Adoption Application"}
                </Text>
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
                {dayjs(adoption.date_created).fromNow()}
              </Text>
              {onShowAdoption && (
                <Button
                  type="link"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowAdoption(adoption.id);
                  }}
                  style={{
                    padding: "0 8px",
                    height: "auto",
                    fontSize: "0.75rem",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Xem
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );

  const tabItems = [
    {
      key: "reports",
      label: (
        <span>
          <FileTextOutlined /> Báo cáo ({recentReports.length})
        </span>
      ),
      children: renderReportsTab(),
    },
    {
      key: "rescues",
      label: (
        <span>
          <SafetyOutlined /> Cứu hộ ({recentRescues.length})
        </span>
      ),
      children: renderRescuesTab(),
    },
    {
      key: "adoptions",
      label: (
        <span>
          <HeartOutlined /> Nhận nuôi ({recentAdoptions.length})
        </span>
      ),
      children: renderAdoptionsTab(),
    },
  ];

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
        height: "100%",
      }}
      bodyStyle={{
        padding: "0",
        maxHeight: "500px",
        overflowY: "auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ padding: "0 16px" }}
      />
    </Card>
  );
};
