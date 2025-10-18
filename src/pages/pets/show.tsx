import { useShow } from "@refinedev/core";

import { Show } from "@refinedev/antd";

import { Typography, Tag, Descriptions } from "antd";

import type { IPet } from "../../interfaces";

const { Title, Text } = Typography;

export const PetShow = () => {
  const { query: queryResult } = useShow<IPet>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'green';
      case 'pending':
        return 'orange';
      case 'adopted':
        return 'blue';
      case 'archived':
        return 'gray';
      default:
        return 'default';
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'small':
        return 'green';
      case 'medium':
        return 'blue';
      case 'large':
        return 'red';
      default:
        return 'default';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'green';
      case 'needs_attention':
        return 'orange';
      case 'critical':
        return 'red';
      case 'deceased':
        return 'gray';
      default:
        return 'default';
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{record?.name}</Descriptions.Item>
        <Descriptions.Item label="Species">{record?.species}</Descriptions.Item>
        <Descriptions.Item label="Description">{record?.description}</Descriptions.Item>
        <Descriptions.Item label="Age">
          {record?.age} {record?.age_unit}
        </Descriptions.Item>
        <Descriptions.Item label="Size">
          <Tag color={getSizeColor(record?.size || '')}>
            {record?.size}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Health Status">
          <Tag color={getHealthStatusColor(record?.health_status || '')}>
            {record?.health_status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Gender">{record?.gender}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(record?.status || '')}>
            {record?.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
