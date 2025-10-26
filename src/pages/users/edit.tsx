import React from "react";
import { Edit } from "@refinedev/antd";
import { useNavigation, useParsed } from "@refinedev/core";
import { UserForm } from "../../components/UserForm";

export const UserEdit = () => {
  const { list } = useNavigation();
  const { params } = useParsed();
  const id = params?.id as string;

  return (
    <Edit saveButtonProps={{ style: { display: "none" } }}>
      <UserForm
        id={id}
        onSuccess={() => list("users")}
      />
    </Edit>
  );
};