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
        <p style={{ marginTop: 20 }}>Đang xử lý yêu cầu hủy của bạn...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <Result
        status="warning"
        icon={<ExclamationCircleOutlined style={{ color: "#faad14" }} />}
        title="Đã Hủy Nhận nuôi"
        subTitle="Yêu cầu nhận nuôi của bạn đã bị hủy. Thú cưng hiện đã có sẵn cho người nhận nuôi khác. Nếu bạn thay đổi ý định, bạn có thể gửi yêu cầu nhận nuôi mới."
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
      title="Hủy Thất bại"
      subTitle={
        errorMessage ||
        "Chúng tôi không thể hủy yêu cầu nhận nuôi của bạn. Vui lòng liên hệ hỗ trợ để được trợ giúp."
      }
      extra={[
        <Button type="primary" key="home" onClick={() => navigate("/")}>
          Về Trang chủ
        </Button>,
      ]}
    />
  );
};
