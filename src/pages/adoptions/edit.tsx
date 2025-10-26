// AdoptionEdit.tsx
import { Edit, useForm } from "@refinedev/antd";
import { useParsed } from "@refinedev/core";
import { AdoptionForm } from "../../components/AdoptionForm";

export const AdoptionEdit = () => {
  const { params } = useParsed();
  const id = params?.id;

  const { formProps, saveButtonProps } = useForm({
    id,
  });

  return (
    <Edit>
      <AdoptionForm formProps={formProps} saveButtonProps={saveButtonProps} />
    </Edit>
  );
};