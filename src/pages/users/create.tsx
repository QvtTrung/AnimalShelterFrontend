// UserCreate.tsx
import { Create, useForm } from "@refinedev/antd";
import { UserForm } from "../../components/UserForm";

export const UserCreate = () => {
  return (
    <Create>
      <UserForm />
    </Create>
  );
};
