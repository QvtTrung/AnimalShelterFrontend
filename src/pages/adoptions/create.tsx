// AdoptionCreate.tsx
import { Create, useForm } from "@refinedev/antd";
import { AdoptionForm } from "../../components/Forms/AdoptionForm";

export const AdoptionCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create>
      <AdoptionForm formProps={formProps} saveButtonProps={saveButtonProps} />
    </Create>
  );
};
