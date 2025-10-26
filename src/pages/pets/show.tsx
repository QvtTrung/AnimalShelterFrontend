import { useShow, useCustom } from "@refinedev/core";
import { useApi } from "../../hooks/useApi";
import { useState, useEffect } from "react";

import { Show } from "@refinedev/antd";

import { Typography, Tag, Descriptions, List, Image, Space } from "antd";

import type { IPet } from "../../interfaces";

const { Title, Text } = Typography;

export const PetShow = () => {
  const { query: queryResult } = useShow<IPet>();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const { useApiList, useApiCustom } = useApi();

  // Define the expected response type
  interface PetImagesResponse {
    data: any[];
  }

  useEffect(() => {
    // Component will re-render when record ID changes
  }, [record?.id]);

  // Fetch pet images using useApiCustom hook
  const imagesQueryResult = useApiCustom(`/pets/${record?.id}/images`, "get", {
    queryOptions: {
      enabled: !!record?.id,
    },
  });

  // Extract data with proper typing based on UseCustomReturnType
  // The data is in imagesQueryResult.result.data according to UseCustomReturnType
  const imageData = imagesQueryResult?.result?.data;
  // Loading state is in imagesQueryResult.query.isLoading
  const imagesLoading = imagesQueryResult?.query?.isLoading || false;

  // Extract images from response
  // The imageData.data contains the array of images
  const images = imageData?.data?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "green";
      case "pending":
        return "orange";
      case "adopted":
        return "blue";
      case "archived":
        return "gray";
      default:
        return "default";
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case "small":
        return "green";
      case "medium":
        return "blue";
      case "large":
        return "red";
      default:
        return "default";
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "green";
      case "needs_attention":
        return "orange";
      case "critical":
        return "red";
      case "deceased":
        return "gray";
      default:
        return "default";
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{record?.name}</Descriptions.Item>
        <Descriptions.Item label="Species">{record?.species}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {record?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Age">
          {record?.age} {record?.age_unit}
        </Descriptions.Item>
        <Descriptions.Item label="Size">
          <Tag color={getSizeColor(record?.size || "")}>{record?.size}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Health Status">
          <Tag color={getHealthStatusColor(record?.health_status || "")}>
            {record?.health_status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Gender">{record?.gender}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(record?.status || "")}>
            {record?.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Images">
          {images.length > 0 ? (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
              dataSource={images}
              loading={imagesLoading}
              renderItem={(item: any) => {
                return (
                  <List.Item>
                    <Image
                      width={200}
                      height={200}
                      src={(item as any).image_url}
                      style={{ objectFit: "cover" }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8O+L"
                      preview={{
                        src: (item as any).image_url,
                      }}
                    />
                  </List.Item>
                );
              }}
            />
          ) : (
            <span>No images available</span>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
