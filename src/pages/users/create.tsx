// UserCreate.tsx
import { Create, useForm } from "@refinedev/antd";
import { UserForm } from "../../components/Forms/UserForm";

export const UserCreate = () => {
  return (
    <Create saveButtonProps={{ hidden: true }}>
      <UserForm />
    </Create>
  );
};
