// AdoptionEdit.tsx
import { Edit, useForm } from "@refinedev/antd";
import { useParsed } from "@refinedev/core";
import { AdoptionForm } from "../../components/Forms/AdoptionForm";

export const AdoptionEdit = () => {
  const { params } = useParsed();
  const id = params?.id;

  const { formProps, saveButtonProps } = useForm({
    id,
  });

  return (
    <Edit saveButtonProps={{ hidden: true }}>
      <AdoptionForm formProps={formProps} saveButtonProps={saveButtonProps} />
    </Edit>
  );
};
