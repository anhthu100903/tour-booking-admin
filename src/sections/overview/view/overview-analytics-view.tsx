import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';
import CanvasJSReact from '@canvasjs/react-charts'; // Import từ package bên ngoài

import { AnalyticsNews } from '../analytics-news'; // Imports nội bộ
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

// Mock data
const mockPosts = [
  { id: 1, title: "Tin tức 1", date: "2024-01-01" },
  { id: 2, title: "Tin tức 2", date: "2024-01-02" },
  { id: 3, title: "Tin tức 3", date: "2024-01-03" },
  { id: 4, title: "Tin tức 4", date: "2024-01-04" },
  { id: 5, title: "Tin tức 5", date: "2024-01-05" },
];

const mockTimeline = [
  { id: 1, title: "Booking 1", date: "2024-01-01" },
  { id: 2, title: "Booking 2", date: "2024-01-02" },
  { id: 3, title: "Booking 3", date: "2024-01-03" },
];

export function OverviewAnalyticsView() {
  // Dữ liệu cho biểu đồ doanh thu
  const revenueChartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Doanh thu hàng tháng"
    },
    axisY: {
      title: "Doanh thu (VND)"
    },
    data: [{
      type: "column",
      dataPoints: [
        { label: "Jan", y: 714000 },
        { label: "Feb", y: 800000 },
        { label: "Mar", y: 500000 },
        { label: "Apr", y: 600000 },
        { label: "May", y: 800000 },
        { label: "Jun", y: 900000 },
        { label: "Jul", y: 700000 },
        { label: "Aug", y: 800000 }
      ]
    }]
  };

  // Dữ liệu cho biểu đồ phân bổ tour
  const tourData = [
    { label: "Tour 1", y: 30 },
    { label: "Tour 2", y: 20 },
    { label: "Tour 3", y: 25 },
    { label: "Tour 4", y: 15 },
    { label: "Tour 5", y: 10 },
  ];

  const tourChartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Phân bổ các loại tour"
    },
    data: [{
      type: "pie",
      showInLegend: true,
      toolTipContent: "<b>{label}</b>: {y}%",
      dataPoints: tourData,
    }]
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Doanh thu hàng tháng"
            percent={2.6}
            total={714000}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Khách hàng mới hàng tháng"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Tour hàng tháng"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Booking tour hàng tháng"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-tour-booking.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="Tin tức mới" list={mockPosts} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Booking Tour gần đây" list={mockTimeline} />
        </Grid>

        {/* Thêm biểu đồ doanh thu */}
        <Grid xs={12}>
          <CanvasJSChart options={revenueChartOptions} />
        </Grid>

        {/* Thêm biểu đồ phân bổ tour */}
        <Grid xs={12}>
          <CanvasJSChart options={tourChartOptions} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
