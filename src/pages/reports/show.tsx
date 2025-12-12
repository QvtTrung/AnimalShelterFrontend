import { useShow } from "@refinedev/core";

import { Show, ListButton, EditButton } from "@refinedev/antd";

import { Typography, Tag, Descriptions, List, Image, Space } from "antd";

import type { IReport } from "../../interfaces";
import { LocationPicker } from "../../components/Map/LocationPicker";

const { Title, Text } = Typography;

export const ReportShow = () => {
  const { query: queryResult } = useShow<IReport>({
    meta: {
      fields: [
        "id",
        "title",
        "description",
        "species",
        "type",
        "location",
        "coordinates",
        "urgency_level",
        "status",
        "date_created",
        "date_updated",
        "user_created.*",
        "images.*",
      ],
    },
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;
  console.log("data:", data);
  console.log("record:", record);
  // Backend already populates user_created as an object with user data
  // No need to fetch separately - just use it directly
  const reporterData =
    typeof record?.user_created === "object" ? record.user_created : null;

  console.log("reporter:", reporterData);

  // Backend already includes images in the report data (images field)
  const images = record?.images || [];

  console.log("Images data:", images);

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

  // Vietnamese mappings
  const statusMap: Record<string, string> = {
    pending: "Chờ xử lý",
    assigned: "Đã gán",
    resolved: "Đã giải quyết",
  };

  const typeMap: Record<string, string> = {
    abuse: "Bị ngược đãi",
    abandonment: "Bị bỏ rơi",
    injured_animal: "Động vật bị thương",
    other: "Khác",
  };

  const urgencyMap: Record<string, string> = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
    critical: "Nghiêm trọng",
  };

  const speciesMap: Record<string, string> = {
    Dog: "Chó",
    Cat: "Mèo",
    Other: "Khác",
  };

  return (
    <Show
      isLoading={isLoading}
      title="Chi tiết Báo cáo"
      headerButtons={({ listButtonProps, editButtonProps }) => (
        <>
          {listButtonProps && (
            <ListButton {...listButtonProps}>Báo cáo</ListButton>
          )}
          {editButtonProps && (
            <EditButton {...editButtonProps}>Chỉnh sửa</EditButton>
          )}
        </>
      )}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Tiêu đề">{record?.title}</Descriptions.Item>
        <Descriptions.Item label="Loài">
          {speciesMap[record?.species || ""] || record?.species}
        </Descriptions.Item>
        <Descriptions.Item label="Loại">
          <Tag color={getTypeColor(record?.type || "")}>{record?.type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          {record?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Vị trí">
          {record?.location || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Mức độ khẩn cấp">
          <Tag color={getUrgencyColor(record?.urgency_level || "")}>
            {record?.urgency_level}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Người báo cáo">
          {reporterData?.first_name || "Loading..."}
          {" "}
          {reporterData?.last_name || ""}
        </Descriptions.Item>
        <Descriptions.Item label="Email người báo cáo">
          {reporterData?.email || "Loading..."}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={getStatusColor(record?.status || "")}>
            {record?.status}
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
        {/* Coordinates map moved outside of table */}
        <Descriptions.Item label="Hình ảnh">
          {!record ? (
            <span>Đang tải hình ảnh...</span>
          ) : images.length > 0 ? (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
              dataSource={images}
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
            <span>Không có hình ảnh</span>
          )}
        </Descriptions.Item>
      </Descriptions>

      {/* Coordinates Map */}
      <div className="mt-5">
        <Title level={4}>Vị trí trên bản đồ</Title>
        {record?.coordinates ? (
          <div className="h-96 w-full">
            <LocationPicker
              value={(() => {
                // Convert coordinates to GeoJSON format if needed
                const coords: any = record.coordinates;
                if (!coords) return null;

                // If it's already in GeoJSON format
                if (typeof coords === "object" && coords.type === "Point") {
                  return coords;
                }

                // If it's a string in "POINT (lng lat)" format
                if (
                  typeof coords === "string" &&
                  coords.startsWith("POINT (")
                ) {
                  const match = coords.match(/POINT\s*\(([^\s]+)\s+([^\s]+)\)/);
                  if (match && match.length === 3) {
                    return {
                      type: "Point",
                      coordinates: [parseFloat(match[1]), parseFloat(match[2])], // [lng, lat]
                    };
                  }
                }

                // If it's a JSON string
                if (typeof coords === "string") {
                  try {
                    const parsed = JSON.parse(coords);
                    if (parsed && parsed.type === "Point") {
                      return parsed;
                    }
                  } catch (e) {
                    console.error("Error parsing coordinates JSON:", e);
                  }
                }

                return null;
              })()}
              locationText={record.location}
              readOnly={true}
            />
          </div>
        ) : (
          <span>Không có toạ độ</span>
        )}
      </div>
    </Show>
  );
};
