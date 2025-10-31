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
      { id: "User", name: "User" },
      { id: "Staff", name: "Staff" },
      { id: "Administrator", name: "Administrator" },
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
        label="Password"
        name="password"
        rules={[
          {
            required: !id,
            min: 6,
            message: "Password must be at least 6 characters",
          },
        ]}
        help={id ? "Leave blank to keep current password" : ""}
      >
        <Input.Password
          placeholder={id ? "Leave blank to keep current password" : ""}
        />
      </Form.Item>
      <Form.Item
        label="First Name"
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
        label="Last Name"
        name="last_name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Phone Number" name="phone_number">
        <Input />
      </Form.Item>
      <Form.Item label="Address" name="address">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: "Please select a role",
          },
        ]}
      >
        <Select
          placeholder="Select a role"
          options={roles.map((role) => ({
            label: role.name,
            value: role.id,
          }))}
        />
      </Form.Item>
      <Form.Item
        label="Status"
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
              label: "Active",
              value: "active",
            },
            {
              label: "Inactive",
              value: "inactive",
            },
          ]}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" {...saveButtonProps}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
