import React from "react";
import { Edit, ListButton } from "@refinedev/antd";
import { useNavigation, useParsed } from "@refinedev/core";
import { UserForm } from "../../components/Forms/UserForm";

export const UserEdit = () => {
  const { list } = useNavigation();
  const { params } = useParsed();
  const id = params?.id as string;

  return (
    <Edit
      saveButtonProps={{ hidden: true }}
      title="Chỉnh sửa Người dùng"
      headerButtons={({ listButtonProps }) => (
        <>
          {listButtonProps && (
            <ListButton {...listButtonProps}>Người dùng</ListButton>
          )}
        </>
      )}
    >
      <UserForm id={id} onSuccess={() => list("users")} />
    </Edit>
  );
};
