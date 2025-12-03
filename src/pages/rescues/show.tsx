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

  // Vietnamese mappings
  const statusMap: Record<string, string> = {
    planned: "Đã lên kế hoạch",
    in_progress: "Đang thực hiện",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const reportStatusMap: Record<string, string> = {
    pending: "Chờ xử lý",
    assigned: "Đã gán",
    resolved: "Đã giải quyết",
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
          message.success("Đã bắt đầu chiến dịch cứu hộ thành công!");
          queryResult.refetch();
          setIsStartModalVisible(false);
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(
            error?.message || "Không thể bắt đầu chiến dịch cứu hộ"
          );
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
          message.success("Đã hủy chiến dịch cứu hộ thành công!");
          queryResult.refetch();
          setIsCancelModalVisible(false);
          setCancelReason("");
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Không thể hủy chiến dịch cứu hộ");
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
            "Đã hoàn tất chiến dịch cứu hộ thành công! Báo cáo đã được cập nhật."
          );
          queryResult.refetch();
          setIsCompleteModalVisible(false);
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(
            error?.message || "Không thể hoàn tất chiến dịch cứu hộ"
          );
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
      <div className="bg-gray-50 rounded-xl">
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
                  <Title level={4} className="m-0!">
                    Thông tin chiến dịch cứu hộ
                  </Title>
                </Space>
              }
              variant="outlined"
              className="h-[550px] rounded-2xl shadow-lg overflow-y-scroll"
              style={{ backgroundColor: "inherit" }}
            >
              <div className="px-2 sm:px-3 overflow-y-auto h-full">
                <Space direction="vertical" className="w-full">
                  <Space className="flex flex-wrap">
                    <Text strong>Tiêu đề:</Text>
                    <Text>{record?.title}</Text>
                    <Tag color={getStatusColor(record?.status ?? "")}>
                      {statusMap[record?.status || ""] ||
                        record?.status?.toUpperCase()}
                    </Tag>
                  </Space>

                  <Text>
                    <strong>Mô tả:</strong> {record?.description}
                  </Text>

                  <Text>
                    <strong>Thành viên cần thiết:</strong>{" "}
                    {record?.required_participants}
                  </Text>

                  <Text>
                    <strong>Ngày tạo:</strong>{" "}
                    {record?.date_created
                      ? new Date(record.date_created).toLocaleString()
                      : "N/A"}
                  </Text>

                  <Text>
                    <strong>Cập nhật lần cuối:</strong>{" "}
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
                          Bắt đầu chiến dịch cứu hộ
                        </Button>
                        <Button
                          danger
                          icon={<StopOutlined />}
                          onClick={() => setIsCancelModalVisible(true)}
                          loading={loading}
                          block
                          size="large"
                        >
                          Hủy chiến dịch cứu hộ
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
                        Hoàn tất chiến dịch cứu hộ
                      </Button>
                    )}

                    {record?.status === "completed" && (
                      <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 text-center">
                        <CheckCircleOutlined className="text-4xl text-green-600 mb-2" />
                        <Title level={5} className="mb-1! text-gray-800">
                          Đã hoàn thành chiến dịch cứu hộ
                        </Title>
                        <Text className="text-gray-700">
                          Chiến dịch cứu hộ này đã hoàn thành
                        </Text>
                      </div>
                    )}

                    {record?.status === "cancelled" && (
                      <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 text-center">
                        <StopOutlined className="text-4xl text-red-600 mb-2" />
                        <Title level={5} className="mb-1! text-gray-800">
                          Đã hủy chiến dịch cứu hộ
                        </Title>
                        <Text className="text-gray-700">
                          Chiến dịch cứu hộ này đã bị hủy
                        </Text>
                        {record?.cancellation_reason && (
                          <div className="mt-2 pt-2 border-t border-gray-300">
                            <Text className="text-sm text-gray-600">
                              <strong>Lý do:</strong>{" "}
                              {record.cancellation_reason}
                            </Text>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Divider className="my-3" />

                  <Title level={5}>Báo cáo liên kết</Title>
                  <div className="overflow-y-auto">
                    <List
                      dataSource={record?.reports ?? []}
                      className="mt-2!"
                      pagination={false}
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
                                Chưa tải dữ liệu báo cáo
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
                                  Mức độ khẩn cấp: {report.urgency_level} •{" "}
                                  {report.location}
                                </Text>
                              }
                            />
                          </List.Item>
                        );
                      }}
                      locale={{ emptyText: "Chưa có báo cáo nào" }}
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
                  <Title level={4} className="m-0!">
                    Thành viên
                  </Title>
                  <Tag color="blue" className="text-base px-3 py-1">
                    {record?.participants?.length ?? 0} /{" "}
                    {record?.required_participants}
                  </Tag>
                </Space>
              }
              variant="outlined"
              className="rounded-2xl shadow-lg overflow-hidden"
              style={{ backgroundColor: "inherit" }}
            >
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
                dataSource={record?.participants ?? []}
                pagination={false}
                renderItem={(item) => {
                  const user = getUserDetails(item.users_id);
                  return (
                    <List.Item>
                      <Card
                        hoverable
                        className="text-center cursor-pointer pt-2.5 shadow-md hover:shadow-lg transition-shadow"
                        onClick={() => show("users", item.users_id)}
                        cover={
                          <div className="flex justify-center py-4">
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
                locale={{ emptyText: "Chưa có thành viên" }}
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
        title="Hủy chiến dịch cứu hộ"
        open={isCancelModalVisible}
        onOk={handleCancelRescue}
        onCancel={() => {
          setIsCancelModalVisible(false);
          setCancelReason("");
        }}
        confirmLoading={loading}
        okText="Hủy chiến dịch"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn hủy chiến dịch cứu hộ này không?</p>
        <p className="text-gray-500 text-sm mb-4">
          Tất cả các báo cáo đã gán sẽ được trả về trạng thái chờ xử lý.
        </p>
        <Input.TextArea
          rows={4}
          placeholder="Lý do hủy (tùy chọn)"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </Modal>

      {/* ----------------------- START RESCUE CONFIRMATION MODAL ------------------------------ */}
      <Modal
        title={
          <span className="text-lg font-semibold">
            <PlayCircleOutlined className="mr-2 text-blue-500" />
            Bắt đầu chiến dịch cứu hộ
          </span>
        }
        open={isStartModalVisible}
        onOk={handleStartRescue}
        onCancel={() => setIsStartModalVisible(false)}
        confirmLoading={loading}
        okText="Bắt đầu"
        okButtonProps={{ type: "primary", size: "large" }}
        cancelButtonProps={{ size: "large" }}
      >
        <div className="py-4">
          <p className="text-base mb-3">
            Bạn có chắc chắn muốn bắt đầu chiến dịch cứu hộ này không?
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>Hành động này sẽ:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
              <li>Thay đổi trạng thái chiến dịch thành "Đang thực hiện"</li>
              <li>Thông báo cho tất cả thành viên</li>
              <li>Kích hoạt bộ theo dõi tiến độ</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* ----------------------- COMPLETE RESCUE CONFIRMATION MODAL ------------------------------ */}
      <Modal
        title={
          <span className="text-lg font-semibold">
            <CheckCircleOutlined className="mr-2 text-green-500" />
            Hoàn tất chiến dịch cứu hộ
          </span>
        }
        open={isCompleteModalVisible}
        onOk={handleCompleteRescue}
        onCancel={() => setIsCompleteModalVisible(false)}
        confirmLoading={loading}
        okText="Hoàn tất"
        okButtonProps={{ type: "primary", size: "large" }}
        cancelButtonProps={{ size: "large" }}
      >
        <div className="py-4">
          <p className="text-base mb-3">
            Bạn có chắc chắn muốn hoàn tất chiến dịch cứu hộ này không?
          </p>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>Hành động này sẽ:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
              <li>Đánh dấu chiến dịch là "Hoàn thành"</li>
              <li>Cập nhật tất cả báo cáo thành công thành "Giải quyết"</li>
              <li>Trả lại báo cáo bị hủy/chưa hoàn thành về "Chờ xử lý"</li>
              <li>Thông báo cho tất cả thành viên về việc hoàn thành</li>
            </ul>
          </div>
        </div>
      </Modal>
    </Show>
  );
};
