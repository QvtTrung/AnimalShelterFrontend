import React from "react";
import { Link } from "react-router";
import { INotification } from "../../interfaces";
import { Badge, Typography, Space, theme } from "antd";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  BellOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface NotificationItemProps {
  notification: INotification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const { token } = theme.useToken();

  const getNotificationLink = () => {
    if (!notification.related_id) return "#";

    switch (notification.type) {
      case "adoption":
        return `/adoptions/show/${notification.related_id}`;
      case "rescue":
        return `/rescues/show/${notification.related_id}`;
      case "report":
        return `/reports/show/${notification.related_id}`;
      default:
        return "#";
    }
  };

  const getNotificationIcon = () => {
    const iconStyle = { fontSize: "18px" };

    switch (notification.type) {
      case "adoption":
        return (
          <CheckCircleOutlined style={{ ...iconStyle, color: "#52c41a" }} />
        );
      case "rescue":
        return <WarningOutlined style={{ ...iconStyle, color: "#fa8c16" }} />;
      case "report":
        return (
          <InfoCircleOutlined style={{ ...iconStyle, color: "#1890ff" }} />
        );
      case "system":
        return <BellOutlined style={{ ...iconStyle, color: "#1890ff" }} />;
      default:
        return (
          <InfoCircleOutlined style={{ ...iconStyle, color: "#8c8c8c" }} />
        );
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case "adoption":
        return "#52c41a";
      case "rescue":
        return "#fa8c16";
      case "report":
        return "#9254de";
      case "system":
        return "#1890ff";
      default:
        return "#8c8c8c";
    }
  };

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <Link
      to={getNotificationLink()}
      onClick={handleClick}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          padding: "12px 16px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          backgroundColor: notification.is_read
            ? "transparent"
            : token.colorPrimaryBg,
          transition: "background-color 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = token.colorBgTextHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = notification.is_read
            ? "transparent"
            : token.colorPrimaryBg;
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: `${getNotificationColor()}20`,
            border: `2px solid ${getNotificationColor()}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {getNotificationIcon()}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "4px",
            }}
          >
            <Text
              strong={!notification.is_read}
              style={{
                fontSize: "14px",
                fontWeight: notification.is_read ? 500 : 600,
              }}
            >
              {notification.title}
            </Text>
            {!notification.is_read && (
              <Badge color="blue" style={{ marginLeft: "8px" }} />
            )}
          </div>

          <Text
            type="secondary"
            style={
              {
                fontSize: "13px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "8px",
                wordBreak: "break-word",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              } as React.CSSProperties
            }
          >
            {notification.message}
          </Text>

          <Space size="middle">
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {notification.date_created &&
                formatDistanceToNow(new Date(notification.date_created), {
                  addSuffix: true,
                })}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: getNotificationColor(),
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {notification.type}
            </Text>
          </Space>
        </div>
      </div>
    </Link>
  );
};
