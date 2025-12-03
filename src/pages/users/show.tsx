import React from "react";
import { useShow } from "@refinedev/core";

import { Show } from "@refinedev/antd";

import { Typography, Tag, Descriptions } from "antd";

import type { IUser } from "../../interfaces";

const { Title, Text } = Typography;

export const UserShow = () => {
  const { query: queryResult } = useShow<IUser>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      default:
        return "default";
    }
  };

  // Vietnamese mappings
  const statusMap: Record<string, string> = {
    active: "Hoạt động",
    inactive: "Không hoạt động",
    suspended: "Đã đình chỉ",
    draft: "Nháp",
    archived: "Đã lưu trữ",
  };

  const roleMap: Record<string, string> = {
    User: "Người dùng",
    Staff: "Nhân viên",
    Administrator: "Quản trị viên",
  };

  return (
    <Show isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
        <Descriptions.Item label="Tên">{record?.first_name}</Descriptions.Item>
        <Descriptions.Item label="Họ">{record?.last_name}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {record?.phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{record?.address}</Descriptions.Item>
        <Descriptions.Item label="Vai trò">
          {roleMap[record?.role || ""] || record?.role || "Chưa gán"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={getStatusColor(record?.status || "")}>
            {statusMap[record?.status || ""] || record?.status}
          </Tag>
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
    </Show>
  );
};
