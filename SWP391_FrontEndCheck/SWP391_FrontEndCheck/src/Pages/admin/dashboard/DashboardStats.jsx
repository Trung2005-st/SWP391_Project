import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, DatePicker, message, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip as BarTooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import api from "../../../configs/axios";
import AppLayout from "../../../components/layout/AppLayout";

export default function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [range, setRange] = useState([moment().subtract(6, "days"), moment()]);
  const [loading, setLoading] = useState(true);

  const [userTrend, setUserTrend] = useState([]);
  const [planTrend, setPlanTrend] = useState([]);
  const [moneyTrend, setMoneyTrend] = useState([]);
  const [ratingTrend, setRatingTrend] = useState([]);

  useEffect(() => {
    fetchAll();
  }, [range]);

  async function fetchAll() {
    setLoading(true);
    try {
      const { data: s } = await api.get("/dashboard/stats");
      setStats(s);

      const from = range[0].format("YYYY-MM-DD");
      const to = range[1].format("YYYY-MM-DD");

      const [userRes, planRes, moneyRes, ratingRes] = await Promise.all([
        api.get(`/dashboard/new-users-trend?from=${from}&to=${to}`),
        api.get(`/dashboard/plan-trend?from=${from}&to=${to}`),
        api.get(`/dashboard/money-saved-trend?from=${from}&to=${to}`),
        api.get(`/dashboard/rating-trend?from=${from}&to=${to}`),
      ]);

      setUserTrend(userRes.data);
      setPlanTrend(planRes.data);
      setMoneyTrend(moneyRes.data);
      setRatingTrend(ratingRes.data);
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
        {/* Stat summary cards */}
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
                title="Money Saved ($)"
                value={stats.totalMoneySaved}
                precision={2}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Trend Charts */}
        <DatePicker.RangePicker
          value={range}
          onChange={(r) => setRange(r)}
          allowClear={false}
          style={{ marginBottom: 24 }}
        />

        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card title="New Users Trend">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userTrend} margin={{ top: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <BarTooltip />
                  <Legend />
                  <Bar dataKey="count" name="New Users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Quit Plans Created">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={planTrend} margin={{ top: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <BarTooltip />
                  <Legend />
                  <Bar dataKey="count" name="Plans" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Money Saved Trend ($)">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moneyTrend} margin={{ top: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <BarTooltip />
                  <Legend />
                  <Bar dataKey="count" name="Dollars Saved" fill="#fa8c16" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Feedback Emoji Rating">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingTrend} margin={{ top: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <BarTooltip />
                  <Legend />
                  <Bar dataKey="count" name="Emoji Rating" fill="#722ed1" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    </AppLayout>
  );
}
