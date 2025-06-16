import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import AdminUser from "../../Pages/adminUser/AdminUser";
import Navbar from "./Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { ROUTES } from "../../configs/routes";
import { BookOutlined, ControlOutlined } from "@ant-design/icons/lib/icons";
const { Header, Sider, Content } = Layout;
const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "User management",
              onClick: () => navigate(ROUTES.ADMIN_USER),
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "Membership management",
              onClick: () => navigate(ROUTES.ADMIN_MEMBERSHIP),
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "Plan management",
              onClick: () => navigate(ROUTES.ADMIN_QUIT),
            },
            {
              key: "4",
              icon: <ControlOutlined></ControlOutlined>,
              label: "Coach registeration",
            },
            {
              key: "5",
              icon: <BookOutlined></BookOutlined>,
              label: "Coach Profile",
              onClick: () => navigate(ROUTES.ADMIN_COACHPROFILE),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Trái: Nút + tiêu đề */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 40,
                  height: 40,
                }}
              />
              <h2 style={{ margin: 0 }}>Admin</h2>
            </div>

            {/* Phải: Navbar */}
            <Navbar />
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 610,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default AppLayout;
