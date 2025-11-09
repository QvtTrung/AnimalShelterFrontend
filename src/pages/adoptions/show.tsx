import { useShow, useCustomMutation } from "@refinedev/core";

import { Show } from "@refinedev/antd";

import {
  Typography,
  Tag,
  Descriptions,
  Button,
  Space,
  message,
  Popconfirm,
} from "antd";
import {
  SendOutlined,
  CheckOutlined,
  CloseOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

import type { IAdoption } from "../../interfaces";
import { useState } from "react";

const { Title, Text } = Typography;

export const AdoptionShow = () => {
  const { query: queryResult } = useShow<IAdoption>({
    meta: {
      fields: ["*", "pet_id.*", "user_id.*"],
    },
  });
  const { data, isLoading } = queryResult;
  console.log("Show Data:", queryResult);
  const record = data?.data;

  // Type-safe accessors for nested data
  const pet = typeof record?.pet_id === "object" ? record.pet_id : null;
  const user = typeof record?.user_id === "object" ? record.user_id : null;

  const [loading, setLoading] = useState(false);

  // Custom mutation for sending confirmation
  const { mutate: sendConfirmation } = useCustomMutation();

  // Custom mutation for confirming
  const { mutate: confirmAdoption } = useCustomMutation();

  // Custom mutation for canceling
  const { mutate: cancelAdoption } = useCustomMutation();

  // Custom mutation for completing
  const { mutate: completeAdoption } = useCustomMutation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "blue";
      case "confirming":
        return "orange";
      case "confirmed":
        return "cyan";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const handleSendConfirmation = () => {
    setLoading(true);
    sendConfirmation(
      {
        url: `/adoptions/${record?.id}/send-confirmation`,
        method: "post",
        values: {},
      },
      {
        onSuccess: () => {
          message.success("Confirmation email sent successfully!");
          queryResult.refetch();
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Failed to send confirmation");
          setLoading(false);
        },
      }
    );
  };

  const handleConfirm = () => {
    setLoading(true);
    confirmAdoption(
      {
        url: `/adoptions/${record?.id}/confirm`,
        method: "post",
        values: {},
      },
      {
        onSuccess: () => {
          message.success("Adoption confirmed successfully!");
          queryResult.refetch();
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Failed to confirm adoption");
          setLoading(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setLoading(true);
    cancelAdoption(
      {
        url: `/adoptions/${record?.id}/cancel`,
        method: "post",
        values: {},
      },
      {
        onSuccess: () => {
          message.success("Adoption cancelled successfully!");
          queryResult.refetch();
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Failed to cancel adoption");
          setLoading(false);
        },
      }
    );
  };

  const handleComplete = () => {
    setLoading(true);
    completeAdoption(
      {
        url: `/adoptions/${record?.id}/complete`,
        method: "post",
        values: {},
      },
      {
        onSuccess: () => {
          message.success("Adoption completed successfully!");
          queryResult.refetch();
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Failed to complete adoption");
          setLoading(false);
        },
      }
    );
  };

  return (
    <Show isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>

        <Descriptions.Item label="Pet Name">
          {pet?.name || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Pet Species">
          {pet?.species || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Pet Status">
          {pet?.status ? (
            <Tag
              color={
                pet.status === "available"
                  ? "green"
                  : pet.status === "pending"
                  ? "orange"
                  : "blue"
              }
            >
              {pet.status.toUpperCase()}
            </Tag>
          ) : (
            "-"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Adopter Name">
          {user
            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Adopter Email">
          {user?.email || "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Adoption Status">
          <Tag color={getStatusColor(record?.status || "")}>
            {record?.status?.toUpperCase()}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Appointment Date">
          {record?.appointment_date
            ? new Date(record.appointment_date).toLocaleString()
            : "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Approval Date">
          {record?.approval_date
            ? new Date(record.approval_date).toLocaleDateString()
            : "-"}
        </Descriptions.Item>

        {record?.confirmation_sent_at && (
          <Descriptions.Item label="Confirmation Sent">
            {new Date(record.confirmation_sent_at).toLocaleString()}
          </Descriptions.Item>
        )}

        {record?.confirmation_expires_at && (
          <Descriptions.Item label="Confirmation Expires">
            {new Date(record.confirmation_expires_at).toLocaleString()}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Notes">
          {record?.notes || "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Date Created">
          {record?.date_created
            ? new Date(record.date_created).toLocaleString()
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Date Updated">
          {record?.date_updated
            ? new Date(record.date_updated).toLocaleString()
            : "N/A"}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24 }}>
        <Space>
          {record?.status === "pending" && (
            <Popconfirm
              title="Send Confirmation Request"
              description="This will change the pet status to 'pending' and send a confirmation email to the user."
              onConfirm={handleSendConfirmation}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" icon={<SendOutlined />} loading={loading}>
                Send Confirmation Request
              </Button>
            </Popconfirm>
          )}

          {record?.status === "confirming" && (
            <>
              <Popconfirm
                title="Confirm Adoption"
                description="This will change the adoption status to 'confirmed'."
                onConfirm={handleConfirm}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  loading={loading}
                  style={{ backgroundColor: "#52c41a" }}
                >
                  Confirm Adoption
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Cancel Adoption"
                description="This will cancel the adoption and return the pet to 'available' status."
                onConfirm={handleCancel}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<CloseOutlined />} loading={loading}>
                  Cancel Adoption
                </Button>
              </Popconfirm>
            </>
          )}

          {record?.status === "confirmed" && (
            <>
              <Popconfirm
                title="Complete Adoption"
                description="This will mark the adoption as completed and change the pet status to 'adopted'."
                onConfirm={handleComplete}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  icon={<TrophyOutlined />}
                  loading={loading}
                  style={{ backgroundColor: "#13c2c2" }}
                >
                  Complete Adoption
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Cancel Adoption"
                description="This will cancel the adoption and return the pet to 'available' status."
                onConfirm={handleCancel}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<CloseOutlined />} loading={loading}>
                  Cancel Adoption
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      </div>
    </Show>
  );
};
