// RescueEdit.tsx
import { Edit, useForm } from "@refinedev/antd";
import { useParsed } from "@refinedev/core";
import { RescueForm } from "../../components/RescueForm";

export const RescueEdit = () => {
  const { params } = useParsed();
  const id = params?.id;

  const { formProps, saveButtonProps } = useForm({
    id,
  });

  return (
    <Edit>
      <RescueForm formProps={formProps} saveButtonProps={saveButtonProps} />
    </Edit>
  );
};