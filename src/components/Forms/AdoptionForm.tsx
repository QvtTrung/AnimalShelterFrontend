// AdoptionForm.tsx
import React from "react";
import { Form, Select, DatePicker, Button, Input } from "antd";
import type { IAdoption } from "../../interfaces";

interface AdoptionFormProps {
  formProps: any;
  saveButtonProps: any;
}

export const AdoptionForm: React.FC<AdoptionFormProps> = ({
  formProps,
  saveButtonProps,
}) => {
  return (
    <Form
      {...formProps}
      layout="vertical"
      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
    >
      <Form.Item label="Pet" name="pet_id" rules={[{ required: true }]}>
        <Select
          options={[
            { label: "Dog", value: "dog" },
            { label: "Cat", value: "cat" },
            { label: "Bird", value: "bird" },
          ]}
        />
      </Form.Item>
      <Form.Item label="User" name="user_id" rules={[{ required: true }]}>
        <Select
          options={[
            { label: "User 1", value: "user1" },
            { label: "User 2", value: "user2" },
            { label: "User 3", value: "user3" },
          ]}
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
              label: "Planned",
              value: "planned",
            },
            {
              label: "In Progress",
              value: "in_progress",
            },
            {
              label: "Completed",
              value: "completed",
            },
            {
              label: "Cancelled",
              value: "cancelled",
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Approval Date"
        name="approval_date"
        getValueFromEvent={(value) => value && value.toISOString()}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Notes" name="notes">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" {...saveButtonProps}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
