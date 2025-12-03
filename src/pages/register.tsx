import { useRegister } from "@refinedev/core";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Layout,
  Divider,
} from "antd";
import { Link } from "react-router";

import { useState } from "react";

const { Title, Text } = Typography;
const { Content } = Layout;

interface IRegisterForm {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export const RegisterPage: React.FC = () => {
  const { mutate: register } = useRegister<IRegisterForm>();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: IRegisterForm) => {
    setLoading(true);
    const { email, password, first_name, last_name } = values;
    register(
      { email, password, first_name, last_name },
      {
        onSettled: () => {
          setLoading(false);
        },
      }
    );
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
              <Title level={3}>Đăng ký</Title>
              <Text type="secondary">Tạo tài khoản của bạn</Text>
            </div>
            <Form
              name="register"
              layout="vertical"
              onFinish={onFinish}
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="first_name"
                label="Tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên của bạn!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="last_name"
                label="Họ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ của bạn!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
            <Divider />
            <div style={{ textAlign: "center" }}>
              <Text type="secondary">
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};
