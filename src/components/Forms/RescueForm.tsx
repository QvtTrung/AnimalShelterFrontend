import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  InputNumber,
  Button,
  Input,
  Card,
  Space,
  List,
  Avatar,
  Tag,
  Divider,
  Modal,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  FileTextOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelect, useMany } from "@refinedev/core";
import { useApi } from "../../hooks/useApi";
import type {
  IRescue,
  IRescueParticipant,
  IRescueReport,
} from "../../interfaces";

interface RescueFormProps {
  formProps: any;
  initialValues?: IRescue;
  participants?: IRescueParticipant[];
  setParticipants?: React.Dispatch<React.SetStateAction<IRescueParticipant[]>>;
  reports?: IRescueReport[];
  setReports?: React.Dispatch<React.SetStateAction<IRescueReport[]>>;
}

export const RescueForm: React.FC<RescueFormProps> = ({
  formProps,
  initialValues,
  participants: externalParticipants,
  setParticipants: externalSetParticipants,
  reports: externalReports,
  setReports: externalSetReports,
}) => {
  const [participants, setParticipants] = useState<IRescueParticipant[]>(
    externalParticipants || []
  );
  const [reports, setReports] = useState<IRescueReport[]>(
    externalReports || []
  );

  // Update participants and reports when initialValues change
  useEffect(() => {
    if (initialValues) {
      setParticipants(initialValues.participants || []);
      setReports(initialValues.reports || []);
    }
  }, [initialValues]);

  // Sync state changes to parent component
  useEffect(() => {
    if (externalSetParticipants) {
      externalSetParticipants(participants);
    }
  }, [participants, externalSetParticipants]);

  useEffect(() => {
    if (externalSetReports) {
      externalSetReports(reports);
    }
  }, [reports, externalSetReports]);

  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState<{
    [key: string]: string;
  }>({});
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);

  const { useApiMutation } = useApi();
  const addParticipant = useApiMutation("/rescues/:id/participants", "post");
  const removeParticipant = useApiMutation(
    "/rescues/participants/:participantId",
    "delete"
  );
  const addReport = useApiMutation("/rescues/:id/reports", "post");
  const removeReport = useApiMutation(
    "/rescues/reports/:rescueReportId",
    "delete"
  );

  const { options: userOptions } = useSelect({
    resource: "users",
    optionLabel: (user: any) => `${user.first_name} ${user.last_name}`,
    optionValue: (user: any) => user.id,
  });

  const { options: reportOptions } = useSelect({
    resource: "reports",
    optionLabel: "title",
    optionValue: "id",
  });

  const {
    result: { data: userData },
  } = useMany({
    resource: "users",
    ids: participants.map((p) => p.users_id),
    queryOptions: { enabled: participants.length > 0 },
  });

  const {
    result: { data: reportData },
  } = useMany({
    resource: "reports",
    ids: reports.map((r) => r.reports_id),
    queryOptions: { enabled: reports.length > 0 },
  });

  useEffect(() => {
    formProps?.form?.setFieldsValue({
      participants,
      reports,
    });
  }, [participants, reports]);

  const handleAddUser = () => {
    if (!selectedUserId) return message.error("Please select a user");
    if (participants.some((p) => p.users_id === selectedUserId))
      return message.error("User is already a participant");

    const role = selectedUserRoles[selectedUserId] || "member";
    const rescueId = initialValues?.id;

    if (rescueId) {
      addParticipant.mutate(
        {
          url: `/rescues/${rescueId}/participants`,
          method: "post",
          values: {
            users_id: selectedUserId,
            role: role as "leader" | "member",
          },
        },
        {
          onSuccess: () => message.success("Participant added"),
          onError: () => message.error("Failed to add participant"),
        }
      );
    }

    setParticipants(
      (prev) =>
        [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            rescue_id: rescueId || "temp",
            users_id: selectedUserId,
            role: role as "leader" | "member",
          },
        ] as IRescueParticipant[]
    );

    setSelectedUserId(null);
    setIsUserModalVisible(false);
  };

  const handleRemoveUser = (userId: string) => {
    console.log("Removing participant with user ID:", userId); // Debug log
    const participant = participants.find((p) => p.users_id === userId);
    console.log("Found participant:", participant); // Debug log

    // Always make the API call to remove the participant
    // Use the rescue ID and user ID to identify the participant to remove
    const rescueId = initialValues?.id;

    if (rescueId) {
      // Find the participant ID to use for the API call
      const participantId = participant?.id || userId;
      console.log(
        "Making API call to delete participant with ID:",
        participantId
      ); // Debug log
      removeParticipant.mutate(
        {
          url: `/rescues/participants/${participantId}`,
          method: "delete",
          values: {},
        },
        {
          onSuccess: (response) => {
            console.log("API response:", response); // Debug log
            message.success("Participant removed successfully");
            setParticipants((prev) =>
              prev.filter((p) => p.users_id !== userId)
            );
          },
          onError: (error) => {
            console.error("Failed to remove participant:", error);
            message.error("Failed to remove participant");
            // Still remove from UI even if API call fails
            setParticipants((prev) =>
              prev.filter((p) => p.users_id !== userId)
            );
          },
        }
      );
    } else {
      // If no rescue ID, just remove from UI
      console.log("No rescue ID, removing from UI only"); // Debug log
      setParticipants((prev) => prev.filter((p) => p.users_id !== userId));
    }
  };

  const handleAddReports = () => {
    if (selectedReportIds.length === 0)
      return message.error("Please select at least one report");
    const rescueId = initialValues?.id;

    selectedReportIds.forEach((reportId) => {
      if (!reports.some((r) => r.reports_id === reportId)) {
        if (rescueId) {
          addReport.mutate({
            url: `/rescues/${rescueId}/reports`,
            method: "post",
            values: {
              reports_id: reportId,
              status: "in_progress" as "success" | "in_progress" | "cancelled",
            },
          });
        }

        setReports(
          (prev) =>
            [
              ...prev,
              {
                id: `temp-${Date.now()}`,
                rescue_id: rescueId || "temp",
                reports_id: reportId,
                status: "in_progress" as
                  | "success"
                  | "in_progress"
                  | "cancelled",
              },
            ] as IRescueReport[]
        );
      }
    });

    setSelectedReportIds([]);
    setIsReportModalVisible(false);
  };

  const handleRemoveReport = (reportId: string) => {
    console.log("Removing report with ID:", reportId); // Debug log
    const report = reports.find((r) => r.reports_id === reportId);
    console.log("Found report:", report); // Debug log

    // Always make the API call to remove the report
    // Use the rescue ID and report ID to identify the report to remove
    const rescueId = initialValues?.id;

    if (rescueId) {
      // Find the report ID to use for the API call
      const rescueReportId = report?.id || reportId;
      console.log("Making API call to delete report with ID:", rescueReportId); // Debug log
      removeReport.mutate(
        {
          url: `/rescues/reports/${rescueReportId}`,
          method: "delete",
          values: {},
        },
        {
          onSuccess: (response) => {
            console.log("API response:", response); // Debug log
            message.success("Report removed successfully");
            setReports((prev) => prev.filter((r) => r.reports_id !== reportId));
          },
          onError: (error) => {
            console.error("Failed to remove report:", error);
            message.error("Failed to remove report");
            // Still remove from UI even if API call fails
            setReports((prev) => prev.filter((r) => r.reports_id !== reportId));
          },
        }
      );
    } else {
      // If no rescue ID, just remove from UI
      console.log("No rescue ID, removing from UI only"); // Debug log
      setReports((prev) => prev.filter((r) => r.reports_id !== reportId));
    }
  };

  const getUserDetails = (userId: string) =>
    userData?.find(
      (u: any) => u.id === userId || u._id === userId || u.users_id === userId
    );
  const getReportDetails = (reportId: string) =>
    reportData?.find((r: any) => r.id === reportId || r._id === reportId);

  return (
    <Form {...formProps} layout="vertical" initialValues={initialValues}>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="Required Participants"
        name="required_participants"
        rules={[{ required: true }]}
      >
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Status" name="status" rules={[{ required: true }]}>
        <Select
          options={[
            { label: "Planned", value: "planned" },
            { label: "In Progress", value: "in_progress" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
        />
      </Form.Item>

      <Divider>Participants</Divider>
      <Card
        title="Rescue Participants"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsUserModalVisible(true)}
          >
            Add Participant
          </Button>
        }
      >
        <List
          dataSource={participants}
          renderItem={(item) => {
            const user = getUserDetails(item.users_id);
            return (
              <List.Item
                actions={[
                  <Popconfirm
                    title="Remove?"
                    onConfirm={() => handleRemoveUser(item.users_id)}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={user?.avatar} icon={<UserOutlined />} />}
                  title={
                    <Space>
                      {user?.first_name} {user?.last_name}{" "}
                      <Tag>{item.role}</Tag>
                    </Space>
                  }
                  description={user?.email}
                />
              </List.Item>
            );
          }}
        />
      </Card>

      <Divider>Reports</Divider>
      <Card
        title="Included Reports"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsReportModalVisible(true)}
          >
            Add Reports
          </Button>
        }
      >
        <List
          dataSource={reports}
          renderItem={(item) => {
            const report = getReportDetails(item.reports_id);
            return (
              <List.Item
                actions={[
                  <Popconfirm
                    title="Remove?"
                    onConfirm={() => handleRemoveReport(item.reports_id)}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<FileTextOutlined />} />}
                  title={report?.title}
                  description={report?.location}
                />
              </List.Item>
            );
          }}
        />
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>

      {/* User Modal */}
      <Modal
        title="Add Participant"
        open={isUserModalVisible}
        onOk={handleAddUser}
        onCancel={() => setIsUserModalVisible(false)}
      >
        <Select
          placeholder="Select a user"
          value={selectedUserId}
          onChange={setSelectedUserId}
          options={userOptions}
          style={{ width: "100%", marginBottom: 16 }}
        />
        <Select
          placeholder="Select role"
          value={selectedUserRoles[selectedUserId || ""]}
          onChange={(value) =>
            selectedUserId &&
            setSelectedUserRoles({
              ...selectedUserRoles,
              [selectedUserId]: value,
            })
          }
          options={[
            { label: "Leader", value: "leader" },
            { label: "Member", value: "member" },
          ]}
          style={{ width: "100%" }}
        />
      </Modal>

      {/* Report Modal */}
      <Modal
        title="Add Reports"
        open={isReportModalVisible}
        onOk={handleAddReports}
        onCancel={() => setIsReportModalVisible(false)}
      >
        <Select
          mode="multiple"
          placeholder="Select reports"
          value={selectedReportIds}
          onChange={setSelectedReportIds}
          options={reportOptions}
          style={{ width: "100%" }}
        />
      </Modal>
    </Form>
  );
};
