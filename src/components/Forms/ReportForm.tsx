// ReportForm.tsx
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  App,
  List,
  Image,
  Space,
  Popconfirm,
} from "antd";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { useApi } from "../../hooks/useApi";
import { LocationPicker } from "../Map/LocationPicker";

interface ReportFormProps {
  formProps: any;
  reportId?: string;
  uploading?: boolean;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  formProps,
  reportId,
  uploading: uploadingProp,
}) => {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [locText, setLocText] = useState<string>("");
  const { useApiCustom, useApiMutation } = useApi();

  // Handle initial values for edit mode
  useEffect(() => {
    if (formProps.initialValues) {
      // Set location text if available
      if (formProps.initialValues.location) {
        setLocText(formProps.initialValues.location);
      }

      // Set coordinates if available
      if (formProps.initialValues.coordinates) {
        const coords: any = formProps.initialValues.coordinates;

        // Convert coordinates to GeoJSON format if needed
        if (typeof coords === "string" && coords.startsWith("POINT (")) {
          const match = coords.match(/POINT\s*\(([^\s]+)\s+([^\s]+)\)/);
          if (match && match.length === 3) {
            formProps.initialValues.coordinates = {
              type: "Point",
              coordinates: [parseFloat(match[1]), parseFloat(match[2])], // [lng, lat]
            };
          } else {
            formProps.initialValues.coordinates = undefined;
          }
        }
        // If coordinates are a JSON string
        else if (typeof coords === "string") {
          try {
            const parsed = JSON.parse(coords);
            if (
              parsed &&
              parsed.type === "Point" &&
              Array.isArray(parsed.coordinates)
            ) {
              formProps.initialValues.coordinates = parsed;
            } else {
              formProps.initialValues.coordinates = undefined;
            }
          } catch (e) {
            console.error("Error parsing coordinates JSON:", e);
            formProps.initialValues.coordinates = undefined;
          }
        }
      }
    }
  }, [formProps.initialValues]);

  let uploadImages: any = () => {};
  let mutation: any = { status: "idle" };

  // 🟢 Giống Pet: chỉ fetch & upload khi edit
  if (reportId) {
    const imagesQueryResult = useApiCustom(
      `/reports/${reportId}/images`,
      "get",
      {
        onError: (error: any) => console.error("Error fetching images:", error),
      }
    );

    const imageData = (imagesQueryResult as any)?.result?.data;

    const mutationResult = useApiMutation(
      `/reports/${reportId}/images`,
      "post",
      {
        onSuccess: (data: any) => {
          let newImages: any[] = [];

          if (data?.data?.data)
            newImages = Array.isArray(data.data.data)
              ? data.data.data
              : [data.data.data];
          else if (data?.data)
            newImages = Array.isArray(data.data) ? data.data : [data.data];
          else if (Array.isArray(data)) newImages = data;

          const processedImages = newImages.map((img: any) => {
            // If img is a string (URL), convert to object
            if (typeof img === "string") {
              return {
                id: img.split("/").pop() || Date.now().toString(),
                image_url: img,
              };
            }

            // If img is an object, ensure it has id and image_url
            return {
              id:
                img.id ||
                img._id ||
                img.image_url?.split("/").pop() ||
                Date.now().toString(),
              image_url: img.image_url || img.url || "",
            };
          });

          setExistingImages((prevImages) => [
            ...prevImages,
            ...processedImages,
          ]);
          message.success("Image uploaded successfully");
        },
        onError: (error: any) => {
          console.error("Upload failed:", error);
          message.error("Failed to upload image");
        },
      }
    );

    uploadImages = mutationResult.mutate;
    mutation = mutationResult.mutation;

    useEffect(() => {
      if (!reportId || !imageData) return;

      console.log("API Response:", imageData);

      const extracted =
        imageData?.data?.data ||
        imageData?.data ||
        (Array.isArray(imageData) ? imageData : []);

      setExistingImages(Array.isArray(extracted) ? extracted : []);
    }, [imageData, reportId]);
  }

  // 🟢 Giống Pet: handleUpload
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setUploading(true);

    try {
      if (reportId) {
        const formData = new FormData();
        formData.append("images", file);

        await new Promise<void>((resolve, reject) => {
          uploadImages(
            {
              url: `/reports/${reportId}/images`,
              method: "post",
              values: formData,
            },
            {
              onSuccess: (data: any) => {
                let newImages: any[] = [];

                if (data?.data?.data)
                  newImages = Array.isArray(data.data.data)
                    ? data.data.data
                    : [data.data.data];
                else if (data?.data)
                  newImages = Array.isArray(data.data)
                    ? data.data
                    : [data.data];
                else if (Array.isArray(data)) newImages = data;

                const processed = newImages.map((img: any) => ({
                  id: img.id || img._id || Date.now().toString(),
                  image_url: img.image_url || img.url || "",
                }));

                setExistingImages((prev) => [...prev, ...processed]);
                message.success("Image uploaded successfully");
                resolve();
                onSuccess(file);
              },
              onError: (error: any) => {
                console.error("Upload failed:", error);
                message.error("Failed to upload image");
                reject(error);
              },
            }
          );
        });
      } else {
        // 🟢 Khi tạo mới — không upload, chỉ lưu file trong state
        setFileList([...fileList, file]);
        onSuccess(file);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  // 🟢 Giống Pet: handleDeleteImage
  const { mutate: deleteImage } = reportId
    ? useApiMutation(`/reports/:id/images/:imageId`, "delete", {
        // Remove the success and error handlers from here
        // We'll handle them in the handleDeleteImage function
      })
    : { mutate: () => {} };

  const handleDeleteImage = async (imageId: string) => {
    if (!reportId) return; // Only allow deletion in edit mode

    console.log("Deleting image with ID:", imageId);

    try {
      await new Promise<void>((resolve, reject) => {
        deleteImage(
          {
            url: `/reports/${reportId}/images/${imageId}`,
            method: "delete",
            values: { id: reportId, imageId: imageId },
          },
          {
            onSuccess: (data: any, variables: any) => {
              console.log("Delete response:", data);
              console.log("Delete variables:", variables);

              // Extract the image ID from variables
              const deletedImageId =
                variables?.values?.imageId ||
                variables?.imageId ||
                variables?.url?.split("/").pop();
              console.log("Extracted imageId:", deletedImageId);

              if (deletedImageId) {
                setExistingImages((prevImages) => {
                  // Try multiple ways to match the image ID since the structure might vary
                  const filteredImages = prevImages.filter((img) => {
                    // Check if img.id exists and matches
                    if (img.id && img.id === deletedImageId) return false;
                    // Check if img._id exists and matches
                    if (img._id && img._id === deletedImageId) return false;
                    // Check if image_url contains the imageId
                    if (img.image_url && img.image_url.includes(deletedImageId))
                      return false;
                    // If none of the above, keep the image
                    return true;
                  });
                  console.log("Filtered images:", filteredImages);
                  return filteredImages;
                });
                message.success("Image deleted successfully");
              } else {
                console.error("Could not extract image ID from response");
                message.error("Failed to identify deleted image");
              }

              resolve();
            },
            onError: (error: any) => {
              console.error("Delete mutation failed:", error);
              message.error("Failed to delete image");
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      console.error("Failed to delete image:", error);
      // Error is already handled by the mutation's onError callback
    }
  };

  // 🟢 Giống Pet: Upload props
  const uploadProps = {
    name: "file",
    multiple: true,
    customRequest: handleUpload,
    fileList,
    showUploadList: false,
  };

  // 🟢 Giống Pet: handleFormFinish
  const handleFormFinish = (values: any) => {
    const imageFiles = fileList
      .map((file) =>
        file.originFileObj instanceof File ? file.originFileObj : file
      )
      .filter(Boolean);

    // Get coordinates from form values or use default Hanoi coordinates
    let coordinates = values.coordinates;

    // If coordinates are undefined, use default Hanoi coordinates
    if (!coordinates) {
      coordinates = {
        type: "Point",
        coordinates: [105.8542, 21.0285],
      };
    }

    // Log coordinates for debugging
    console.log("Submitting coordinates:", coordinates);

    const updatedValues = {
      ...values,
      // Ensure location is a string
      location: locText || values.location || "Unknown location",
      coordinates: coordinates,
      ...(imageFiles.length > 0 && { images: imageFiles }),
    };

    if (formProps.onFinish) {
      formProps.onFinish(updatedValues);
    }
  };

  return (
    <Form
      {...formProps}
      onFinish={handleFormFinish}
      layout="vertical"
      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
    >
      <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
        <Input placeholder="Nhập tiêu đề báo cáo" />
      </Form.Item>

      <Form.Item label="Mô tả" name="description" rules={[{ required: true }]}>
        <Input.TextArea rows={4} placeholder="Mô tả vấn đề" />
      </Form.Item>

      <Form.Item label="Loài" name="species" rules={[{ required: true }]}>
        <Input placeholder="Ví dụ: Chó, Mèo, Chim" />
      </Form.Item>

      <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
        <Select
          options={[
            { label: "Lạm dụng", value: "abuse" },
            { label: "Bỏ rơi", value: "abandonment" },
            { label: "Động vật bị thương", value: "injured_animal" },
            { label: "Khác", value: "other" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Mức độ khẩn cấp"
        name="urgency_level"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { label: "Thấp", value: "low" },
            { label: "Trung bình", value: "medium" },
            { label: "Cao", value: "high" },
            { label: "Nghiêm trọng", value: "critical" },
          ]}
        />
      </Form.Item>
      <Form.Item name="coordinates" hidden>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item
        label="Vị trí"
        name="coordinates"
        rules={[{ required: true, message: "Vui lòng chọn vị trí" }]}
      >
        <LocationPicker
          locationText={locText}
          onLocationTextChange={setLocText}
        />
      </Form.Item>

      <Form.Item label="Hình ảnh báo cáo">
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấp hoặc kéo tệp vào khu vực này để tải lên
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ tải lên đơn lẻ hoặc nhiều tệp.
          </p>
        </Upload.Dragger>

        {/* Existing Images (edit mode) */}
        {existingImages.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4>Hình ảnh hiện có:</h4>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
              dataSource={existingImages}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <Space direction="vertical" align="center">
                    <Image
                      width={120}
                      height={120}
                      src={item.image_url}
                      style={{ objectFit: "cover" }}
                    />
                    <Popconfirm
                      title="Xóa hình ảnh này?"
                      onConfirm={() => handleDeleteImage(item.id)}
                    >
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}

        {/* FileList (create mode) */}
        {fileList.length > 0 && !reportId && (
          <div style={{ marginTop: 16 }}>
            <h4>Hình ảnh sẽ tải lên:</h4>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
              dataSource={fileList}
              renderItem={(file) => (
                <List.Item>
                  <Space direction="vertical" align="center">
                    <Image
                      width={120}
                      height={120}
                      src={URL.createObjectURL(file.originFileObj || file)}
                      style={{ objectFit: "cover" }}
                    />
                    <Button
                      type="primary"
                      danger
                      size="small"
                      onClick={() =>
                        setFileList(fileList.filter((f) => f !== file))
                      }
                    >
                      Gỡ
                    </Button>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={uploadingProp || uploading || mutation?.status === "pending"}
        >
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};
