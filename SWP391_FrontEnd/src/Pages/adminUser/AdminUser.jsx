import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import api from "../../configs/axios";

function AdminUser() {
  const [originalData, setOriginalData] = useState([]); // lưu bản gốc
  const [dataSource, setDataSource] = useState([]);
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUserID, setEditingUserID] = useState(null);
  const [form] = useForm();

  const columns = [
    { title: "Id", dataIndex: "userID", key: "userID" },
    { title: "Name", dataIndex: "username", key: "username" },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (value) => {
        if (value === "MALE") return "Male";
        if (value === "FEMALE") return "Female";
        return "Unknown";
      },
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (value) => {
        if (value === 1) return "Member";
        if (value === 2) return "Coach";
        if (value === 3) return "Admin";
        return "Unknown";
      },
    },
    {
      title: "Create/Update Date",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (value) => {
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      },
    },
    {
      title: "Is Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (val) => (val === 1 ? "Yes" : "No"),
    },
    {
      title: "Membership",
      dataIndex: ["membershipPlan", "name"],
      key: "membershipPlan",
      render: (_, record) => record.membershipPlan?.name || "No Plan",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => onDelete(record.userID)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchPlans();
    fetchUser();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/membership");
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to load membership plans:", err);
      message.error("Failed to load membership plans!");
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/users");
      setOriginalData(res.data);
      setDataSource(res.data);
    } catch (err) {
      console.error("Fetch users failed:", err);
      message.error("Failed to load users!");
      setOriginalData([]);
      setDataSource([]);
    }
  };

  const onEdit = (record) => {
    setEditingUserID(record.userID);
    setOpen(true);
    form.setFieldsValue(record);
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      message.success("Deleted successfully!");
      fetchUser();
    } catch (err) {
      console.error("Delete failed:", err);
      message.error("Delete failed!");
    }
  };

  const onAddOrUpdate = async (values) => {
    try {
      if (editingUserID) {
        await api.put(`/users/${editingUserID}`, values);
        message.success("User updated successfully!");
      } else {
        await api.post("/users", values);
        message.success("User added successfully!");
      }
      form.resetFields();
      setOpen(false);
      setEditingUserID(null);
      fetchUser();
    } catch (err) {
      console.error("Error with Axios request:", err.response || err);
      message.error("Operation failed!");
    }
  };

  const searchUserById = (userId) => {
    const trimmed = userId.trim();
    if (!trimmed) {
      // nếu rỗng thì trả về all
      setDataSource(originalData);
      return;
    }
    const filtered = originalData.filter(
      (item) => String(item.userID) === trimmed
    );
    if (filtered.length) {
      setDataSource(filtered);
    } else {
      message.error("User not found!");
      setDataSource([]);
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
        <Input.Search
          placeholder="Enter user ID"
          allowClear
          style={{ width: 300 }}
          onSearch={searchUserById}
        />
        <Button type="primary" onClick={() => setOpen(true)}>
          Add User
        </Button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 6 }}
        rowKey="userID"
      />

      <Modal
        title={editingUserID ? "Edit User" : "Add User"}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditingUserID(null);
        }}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={onAddOrUpdate}>
          <Form.Item
            label="Name"
            name="username"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          {!editingUserID && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "You must input your password" },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message:
                    "Password must be at least 8 characters long, contain an uppercase, lowercase, number and special character.",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select your gender!" }]}
          >
            <Select>
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Select>
              <Select.Option value={1}>Member</Select.Option>
              <Select.Option value={2}>Coach</Select.Option>
              <Select.Option value={3}>Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Verify"
            name="isVerified"
            rules={[{ required: true, message: "Please select verify user!" }]}
          >
            <Select>
              <Select.Option value={1}>Yes</Select.Option>
              <Select.Option value={0}>No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Membership Plan"
            name={["membershipPlan", "planID"]}
          >
            <Select placeholder="Select a plan">
              {plans.map((plan) => (
                <Select.Option key={plan.planID} value={plan.planID}>
                  {plan.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
}

export default AdminUser;
