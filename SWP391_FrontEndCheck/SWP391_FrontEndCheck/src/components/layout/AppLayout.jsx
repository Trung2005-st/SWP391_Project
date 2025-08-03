import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  DashboardOutlined,
  UnorderedListOutlined,
  MessageOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Input, Badge, Button, theme } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import logoImg from "../../../image/quit.png";
import "../../components/layout/override.css"; // file CSS bên dưới
import { ROUTES } from "../../configs/routes";

const { Header, Sider, Content } = Layout;

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  // Map path -> key
  const selectedKey = 
    {
      [ROUTES.ADMIN_DASHBOARD]: "1",
      [ROUTES.ADMIN_BLOG]: "2",
      [ROUTES.ADMIN_USER]: "3",
      [ROUTES.ADMIN_NOTIFICATION]: "4",
      [ROUTES.ADMIN_FEEDBACK]: "5",
    }[location.pathname] || "1";

  // Title/Sub
  const headers = {
    1: { title: "Dashboard", subtitle: "Overview of platform metrics" },
    2: { title: "Blog Management", subtitle: "Manage user Blogs" },
    3: { title: "Users", subtitle: "Manage your QuitHub users" },
    4: {
      title: "Notifications",
      subtitle: "Manage and send QuitHub notification",
    },
    5: {
      title: "Feedback",
      subtitle: "Manage your QuitHub feedback and response",
    },
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
        className="custom-sider"
      >
        {/* Logo */}
        <div className="sider-logo">
          <img src={logoImg} alt="QuitHub" className="sider-logo-img" />
          {!collapsed && (
            <div className="sider-logo-text">
              <div className="sider-logo-main">QuitHub</div>
              <div className="sider-logo-sub">Admin Panel</div>
            </div>
          )}
        </div>

        {/* Menu wrapper */}
        <div className="sider-menu-wrapper">
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => {
              switch (key) {
                case "1":
                  return navigate(ROUTES.ADMIN_DASHBOARD);
                case "2":
                  return navigate(ROUTES.ADMIN_BLOG);
                case "3":
                  return navigate(ROUTES.ADMIN_USER);
                case "4":
                  return navigate(ROUTES.ADMIN_NOTIFICATION);
                case "5":
                  return navigate(ROUTES.ADMIN_FEEDBACK);
                default:
                  return;
              }
            }}
            items={[
              { key: "1", icon: <DashboardOutlined />, label: "Dashboard" },
              {
                key: "2",
                icon: <MessageOutlined />,
                label: "Blog Management",
              },
              {
                key: "3",
                icon: <UnorderedListOutlined />,
                label: "User Management",
              },
              { key: "4", icon: <BellOutlined />, label: "Notifications" },
              { key: "5", icon: <CrownOutlined />, label: "Feedback" },
            ]}
            style={{ border: "none" }}
          />
        </div>

        {/* Bottom Panel */}
        {!collapsed && (
          <div className="bottomPanel">
            Admin Dashboard v1.0
            <div className="bottomPanelSmall">Smoke-Free Management</div>
          </div>
        )}
      </Sider>

      {/* MAIN */}
      <Layout>
        {/* HEADER */}
        <Header className="appHeader">
          <div className="appHeader-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="collapseBtn"
            />
            <div className="pageTitleWrapper">
              <span className="pageTitle">{headers[selectedKey].title}</span>
              <small className="pageSubtitle">
                {headers[selectedKey].subtitle}
              </small>
            </div>
          </div>

          <div className="appHeader-right">
            <Badge dot offset={[0, 4]}>
              <BellOutlined className="headerBell" />
            </Badge>
            <Navbar />
          </div>
        </Header>

        {/* CONTENT */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
