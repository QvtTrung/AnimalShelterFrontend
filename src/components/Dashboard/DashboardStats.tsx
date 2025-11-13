import React from "react";
import { Card, Row, Col, Statistic, Space } from "antd";
import {
  FileTextOutlined,
  SafetyOutlined,
  HeartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardStatsProps {
  stats: {
    reports: {
      total: number;
      pending: number;
      assigned: number;
      resolved: number;
    };
    rescues: {
      total: number;
      in_progress: number;
      success: number;
      cancelled: number;
    };
    adoptions: {
      total: number;
      pending: number;
      confirming: number;
      confirmed: number;
      completed: number;
      cancelled: number;
    };
    pets: {
      total: number;
      available: number;
      adopted: number;
    };
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  // Mock data for charts (in production, you'd calculate this from real data)
  const reportsTrendData = [
    { day: "Wed", value: stats.reports.resolved || 45 },
    { day: "Thu", value: stats.reports.assigned || 38 },
    { day: "Fri", value: stats.reports.resolved || 42 },
    { day: "Sat", value: stats.reports.assigned || 43 },
    { day: "Sun", value: stats.reports.resolved || 49 },
    { day: "Mon", value: stats.reports.assigned || 30 },
    { day: "Tue", value: stats.reports.pending || 52 },
  ];

  const rescuesTrendData = [
    { day: "Wed", value: 48 },
    { day: "Thu", value: 42 },
    { day: "Fri", value: 45 },
    { day: "Sat", value: 44 },
    { day: "Sun", value: 51 },
    { day: "Mon", value: 32 },
    { day: "Tue", value: 47 },
  ];

  const adoptionsTrendData = [
    { day: "Wed", value: 15 },
    { day: "Thu", value: 9 },
    { day: "Fri", value: 16 },
    { day: "Sat", value: 21 },
    { day: "Sun", value: 23 },
    { day: "Mon", value: 22 },
    { day: "Tue", value: 18 },
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* Reports Card */}
      <Col xs={24} sm={24} md={8}>
        <Card
          style={{
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            height: "100%",
          }}
          bodyStyle={{ padding: "20px" }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space>
                <FileTextOutlined
                  style={{ fontSize: "1.25rem", color: "#ff6b35" }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Daily Reports
                </span>
              </Space>
              <Space>
                <Statistic
                  value={stats.reports.total}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#111827",
                    fontFamily: "Inter, sans-serif",
                  }}
                  suffix={
                    <ArrowUpOutlined
                      style={{ fontSize: "0.875rem", color: "#10b981" }}
                    />
                  }
                />
              </Space>
            </div>

            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={reportsTrendData}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  fill="url(#colorReports)"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Pending
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#ff6b35",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {stats.reports.pending}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Resolved
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#10b981",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {stats.reports.resolved}
                </div>
              </div>
            </div>
          </Space>
        </Card>
      </Col>

      {/* Rescues Card */}
      <Col xs={24} sm={24} md={8}>
        <Card
          style={{
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            height: "100%",
          }}
          bodyStyle={{ padding: "20px" }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space>
                <SafetyOutlined
                  style={{ fontSize: "1.25rem", color: "#3b82f6" }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Daily Rescues
                </span>
              </Space>
              <Space>
                <Statistic
                  value={stats.rescues.total}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#111827",
                    fontFamily: "Inter, sans-serif",
                  }}
                  suffix={
                    <ArrowUpOutlined
                      style={{ fontSize: "0.875rem", color: "#10b981" }}
                    />
                  }
                />
              </Space>
            </div>

            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={rescuesTrendData}>
                <defs>
                  <linearGradient id="colorRescues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <Bar
                  dataKey="value"
                  fill="url(#colorRescues)"
                  radius={[4, 4, 0, 0]}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
              </BarChart>
            </ResponsiveContainer>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  In Progress
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#3b82f6",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {stats.rescues.in_progress}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Success
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#10b981",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {stats.rescues.success}
                </div>
              </div>
            </div>
          </Space>
        </Card>
      </Col>

      {/* Adoptions Card */}
      <Col xs={24} sm={24} md={8}>
        <Card
          style={{
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            height: "100%",
          }}
          bodyStyle={{ padding: "20px" }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space>
                <HeartOutlined
                  style={{ fontSize: "1.25rem", color: "#ec4899" }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  New Adoptions
                </span>
              </Space>
              <Space>
                <Statistic
                  value={
                    stats.adoptions.total > 0
                      ? (
                          (stats.adoptions.completed / stats.adoptions.total) *
                          100
                        ).toFixed(2)
                      : 0
                  }
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#111827",
                    fontFamily: "Inter, sans-serif",
                  }}
                  suffix={
                    <>
                      %
                      <ArrowUpOutlined
                        style={{
                          fontSize: "0.875rem",
                          color: "#10b981",
                          marginLeft: "4px",
                        }}
                      />
                    </>
                  }
                />
              </Space>
            </div>

            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={adoptionsTrendData}>
                <defs>
                  <linearGradient
                    id="colorAdoptions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <Bar
                  dataKey="value"
                  fill="url(#colorAdoptions)"
                  radius={[4, 4, 0, 0]}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
              </BarChart>
            </ResponsiveContainer>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Pending
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#ff6b35",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {stats.adoptions.pending}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Completed
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#10b981",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {stats.adoptions.completed}
                </div>
              </div>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};
