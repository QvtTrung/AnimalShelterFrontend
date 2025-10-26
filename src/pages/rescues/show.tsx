import { useShow } from "@refinedev/core";

import { Show } from "@refinedev/antd";

import { Typography, Tag, Descriptions } from "antd";

import type { IRescue } from "../../interfaces";

const { Title, Text } = Typography;

export const RescueShow = () => {
  const { query: queryResult } = useShow<IRescue>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'blue';
      case 'in_progress':
        return 'orange';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Title">{record?.title}</Descriptions.Item>
        <Descriptions.Item label="Description">{record?.description}</Descriptions.Item>
        <Descriptions.Item label="Required Participants">{record?.required_participants}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(record?.status || '')}>
            {record?.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Date Created">{record?.date_created}</Descriptions.Item>
        <Descriptions.Item label="Date Updated">{record?.date_updated}</Descriptions.Item>
      </Descriptions>
    </Show>
  );
};