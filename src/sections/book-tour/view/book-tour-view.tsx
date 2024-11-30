import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Modal,
  TextField,
  Select,
  MenuItem,
  IconButton,
  SvgIcon,
  SelectChangeEvent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { getToken } from 'src/service/localStorage';
import { getBookingInfo } from 'src/service/bookTourService';

const CustomDeleteIcon = () => (
  <SvgIcon>
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM16 4h-2V2H10v2H6v2h12V4z" />
  </SvgIcon>
);

const CustomEditIcon = () => (
  <SvgIcon>
    <path d="M3 17.25V21h3.75L18.81 10.94l-3.75-3.75L3 17.25zm2.88-.98L13.02 8.9l3.75 3.75-7.22 7.22L5.88 16.27zm9.58-9.58l1.34-1.34c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.34 1.34 1.41 1.41 1.34-1.34z" />
  </SvgIcon>
);

// Mock data
const mockData = [
  {
    id: 1,
    customerName: 'Nguyen Van A',
    tourInfo: 'Tour Đà Lạt',
    tripName: 'Đà Lạt Adventure',
    bookingDate: '2024-12-01',
    adults: 2,
    children: 1,
    paymentStatus: 'paid',
  },
  {
    id: 2,
    customerName: 'Tran Thi B',
    tourInfo: 'Tour Nha Trang',
    tripName: 'Beach Relax',
    bookingDate: '2024-12-05',
    adults: 3,
    children: 0,
    paymentStatus: 'unpaid',
  },
];

interface Booking {
  id: number | string;
  numberOfAdult: number;
  numberOfChildren: number;
  numberOfBaby: number;
  departureDate: string | null;
  createdAt: string;
  tourId: number;
  tourName: String;
  destinitation: String;
  userId: number;
  fullName: string;
  email: string;
  payment: any; // Thay thế 'any' bằng kiểu cụ thể nếu có thể
  active: boolean;
}

export function BookTourView() {
  const [bookings, setBookings] = useState<Booking[]>([]); // Lưu trữ danh sách booking
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(false); // Trạng thái lỗi
  const fetchCalled = useRef(false); // Sử dụng useRef để tránh gọi API nhiều lần
  const [changeSelect, setChangeSelect] = useState('pending');
  const [bookingData, setBookingData] = useState<{
    id: number | string;
    customerName: string;
    tourInfo: string;
    tripName: string;
    bookingDate: string;
    adults: string;
    children: string;
    baby: string;
    paymentStatus: boolean;
    email: string;
    userId: string;
    paymentId: string | null;
  }[]>([]);  // Khai báo mảng kiểu Booking[]
  

  const [formData, setFormData] =  useState<{
    id: number | string;
    customerName: string;
    tourInfo: string;
    tripName: string;
    bookingDate: string;
    adults: string;
    children: string;
    baby: string;
    paymentStatus: boolean;
    email: string;
    userId: string;
    paymentId: string | null;
  }>({
    id: '', // id có thể là number hoặc string
    customerName: '',
    tourInfo: '',
    tripName: '',
    bookingDate: '',
    adults: '',
    children: '',
    baby: '',
    paymentStatus: false,
    email: '',
    userId: '',
    paymentId: '',
  });  // Khai báo đối tượng thay vì mảng
  

  const resetForm = () => {
    setFormData({
      id: '',
      customerName: '',
      tourInfo: '',
      tripName: '',
      bookingDate: '',
      adults: '',
      children: '',
      baby: '',
      paymentStatus: false,
      email: '',
      userId: '',
      paymentId: '',
    });
  };

  const PAGE = 0;
  const PAGESIZE = 20;
  const TOKEN = getToken();

  const fetchBookings = async (page = PAGE, pageSize = PAGESIZE) => {
    if (fetchCalled.current) return; // Tránh gọi API nhiều lần
    fetchCalled.current = true; // Đánh dấu là đã gọi API

    try {
      // Gọi API với TOKEN trong header
      const data = await getBookingInfo(page, pageSize, TOKEN); // Giả sử getBookingInfo hỗ trợ token trong header
      
      console.log(data)
      // Nếu dữ liệu không hợp lệ hoặc rỗng, không xử lý
      if (!data || data.length === 0) {
        console.error("Dữ liệu không hợp lệ hoặc không có dữ liệu.");
        setError(true);
        return;
      }
      // Cập nhật state bookings với dữ liệu mới
      setBookings((prevBookings) => [...prevBookings, ...data]);  // Nối mảng cũ và mảng mới

      // Nếu chỉ lấy một booking đầu tiên (hoặc cần update form theo booking)
      if (data && data.length > 0) {
        // Duyệt qua tất cả các phần tử trong data
        const bookings = data.map((booking: Booking) => ({
          id: booking.id,
          customerName: booking.fullName,
          tourInfo: booking.tourName,
          tripName: booking.destinitation ?? '',
          bookingDate: booking.departureDate ?? '',
          adults: booking.numberOfAdult ?? '',
          children: booking.numberOfChildren ?? '',
          baby: booking.numberOfBaby || '',
          paymentStatus: booking.payment?.active || false,  // Cẩn thận nếu payment có thể là null
          userId: booking.userId,
          paymentId: booking.payment?.id ?? '',
          email: booking.email ?? '',
        }));
        // Cập nhật bookingData với các booking mới
        setBookingData((prevData) => [...prevData, ...bookings]);
      }
    } catch (error) {
      console.log(error);
      setError(true); // Bật trạng thái lỗi nếu có vấn đề
    } finally {
      setLoading(false);  // Tắt trạng thái loading sau khi hoàn thành
    }
  };

  useEffect(() => {
    if (TOKEN) {
      fetchBookings(0, PAGESIZE);
      console.log(bookingData);
    } else {
      setError(true);  // Nếu không có token, bật lỗi
    }
  }, [TOKEN]);  // Chạy lại nếu TOKEN thay đổi









  const [data, setData] = useState(mockData);
  const [filterName, setFilterName] = useState('');
  const [openForm, setOpenForm] = useState(false);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name || '']: value });
  };

  // const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name || '']: value });
  // };

  // const handleFormSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (formData.id) {
  //     // Update data
  //     setData((prevData) =>
  //       prevData.map((item) => (item.id === formData.id ? { ...formData } : item))
  //     );
  //   } else {
  //     // Add new data
  //     setData((prevData) => [
  //       ...prevData,
  //       { id: prevData.length + 1, ...formData },
  //     ]);
  //   }
  //   setOpenForm(false); // Close form
  //   resetForm();
  // };

  

  const handleEdit = (id: number | string) => {
    const editItem = bookingData.find((item) => item.id === id);
    if (editItem) {
      console.log(editItem.paymentStatus)
      if(editItem.paymentStatus === true){
        setChangeSelect("paid");
      }else {
        setChangeSelect("unpaid");
      }
      setFormData(editItem);
      setOpenForm(true);
    }
  };

  const handleDelete = (id: number | string) => {
    // setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const filteredData = bookingData.filter((item) =>
    item.customerName.toLowerCase().includes(filterName.toLowerCase())
  );


  const handleFormSubmit = (() => {
    console.log(formData)
  })

  // Hiển thị loading hoặc lỗi nếu có
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Quay lại sau...</div>;
  }
  return (
    <Box p={4}>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Booking Tour
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenForm(true)}
        >
          Thêm
        </Button>
      </Box>

      <Card>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Tìm kiếm theo tên"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </Box>
        <Scrollbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên Khách Hàng</TableCell>
                  <TableCell>Tên Tour</TableCell>
                  <TableCell align="center">Ngày Khởi Hành</TableCell>
                  <TableCell align="center">Trạng Thái Thanh Toán</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>{row.tourInfo}</TableCell>
                    <TableCell align="center">{row.bookingDate}</TableCell>
                    <TableCell align="center">{row.paymentStatus?"Đã thanh toán":"Chưa Thanh Toán"}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEdit(row.id)} color="primary">
                        <CustomEditIcon />
                      </IconButton>
                      {/* <IconButton onClick={() => handleDelete(row.id)} color="error">
                        <CustomDeleteIcon />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Không tìm thấy kết quả.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      {/* Form Modal */}
      {/* Form Modal */}
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: '90%',
            maxWidth: 500,
            maxHeight: '80vh',  // Giới hạn chiều cao của modal
            overflowY: 'auto',  // Thêm khả năng cuộn khi cần thiết
            zIndex: 1300, // Đảm bảo modal nổi bật
          }}
        >
          <Typography variant="h6" mb={3}>
            {formData.id ? 'Edit Booking Tour' : 'New Booking Tour'}
          </Typography>
          <form onSubmit={handleFormSubmit}>
          
            <TextField
              fullWidth
              label="Tên khách hàng"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Tên tour"
              name="tourInfo"
              value={formData.tourInfo}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                readOnly: true,  // Thiết lập trường này chỉ có thể xem, không thể chỉnh sửa
              }}
            />
            <TextField
              fullWidth
              label="Điểm đến"
              name="tripName"
              value={formData.tripName}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                readOnly: true,  // Thiết lập trường này chỉ có thể xem, không thể chỉnh sửa
              }}
            />
            <TextField
              fullWidth
              label="Ngày đặt tour"
              name="bookingDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.bookingDate}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                readOnly: true,  // Thiết lập trường này chỉ có thể xem, không thể chỉnh sửa
              }}
            />
            <TextField
              fullWidth
              label="Người lớn"
              name="adults"
              type="number"
              value={formData.adults}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                readOnly: true,  // Thiết lập trường này chỉ có thể xem, không thể chỉnh sửa
              }}
            />
            <TextField
              fullWidth
              label="Trẻ em"
              name="children"
              type="number"
              value={formData.children}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                readOnly: true,  // Thiết lập trường này chỉ có thể xem, không thể chỉnh sửa
              }}
            />
            <TextField
              fullWidth
              label="Em bé"
              name="baby"
              type="number"
              value={formData.baby}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                readOnly: true,  // Thiết lập trường này chỉ có thể xem, không thể chỉnh sửa
              }}
            />
            <Select
              fullWidth
              name="Trạng thái thanh toán"
              value={changeSelect}
              onChange={handleSelectChange}
              displayEmpty
              sx={{ mt: 2, mb: 2 }}
            >
              <MenuItem value="" disabled>
                Chọn trạng thái thanh toán
              </MenuItem>
              <MenuItem value="paid">Đã thanh toán</MenuItem>
              <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
              <MenuItem value="pending">Đang xử lý</MenuItem>
              {/* <MenuItem value="canceled">Hủy đặt tour</MenuItem> */}
            </Select>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpenForm(false)} color="inherit">
                Hủy
              </Button>
              <Button type="submit" variant="contained">
                Lưu
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>


      {/* <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: '90%',
            maxWidth: 500,
          }}
        >
          <Typography variant="h6" mb={3}>
            {formData.id ? 'Edit Booking Tour' : 'New Booking Tour'}
          </Typography>
          <form >
            onSubmit={handleFormSubmit}
            <TextField
              fullWidth
              label="Tên khách hàng"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Tên tour"
              name="tourInfo"
              value={formData.tourInfo}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Điểm đến"
              name="tripName"
              value={formData.tripName}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Ngày đặt tour"
              name="bookingDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.bookingDate}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Người lớn"
              name="adults"
              type="number"
              value={formData.adults}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Trẻ em"
              name="children"
              type="number"
              value={formData.children}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Em bé"
              name="baby"
              type="number"
              value={formData.children}
              onChange={handleInputChange}
              margin="normal"
            />
            <Select
              fullWidth
              name="Trạng thái thanh toán"
              value={formData.paymentStatus}
              onChange={handleSelectChange}
              displayEmpty
              sx={{ mt: 2, mb: 2 }}
            >
              <MenuItem value="" disabled>
                Chọn trạng thái thanh toán
              </MenuItem>
              <MenuItem value="paid">Đã thanh toán</MenuItem>
              <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
              <MenuItem value="pending">Đang xử lý</MenuItem>
              <MenuItem value="pending">Hủy đặt tour</MenuItem>
            </Select>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpenForm(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Modal> */}
    </Box>
  );
}
