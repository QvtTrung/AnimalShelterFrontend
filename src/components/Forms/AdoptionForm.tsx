// AdoptionForm.tsx
import React from "react";
import { Form, Select, DatePicker, Button, Input } from "antd";
import { useSelect } from "@refinedev/antd";
import dayjs from "dayjs";
import type { IAdoption, IPet, IUser } from "../../interfaces";

interface AdoptionFormProps {
  formProps: any;
  saveButtonProps: any;
}

export const AdoptionForm: React.FC<AdoptionFormProps> = ({
  formProps,
  saveButtonProps,
}) => {
  // Get the current form values to check if we're in edit mode
  const currentPetId = formProps?.initialValues?.pet_id;
  const currentPet = typeof currentPetId === "object" ? currentPetId : null;

  // Fetch available pets for dropdown
  const { selectProps: petSelectProps } = useSelect<IPet>({
    resource: "pets",
    optionLabel: "name",
    optionValue: "id",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "available",
      },
    ],
    pagination: {
      mode: "off", // Disable pagination to fetch all pets
    },
    meta: {
      select: "id,name,species,status",
    },
  });

  // If we're editing and the current pet is not in the available list, add it manually
  const petOptions = React.useMemo(() => {
    const options = petSelectProps.options || [];

    // If editing and current pet exists and is not in options, add it
    if (currentPet && currentPet.id) {
      const petExists = options.some((opt: any) => opt.value === currentPet.id);
      if (!petExists) {
        return [
          {
            label: `${currentPet.name} (${currentPet.status})`,
            value: currentPet.id,
          },
          ...options,
        ];
      }
    }

    return options;
  }, [petSelectProps.options, currentPet]);

  // Fetch users for dropdown
  const { selectProps: userSelectProps } = useSelect<IUser>({
    resource: "users",
    optionLabel: (item) =>
      `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.email,
    optionValue: "id",
    pagination: {
      mode: "off", // Disable pagination to fetch all users
    },
    meta: {
      select: "id,first_name,last_name,email",
    },
  });

  return (
    <Form
      {...formProps}
      layout="vertical"
      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
    >
      <Form.Item
        label="Thú cưng"
        name="pet_id"
        rules={[{ required: true, message: "Vui lòng chọn thú cưng" }]}
        getValueProps={(value) => {
          // Handle both object (from populated query) and string (ID only) values
          if (typeof value === "object" && value !== null) {
            return { value: value.id };
          }
          return { value };
        }}
      >
        <Select
          {...petSelectProps}
          options={petOptions} // Use custom options that include current pet
          placeholder="Chọn thú cưng"
          showSearch
          filterOption={(input, option) => {
            const label = String(option?.label ?? "");
            return label.toLowerCase().includes(input.toLowerCase());
          }}
        />
      </Form.Item>

      <Form.Item
        label="Người dùng"
        name="user_id"
        rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}
        getValueProps={(value) => {
          // Handle both object (from populated query) and string (ID only) values
          if (typeof value === "object" && value !== null) {
            return { value: value.id };
          }
          return { value };
        }}
      >
        <Select
          {...userSelectProps}
          placeholder="Chọn người dùng"
          showSearch
          filterOption={(input, option) => {
            const label = String(option?.label ?? "");
            return label.toLowerCase().includes(input.toLowerCase());
          }}
        />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          options={[
            {
              label: "Chờ xử lý",
              value: "pending",
            },
            {
              label: "Đang xác nhận",
              value: "confirming",
            },
            {
              label: "Đã xác nhận",
              value: "confirmed",
            },
            {
              label: "Hoàn thành",
              value: "completed",
            },
            {
              label: "Đã hủy",
              value: "cancelled",
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Ngày hẹn"
        name="appointment_date"
        getValueProps={(value) => ({
          value: value ? dayjs(value) : undefined,
        })}
        getValueFromEvent={(value) => value?.toISOString()}
      >
        <DatePicker
          style={{ width: "100%" }}
          showTime
          format="YYYY-MM-DD HH:mm"
        />
      </Form.Item>

      <Form.Item label="Ghi chú" name="notes">
        <Input.TextArea rows={4} placeholder="Ghi chú bổ sung..." />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" {...saveButtonProps}>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};
