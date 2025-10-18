import React from "react";
import { useForm } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, Button } from "antd";
import type { IPet } from "../interfaces";

interface PetFormProps {
  id?: string;
  onSuccess?: () => void;
}

export const PetForm: React.FC<PetFormProps> = ({ id, onSuccess }) => {

  
  const { formProps, saveButtonProps, query: queryResult } = useForm<IPet>({
    id,
    redirect: false,
    onMutationSuccess: () => {
      onSuccess?.();
    },
  });
  


  const petData = queryResult?.data?.data;

  return (
    <Form
      {...formProps}
      layout="vertical"
      initialValues={petData}
    >
      <Form.Item
        label="Name"
        name="name"
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
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="Age"
        name={["age"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="Age Unit"
        name={["age_unit"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          options={[
            {
              label: "Months",
              value: "months",
            },
            {
              label: "Years",
              value: "years",
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Size"
        name="size"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          options={[
            {
              label: "Small",
              value: "small",
            },
            {
              label: "Medium",
              value: "medium",
            },
            {
              label: "Large",
              value: "large",
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Health Status"
        name="health_status"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          options={[
            {
              label: "Healthy",
              value: "healthy",
            },
            {
              label: "Needs Attention",
              value: "needs_attention",
            },
            {
              label: "Critical",
              value: "critical",
            },
            {
              label: "Deceased",
              value: "deceased",
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Gender"
        name="gender"
      >
        <Input />
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
              label: "Available",
              value: "available",
            },
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Adopted",
              value: "adopted",
            },
            {
              label: "Archived",
              value: "archived",
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
