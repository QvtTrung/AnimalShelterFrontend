// ReportCreate.tsx
import { Create, useForm } from "@refinedev/antd";
import { ReportForm } from "../../components/ReportForm";

export const ReportCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create>
      <ReportForm formProps={formProps} saveButtonProps={saveButtonProps} />
    </Create>
  );
};