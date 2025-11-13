import { useGetIdentity, useNavigation, useCustom } from "@refinedev/core";
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

  // Fetch dashboard analytics using useCustom hook
  const customResult = useCustom({
    url: "/dashboard/analytics",
    method: "get",
  });

  console.log("Full useCustom result:", customResult);
  console.log("Query data:", customResult?.query?.data);
  console.log("Query isLoading:", customResult?.query?.isLoading);
  console.log("Query isError:", customResult?.query?.isError);

  const isLoading = customResult?.query?.isLoading;
  const isError = customResult?.query?.isError;

  // Extract the actual data from the response
  // The response structure is: query.data (from React Query) -> { data: { status, message, data: actualData } }
  // So we need to go: query.data.data.data to get the actual analytics data
  const responseWrapper = customResult?.query?.data;
  const analytics = responseWrapper?.data?.data || responseWrapper?.data;

  console.log("Response wrapper:", responseWrapper);
  console.log("Analytics data:", analytics);

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
          message="Error Loading Dashboard"
          description={
            <>
              Failed to load dashboard data. Please try refreshing the page.
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
          message="Incomplete Dashboard Data"
          description={
            <>
              The dashboard data structure is incomplete.
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
              Overview
            </Title>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 150 }}
              options={[
                { value: "today", label: "Today" },
                { value: "week", label: "Last Week" },
                { value: "month", label: "Last Month" },
                { value: "year", label: "Last Year" },
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
            inProgressRescues={analytics.map?.inProgressRescues || []}
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
            onRescueClick={(id) => mapRef.current?.flyToRescue(id)}
          />
        </Col>

        {/* User Info Section */}
        <Col xs={24}>
          <Card
            style={{
              borderRadius: "1rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
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
                    Role: {user?.role || "User"}
                  </Tag>
                  <Tag
                    color={user?.status === "active" ? "green" : "red"}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Status: {user?.status || "Unknown"}
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
