// ReportCreate.tsx
import { Create, useForm } from "@refinedev/antd";
import { ReportForm } from "../../components/Forms/ReportForm";
import { message } from "antd";
import { useApi } from "../../hooks/useApi";
import { useNavigation } from "@refinedev/core";
import { useState } from "react";

export const ReportCreate = () => {
  const { formProps, onFinish } = useForm();
  const { useApiMutation } = useApi();
  const { list } = useNavigation();
  const [isUploading, setIsUploading] = useState(false);

  // Mutation for uploading images
  const { mutate: uploadImages, mutation } = useApiMutation("", "post", {
    onSuccess: () => {
      message.success("Report and images created successfully");
      list("reports");
    },
    onError: (error: any) => {
      console.error("Error uploading images:", error);
      message.error("Failed to upload images");
    },
  });

  // Custom submit handler (same as Pet)
  const handleFinish = async (values: any) => {
    try {
      // 1️⃣ Tạo report trước (chỉ gửi JSON)
      const response = await onFinish(values);

      // 2️⃣ Nếu có ảnh thì upload sau, tương tự Pet
      if (
        values.images &&
        Array.isArray(values.images) &&
        values.images.length > 0 &&
        response &&
        "data" in response
      ) {
        const formData = new FormData();

        values.images.forEach((file: any) => {
          if (file.originFileObj instanceof File) {
            formData.append("images", file.originFileObj);
          } else if (file instanceof File) {
            formData.append("images", file);
          }
        });

        const reportId = (response as any).data?.id || (response as any).id;

        console.log("Uploading images for report:", reportId);

        uploadImages({
          url: `/reports/${reportId}/images`,
          method: "post",
          values: formData,
        });
      } else {
        message.success("Report created successfully");
        list("reports");
      }

      return response;
    } catch (error) {
      console.error("Error creating report:", error);
      message.error("Failed to create report");
      throw error;
    }
  };

  return (
    <Create saveButtonProps={{ hidden: true }}>
      <ReportForm
        formProps={{ ...formProps, onFinish: handleFinish }}
        uploading={isUploading}
      />
    </Create>
  );
};
