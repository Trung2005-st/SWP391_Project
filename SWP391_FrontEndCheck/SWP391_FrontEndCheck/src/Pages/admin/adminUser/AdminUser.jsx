import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  message,
  Avatar,
  Form,
  Select,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AppLayout from "../../../components/layout/AppLayout";
import api from "../../../configs/axios";
import avatarTracey from "../../../../image/avt.png";
import avatarJason from "../../../../image/avt2.png";
import avatarElizabeth from "../../../../image/avt3.png";
import styles from "./adminUser.module.css";

const avatars = [avatarTracey, avatarJason, avatarElizabeth];
const ROLES = [
  { value: 1, label: "Member" },
  { value: 2, label: "Coach" },
  { value: 3, label: "Admin" },
];
const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // NEW
  const [addModal, setAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/users");
      setUsers(
        res.data.map((user, idx) => ({
          ...user,
          avatar: avatars[idx % avatars.length],
          smokeFreeDays: randomInt(1, 50),
          moneySaved: randomInt(10, 500),
          blogs: randomInt(1, 10),
          blocked: user.blocked || false,
          status: typeof user.status === "boolean" ? user.status : true,
        }))
      );
    } catch {
      message.error("Failed to load users!");
      setUsers([]);
    }
  };

  // FILTER with status + search
  useEffect(() => {
    let result = [...users];
    if (searchKey)
      result = result.filter(
        (u) =>
          u.username &&
          u.username
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              searchKey
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            )
      );
    if (statusFilter === "active")
      result = result.filter((u) => u.status === true);
    else if (statusFilter === "locked")
      result = result.filter((u) => u.status === false);
    setFiltered(result);
  }, [searchKey, users, statusFilter]);

  const total = users.length,
    active = users.filter((u) => u.status === true).length,
    blocked = users.filter((u) => u.status === false).length;

  function getEmailFont(email) {
    if (!email) return {};
    if (email.length > 27) return { fontSize: "0.93rem" };
    if (email.length > 38) return { fontSize: "0.86rem" };
    return {};
  }

  const toggleStatus = async (user) => {
    try {
      const newStatus = !user.status;
      await api.put(`/users/${user.userID}`, { ...user, status: newStatus });
      message.success(
        newStatus ? "User unlocked successfully!" : "User locked successfully!"
      );
      fetchUser();
    } catch {
      message.error("Failed to update user status!");
    }
  };

  // ----- ADD USER FORM -----
  const handleAdd = () => {
    form.resetFields();
    setAddModal(true);
  };

  const handleAddOk = async () => {
    try {
      setAddLoading(true);
      const values = await form.validateFields();
      await api.post("/users", {
        ...values,
        joinDate: new Date(),
        status: true,
      });
      setAddModal(false);
      setAddLoading(false);
      message.success("User added successfully!");
      fetchUser();
    } catch (err) {
      setAddLoading(false);
      if (err?.errorFields) return;
      message.error("Failed to add user!");
    }
  };

  // ----- UPDATE USER FORM -----
  const handleUpdate = () => {
    updateForm.setFieldsValue({
      username: selectedUser.username,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      gender: selectedUser.gender,
      role: selectedUser.role,
      email: selectedUser.email,
      phone: selectedUser.phone,
      status: selectedUser.status,
    });
    setUpdateModal(true);
  };

  const handleUpdateOk = async () => {
    try {
      const values = await updateForm.validateFields();
      await api.put(`/users/${selectedUser.userID}`, {
        ...selectedUser,
        ...values,
        password: selectedUser.password,
      });
      setUpdateModal(false);
      setDetailModal(false);
      message.success("User updated successfully!");
      fetchUser();
    } catch {
      message.error("Failed to update user!");
    }
  };

  return (
    <AppLayout>
      <div className={styles.adminPageRoot}>
        {/* DASHBOARD */}
        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <span className={styles.statTitle}>Total Users</span>
              <span className={styles.statValue}>{total}</span>
            </div>
            <span className={styles.statIcon}>
              <UserOutlined />
            </span>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <span className={styles.statTitle}>Active Users</span>
              <span className={styles.statValue} style={{ color: "#16a34a" }}>
                {active}
              </span>
            </div>
            <span className={`${styles.statIcon} ${styles.green}`}>
              <UserOutlined />
            </span>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <span className={styles.statTitle}>Blocked Users</span>
              <span className={styles.statValue} style={{ color: "#f5222d" }}>
                {blocked}
              </span>
            </div>
            <span className={`${styles.statIcon} ${styles.red}`}>
              <UserOutlined />
            </span>
          </div>
        </div>

        {/* FILTER + ADD BTN ROW */}
        <div className={styles.filterRow}>
          <div className={styles.leftFilter}>
            <Input
              placeholder="Search users..."
              allowClear
              className={styles.searchInput}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Select
              className={styles.statusSelect}
              value={statusFilter}
              style={{ width: 110 }}
              onChange={(v) => setStatusFilter(v)}
              options={[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "locked", label: "Locked" },
              ]}
            />
          </div>
          <Button
            className={styles.addUserBtn}
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add User
          </Button>
        </div>

        {/* USER GRID */}
        <div className={styles.userGrid}>
          {filtered.map((user) => (
            <div
              className={styles.userCard}
              key={user.userID}
              onClick={() => {
                setSelectedUser(user);
                setDetailModal(true);
              }}
            >
              <div className={styles.userCardHeader}>
                <div className={styles.userHeaderLeft}>
                  <Avatar src={user.avatar} className={styles.userAvatar} />
                  <div className={styles.userMainInfo}>
                    <div className={styles.userName}>{user.username}</div>
                    <div
                      className={styles.userEmail}
                      style={getEmailFont(user.email)}
                    >
                      {user.email}
                    </div>
                  </div>
                </div>
                {user.blocked && (
                  <span className={styles.blockedTag}>
                    <UserOutlined style={{ marginRight: 3 }} />
                    Blocked
                  </span>
                )}
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <div
                    className={styles.infoValue + " " + styles.smokeDayValue}
                  >
                    {user.smokeFreeDays}
                  </div>
                  <div className={styles.infoLabel}>Smoke-free Days</div>
                </div>
                <div className={styles.infoItem}>
                  <div
                    className={styles.infoValue + " " + styles.moneySavedValue}
                  >
                    {user.moneySaved}$
                  </div>
                  <div className={styles.infoLabel}>Money Saved</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoValue + " " + styles.blogsValue}>
                    {user.blogs}
                  </div>
                  <div className={styles.infoLabel}>Blogs</div>
                </div>
              </div>
              <div className={styles.userJoined}>
                Joined{" "}
                {user.joinDate
                  ? new Date(user.joinDate).toLocaleDateString("en-US")
                  : ""}
              </div>
              <Button
                className={user.status ? styles.lockBtn : styles.unblockBtn}
                style={{
                  background: user.status ? "#ff4747" : "#16a34a",
                  color: "#fff",
                  fontWeight: 700,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStatus(user);
                }}
              >
                {user.status ? "Lock User" : "Unlock User"}
              </Button>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        <Modal
          title={
            <span style={{ fontWeight: 600, fontSize: 18 }}>
              <UserOutlined style={{ marginRight: 7 }} />
              User Detail
            </span>
          }
          open={detailModal}
          onCancel={() => setDetailModal(false)}
          footer={[
            <Popconfirm
              key="delete"
              title="Are you sure delete this user?"
              okText="Yes"
              cancelText="No"
              icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
              onConfirm={async () => {
                try {
                  await api.delete(`/users/${selectedUser.userID}`);
                  message.success("User deleted!");
                  setDetailModal(false);
                  fetchUser();
                } catch (err) {
                  message.error("Delete failed!");
                }
              }}
            >
              <Button type="primary" danger>
                Delete User
              </Button>
            </Popconfirm>,
            <Button
              key="update"
              style={{
                background: "#16a34a",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                marginLeft: 8,
              }}
              onClick={() => handleUpdate()}
            >
              Update
            </Button>,
            <Button key="close" onClick={() => setDetailModal(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedUser && (
            <div className={styles.modalDetailWrapper}>
              <div className={styles.modalUserHeader}>
                <Avatar src={selectedUser.avatar} size={54} />
                <div style={{ marginLeft: 13 }}>
                  <div className={styles.modalUserName}>
                    {selectedUser.username}
                  </div>
                  <div
                    className={styles.modalUserEmail}
                    style={getEmailFont(selectedUser.email)}
                  >
                    {selectedUser.email}
                  </div>
                  <div className={styles.modalUserJoined}>
                    Joined:{" "}
                    {selectedUser.joinDate
                      ? new Date(selectedUser.joinDate).toLocaleDateString(
                          "en-US"
                        )
                      : ""}
                  </div>
                </div>
              </div>
              <div
                className={styles.infoRow}
                style={{ margin: "13px 0 12px 0" }}
              >
                <div className={styles.infoItem}>
                  <div
                    className={styles.infoValue + " " + styles.smokeDayValue}
                  >
                    {selectedUser.smokeFreeDays}
                  </div>
                  <div className={styles.infoLabel}>Smoke-free Days</div>
                </div>
                <div className={styles.infoItem}>
                  <div
                    className={styles.infoValue + " " + styles.moneySavedValue}
                  >
                    {selectedUser.moneySaved}$
                  </div>
                  <div className={styles.infoLabel}>Money Saved</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoValue + " " + styles.blogsValue}>
                    {selectedUser.blogs}
                  </div>
                  <div className={styles.infoLabel}>Blogs</div>
                </div>
              </div>
              <div className={styles.modalMetaList}>
                <span>
                  <b>Gender:</b>{" "}
                  {selectedUser.gender === "MALE"
                    ? "Male"
                    : selectedUser.gender === "FEMALE"
                      ? "Female"
                      : "Unknown"}
                </span>
                <span>
                  <b>Role:</b>{" "}
                  {selectedUser.role === 1
                    ? "Member"
                    : selectedUser.role === 2
                      ? "Coach"
                      : selectedUser.role === 3
                        ? "Admin"
                        : "Unknown"}
                </span>
                <span>
                  <b>Phone:</b> {selectedUser.phone || "N/A"}
                </span>
              </div>
            </div>
          )}
        </Modal>

        {/* ADD USER MODAL */}
        <Modal
          open={addModal}
          title="Add New User"
          onCancel={() => setAddModal(false)}
          onOk={handleAddOk}
          okText="Save"
          confirmLoading={addLoading}
          width={570}
          bodyStyle={{ padding: "28px 38px 10px 38px" }}
        >
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            style={{ marginTop: 4 }}
          >
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ flex: 1 }}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input username!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    { required: true, message: "Please input first name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: "Select role!" }]}
                >
                  <Select options={ROLES} />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input email!" },
                    { type: "email", message: "Invalid email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div style={{ flex: 1 }}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please input last name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: "Select gender!" }]}
                >
                  <Select options={GENDERS} />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: "Please input phone!" }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>

        {/* UPDATE USER MODAL */}
        <Modal
          open={updateModal}
          title="Update User"
          onCancel={() => setUpdateModal(false)}
          onOk={handleUpdateOk}
          okText="Save"
          width={570}
          bodyStyle={{ padding: "28px 38px 10px 38px" }}
        >
          <Form
            form={updateForm}
            layout="vertical"
            autoComplete="off"
            style={{ marginTop: 4 }}
          >
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ flex: 1 }}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input username!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    { required: true, message: "Please input first name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: "Select role!" }]}
                >
                  <Select options={ROLES} />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input email!" },
                    { type: "email", message: "Invalid email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div style={{ flex: 1 }}>
                {/* Không có field password */}
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please input last name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: "Select gender!" }]}
                >
                  <Select options={GENDERS} />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: "Please input phone!" }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
}
