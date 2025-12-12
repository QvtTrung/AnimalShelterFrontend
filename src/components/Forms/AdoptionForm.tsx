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

      {/* Contact Information Section */}
      <Form.Item label="Họ và tên" name="full_name">
        <Input placeholder="Nhập họ và tên đầy đủ" maxLength={255} />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="phone_number">
        <Input placeholder="Nhập số điện thoại" maxLength={20} />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: "email", message: "Email không hợp lệ" }]}
      >
        <Input placeholder="Nhập email liên hệ" maxLength={255} />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address">
        <Input.TextArea
          rows={2}
          placeholder="Nhập địa chỉ chi tiết"
          maxLength={500}
        />
      </Form.Item>

      {/* Housing Information Section */}
      <Form.Item label="Loại nhà ở" name="housing_type">
        <Select
          placeholder="Chọn loại nhà ở"
          options={[
            { label: "Chung cư", value: "apartment" },
            { label: "Nhà riêng", value: "house" },
            { label: "Biệt thự", value: "villa" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Diện tích nhà (m²)" name="housing_area">
        <Input type="number" placeholder="Nhập diện tích" min={0} />
      </Form.Item>

      <Form.Item label="Có sân vườn" name="has_yard" valuePropName="checked">
        <Select
          options={[
            { label: "Có", value: true },
            { label: "Không", value: false },
          ]}
        />
      </Form.Item>

      {/* Experience Section */}
      <Form.Item label="Kinh nghiệm nuôi thú cưng" name="pet_experience">
        <Input.TextArea
          rows={3}
          placeholder="Mô tả kinh nghiệm nuôi thú cưng của bạn..."
          maxLength={2000}
        />
      </Form.Item>

      <Form.Item label="Lý do nhận nuôi" name="adoption_reason">
        <Input.TextArea
          rows={3}
          placeholder="Vì sao bạn muốn nhận nuôi thú cưng này..."
          maxLength={2000}
        />
      </Form.Item>

      <Form.Item label="Cam kết chăm sóc" name="care_commitment">
        <Input.TextArea
          rows={3}
          placeholder="Bạn cam kết sẽ chăm sóc thú cưng như thế nào..."
          maxLength={2000}
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
