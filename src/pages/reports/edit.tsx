// ReportEdit.tsx
import { Edit, useForm } from "@refinedev/antd";
import { useParsed } from "@refinedev/core";
import { ReportForm } from "../../components/Forms/ReportForm";

export const ReportEdit = () => {
  const { params } = useParsed();
  const id = params?.id;

  const { formProps } = useForm({
    id,
  });

  return (
    <Edit saveButtonProps={{ hidden: true }}>
      <ReportForm formProps={formProps} reportId={id} />
    </Edit>
  );
};
