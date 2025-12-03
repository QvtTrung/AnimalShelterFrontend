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
        <p style={{ marginTop: 20 }}>
          Đang xác nhận yêu cầu nhận nuôi của bạn...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <Result
        status="success"
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        title="Xác nhận Nhận nuôi Thành công!"
        subTitle="Cảm ơn bạn đã xác nhận yêu cầu nhận nuôi. Đội ngũ của chúng tôi sẽ liên hệ với bạn sớm để sắp xếp lịch hẹn."
        extra={[
          <Button type="primary" key="home" onClick={() => navigate("/")}>
            Về Trang chủ
          </Button>,
        ]}
      />
    );
  }

  return (
    <Result
      status="error"
      icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
      title="Xác nhận Thất bại"
      subTitle={
        errorMessage ||
        "Chúng tôi không thể xác nhận yêu cầu nhận nuôi của bạn. Liên kết có thể đã hết hạn hoặc đã được sử dụng."
      }
      extra={[
        <Button type="primary" key="home" onClick={() => navigate("/")}>
          Về Trang chủ
        </Button>,
      ]}
    />
  );
};
