// RescueEdit.tsx
import { Edit, useForm } from "@refinedev/antd";
import { useParsed, useShow } from "@refinedev/core";
import { RescueForm } from "../../components/Forms/RescueForm";
import type { IRescue } from "../../interfaces";
import { useEffect, useState } from "react";
import { Spin } from "antd";

export const RescueEdit = () => {
  const { params } = useParsed();
  const id = params?.id;
  const [isInitialized, setIsInitialized] = useState(false);

  const { query } = useShow<IRescue>({
    resource: "rescues",
    id,
  });

  const { formProps, saveButtonProps } = useForm<IRescue>({
    id,
  });

  // Get the rescue data to pass as initial values
  const rescueData = query?.data?.data;

  // Ensure form is updated with initial values when data is loaded
  useEffect(() => {
    if (rescueData && formProps?.form && !isInitialized) {
      formProps.form.setFieldsValue({
        ...rescueData,
        participants: rescueData.participants || [],
        reports: rescueData.reports || [],
      });
      setIsInitialized(true);
    }
  }, [rescueData, formProps?.form, isInitialized]);

  if (query?.isLoading || !rescueData) {
    return (
      <Edit>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        >
          <Spin size="large" />
        </div>
      </Edit>
    );
  }

  return (
    <Edit saveButtonProps={{ hidden: true }}>
      <RescueForm
        formProps={formProps}
        saveButtonProps={saveButtonProps}
        initialValues={rescueData}
      />
    </Edit>
  );
};
