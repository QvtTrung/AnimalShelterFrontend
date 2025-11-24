import React, { useState } from "react";
import {
  Badge,
  Button,
  Popover,
  Typography,
  Space,
  Spin,
  Empty,
  Divider,
  theme,
} from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";

const { Text, Title } = Typography;

export const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { token } = theme.useToken();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useNotifications();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      refetch();
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // Limit displayed notifications to 10 most recent
  const displayNotifications = notifications.slice(0, 10);
  const hasUnread = unreadCount > 0;

  const content = (
    <div
      style={{
        width: "420px",
        maxHeight: "600px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          backgroundColor: token.colorBgContainer,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            Notifications
          </Title>
          {hasUnread && (
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              onClick={handleMarkAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        {hasUnread && (
          <Text type="secondary" style={{ fontSize: "13px" }}>
            You have {unreadCount} unread notification
            {unreadCount !== 1 ? "s" : ""}
          </Text>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "64px 0",
            }}
          >
            <Spin />
          </div>
        ) : displayNotifications.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "64px 24px",
              textAlign: "center",
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size={4}>
                  <Text strong style={{ fontSize: "16px" }}>
                    No notifications yet
                  </Text>
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    We'll notify you when something important happens
                  </Text>
                </Space>
              }
            />
          </div>
        ) : (
          displayNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {displayNotifications.length > 0 && (
        <div
          style={{
            padding: "12px",
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            textAlign: "center",
            backgroundColor: token.colorBgContainer,
          }}
        >
          <Button type="link" block size="small" onClick={() => setOpen(false)}>
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      title={null}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomRight"
      overlayStyle={{ paddingTop: "8px" }}
    >
      <Badge count={unreadCount} overflowCount={9} offset={[-4, 4]}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: "18px" }} />}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </Badge>
    </Popover>
  );
};
