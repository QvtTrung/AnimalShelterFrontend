import React from "react";
import { useGetIdentity, useLogout, useGo } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Typography,
  Avatar,
  Space,
  theme,
  Dropdown,
  Switch,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import type { RefineThemedLayoutHeaderProps } from "@refinedev/antd";
import type { MenuProps } from "antd";
import { useTheme } from "../../contexts/ThemeContext";
import { NotificationDropdown } from "../Notifications";

export const ThemedHeader: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky,
}) => {
  const { token } = theme.useToken();
  const { data: user } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const go = useGo();
  const { isDarkMode, toggleTheme } = useTheme();

  const shouldRenderHeader = user && (user.name || user.avatar);

  if (!shouldRenderHeader) {
    return null;
  }

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => go({ to: "/profile" }),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: () => logout(),
      danger: true,
    },
  ];

  const headerStyles: React.CSSProperties = {
    backgroundColor: isDarkMode ? "#1f1f1f" : "#f0f2f5",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    borderBottom: `1px solid ${isDarkMode ? "#303030" : "#d9d9d9"}`,
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space size="large">
        <Space align="center">
          <BulbOutlined style={{ color: isDarkMode ? "#fff" : "inherit" }} />
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </Space>
        <NotificationDropdown />
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
          arrow
        >
          <Space style={{ cursor: "pointer" }}>
            <Typography.Text
              strong
              style={{ color: isDarkMode ? "#fff" : "inherit" }}
            >
              {user?.name || `${user?.first_name} ${user?.last_name}`}
            </Typography.Text>
            <Avatar src={user?.avatar} icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </Space>
    </AntdLayout.Header>
  );
};
