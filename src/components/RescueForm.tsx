// RescueForm.tsx
import React from "react";
import { Form, Select, InputNumber, Button, Input } from "antd";
import type { IRescue } from "../interfaces";

interface RescueFormProps {
  formProps: any;
  saveButtonProps: any;
}

export const RescueForm: React.FC<RescueFormProps> = ({
  formProps,
  saveButtonProps,
}) => {
  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="Required Participants"
        name="required_participants"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber min={1} style={{ width: "100%" }} />
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
      <Form.Item>
        <Button type="primary" htmlType="submit" {...saveButtonProps}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};