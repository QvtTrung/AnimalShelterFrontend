import { useShow } from "@refinedev/core";

import { Show } from "@refinedev/antd";

import { Typography, Tag, Descriptions } from "antd";

import type { IReport } from "../../interfaces";

const { Title, Text } = Typography;

export const ReportShow = () => {
  const { query: queryResult } = useShow<IReport>({
    meta: {
      select: "*, reporter_user.first_name, reporter_user.last_name, reporter_user.email"
    }
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'assigned':
        return 'blue';
      case 'resolved':
        return 'green';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Title">{record?.title}</Descriptions.Item>
        <Descriptions.Item label="Species">{record?.species}</Descriptions.Item>
        <Descriptions.Item label="Type">{record?.type}</Descriptions.Item>
        <Descriptions.Item label="Description">{record?.description}</Descriptions.Item>
        <Descriptions.Item label="Location">{record?.location || "-"}</Descriptions.Item>
        <Descriptions.Item label="Urgency Level">
          <Tag color={getUrgencyColor(record?.urgency_level || '')}>
            {record?.urgency_level}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Reporter">{record?.reporter_user?.first_name} {record?.reporter_user?.last_name}</Descriptions.Item>
        <Descriptions.Item label="Reporter Email">{record?.reporter_user?.email}</Descriptions.Item>
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