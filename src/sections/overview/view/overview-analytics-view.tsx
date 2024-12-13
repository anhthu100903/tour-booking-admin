import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';
import CanvasJSReact from '@canvasjs/react-charts'; // Import từ package bên ngoài

import { AnalyticsNews } from '../analytics-news'; // Imports nội bộ
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { chartBookType, chartDoanhThu } from 'src/service/chartService';
import { setToken, getToken } from 'src/service/localStorage';
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

// Mock data
const mockPosts = [
  { id: 1, title: "Phan Thị Anh Thư", date: "2024-01-01" },
  { id: 2, title: "H20", date: "2024-01-02" },
  { id: 3, title: "Anh Thư", date: "2024-01-03" },
  { id: 4, title: "Nguyễn Văn A", date: "2024-01-04" },
  { id: 5, title: "Nguyễn THị B", date: "2024-01-05" },
];

const mockTimeline = [
  { id: 1, title: "Tour Leo Núi Khám Phá - Fansipan", date: "2024-12-30" },
  { id: 2, title: "Tour Du Thuyền Khám Phá - Vịnh Hạ Long", date: "2024-12-30" },
  { id: 3, title: "Tour Thể Thao Mạo Hiểm - Ninh Thuận", date: "2024-12-29" },
];

export function OverviewAnalyticsView() {
  // Dữ liệu cho biểu đồ doanh thu
  


  const [typeTourBook, setTypeTourBook] = useState<any[]>([]);  // Đảm bảo state là mảng trống ban đầu
  const [doanhThu, setDoanhThu] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);  // Để quản lý trạng thái loading
  const [tokenExist, setTokenExist] = useState<boolean>(false);
  const token = getToken();  // Lấy token

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const tokenFromCookie = getCookie('token');
    if (tokenFromCookie) {
      setToken(tokenFromCookie);
      setTokenExist(true);
    } else {
      console.log('Không có token trong cookie');
    }
  }, []);
  


  const fetchBookType = async () => {
    setLoading(true);  // Bắt đầu tải dữ liệu
    try {
      const result = await chartBookType(token);
      console.log(result);  // Kiểm tra xem kết quả trả về có đúng không

      if (result) {
        // Chuyển đổi dữ liệu từ API thành dạng phù hợp cho biểu đồ
        const formattedData = result.map((item: any) => ({
          label: item[0],  // Tên tour
          y: item[1]      // Số lượng booking
        }));
        setTypeTourBook(formattedData);
      } else {
        console.error("Dữ liệu trả về không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tour:", error);
    } finally {
      setLoading(false);  // Kết thúc quá trình tải dữ liệu
    }
  };

  const fetchDoanhThu = async () => {
    setLoading(true);  // Bắt đầu tải dữ liệu
    try {
      const result = await chartDoanhThu(token);
      console.log(result);  // Kiểm tra xem kết quả trả về có đúng không

      if (result) {
        // Chuyển đổi dữ liệu từ API thành dạng phù hợp cho biểu đồ
        // Danh sách tên tháng
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Chuyển đổi dữ liệu thành định dạng yêu cầu
        const formattedData = result.map(item => ({
          label: months[item[0] - 1],  // Chuyển đổi tháng từ số thành tên
          y: item[1]                   // Số lượng doanh thu
        }));
        console.log(formattedData)
        setDoanhThu(formattedData);
      } else {
        console.error("Dữ liệu trả về không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tour:", error);
    } finally {
      setLoading(false);  // Kết thúc quá trình tải dữ liệu
    }
  }

  useEffect(() => {
    if (!token ) return;  // Không làm gì nếu token không có
    fetchDoanhThu();
    fetchBookType();
  }, [token]);  // useEffect chỉ chạy khi token thay đổi


  const tourChartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Thống kê mức độ phổ biến của các loại tour được đặt trong 3 tháng gần đây)."
    },
    data: [{
      type: "pie",
      showInLegend: true,
      toolTipContent: "<b>{label}</b>: {y}%",
      dataPoints: typeTourBook,
    }]
  };

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
      dataPoints: doanhThu
    }]
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Xin chào, Mừng bạn đã trở lại 👋
      </Typography>

      <Grid container spacing={3}>

        {/* Thêm biểu đồ doanh thu */}
        <Grid xs={12}>
          <CanvasJSChart options={revenueChartOptions} />
        </Grid>

        {/* Thêm biểu đồ phân bổ tour */}
        <Grid xs={12}>
          <CanvasJSChart options={tourChartOptions} />
        </Grid>
        

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="Khách hàng đã đặt tour gần đây" list={mockPosts} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Booking Tour gần đây" list={mockTimeline} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
