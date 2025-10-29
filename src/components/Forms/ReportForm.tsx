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
  const { useApiCustom, useApiMutation } = useApi();

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

    const imageData = (imagesQueryResult as any)?.result?.data.data;

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

          const processed = newImages.map((img: any) => ({
            id: img.id || img._id || Date.now().toString(),
            image_url: img.image_url || img.url || "",
          }));

          setExistingImages((prev) => [...prev, ...processed]);
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
      if (imageData && reportId) {
        // Check if imageData.data.data exists and is an array
        if (Array.isArray(imageData.data.data)) {
          setExistingImages(imageData.data.data);
        }
      }
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
    ? useApiMutation(`/reports/:id/images/:imageId`, "delete")
    : { mutate: () => {} };

  const handleDeleteImage = async (imageId: string) => {
    if (!reportId) return;

    try {
      await new Promise<void>((resolve, reject) => {
        deleteImage(
          {
            url: `/reports/${reportId}/images/${imageId}`,
            method: "delete",
            values: { id: reportId, imageId },
          },
          {
            onSuccess: () => {
              setExistingImages((prev) =>
                prev.filter((img) => img.id !== imageId)
              );
              message.success("Image deleted successfully");
              resolve();
            },
            onError: (error: any) => {
              console.error("Delete failed:", error);
              message.error("Failed to delete image");
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      console.error("Failed to delete image:", error);
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

    const updatedValues = {
      ...values,
      ...(imageFiles.length > 0 && { images: imageFiles }),
    };

    if (formProps.onFinish) {
      formProps.onFinish(updatedValues);
    }
  };

  return (
    <Form {...formProps} onFinish={handleFormFinish} layout="vertical">
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input placeholder="Enter report title" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={4} placeholder="Describe the issue" />
      </Form.Item>

      <Form.Item label="Species" name="species" rules={[{ required: true }]}>
        <Input placeholder="e.g. Dog, Cat, Bird" />
      </Form.Item>

      <Form.Item label="Type" name="type" rules={[{ required: true }]}>
        <Select
          options={[
            { label: "Abuse", value: "abuse" },
            { label: "Abandonment", value: "abandonment" },
            { label: "Injured Animal", value: "injured_animal" },
            { label: "Other", value: "other" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Urgency Level"
        name="urgency_level"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
            { label: "Critical", value: "critical" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Location" name="location" rules={[{ required: true }]}>
        <Input placeholder="Where did it happen?" />
      </Form.Item>

      <Form.Item label="Report Images">
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload.
          </p>
        </Upload.Dragger>

        {/* Existing Images (edit mode) */}
        {existingImages.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4>Existing Images:</h4>
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
                      title="Delete this image?"
                      onConfirm={() => handleDeleteImage(item.id)}
                    >
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      >
                        Delete
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
            <h4>Images to upload:</h4>
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
                      Remove
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
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
