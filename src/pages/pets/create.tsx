// PetCreate.tsx
import { Create, useForm } from "@refinedev/antd";
import { PetForm } from "../../components/Forms/PetForm";
import { message } from "antd";
import { useApi } from "../../hooks/useApi";
import { useNavigation } from "@refinedev/core";
import { useState } from "react";

export const PetCreate = () => {
  const { formProps, onFinish } = useForm();
  const { useApiCustom, useApiMutation } = useApi();
  const { list } = useNavigation();
  const [isUploading, setIsUploading] = useState(false);

  // Mutation for uploading images
  const { mutate: uploadImages, mutation } = useApiMutation("", "post", {
    onSuccess: () => {
      message.success("Đã tạo thú cưng và tải hình ảnh thành công");
      list("pets");
    },
    onError: (error: any) => {
      console.error("Error uploading images:", error);
      message.error("Tải hình ảnh thất bại");
    },
  });

  // Custom submit handler to handle file uploads
  const handleFinish = async (values: any) => {
    try {
      // First, create the pet
      const response = await onFinish(values);

      // If there are images, upload them
      if (
        values.images &&
        Array.isArray(values.images) &&
        values.images.length > 0 &&
        response &&
        "data" in response
      ) {
        const formData = new FormData();
        if (values.images && Array.isArray(values.images)) {
          values.images.forEach((file: any) => {
            // Check if it's a File object or has the necessary properties
            // Extract the actual File object from Ant Design Upload component
            // Ant Design wraps the actual file in originFileObj
            if (file.originFileObj instanceof File) {
              formData.append("images", file.originFileObj);
            } else if (file instanceof File) {
              // In case it's already a File object
              formData.append("images", file);
            }
          });
        }

        // Debug FormData contents
        console.log("FormData contents:");
        for (let pair of formData.entries()) {
          console.log(pair[0] + ": ", pair[1]);
        }

        // Check if FormData has any entries
        console.log(
          "FormData has entries:",
          formData.entries().next().done !== true
        );

        // Log the FormData object itself
        console.log("FormData object:", formData);

        // Use useApiMutation for image upload
        const petId = (response as any).data?.id || (response as any).id;

        // Use useApiMutation for image upload
        // Ensure we pass FormData directly without any transformation
        console.log("Calling uploadImages with:", {
          url: `/pets/${petId}/images`,
          method: "post",
          values: formData,
        });
        uploadImages({
          url: `/pets/${petId}/images`,
          method: "post",
          values: formData,
        });
      } else {
        message.success("Đã tạo thú cưng thành công");
        list("pets");
      }

      return response;
    } catch (error) {
      console.error("Error creating pet:", error);
      message.error("Tạo thú cưng thất bại");
      throw error;
    }
  };

  return (
    <Create saveButtonProps={{ hidden: true }}>
      <PetForm
        formProps={{ ...formProps, onFinish: handleFinish }}
        uploading={isUploading}
      />
    </Create>
  );
};
