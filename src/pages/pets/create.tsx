import React from "react";
import { Create } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { PetForm } from "../../components/PetForm";

export const PetCreate = () => {
  const { list } = useNavigation();

  return (
    <Create saveButtonProps={{ style: { display: "none" } }}>
      <PetForm
        onSuccess={() => list("pets")}
      />
    </Create>
  );
};
