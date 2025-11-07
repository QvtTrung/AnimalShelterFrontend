import { useGetIdentity, usePermissions } from "@refinedev/core";
import { Row, Col, Card, Avatar, Typography, Space, Tag } from "antd";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/leaflet/marker-icon-2x.png",
  iconUrl: "/images/leaflet/marker-icon.png",
  shadowUrl: "/images/leaflet/marker-shadow.png",
});

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  const { data: user } = useGetIdentity({});
  console.log("Dashboard - user data:", user);
  const { data: permissions } = usePermissions({});
  console.log("Dashboard - permissions:", permissions);

  // Default position (can be updated based on user location)
  const [position, setPosition] = useState<[number, number]>([
    10.0316, 105.7502,
  ]); // Custom coordinates

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar size={64} src={user?.avatar} style={{ marginRight: 16 }}>
                {user?.first_name?.charAt(0) ||
                  user?.email?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {user?.first_name} {user?.last_name}
                </Title>
                <Text type="secondary">{user?.email}</Text>
              </div>
            </div>
            <div>
              <Space wrap>
                <Tag color="blue">Role: {user?.role || "User"}</Tag>
                {/* {permissions?.map((permission: string) => (
                  <Tag key={permission} color="green">
                    {permission}
                  </Tag>
                ))} */}
              </Space>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card title="Account Information" variant="borderless">
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text strong>First Name:</Text>
              <br />
              <Text>{user?.first_name || "N/A"}</Text>
            </div>
            <div>
              <Text strong>Last Name:</Text>
              <br />
              <Text>{user?.last_name || "N/A"}</Text>
            </div>
            <div>
              <Text strong>Email:</Text>
              <br />
              <Text>{user?.email || "N/A"}</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card title="System Information" variant="borderless">
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text strong>User ID:</Text>
              <br />
              <Text>{user?.id || "N/A"}</Text>
            </div>
            <div>
              <Text strong>Account Created:</Text>
              <br />
              <Text>
                {user?.date_created
                  ? new Date(user.date_created).toLocaleDateString()
                  : "N/A"}
              </Text>
            </div>
            <div>
              <Text strong>Last Updated:</Text>
              <br />
              <Text>
                {user?.date_updated
                  ? new Date(user.date_updated).toLocaleDateString()
                  : "N/A"}
              </Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card title="Quick Stats" variant="borderless">
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text strong>Status:</Text>
              <br />
              <Tag color={user?.status === "active" ? "green" : "red"}>
                {user?.status || "Unknown"}
              </Tag>
            </div>
            <div>
              <Text strong>Language:</Text>
              <br />
              <Text>{user?.language || "English"}</Text>
            </div>
            <div>
              <Text strong>Timezone:</Text>
              <br />
              <Text>{user?.timezone || "UTC"}</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24}>
        <Card title="Animal Rescue Map" variant="borderless">
          <div style={{ height: "400px", width: "100%" }}>
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position}>
                <Popup>Your Location</Popup>
              </Marker>
            </MapContainer>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
