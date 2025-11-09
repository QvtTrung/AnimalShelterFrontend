import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useCustomMutation } from "@refinedev/core";
import { Result, Button, Spin } from "antd";
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export const AdoptionCancel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: cancelAdoption } = useCustomMutation();

  useEffect(() => {
    if (id) {
      cancelAdoption(
        {
          url: `/adoptions/${id}/cancel`,
          method: "post",
          values: {},
        },
        {
          onSuccess: () => {
            setStatus("success");
          },
          onError: (error: any) => {
            setStatus("error");
            setErrorMessage(error?.message || "Failed to cancel adoption");
          },
        }
      );
    }
  }, [id, cancelAdoption]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" />
        <p style={{ marginTop: 20 }}>Processing your cancellation...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <Result
        status="warning"
        icon={<ExclamationCircleOutlined style={{ color: "#faad14" }} />}
        title="Adoption Cancelled"
        subTitle="Your adoption request has been cancelled. The pet is now available for other adopters. If you change your mind, you can submit a new adoption request."
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
      title="Cancellation Failed"
      subTitle={
        errorMessage ||
        "We couldn't cancel your adoption request. Please contact support for assistance."
      }
      extra={[
        <Button type="primary" key="home" onClick={() => navigate("/")}>
          Go to Home
        </Button>,
      ]}
    />
  );
};
