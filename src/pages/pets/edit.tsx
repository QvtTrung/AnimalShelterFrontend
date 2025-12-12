// PetEdit.tsx
import { Edit, useForm, ListButton } from "@refinedev/antd";
import { useParsed } from "@refinedev/core";
import { PetForm } from "../../components/Forms/PetForm";

export const PetEdit = () => {
  const { params } = useParsed();
  const id = params?.id;

  const { formProps } = useForm({
    id,
  });

  return (
    <Edit
      saveButtonProps={{ hidden: true }}
      title="Chỉnh sửa Thú cưng"
      headerButtons={({ listButtonProps }) => (
        <>
          {listButtonProps && (
            <ListButton {...listButtonProps}>Thú cưng</ListButton>
          )}
        </>
      )}
    >
      <PetForm formProps={formProps} petId={id} />
    </Edit>
  );
};
