// src/Pages/adminQuitPlan/AdminQuitPlan.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
} from "antd";
import { useForm } from "antd/es/form/Form";
import api from "../../../configs/axios"; // use your configured instance
import AppLayout from "../../../components/layout/AppLayout";
import dayjs from "dayjs";

export default function AdminQuitPlan() {
  const [dataSource, setDataSource] = useState([]);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]); // <-- new
  const [open, setOpen] = useState(false);
  const [editingPlanID, setEditingPlanID] = useState(null);
  const [form] = useForm();

  useEffect(() => {
    fetchPlans();
    fetchUsers(); // <-- fetch users
    fetchQuitPlans();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      message.error("Failed to load users");
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get("/membership");
      setPlans(res.data);
    } catch {
      message.error("Failed to load membership plans!");
    }
  };

  const fetchQuitPlans = async () => {
    try {
      const res = await api.get("/quitPlan");
      setDataSource(res.data);
    } catch {
      message.error("Failed to load quit plans!");
      setDataSource([]);
    }
  };

  const onEdit = (record) => {
    setEditingPlanID(record.quitID);
    setOpen(true);
    form.setFieldsValue({
      userID: record.user?.userID, // <-- new
      planID: record.plan?.planID,
      endDate: dayjs(record.endDate),
      reason: record.reason,
      stage: record.stage,
    });
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/quitPlan/${id}`);
      message.success("Deleted successfully!");
      fetchQuitPlans();
    } catch {
      message.error("Delete failed!");
    }
  };

  const onAddOrUpdate = async (values) => {
    if (!values.userID) {
      return message.error("Please select a user!");
    }
    if (!values.planID) {
      return message.error("Please select a membership plan!");
    }
    if (!values.endDate) {
      return message.error("Please select an end date!");
    }
    if (!values.reason.trim()) {
      return message.error("Please enter a reason!");
    }

    const requestData = {
      user: { userID: values.userID }, // <-- send selected user
      plan: { planID: values.planID },
      startDate: new Date().toISOString().split("T")[0],
      endDate: values.endDate.format("YYYY-MM-DD"),
      reason: values.reason.trim(),
      stage: values.stage || "PENDING",
    };

    try {
      if (editingPlanID) {
        await api.put(`/quitPlan/${editingPlanID}`, requestData);
        message.success("Quit plan updated!");
      } else {
        await api.post("/quitPlan", requestData);
        message.success("Quit plan created!");
      }
      form.resetFields();
      setOpen(false);
      setEditingPlanID(null);
      fetchQuitPlans();
    } catch (error) {
      console.error(error);
      message.error(
        "Operation failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const searchQuitPlanById = async (id) => {
    const term = id.trim();
    if (!term) return fetchQuitPlans();
    try {
      const res = await api.get(`/quitPlan/${term}`);
      setDataSource([res.data]);
    } catch {
      message.error("Quit plan not found!");
      setDataSource([]);
    }
  };

  const columns = [
    { title: "Id", dataIndex: "quitID", key: "quitID" },
    {
      title: "User", // <-- new column
      dataIndex: ["user", "username"],
      key: "username",
      render: (_, rec) => rec.user?.username || "—",
    },
    {
      title: "Membership Plan",
      dataIndex: ["plan", "name"],
      key: "plan",
      render: (_, rec) => rec.plan?.name || "—",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (d) => d?.split("T")[0],
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (d) => d?.split("T")[0],
    },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Stage", dataIndex: "stage", key: "stage" },
    {
      title: "Actions",
      key: "actions",
      render: (_, rec) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(rec)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this quit plan?"
            onConfirm={() => onDelete(rec.quitID)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger ghost>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Input.Search
          placeholder="Enter quit ID"
          allowClear
          style={{ width: 300 }}
          onSearch={searchQuitPlanById}
        />
        <Button type="primary" onClick={() => setOpen(true)}>
          Add Quit Plan
        </Button>
      </div>

      <Table
        rowKey="quitID"
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 6 }}
      />

      <Modal
        title={editingPlanID ? "Edit Quit Plan" : "Add Quit Plan"}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditingPlanID(null);
        }}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={onAddOrUpdate}>
          <Form.Item
            name="userID"
            label="User"
            rules={[{ required: true, message: "Please select a user!" }]}
          >
            <Select placeholder="Choose a user">
              {users.map((u) => (
                <Select.Option key={u.userID} value={u.userID}>
                  {u.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="planID"
            label="Membership Plan"
            rules={[{ required: true, message: "Please select a plan!" }]}
          >
            <Select placeholder="Choose a plan">
              {plans.map((p) => (
                <Select.Option key={p.planID} value={p.planID}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please input quit end date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: "Please input quit reason!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="stage"
            label="Stage"
            rules={[{ required: true, message: "Please input quit stage!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
}
