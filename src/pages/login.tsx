import { useLogin } from "@refinedev/core";
import { Row, Col, Card, Form, Input, Button, Typography, Layout } from "antd";
import { useState } from "react";

const { Title } = Typography;

interface ILoginForm {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { mutate: login } = useLogin<ILoginForm>();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: ILoginForm) => {
    setLoading(true);
    login(values, {
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <img
                src="/logo2.png"
                alt="Logo"
                style={{
                  maxWidth: "320px",
                  height: "75px",
                  marginBottom: "16px",
                }}
              />
              <Title level={3}>Đăng nhập</Title>
            </div>
            <Form
              name="login"
              layout="vertical"
              onFinish={onFinish}
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    type: "email",
                    message: "Vui lòng nhập email hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                ]}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};
