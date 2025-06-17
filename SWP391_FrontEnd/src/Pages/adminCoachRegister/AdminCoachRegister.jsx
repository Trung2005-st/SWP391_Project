// src/Pages/adminCoachRegister/AdminCoachRegisterInfo.jsx
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import api from "../../configs/axios";

const { Search, TextArea } = Input;
const { Option } = Select;

export default function AdminCoachRegister() {
  const [originalData, setOriginalData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  const columns = [
    { title: "Register ID", dataIndex: "registerId", key: "registerId" },
    { title: "User Name", dataIndex: "username", key: "username" },
    { title: "User Email", dataIndex: "email", key: "email" },
    {
      title: "Register Date",
      dataIndex: "registerDate",
      key: "registerDate",
      render: (value) =>
        value
          ? new Date(value).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "",
    },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "PENDING" ? (
          <Space size="small">
            <Popconfirm
              title="Are you sure you want to approve this registration?"
              onConfirm={() => handleApprove(record)}
              okText="Approve"
              cancelText="Cancel"
            >
              <Button type="primary">Approve</Button>
            </Popconfirm>
            <Popconfirm
              title="Are you sure you want to reject this registration?"
              onConfirm={() => handleReject(record)}
              okText="Reject"
              cancelText="Cancel"
            >
              <Button danger>Reject</Button>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  useEffect(() => {
    fetchRegistrations();
    fetchUsers();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/coach-register-info");
      setOriginalData(res.data);
      setDataSource(res.data);
    } catch (err) {
      console.error("Fetch registrations failed:", err);
      message.error("Failed to load registrations!");
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      // Only members (role === 1)
      setUsers(res.data.filter((u) => u.role === 1));
    } catch (err) {
      console.error("Fetch users failed:", err);
      message.error("Failed to load users!");
    }
  };

  const handleApprove = async ({ registerId }) => {
    try {
      await api.post(`/coach-register-info/${registerId}/approve`);
      message.success("Registration approved and user role updated!");
      fetchRegistrations();
    } catch (err) {
      console.error("Approve failed:", err);
      message.error("Approve action failed!");
    }
  };

  const handleReject = async ({ registerId }) => {
    try {
      await api.post(`/coach-register-info/${registerId}/reject`);
      message.success("Registration rejected!");
      fetchRegistrations();
    } catch (err) {
      console.error("Reject failed:", err);
      message.error("Reject action failed!");
    }
  };

  const onSearch = (value) => {
    const term = value.trim().toLowerCase();
    if (!term) {
      setDataSource(originalData);
      return;
    }
    const filtered = originalData.filter(
      (item) =>
        String(item.registerId) === term ||
        item.username.toLowerCase().includes(term)
    );
    if (filtered.length) {
      setDataSource(filtered);
    } else {
      message.error("No matching records found!");
      setDataSource([]);
    }
  };

  const onAdd = () => {
    form.resetFields();
    setOpen(true);
  };

  const onFinish = async (values) => {
    try {
      await api.post("/coach-register-info", {
        user: { userID: values.userID },
        reason: values.reason,
      });
      message.success("New registration added!");
      setOpen(false);
      fetchRegistrations();
    } catch (err) {
      console.error("Add registration failed:", err);
      message.error("Add registration failed!");
    }
  };

  return (
    <AppLayout>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Search
          placeholder="Search ID or Username"
          allowClear
          style={{ width: 300 }}
          onSearch={onSearch}
        />
        <Button type="primary" onClick={onAdd}>
          Add Registration
        </Button>
      </div>

      <Table
        rowKey="registerId"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 6 }}
        locale={{
          emptyText: loading ? "Loading..." : "No registrations found",
        }}
      />

      <Modal
        title="Add New Registration"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Select User"
            name="userID"
            rules={[{ required: true, message: "Please select a user!" }]}
          >
            <Select placeholder="User">
              {users.map((u) => (
                <Option key={u.userID} value={u.userID}>
                  {u.username} ({u.email})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: "Please input reason!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
}
