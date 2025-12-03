import React, { useState, useEffect } from "react";
import { useGetIdentity, useUpdate } from "@refinedev/core";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Space,
  Typography,
  message,
  Select,
  Row,
  Col,
} from "antd";
import { UserOutlined, SaveOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const { data: identity, refetch } = useGetIdentity<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    address?: string;
    role?: string;
    status?: string;
  }>();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { mutate: updateUser } = useUpdate();

  // Update form when identity data changes
  useEffect(() => {
    if (identity) {
      form.setFieldsValue({
        first_name: identity.first_name,
        last_name: identity.last_name,
        email: identity.email,
        phone_number: identity.phone_number,
        address: identity.address,
        role: identity.role,
        status: identity.status,
      });
    }
  }, [identity, form]);

  const handleSubmit = async (values: any) => {
    if (!identity?.id) return;

    setLoading(true);
    try {
      updateUser(
        {
          resource: "users",
          id: identity.id,
          values: {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone_number: values.phone_number,
            address: values.address,
          },
        },
        {
          onSuccess: (data) => {
            message.success("Cập nhật hồ sơ thành công");
            setEditMode(false);

            // Update localStorage with new values
            const appUserStr = localStorage.getItem("appUser");
            if (appUserStr) {
              const appUser = JSON.parse(appUserStr);
              const updatedAppUser = {
                ...appUser,
                phone_number: values.phone_number,
                address: values.address,
              };
              localStorage.setItem("appUser", JSON.stringify(updatedAppUser));
            }

            const directusUserStr = localStorage.getItem("directusUser");
            if (directusUserStr) {
              const directusUser = JSON.parse(directusUserStr);
              const updatedDirectusUser = {
                ...directusUser,
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
              };
              localStorage.setItem(
                "directusUser",
                JSON.stringify(updatedDirectusUser)
              );
            }

            // Refetch identity to update UI
            refetch();
          },
          onError: (error) => {
            message.error("Cập nhật hồ sơ thất bại");
            console.error(error);
          },
        }
      );
    } catch (error) {
      message.error("Đã xảy ra lỗi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Avatar
              size={120}
              src={identity?.avatar}
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Title level={3}>
              {identity?.first_name} {identity?.last_name}
            </Title>
            <Text type="secondary">{identity?.email}</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              first_name: identity?.first_name,
              last_name: identity?.last_name,
              email: identity?.email,
              phone_number: identity?.phone_number,
              address: identity?.address,
              role: identity?.role,
              status: identity?.status,
            }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Tên"
                  name="first_name"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Họ"
                  name="last_name"
                  rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                >
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Vui lòng nhập email hợp lệ" },
              ]}
            >
              <Input disabled={!editMode} />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone_number">
              <Input disabled={!editMode} />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <Input.TextArea rows={4} disabled={!editMode} />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Vai trò" name="role">
                  <Select
                    disabled
                    options={[
                      { label: "Người dùng", value: "User" },
                      { label: "Nhân viên", value: "Staff" },
                      { label: "Quản trị viên", value: "Administrator" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Trạng thái" name="status">
                  <Select
                    disabled
                    options={[
                      { label: "Hoạt động", value: "active" },
                      { label: "Không hoạt động", value: "inactive" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                {!editMode ? (
                  <Button type="primary" onClick={() => setEditMode(true)}>
                    Chỉnh sửa hồ sơ
                  </Button>
                ) : (
                  <>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={loading}
                      onClick={async () => {
                        try {
                          const values = await form.validateFields();
                          handleSubmit(values);
                        } catch (error) {
                          console.error("Validation failed:", error);
                        }
                      }}
                    >
                      Lưu thay đổi
                    </Button>
                    <Button
                      onClick={() => {
                        setEditMode(false);
                        form.resetFields();
                      }}
                    >
                      Hủy
                    </Button>
                  </>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};
