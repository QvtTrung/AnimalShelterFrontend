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

  // Vietnamese mappings
  const statusMap: Record<string, string> = {
    pending: "Chờ xử lý",
    confirming: "Đang xác nhận",
    confirmed: "Đã xác nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const petStatusMap: Record<string, string> = {
    available: "Có sẵn",
    pending: "Chờ xử lý",
    adopted: "Đã nhận nuôi",
    archived: "Đã lưu trữ",
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
          message.success("Đã gử3i email xác nhận thành công!");
          queryResult.refetch();
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Gửi email xác nhận thất bại");
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
          message.success("Đã xác nhận nhận nuôi thành công!");
          queryResult.refetch();
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Xác nhận nhận nuôi thất bại");
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
          message.success("Đã hủy nhận nuôi thành công!");
          queryResult.refetch();
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Hủy nhận nuôi thất bại");
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
          message.success("Đã hoàn tất nhận nuôi thành công!");
          queryResult.refetch();
          setLoading(false);
        },
        onError: (error: any) => {
          message.error(error?.message || "Hoàn tất nhận nuôi thất bại");
          setLoading(false);
        },
      }
    );
  };

  return (
    <Show isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>

        <Descriptions.Item label="Tên thú cưng">
          {pet?.name || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Loài">
          {pet?.species || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái thú cưng">
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
              {petStatusMap[pet.status] || pet.status.toUpperCase()}
            </Tag>
          ) : (
            "-"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Tên người nhận nuôi">
          {user
            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Email người nhận nuôi">
          {user?.email || "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái nhận nuôi">
          <Tag color={getStatusColor(record?.status || "")}>
            {statusMap[record?.status || ""] || record?.status?.toUpperCase()}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày hẹn">
          {record?.appointment_date
            ? new Date(record.appointment_date).toLocaleString()
            : "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày phê duyệt">
          {record?.approval_date
            ? new Date(record.approval_date).toLocaleDateString()
            : "-"}
        </Descriptions.Item>

        {record?.confirmation_sent_at && (
          <Descriptions.Item label="Gửi xác nhận lúc">
            {new Date(record.confirmation_sent_at).toLocaleString()}
          </Descriptions.Item>
        )}

        {record?.confirmation_expires_at && (
          <Descriptions.Item label="Xác nhận hết hạn lúc">
            {new Date(record.confirmation_expires_at).toLocaleString()}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Ghi chú">
          {record?.notes || "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {record?.date_created
            ? new Date(record.date_created).toLocaleString()
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {record?.date_updated
            ? new Date(record.date_updated).toLocaleString()
            : "N/A"}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24 }}>
        <Space>
          {record?.status === "pending" && (
            <Popconfirm
              title="Gửi Yêu cầu Xác nhận"
              description="Hành động này sẽ thay đổi trạng thái thú cưng thành 'chờ xử lý' và gửi email xác nhận cho người dùng."
              onConfirm={handleSendConfirmation}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" icon={<SendOutlined />} loading={loading}>
                Gửi Yêu cầu Xác nhận
              </Button>
            </Popconfirm>
          )}

          {record?.status === "confirming" && (
            <>
              <Popconfirm
                title="Xác nhận Nhận nuôi"
                description="Hành động này sẽ thay đổi trạng thái nhận nuôi thành 'đã xác nhận'."
                onConfirm={handleConfirm}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  loading={loading}
                  style={{ backgroundColor: "#52c41a" }}
                >
                  Xác nhận Nhận nuôi
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Hủy Nhận nuôi"
                description="Hành động này sẽ hủy nhận nuôi và trả trạng thái thú cưng về 'có sẵn'."
                onConfirm={handleCancel}
                okText="Có"
                cancelText="Không"
              >
                <Button danger icon={<CloseOutlined />} loading={loading}>
                  Hủy Nhận nuôi
                </Button>
              </Popconfirm>
            </>
          )}

          {record?.status === "confirmed" && (
            <>
              <Popconfirm
                title="Hoàn tất Nhận nuôi"
                description="Hành động này sẽ đánh dấu nhận nuôi hoàn tất và thay đổi trạng thái thú cưng thành 'đã nhận nuôi'."
                onConfirm={handleComplete}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  type="primary"
                  icon={<TrophyOutlined />}
                  loading={loading}
                  style={{ backgroundColor: "#13c2c2" }}
                >
                  Hoàn tất Nhận nuôi
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Hủy Nhận nuôi"
                description="Hành động này sẽ hủy nhận nuôi và trả trạng thái thú cưng về 'có sẵn'."
                onConfirm={handleCancel}
                okText="Có"
                cancelText="Không"
              >
                <Button danger icon={<CloseOutlined />} loading={loading}>
                  Hủy Nhận nuôi
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      </div>
    </Show>
  );
};
