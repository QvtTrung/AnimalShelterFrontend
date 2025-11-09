import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useCustomMutation } from "@refinedev/core";
import { Result, Button, Spin } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

export const AdoptionConfirm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: confirmAdoption } = useCustomMutation();

  useEffect(() => {
    if (id) {
      confirmAdoption(
        {
          url: `/adoptions/${id}/confirm`,
          method: "post",
          values: {},
        },
        {
          onSuccess: () => {
            setStatus("success");
          },
          onError: (error: any) => {
            setStatus("error");
            setErrorMessage(error?.message || "Failed to confirm adoption");
          },
        }
      );
    }
  }, [id, confirmAdoption]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" />
        <p style={{ marginTop: 20 }}>Confirming your adoption request...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <Result
        status="success"
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        title="Adoption Confirmed Successfully!"
        subTitle="Thank you for confirming your adoption request. Our team will contact you shortly to schedule the appointment."
        extra={[
          <Button type="primary" key="home" onClick={() => navigate("/")}>
            Go to Home
          </Button>,
        ]}
      />
    );
  }

  return (
    <Result
      status="error"
      icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
      title="Confirmation Failed"
      subTitle={
        errorMessage ||
        "We couldn't confirm your adoption request. The link may have expired or already been used."
      }
      extra={[
        <Button type="primary" key="home" onClick={() => navigate("/")}>
          Go to Home
        </Button>,
      ]}
    />
  );
};
