import { useShow, useCustom } from "@refinedev/core";
import { useApi } from "../../hooks/useApi";
import { useState, useEffect } from "react";

import { Show } from "@refinedev/antd";

import { Typography, Tag, Descriptions, List, Image, Space } from "antd";

import type { IReport } from "../../interfaces";
import { LocationPicker } from "../../components/Map/LocationPicker";

const { Title, Text } = Typography;

export const ReportShow = () => {
  const { query: queryResult } = useShow<IReport>({
    meta: {
      select:
        "*, user_created_user.first_name, user_created_user.last_name, user_created_user.email",
    },
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;
  console.log("record:", record);
  const { useApiList, useApiCustom, useApiOne } = useApi();

  // Define expected response type
  interface ReportImagesResponse {
    data: any[];
  }

  useEffect(() => {
    // Component will re-render when record ID changes
  }, [record?.id]);

  // Fetch report images using useApiCustom hook
  const imagesQueryResult = useApiCustom(
    `/reports/${record?.id}/images`,
    "get",
    {
      queryOptions: {
        enabled: !!record?.id,
        retry: 1,
        retryDelay: 1000,
        onError: (error: any) => {
          console.error("Error fetching images:", error);
        },
      },
    }
  );
  console.log("imagesQueryResult:", imagesQueryResult);

  // Extract data with proper typing based on UseCustomReturnType
  // The data is in imagesQueryResult.result.data according to UseCustomReturnType
  const imageData = imagesQueryResult?.result?.data;
  // Loading state is in imagesQueryResult.query.isLoading
  const imagesLoading = imagesQueryResult?.query?.isLoading || false;

  // Extract images from response
  // The imageData.data contains array of images
  console.log("imageData:", imageData);

  // Add fallback for when imageData is undefined or has no data
  let images = [];
  if (imageData && imageData.data) {
    // Check if data is directly an array or nested
    if (Array.isArray(imageData.data)) {
      images = imageData.data;
    } else if (imageData.data.data && Array.isArray(imageData.data.data)) {
      images = imageData.data.data;
    }
  }

  // Log for debugging
  console.log("images:", images);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "assigned":
        return "blue";
      case "resolved":
        return "green";
      default:
        return "default";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "yellow";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "abuse":
        return "red";
      case "abandonment":
        return "orange";
      case "injured_animal":
        return "blue";
      case "other":
        return "gray";
      default:
        return "default";
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Title">{record?.title}</Descriptions.Item>
        <Descriptions.Item label="Species">{record?.species}</Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color={getTypeColor(record?.type || "")}>{record?.type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {record?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Location">
          {record?.location || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Urgency Level">
          <Tag color={getUrgencyColor(record?.urgency_level || "")}>
            {record?.urgency_level}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Reporter">
          {record?.user_created_user?.first_name}{" "}
          {record?.user_created_user?.last_name}
        </Descriptions.Item>
        <Descriptions.Item label="Reporter Email">
          {record?.user_created_user?.email}
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
        {/* Coordinates map moved outside of table */}
        <Descriptions.Item label="Images">
          {imagesLoading ? (
            <span>Loading images...</span>
          ) : images.length > 0 ? (
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

      {/* Coordinates Map */}
      <div className="mt-5">
        <Title level={4}>Location on Map</Title>
        {record?.coordinates ? (
          <div className="h-96 w-full">
            <LocationPicker
              value={(() => {
                // Convert coordinates to GeoJSON format if needed
                const coords: any = record.coordinates;
                if (!coords) return null;
                
                // If it's already in GeoJSON format
                if (typeof coords === 'object' && coords.type === 'Point') {
                  return coords;
                }
                
                // If it's a string in "POINT (lng lat)" format
                if (typeof coords === 'string' && coords.startsWith('POINT (')) {
                  const match = coords.match(/POINT\s*\(([^\s]+)\s+([^\s]+)\)/);
                  if (match && match.length === 3) {
                    return {
                      type: "Point",
                      coordinates: [parseFloat(match[1]), parseFloat(match[2])] // [lng, lat]
                    };
                  }
                }
                
                // If it's a JSON string
                if (typeof coords === 'string') {
                  try {
                    const parsed = JSON.parse(coords);
                    if (parsed && parsed.type === 'Point') {
                      return parsed;
                    }
                  } catch (e) {
                    console.error('Error parsing coordinates JSON:', e);
                  }
                }
                
                return null;
              })()}
              locationText={record.location}
              readOnly={true}
            />
          </div>
        ) : (
          <span>No coordinates available</span>
        )}
      </div>
    </Show>
  );
};
