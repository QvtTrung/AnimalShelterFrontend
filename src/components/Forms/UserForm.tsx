import React, { useState, useEffect } from "react";
import { useForm } from "@refinedev/antd";
import { Form, Input, Select, Button } from "antd";
import type { IUser } from "../../interfaces";

interface UserFormProps {
  id?: string;
  onSuccess?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ id, onSuccess }) => {
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);

  const {
    formProps,
    saveButtonProps,
    query: queryResult,
  } = useForm<IUser>({
    id,
    onMutationSuccess: () => {
      onSuccess?.();
    },
  });

  const userData = queryResult?.data?.data;

  // Use predefined role names
  useEffect(() => {
    setRoles([
      { id: "User", name: "Người dùng" },
      { id: "Staff", name: "Nhân viên" },
      { id: "Administrator", name: "Quản trị viên" },
    ]);
  }, []);

  return (
    <Form
      {...formProps}
      layout="vertical"
      initialValues={userData}
      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          {
            required: !id,
            min: 6,
            message: "Mật khẩu phải có ít nhất 6 ký tự",
          },
        ]}
        help={id ? "Để trống để giữ mật khẩu hiện tại" : ""}
      >
        <Input.Password
          placeholder={id ? "Để trống để giữ mật khẩu hiện tại" : ""}
        />
      </Form.Item>
      <Form.Item
        label="Tên"
        name="first_name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Họ"
        name="last_name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Số điện thoại" name="phone_number">
        <Input />
      </Form.Item>
      <Form.Item label="Địa chỉ" name="address">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="Vai trò"
        name="role"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn vai trò",
          },
        ]}
      >
        <Select
          placeholder="Chọn vai trò"
          options={roles.map((role) => ({
            label: role.name,
            value: role.id,
          }))}
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
              label: "Hoạt động",
              value: "active",
            },
            {
              label: "Không hoạt động",
              value: "inactive",
            },
          ]}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" {...saveButtonProps}>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};
