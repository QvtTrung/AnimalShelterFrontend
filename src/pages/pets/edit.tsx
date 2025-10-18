import React from "react";
import { Edit } from "@refinedev/antd";
import { useNavigation, useParsed } from "@refinedev/core";
import { PetForm } from "../../components/PetForm";

export const PetEdit = () => {
  const { list } = useNavigation();
  const { params } = useParsed();
  const id = params?.id as string;

  return (
    <Edit saveButtonProps={{ style: { display: "none" } }}>
      <PetForm
        id={id}
        onSuccess={() => list("pets")}
      />
    </Edit>
  );
};
