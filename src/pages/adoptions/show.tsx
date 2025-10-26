import { useShow } from "@refinedev/core";

import { Show } from "@refinedev/antd";

import { Typography, Tag, Descriptions } from "antd";

import type { IAdoption } from "../../interfaces";

const { Title, Text } = Typography;

export const AdoptionShow = () => {
  const { query: queryResult } = useShow<IAdoption>({
    meta: {
      select: "*, pets.name, pets.species, user.first_name, user.last_name, user.email"
    }
  });
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
        <Descriptions.Item label="Pet Name">{record?.pets?.name}</Descriptions.Item>
        <Descriptions.Item label="Pet Species">{record?.pets?.species}</Descriptions.Item>
        <Descriptions.Item label="Adopter Name">{record?.user?.first_name} {record?.user?.last_name}</Descriptions.Item>
        <Descriptions.Item label="Adopter Email">{record?.user?.email}</Descriptions.Item>
        <Descriptions.Item label="Approval Date">{record?.approval_date ? new Date(record.approval_date).toLocaleDateString() : "-"}</Descriptions.Item>
        <Descriptions.Item label="Notes">{record?.notes || "-"}</Descriptions.Item>
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