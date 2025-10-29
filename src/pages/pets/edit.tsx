// PetEdit.tsx
import { Edit, useForm } from "@refinedev/antd";
import { useParsed } from "@refinedev/core";
import { PetForm } from "../../components/Forms/PetForm";

export const PetEdit = () => {
  const { params } = useParsed();
  const id = params?.id;

  const { formProps } = useForm({
    id,
  });

  return (
    <Edit saveButtonProps={{ hidden: true }}>
      <PetForm formProps={formProps} petId={id} />
    </Edit>
  );
};
