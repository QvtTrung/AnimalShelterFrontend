// ReportForm.tsx
import React from "react";
import { Form, Select, Button, Input } from "antd";
import type { IReport } from "../interfaces";

interface ReportFormProps {
  formProps: any;
  saveButtonProps: any;
}

export const ReportForm: React.FC<ReportFormProps> = ({
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
        label="Species"
        name="species"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Type"
        name="type"
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
        label="Location"
        name="location"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Urgency Level"
        name="urgency_level"
      >
        <Select
          options={[
            {
              label: "High",
              value: "high",
            },
            {
              label: "Medium",
              value: "medium",
            },
            {
              label: "Low",
              value: "low",
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Reporter"
        name="reporter"
        rules={[{ required: true }]}
      >
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
              label: "Pending",
              value: "pending",
            },
            {
              label: "Assigned",
              value: "assigned",
            },
            {
              label: "Resolved",
              value: "resolved",
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