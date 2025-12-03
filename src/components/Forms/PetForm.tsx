// PetForm.tsx
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
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
import { uploadFile } from "../../utils/upload";

interface PetFormProps {
  formProps: any;
  petId?: string;
  uploading?: boolean;
}

export const PetForm: React.FC<PetFormProps> = ({
  formProps,
  petId,
  uploading: uploadingProp,
}) => {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const { useApiCustom, useApiList, useApiMutation } = useApi();

  let uploadImages: any = () => {};
  let mutation: any = { status: "idle" };

  // All edit mode logic grouped together
  if (petId) {
    // Fetch existing images using useApiCustom with proper typing
    const imagesQueryResult = useApiCustom(`/pets/${petId}/images`, "get", {
      onError: (error: any) => {
        console.error("Error fetching images:", error);
      },
    });

    // Extract data with proper typing based on useApiCustomReturnType
    const imageData = (imagesQueryResult as any)?.result?.data;

    // Mutation for uploading images
    const mutationResult = useApiMutation(`/pets/${petId}/images`, "post", {
      onSuccess: (data: any) => {
        console.log("Upload response:", data);

        // Try multiple ways to extract the uploaded images
        let newImages = [];

        if (data?.data?.data) {
          newImages = Array.isArray(data.data.data)
            ? data.data.data
            : [data.data.data];
        } else if (data?.data) {
          newImages = Array.isArray(data.data) ? data.data : [data.data];
        } else if (Array.isArray(data)) {
          newImages = data;
        } else if (data.status === "success" && data.data) {
          newImages = Array.isArray(data.data.data || data.data)
            ? data.data.data || data.data
            : [data.data.data || data.data];
        }

        // Process each new image to ensure it has the required properties
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

        setExistingImages((prevImages) => [...prevImages, ...processedImages]);
        message.success("Tải hình ảnh thành công");
      },
      onError: (error: any) => {
        console.error("Upload failed:", error);
        message.error("Tải hình ảnh thất bại");
      },
    });

    // Extract mutate and mutation from mutationResult
    uploadImages = mutationResult.mutate;
    mutation = mutationResult.mutation;

    useEffect(() => {
      if (imageData && petId) {
        console.log("API Response:", imageData);
        // Check if imageData.data.data exists and is an array
        if (imageData.data && Array.isArray(imageData.data.data)) {
          setExistingImages(imageData.data.data);
        } else {
          setExistingImages([]);
        }
      }
    }, [imageData, petId]);
  }

  // Update existing images when data is fetched (only for edit mode)

  // Handle file upload
  const handleUpload = async (options: any) => {
    const { file, onProgress, onSuccess, onError } = options;
    setUploading(true);

    try {
      if (petId) {
        // Edit mode logic: upload the file using useApiMutation
        const formData = new FormData();
        formData.append("images", file);

        // Use a Promise to wait for the upload to complete
        await new Promise<void>((resolve, reject) => {
          uploadImages(
            {
              url: `/pets/${petId}/images`,
              method: "post",
              values: formData,
            },
            {
              onSuccess: (data: any) => {
                console.log("Upload response:", data);

                // Try multiple ways to extract the uploaded images
                let newImages = [];

                if (data?.data?.data) {
                  newImages = Array.isArray(data.data.data)
                    ? data.data.data
                    : [data.data.data];
                } else if (data?.data) {
                  newImages = Array.isArray(data.data)
                    ? data.data
                    : [data.data];
                } else if (Array.isArray(data)) {
                  newImages = data;
                } else if (data.status === "success" && data.data) {
                  newImages = Array.isArray(data.data.data || data.data)
                    ? data.data.data || data.data
                    : [data.data.data || data.data];
                }

                // Process each new image to ensure it has the required properties
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
                message.success("Tải hình ảnh thành công");
                resolve();
                onSuccess(file);
              },
              onError: (error: any) => {
                console.error("Upload failed:", error);
                message.error("Tải hình ảnh thất bại");
                reject(error);
              },
            }
          );
        });
      } else {
        // Create mode logic: just add the file to the list
        // Store the file object with all necessary properties
        // Keep the original file object structure to ensure compatibility
        // Ant Design Upload component wraps the actual file in originFileObj
        setFileList([...fileList, file]);
        onSuccess(file);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Tải hình ảnh thất bại");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  // Delete image mutation (only used in edit mode)
  const { mutate: deleteImage } = petId
    ? useApiMutation(`/pets/:id/images/:imageId`, "delete", {
        // Remove the success and error handlers from here
        // We'll handle them in the handleDeleteImage function
      })
    : { mutate: () => {} };

  // Handle image deletion (only used in edit mode)
  const handleDeleteImage = async (imageId: string) => {
    if (!petId) return; // Only allow deletion in edit mode

    console.log("Deleting image with ID:", imageId);

    try {
      await new Promise<void>((resolve, reject) => {
        deleteImage(
          {
            url: `/pets/${petId}/images/${imageId}`,
            method: "delete",
            values: { id: petId, imageId: imageId },
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
                message.success("Đã xóa hình ảnh thành công");
              } else {
                console.error("Could not extract image ID from response");
                message.error("Không thể xác định hình ảnh đã xóa");
              }

              resolve();
            },
            onError: (error: any) => {
              console.error("Delete mutation failed:", error);
              message.error("Xóa hình ảnh thất bại");
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

  // Upload props
  const uploadProps = {
    name: "file",
    multiple: true,
    customRequest: handleUpload,
    fileList,
    showUploadList: false,
  };

  // Custom onFinish to include image files
  const handleFormFinish = (values: any) => {
    // Add the uploaded files to the form values
    // Only include images if there are any
    // Ensure we have actual File objects
    const imageFiles = fileList
      .map((file) => {
        // Ant Design Upload component wraps the actual file in originFileObj
        if (file.originFileObj instanceof File) {
          return file.originFileObj;
        } else if (file instanceof File) {
          // In case it's already a File object
          return file;
        }
        return null;
      })
      .filter((file) => file !== null);

    const updatedValues = {
      ...values,
      ...(imageFiles.length > 0 && { images: imageFiles }),
    };

    // Call the original onFinish
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
      <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Loài" name="species" rules={[{ required: true }]}>
        <Select
          options={[
            { label: "Chó", value: "dog" },
            { label: "Mèo", value: "cat" },
            { label: "Khác", value: "other" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item label="Tuổi" name="age" rules={[{ required: true }]}>
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        label="Đơn vị tuổi"
        name="age_unit"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { label: "Tháng", value: "months" },
            { label: "Năm", value: "years" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Kích cỡ" name="size" rules={[{ required: true }]}>
        <Select
          options={[
            { label: "Nhỏ", value: "small" },
            { label: "Trung bình", value: "medium" },
            { label: "Lớn", value: "large" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Tình trạng sức khỏe"
        name="health_status"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { label: "Khỏe mạnh", value: "healthy" },
            { label: "Cần chăm sóc", value: "needs_attention" },
            { label: "Nguy kịch", value: "critical" },
            { label: "Đã chết", value: "deceased" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Giới tính" name="gender">
        <Select
          options={[
            { label: "Đực", value: "male" },
            { label: "Cái", value: "female" },
            { label: "Không rõ", value: "unknown" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
        <Select
          options={[
            { label: "Có sẵn", value: "available" },
            { label: "Chờ xử lý", value: "pending" },
            { label: "Đã nhận nuôi", value: "adopted" },
            { label: "Đã lưu trữ", value: "archived" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Hình ảnh thú cưng">
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấp hoặc kéo thả tệp vào đây để tải lên
          </p>
          <p className="ant-upload-hint">Hỗ trợ tải đơn hoặc nhiều tệp.</p>
        </Upload.Dragger>

        {/* Display existing images in edit mode */}
        {existingImages.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4>Hình ảnh hiện có:</h4>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
              dataSource={existingImages}
              renderItem={(item) => {
                console.log("Image item:", item);
                // Get the image URL with fallbacks
                const imageUrl =
                  item.image_url ||
                  item.url ||
                  (typeof item === "string" ? item : "");
                console.log("Image URL:", imageUrl);
                console.log("Image URL type:", typeof imageUrl);

                // Extract the image ID with multiple fallbacks
                const imageId =
                  item.id ||
                  item._id ||
                  (imageUrl ? imageUrl.split("/").pop() : "");
                console.log("Extracted image ID for delete:", imageId);

                return (
                  <List.Item key={imageId}>
                    <Space direction="vertical" align="center">
                      <Image
                        width={120}
                        height={120}
                        src={imageUrl}
                        style={{ objectFit: "cover" }}
                        preview={{
                          src: imageUrl,
                        }}
                      />
                      <Popconfirm
                        title="Bạn có chắc chắn muốn xóa hình ảnh này không?"
                        onConfirm={() => handleDeleteImage(imageId)}
                        okText="Có"
                        cancelText="Không"
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
                );
              }}
            />
          </div>
        )}

        {/* Display uploaded files in create mode */}
        {fileList.length > 0 && !petId && (
          <div style={{ marginTop: 16 }}>
            <h4>Hình ảnh sẽ tải lên:</h4>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
              dataSource={fileList}
              renderItem={(file) => (
                <List.Item>
                  <Space direction="vertical" align="center">
                    <Image
                      width={120}
                      height={120}
                      src={URL.createObjectURL(file)}
                      style={{ objectFit: "cover" }}
                    />
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
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
