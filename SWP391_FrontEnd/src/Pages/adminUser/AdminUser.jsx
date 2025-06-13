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
import axios from "axios";
import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";

function AdminUser() {
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [editingUserID, setEditingUserID] = useState(null); // string | null
  const [plans, setPlans] = useState([]);

  const columns = [
    {
      title: "Id",
      dataIndex: "userID",
      key: "userID",
    },
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (value) => {
        switch (value) {
          case "MALE":
            return "Male";
          case "FEMALE":
            return "Female";
          default:
            return "Unknown";
        }
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (value) => {
        switch (value) {
          case 1:
            return "Member";
          case 2:
            return "Coach";
          case 3:
            return "Admin";
          default:
            return "Unknown";
        }
      },
    },
    {
      title: "CreateDate",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (value) => {
        if (!value) {
          const date = new Date(value);
          return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
        }
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
      render: (values) => {
        if (values == 1) {
          return "Yes";
        } else {
          return "No";
        }
      },
    },
    {
      title: "Membership",
      dataIndex: ["membershipPlan", "name"],
      key: "membershipPlan",
      render: (value, record) => {
        console.log("User record:", record);
        return record.membershipPlan?.name || "No Plan";
      },
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
    fetchUser();
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/membership"); // tạo API nếu chưa có
      setPlans(res.data);
    } catch (err) {
      console.log(err.message + plans);
      message.error("Failed to load membership plans!");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      setDataSource(response.data);
    } catch (error) {
      console.error("Fetch users failed:", error);
      message.error("Failed to load users!");
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
      await axios.delete(`http://localhost:8080/api/users/${id}`);
      message.success("Deleted successfully!");
      fetchUser();
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Delete failed!");
    }
  };

  const onAddOrUpdate = async (values) => {
    try {
      if (editingUserID) {
        await axios.put(
          `http://localhost:8080/api/users/${editingUserID}`,
          values
        );
        message.success("User updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/users", values);
        message.success("User added successfully!");
      }
      form.resetFields();
      setOpen(false);
      setEditingUserID(null);
      fetchUser();
    } catch (error) {
      console.error(
        "Error with Axios request:",
        error.response ? error.response.data : error.message
      );
      message.error("Operation failed!");
    }
  };

  const searchUserById = async (userId) => {
    const trimmedUserId = userId.trim();
    if (!trimmedUserId) {
      // Nếu input rỗng thì load lại tất cả user
      fetchUser();
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${trimmedUserId}`
      );
      setDataSource([response.data]);
    } catch (error) {
      console.error("Search user failed:", error);
      message.error("User not found!");
      setDataSource([]);
    }
  };

  return (
    <AppLayout>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
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
          destroyOnClose
        >
          <Form layout="vertical" onFinish={onAddOrUpdate} form={form}>
            <Form.Item
              label="Name"
              name="username"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message:
                    "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
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
              rules={[
                { required: true, message: "Please select your gender!" },
              ]}
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
              rules={[
                { required: true, message: "Please select verify user!" },
              ]}
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
      </div>
    </AppLayout>
  );
}

export default AdminUser;
