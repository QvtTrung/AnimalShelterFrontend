// ReportEdit.tsx
import { Edit, useForm } from "@refinedev/antd";
import { useParsed } from "@refinedev/core";
import { ReportForm } from "../../components/ReportForm";

export const ReportEdit = () => {
  const { params } = useParsed();
  const id = params?.id;

  const { formProps, saveButtonProps } = useForm({
    id,
  });

  return (
    <Edit>
      <ReportForm formProps={formProps} saveButtonProps={saveButtonProps} />
    </Edit>
  );
};