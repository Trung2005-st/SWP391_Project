// src/Pages/adminDashboard/DashboardStats.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, DatePicker, message, Spin } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip as BarTooltip,
} from "recharts";
import moment from "moment";
import api from "../../configs/axios";
import AppLayout from "../../components/layout/AppLayout";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE"];

export default function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [membershipData, setMembershipData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState([moment().subtract(6, "days"), moment()]);

  useEffect(() => {
    fetchAll();
  }, [range]);

  async function fetchAll() {
    setLoading(true);
    try {
      // 1) summary stats
      const { data: s } = await api.get("/dashboard/stats");
      console.log("Stats:", s);
      setStats(s);

      // 2) membership distribution
      const { data: mem } = await api.get("/reports/members-by-plan");
      console.log("Membership raw:", mem);
      setMembershipData(
        mem.map(({ planName, memberCount }) => ({
          name: planName,
          value: memberCount,
        }))
      );

      // 3) new users trend
      const from = range[0].format("YYYY-MM-DD");
      const to = range[1].format("YYYY-MM-DD");
      const { data: trend } = await api.get(
        `/dashboard/new-users-trend?from=${from}&to=${to}`
      );
      console.log("Trend raw:", trend);
      setTrendData(trend);
    } catch (err) {
      console.error(err);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin tip="Loading dashboard..." size="large" />
        </div>
      </AppLayout>
    );
  }

  if (!stats) {
    return (
      <AppLayout>
        <p style={{ textAlign: "center", fontSize: 18, color: "red" }}>
          No dashboard data available.
        </p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ padding: 24, background: "#fff", borderRadius: 12 }}>
        {/* --- StatBoxes --- */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats.totalUser}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Coaches"
                value={stats.totalCoach}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="New Users (30d)"
                value={stats.newUserCount}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Top Membership"
                value={stats.mostUsedMembership}
                suffix={`(${stats.mostUsedMembershipCount})`}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
        </Row>

        {/* --- Charts --- */}
        <Row gutter={16}>
          <Col xs={24} lg={12} style={{ marginBottom: 24 }}>
            <Card title="Membership Plan Distribution">
              {membershipData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={membershipData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {membershipData.map((_, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <PieTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: "center", padding: 50 }}>
                  No membership data to display.
                </p>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title="New Users Trend"
              extra={
                <DatePicker.RangePicker
                  value={range}
                  onChange={(r) => setRange(r)}
                  allowClear={false}
                />
              }
            >
              {trendData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trendData} margin={{ top: 20, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <BarTooltip />
                    <Legend />
                    <Bar dataKey="count" name="New Users" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: "center", padding: 50 }}>
                  No trend data to display.
                </p>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </AppLayout>
  );
}
