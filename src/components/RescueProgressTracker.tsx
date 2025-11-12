import React, { useState } from "react";
import {
  Card,
  Tag,
  Button,
  Modal,
  Form,
  Select,
  Input,
  message,
  Space,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigation, useCustomMutation } from "@refinedev/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { TextArea } = Input;

interface RescueProgressTrackerProps {
  rescueId: string;
  reports: any[];
  reportData: any[];
  onProgressUpdate: () => void;
}

export const RescueProgressTracker: React.FC<RescueProgressTrackerProps> = ({
  rescueId,
  reports,
  reportData,
  onProgressUpdate,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNavigation();

  const { mutate: updateProgress } = useCustomMutation();

  const getReportDetails = (reportId: string) =>
    reportData.find((r) => r.id === reportId);

  const getStatusMeta = (status: string) => {
    switch (status) {
      case "success":
        return {
          color: "green",
          label: "Success",
          icon: <CheckCircleOutlined className="text-green-500" />,
        };
      case "in_progress":
        return {
          color: "blue",
          label: "In Progress",
          icon: <ClockCircleOutlined className="text-blue-500" />,
        };
      case "cancelled":
        return {
          color: "red",
          label: "Cancelled",
          icon: <CloseCircleOutlined className="text-red-500" />,
        };
      default:
        return {
          color: "default",
          label: "Pending",
          icon: <ClockCircleOutlined className="text-gray-500" />,
        };
    }
  };

  const handleEdit = (rescueReport: any) => {
    setSelectedReport(rescueReport);
    form.setFieldsValue({
      status: rescueReport.status,
      note: rescueReport.note,
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      updateProgress(
        {
          url: `/rescues/reports/${selectedReport.id}/progress`,
          method: "patch",
          values,
        },
        {
          onSuccess: () => {
            message.success("Progress updated successfully");
            setIsModalVisible(false);
            form.resetFields();
            setSelectedReport(null);
            setLoading(false);
            onProgressUpdate();
          },
          onError: (error: any) => {
            message.error(error?.message || "Failed to update progress");
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedReport(null);
  };

  return (
    <>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileTextOutlined
                style={{ color: "#3b82f6", fontSize: "1.125rem" }}
              />
              <span
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#1f2937",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Rescue Progress Tracker
              </span>
            </div>
            <Tag
              color="blue"
              style={{
                padding: "4px 12px",
                fontSize: "0.875rem",
                fontWeight: "500",
                borderRadius: "0.375rem",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {reports.length} {reports.length === 1 ? "Report" : "Reports"}
            </Tag>
          </div>
        }
        style={{
          borderRadius: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #f3f4f6",
          backgroundColor: "#ffffff",
        }}
        headStyle={{
          background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
          padding: "16px 24px",
          fontFamily: "Inter, sans-serif",
        }}
        bodyStyle={{ padding: "24px", fontFamily: "Inter, sans-serif" }}
      >
        {reports.length > 0 ? (
          <div
            className="space-y-6"
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {reports.map((rescueReport, index) => {
              const report = getReportDetails(rescueReport.reports_id);
              if (!report) return null;

              const meta = getStatusMeta(rescueReport.status);

              return (
                <div
                  key={rescueReport.id}
                  className="relative pl-8"
                  style={{
                    position: "relative",
                    paddingLeft: "32px",
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "8px",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                  >
                    {meta.icon}
                  </div>

                  {/* Timeline line */}
                  {index !== reports.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "9px",
                        top: "28px",
                        bottom: "-24px",
                        width: "2px",
                        backgroundColor: "#e5e7eb",
                      }}
                    />
                  )}

                  <div
                    className="bg-gray-50 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-200"
                    style={{
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <span
                          className="text-base font-semibold text-blue-600 cursor-pointer hover:underline hover:text-blue-800"
                          onClick={() => show("reports", report.id)}
                        >
                          {report.title}
                        </span>
                      </div>
                      <Tag
                        color={meta.color}
                        className="text-xs font-semibold px-3 py-1"
                      >
                        {meta.label.toUpperCase()}
                      </Tag>
                    </div>

                    {rescueReport.note && (
                      <div
                        className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3"
                        style={{
                          backgroundColor: "#fefce8",
                          borderLeft: "4px solid #facc15",
                          padding: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        <p className="text-xs font-semibold text-yellow-900 mb-1">
                          Notes:
                        </p>
                        <p className="text-sm text-gray-700 italic">
                          "{rescueReport.note}"
                        </p>
                      </div>
                    )}

                    <div
                      className="flex justify-between items-center text-gray-500 text-xs pt-3 border-t border-gray-200"
                      style={{
                        paddingTop: "12px",
                        borderTop: "1px solid #e5e7eb",
                        marginTop: "8px",
                      }}
                    >
                      <Space size="small">
                        <ClockCircleOutlined />
                        <span>
                          {rescueReport.updated_at
                            ? `Updated ${dayjs(
                                rescueReport.updated_at
                              ).fromNow()}`
                            : "No updates yet"}
                        </span>
                      </Space>

                      <Button
                        type="default"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(rescueReport)}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              color: "#9ca3af",
              padding: "48px 0",
              fontSize: "1rem",
              fontWeight: "500",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <FileTextOutlined className="text-5xl mb-3" />
            <p
              style={{
                textAlign: "center",
                color: "#9ca3af",
                padding: "48px 0",
                fontSize: "1rem",
                fontWeight: "500",
                fontFamily: "Inter, sans-serif",
              }}
            >
              No reports assigned to this rescue yet
            </p>
          </div>
        )}
      </Card>

      {/* Update Progress Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold flex items-center">
            <EditOutlined className="mr-2 text-blue-500" />
            Update Report Progress
          </span>
        }
        open={isModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Save Changes"
        okButtonProps={{ type: "primary", size: "large" }}
        cancelButtonProps={{ size: "large" }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select report status">
              <Select.Option value="in_progress">
                <Tag color="blue">In Progress</Tag>
              </Select.Option>
              <Select.Option value="success">
                <Tag color="green">Success</Tag>
              </Select.Option>
              <Select.Option value="cancelled">
                <Tag color="red">Cancelled</Tag>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span className="flex items-center gap-1">
                Notes{" "}
                <span title="Add any relevant comments or context about this update">
                  <InfoCircleOutlined className="text-gray-400" />
                </span>
              </span>
            }
            name="note"
          >
            <TextArea
              rows={4}
              placeholder="Add notes about this report's progress..."
              showCount
              maxLength={300}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
