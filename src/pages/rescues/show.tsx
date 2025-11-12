// src/pages/rescue/show.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  useShow,
  useNavigation,
  useMany,
  useCustomMutation,
} from "@refinedev/core";
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
  Modal,
  Input,
  message,
} from "antd";
import {
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  PlayCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { IRescue } from "../../interfaces";
import { RescueMap } from "../../components/Map/RescueMap";
import { RescueProgressTracker } from "../../components/RescueProgressTracker";

const { Title, Text } = Typography;

/* -------------------------------------------------------------------------- */
export const RescueShow = () => {
  const { query: queryResult } = useShow<IRescue>();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const { show } = useNavigation();

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Mutations for workflow actions
  const { mutate: startRescue } = useCustomMutation();
  const { mutate: cancelRescue } = useCustomMutation();
  const { mutate: completeRescue } = useCustomMutation();

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

  const getReportStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "assigned":
        return "blue";
      case "resolved":
        return "green";
      default:
        return "default";
    }
  };

  const getReportDetails = (reportId: string) =>
    reportData.find((r) => r.id === reportId);

  const getUserDetails = (userId: string) =>
    userData?.find((u: any) => (u.id ?? u._id) === userId);

  /* ----------------------- Workflow Actions ------------------------------- */
  const handleStartRescue = () => {
    setLoading(true);
    startRescue(
      {
        url: `/rescues/${record?.id}/start`,
        method: "post",
        values: {},
      },
      {
        onSuccess: () => {
          message.success("Rescue campaign started successfully!");
          queryResult.refetch();
          setIsStartModalVisible(false);
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Failed to start rescue");
          setLoading(false);
        },
      }
    );
  };

  const handleCancelRescue = () => {
    setLoading(true);
    cancelRescue(
      {
        url: `/rescues/${record?.id}/cancel`,
        method: "post",
        values: { reason: cancelReason },
      },
      {
        onSuccess: () => {
          message.success("Rescue cancelled successfully!");
          queryResult.refetch();
          setIsCancelModalVisible(false);
          setCancelReason("");
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Failed to cancel rescue");
          setLoading(false);
        },
      }
    );
  };

  const handleCompleteRescue = () => {
    setLoading(true);
    completeRescue(
      {
        url: `/rescues/${record?.id}/complete`,
        method: "post",
        values: {},
      },
      {
        onSuccess: () => {
          message.success(
            "Rescue completed successfully! Reports have been updated."
          );
          queryResult.refetch();
          setIsCompleteModalVisible(false);
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Failed to complete rescue");
          setLoading(false);
        },
      }
    );
  };

  const showStartConfirmation = () => {
    setIsStartModalVisible(true);
  };

  const showCompleteConfirmation = () => {
    setIsCompleteModalVisible(true);
  };

  // Helper function to refetch after progress update
  const handleProgressUpdate = () => {
    queryResult.refetch();
  };

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
                  <FileTextOutlined className="text-blue-500" />
                  <Title level={4} className="!m-0">
                    Rescue Information
                  </Title>
                </Space>
              }
              variant="outlined"
              className="h-[550px] rounded-2xl shadow-lg border border-gray-200 bg-white overflow-y-scroll"
              headStyle={{
                background: "#f8f9fa",
                color: "#333",
                borderBottom: "2px solid #e0e0e0",
              }}
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
                    <strong>Created:</strong>{" "}
                    {record?.date_created
                      ? new Date(record.date_created).toLocaleString()
                      : "N/A"}
                  </Text>

                  <Text>
                    <strong>Last Updated:</strong>{" "}
                    {record?.date_updated
                      ? new Date(record.date_updated).toLocaleString()
                      : "N/A"}
                  </Text>

                  <Divider className="my-3" />

                  {/* ----------------------- ACTION BUTTONS / STATUS INFO ---------------------- */}
                  <div className="space-y-2">
                    {record?.status === "planned" && (
                      <>
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          onClick={showStartConfirmation}
                          loading={loading}
                          block
                          size="large"
                        >
                          Start Rescue Campaign
                        </Button>
                        <Button
                          danger
                          icon={<StopOutlined />}
                          onClick={() => setIsCancelModalVisible(true)}
                          loading={loading}
                          block
                          size="large"
                        >
                          Cancel Rescue
                        </Button>
                      </>
                    )}

                    {record?.status === "in_progress" && (
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={showCompleteConfirmation}
                        loading={loading}
                        block
                        size="large"
                      >
                        Complete Rescue
                      </Button>
                    )}

                    {record?.status === "completed" && (
                      <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 text-center">
                        <CheckCircleOutlined className="text-4xl text-green-600 mb-2" />
                        <Title level={5} className="!mb-1 text-gray-800">
                          Rescue Completed
                        </Title>
                        <Text className="text-gray-700">
                          This rescue campaign has been completed
                        </Text>
                      </div>
                    )}

                    {record?.status === "cancelled" && (
                      <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 text-center">
                        <StopOutlined className="text-4xl text-red-600 mb-2" />
                        <Title level={5} className="!mb-1 text-gray-800">
                          Rescue Cancelled
                        </Title>
                        <Text className="text-gray-700">
                          This rescue campaign has been cancelled
                        </Text>
                        {record?.cancellation_reason && (
                          <div className="mt-2 pt-2 border-t border-gray-300">
                            <Text className="text-sm text-gray-600">
                              <strong>Reason:</strong>{" "}
                              {record.cancellation_reason}
                            </Text>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

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
                                    report.urgency_level === "critical"
                                      ? "bg-red-600"
                                      : report.urgency_level === "high"
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
                                    color={getReportStatusColor(
                                      report.status ?? ""
                                    )}
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
        <Row gutter={[16, 16]} className="mt-6" style={{ marginTop: "24px" }}>
          <Col span={24}>
            <Card
              title={
                <Space>
                  <TeamOutlined className="text-purple-500" />
                  <Title level={4} className="!m-0">
                    Participants
                  </Title>
                  <Tag color="blue" className="text-base px-3 py-1">
                    {record?.participants?.length ?? 0} /{" "}
                    {record?.required_participants}
                  </Tag>
                </Space>
              }
              variant="outlined"
              className="rounded-2xl shadow-lg border border-gray-200 bg-white overflow-hidden"
              headStyle={{
                background: "#f8f9fa",
                color: "#333",
                borderBottom: "2px solid #e0e0e0",
              }}
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
                        className="text-center cursor-pointer pt-[10px] shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                        onClick={() => show("users", item.users_id)}
                        cover={
                          <div className="bg-gray-50 flex justify-center py-4">
                            <Avatar
                              size={64}
                              src={user?.avatar}
                              icon={<UserOutlined />}
                              className="shadow-lg"
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

        {/* ----------------------- PROGRESS TRACKER -------------------------- */}
        {record?.status === "in_progress" && (
          <Row gutter={[16, 16]} className="mt-6" style={{ marginTop: "24px" }}>
            <Col span={24}>
              <RescueProgressTracker
                rescueId={record.id}
                reports={record.reports || []}
                reportData={reportData}
                onProgressUpdate={handleProgressUpdate}
              />
            </Col>
          </Row>
        )}
      </div>

      {/* ----------------------- CANCEL MODAL ------------------------------ */}
      <Modal
        title="Cancel Rescue"
        open={isCancelModalVisible}
        onOk={handleCancelRescue}
        onCancel={() => {
          setIsCancelModalVisible(false);
          setCancelReason("");
        }}
        confirmLoading={loading}
        okText="Cancel Rescue"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to cancel this rescue campaign?</p>
        <p className="text-gray-500 text-sm mb-4">
          All assigned reports will be returned to pending status.
        </p>
        <Input.TextArea
          rows={4}
          placeholder="Reason for cancellation (optional)"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </Modal>

      {/* ----------------------- START RESCUE CONFIRMATION MODAL ------------------------------ */}
      <Modal
        title={
          <span className="text-lg font-semibold">
            <PlayCircleOutlined className="mr-2 text-blue-500" />
            Start Rescue Campaign
          </span>
        }
        open={isStartModalVisible}
        onOk={handleStartRescue}
        onCancel={() => setIsStartModalVisible(false)}
        confirmLoading={loading}
        okText="Start Rescue"
        okButtonProps={{ type: "primary", size: "large" }}
        cancelButtonProps={{ size: "large" }}
      >
        <div className="py-4">
          <p className="text-base mb-3">
            Are you sure you want to start this rescue campaign?
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>This will:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
              <li>Change the rescue status to "In Progress"</li>
              <li>Notify all participants</li>
              <li>Activate the progress tracker</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* ----------------------- COMPLETE RESCUE CONFIRMATION MODAL ------------------------------ */}
      <Modal
        title={
          <span className="text-lg font-semibold">
            <CheckCircleOutlined className="mr-2 text-green-500" />
            Complete Rescue Campaign
          </span>
        }
        open={isCompleteModalVisible}
        onOk={handleCompleteRescue}
        onCancel={() => setIsCompleteModalVisible(false)}
        confirmLoading={loading}
        okText="Complete Rescue"
        okButtonProps={{ type: "primary", size: "large" }}
        cancelButtonProps={{ size: "large" }}
      >
        <div className="py-4">
          <p className="text-base mb-3">
            Are you sure you want to complete this rescue campaign?
          </p>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>This will:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
              <li>Mark the rescue as "Completed"</li>
              <li>Update all successful reports to "Resolved"</li>
              <li>Return cancelled/incomplete reports to "Pending"</li>
              <li>Notify all participants of completion</li>
            </ul>
          </div>
        </div>
      </Modal>
    </Show>
  );
};
