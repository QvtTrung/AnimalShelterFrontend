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

  return (
    <Show isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
        <Descriptions.Item label="First Name">
          {record?.first_name}
        </Descriptions.Item>
        <Descriptions.Item label="Last Name">
          {record?.last_name}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {record?.phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="Address">{record?.address}</Descriptions.Item>
        <Descriptions.Item label="Role">
          {record?.role || "Not assigned"}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(record?.status || "")}>
            {record?.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Date Created">
          {record?.date_created}
        </Descriptions.Item>
        <Descriptions.Item label="Date Updated">
          {record?.date_updated}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
