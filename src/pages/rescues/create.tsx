// RescueCreate.tsx
import { Create, useForm } from "@refinedev/antd";
import { RescueForm } from "../../components/RescueForm";

export const RescueCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create>
      <RescueForm formProps={formProps} saveButtonProps={saveButtonProps} />
    </Create>
  );
};