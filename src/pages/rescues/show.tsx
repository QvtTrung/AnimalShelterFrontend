// src/pages/rescue/show.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useShow, useNavigation, useMany } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import {
  Typography,
  Tag,
  Row,
  Col,
  Card,
  Space,
  Divider,
  List,
  Avatar,
  Button,
} from "antd";
import {
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { IRescue } from "../../interfaces";
import { RescueMap } from "../../components/Map/RescueMap";

const { Title, Text } = Typography;

/* -------------------------------------------------------------------------- */
export const RescueShow = () => {
  const { query: queryResult } = useShow<IRescue>();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const { show } = useNavigation();

  // Map center and zoom are now handled in the RescueMap component

  /* --------------------------- Fetch related data -------------------------- */
  const reportIds = record?.reports?.map((r) => r.reports_id) ?? [];
  const participantIds = record?.participants?.map((p) => p.users_id) ?? [];

  const {
    result: { data: rawReportData },
  } = useMany({
    resource: "reports",
    ids: reportIds,
    queryOptions: { enabled: reportIds.length > 0 },
  });

  const {
    result: { data: userData },
  } = useMany({
    resource: "users",
    ids: participantIds,
    queryOptions: { enabled: participantIds.length > 0 },
  });

  /* ----------------------- Normalise reports (id + coordinates) ----------- */
  const reportData = useMemo(() => {
    return (
      rawReportData?.map((r: any) => ({
        ...r,
        id: r.id ?? r._id,
        coordinates: r.coordinates, // Keep original coordinates for RescueMap
      })) ?? []
    );
  }, [rawReportData]);
  console.log("Normalised report data:", reportData);

  /* ------------------------------- Helpers --------------------------------- */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "blue";
      case "in_progress":
        return "orange";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getReportDetails = (reportId: string) =>
    reportData.find((r) => r.id === reportId);

  const getUserDetails = (userId: string) =>
    userData?.find((u: any) => (u.id ?? u._id) === userId);

  /* ----------------------------------------------------------------------- */
  return (
    <Show isLoading={isLoading}>
      <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
        <Row gutter={[16, 16]}>
          {/* --------------------------- MAP ----------------------------------- */}
          <Col xs={24} lg={16}>
            <RescueMap
              reportIds={reportIds}
              reportData={reportData}
              show={show}
            />
          </Col>

          {/* ----------------------- RESCUE INFO ------------------------------ */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <FileTextOutlined />
                  <Title level={4} className="!m-0">
                    Rescue Information
                  </Title>
                </Space>
              }
              variant="outlined"
              className="h-[550px] rounded-2xl shadow-lg border border-gray-200 bg-white overflow-y-scroll"
            >
              <div className="px-2 sm:px-3 overflow-y-auto h-full">
                <Space direction="vertical" className="w-full">
                  <Space className="flex flex-wrap">
                    <Text strong>Title:</Text>
                    <Text>{record?.title}</Text>
                    <Tag color={getStatusColor(record?.status ?? "")}>
                      {record?.status?.toUpperCase()}
                    </Tag>
                  </Space>

                  <Text>
                    <strong>Description:</strong> {record?.description}
                  </Text>

                  <Text>
                    <strong>Required Participants:</strong>{" "}
                    {record?.required_participants}
                  </Text>

                  <Text>
                    <strong>Created:</strong> {record?.date_created ? new Date(record.date_created).toLocaleString() : 'N/A'}
                  </Text>

                  <Text>
                    <strong>Last Updated:</strong> {record?.date_updated ? new Date(record.date_updated).toLocaleString() : 'N/A'}
                  </Text>

                  <Divider className="my-3" />

                  <Title level={5}>Connected Reports</Title>
                  <div className="overflow-y-auto">
                    <List
                      dataSource={record?.reports ?? []}
                      className="!mt-2"
                      renderItem={(item) => {
                        // item.reports_id === the actual report ID
                        const report = reportData.find(
                          (r) => r.id === item.reports_id
                        );
                        console.log("Rendering report item:", item, report);

                        if (!report) {
                          return (
                            <List.Item>
                              <Text type="secondary">
                                Report data not loaded
                              </Text>
                            </List.Item>
                          );
                        }

                        return (
                          <List.Item
                            className="cursor-pointer hover:bg-gray-50 rounded-lg transition px-2"
                            onClick={() => show("reports", report.id)}
                          >
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  className={`${
                                    report.urgency_level === "high"
                                      ? "bg-red-500"
                                      : report.urgency_level === "medium"
                                      ? "bg-amber-500"
                                      : "bg-green-500"
                                  }`}
                                  icon={<FileTextOutlined />}
                                />
                              }
                              title={
                                <Space className="flex flex-wrap">
                                  <Text strong>{report.title}</Text>
                                  <Tag
                                    color={getStatusColor(report.status ?? "")}
                                  >
                                    {report.status}
                                  </Tag>
                                </Space>
                              }
                              description={
                                <Text type="secondary">
                                  Urgency: {report.urgency_level} •{" "}
                                  {report.location}
                                </Text>
                              }
                            />
                          </List.Item>
                        );
                      }}
                      locale={{ emptyText: "No reports included yet" }}
                    />
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>

        {/* ----------------------- PARTICIPANTS ------------------------------ */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title={
                <Space>
                  <TeamOutlined />
                  <Title level={4} className="!m-0">
                    Participants
                  </Title>
                  <Tag color="blue">
                    {record?.participants?.length ?? 0} /{" "}
                    {record?.required_participants}
                  </Tag>
                </Space>
              }
              variant="outlined"
              className="rounded-2xl shadow-lg border border-gray-200 bg-white overflow-hidden"
            >
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
                dataSource={record?.participants ?? []}
                renderItem={(item) => {
                  const user = getUserDetails(item.users_id);
                  return (
                    <List.Item>
                      <Card
                        hoverable
                        className="text-center cursor-pointer pt-[10px]!"
                        onClick={() => show("users", item.users_id)}
                        cover={
                          <div className="bg-gray-50 flex justify-center">
                            <Avatar
                              size={55}
                              src={user?.avatar}
                              icon={<UserOutlined />}
                            />
                          </div>
                        }
                      >
                        <Card.Meta
                          title={
                            <Space direction="vertical" size="small">
                              <Text strong>
                                {user?.first_name} {user?.last_name}
                              </Text>
                              <Tag
                                color={item.role === "leader" ? "gold" : "blue"}
                              >
                                {item.role}
                              </Tag>
                            </Space>
                          }
                          description={user?.email}
                        />
                      </Card>
                    </List.Item>
                  );
                }}
                locale={{ emptyText: "No participants yet" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Show>
  );
};
