import {
  useGetIdentity,
  useNavigation,
  useCustom,
  useList,
} from "@refinedev/core";
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Space,
  Tag,
  Spin,
  Select,
  Alert,
} from "antd";
import "leaflet/dist/leaflet.css";
import { useState, useRef } from "react";
import L from "leaflet";
import {
  DashboardMap,
  DashboardStats,
  DashboardTimeline,
  DashboardMapHandle,
  DashboardNotifications,
} from "../components/Dashboard";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/leaflet/marker-icon-2x.png",
  iconUrl: "/images/leaflet/marker-icon.png",
  shadowUrl: "/images/leaflet/marker-shadow.png",
});

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  const { data: user } = useGetIdentity({});
  const { show } = useNavigation();
  const [timeRange, setTimeRange] = useState("week");
  const mapRef = useRef<DashboardMapHandle>(null);

  // Fetch recent notifications
  const notificationsResult = useList({
    resource: "notifications",
    pagination: {
      pageSize: 5,
    },
    sorters: [
      {
        field: "date_created",
        order: "desc",
      },
    ],
  });

  const recentNotifications = notificationsResult?.result?.data || [];

  // Fetch dashboard analytics using useCustom hook
  const customResult = useCustom({
    url: "/dashboard/analytics",
    method: "get",
  });

  const isLoading = customResult?.query?.isLoading;
  const isError = customResult?.query?.isError;

  // Extract the actual data from the response
  // The response structure is: query.data (from React Query) -> { data: { status, message, data: actualData } }
  // So we need to go: query.data.data.data to get the actual analytics data
  const responseWrapper = customResult?.query?.data;
  const analytics = responseWrapper?.data?.data || responseWrapper?.data;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large">
          <div style={{ padding: "50px" }} />
        </Spin>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Lỗi Tải Bảng Điều khiển"
          description={
            <>
              Không thể tải dữ liệu bảng điều khiển. Vui lòng thử làm mới trang.
              <br />
              <small>Debug: {JSON.stringify(customResult?.query?.data)}</small>
            </>
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Ensure analytics has the expected structure
  if (!analytics.stats || !analytics.map || !analytics.recent) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Dữ liệu Bảng Điều khiển Không Đầy Đủ"
          description={
            <>
              Cấu trúc dữ liệu bảng điều khiển không đầy đủ.
              <br />
              <small>Received: {JSON.stringify(analytics)}</small>
            </>
          }
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 24px 0" }}>
      <Row gutter={[16, 16]}>
        {/* Header Section */}
        <Col xs={24}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <Title
              level={2}
              style={{ margin: 0, fontFamily: "Inter, sans-serif" }}
            >
              Tổng quan
            </Title>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 150 }}
              options={[
                { value: "today", label: "Hôm nay" },
                { value: "week", label: "Tuần qua" },
                { value: "month", label: "Tháng qua" },
                { value: "year", label: "Năm qua" },
              ]}
            />
          </div>
        </Col>

        {/* Stats Cards */}
        <Col xs={24}>
          <DashboardStats
            stats={
              analytics.stats || {
                reports: { total: 0, pending: 0, assigned: 0, resolved: 0 },
                rescues: { total: 0, in_progress: 0, success: 0, cancelled: 0 },
                adoptions: {
                  total: 0,
                  pending: 0,
                  confirming: 0,
                  confirmed: 0,
                  completed: 0,
                  cancelled: 0,
                },
                pets: { total: 0, available: 0, adopted: 0 },
              }
            }
          />
        </Col>

        {/* Map and Timeline Row */}
        <Col xs={24} lg={14}>
          <DashboardMap
            ref={mapRef}
            pendingReports={analytics.map?.pendingReports || []}
            allRescues={
              analytics.map?.allRescues ||
              analytics.map?.inProgressRescues ||
              []
            }
            onShowReport={(id) => show("reports", id)}
            onShowRescue={(id) => show("rescues", id)}
          />
        </Col>

        <Col xs={24} lg={10}>
          <DashboardTimeline
            recentReports={analytics.recent?.reports || []}
            recentRescues={analytics.recent?.rescues || []}
            recentAdoptions={analytics.recent?.adoptions || []}
            onShowReport={(id) => show("reports", id)}
            onShowRescue={(id) => show("rescues", id)}
            onShowAdoption={(id) => show("adoptions", id)}
            onReportClick={(id) => mapRef.current?.flyToReport(id)}
            onRescueClick={(id, reports) =>
              mapRef.current?.flyToRescue(id, reports)
            }
          />
        </Col>

        {/* Notifications Section */}
        <Col xs={24}>
          <DashboardNotifications notifications={recentNotifications} />
        </Col>

        {/* User Info Section */}
        <Col xs={24}>
          <Card
            style={{
              borderRadius: "1rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              backgroundColor: "inherit",
            }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  size={64}
                  src={user?.avatar}
                  style={{ marginRight: 16 }}
                >
                  {user?.first_name?.charAt(0) ||
                    user?.email?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div>
                  <Title
                    level={3}
                    style={{ margin: 0, fontFamily: "Inter, sans-serif" }}
                  >
                    {user?.first_name} {user?.last_name}
                  </Title>
                  <Text
                    type="secondary"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {user?.email}
                  </Text>
                </div>
              </div>
              <div>
                <Space wrap>
                  <Tag color="blue" style={{ fontFamily: "Inter, sans-serif" }}>
                    Vai trò: {user?.role || "Người dùng"}
                  </Tag>
                  <Tag
                    color={user?.status === "active" ? "green" : "red"}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Trạng thái: {user?.status || "Không rõ"}
                  </Tag>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
