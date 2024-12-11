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
  IconButton,
  SvgIcon,
  SelectChangeEvent,
  TablePagination,

} from '@mui/material';
import { debounce } from 'lodash';

import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState, useRef} from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { getToken } from 'src/service/localStorage';
import { getBookingInfo } from 'src/service/bookTourService';
import { BookingProps, AllPaymentResponse } from '../bookingInterface';

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

export function BookTourView() {
  const PAGE = 0;
  const PAGESIZE = 10;
  const TOKEN = getToken();
  const [bookings, setBookings] = useState<BookingProps[]>([]); // Lưu trữ danh sách booking
  const [error, setError] = useState(false); // Trạng thái lỗi
  const [fetchCalled, setFetchCalled] = useState(false); // Sử dụng useRef để tránh gọi API nhiều lần
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalElement, setTotalElement] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [filteredData, setFilteredData] = useState<BookingProps[]>([]); 
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState<BookingProps>({
    id: -1,
    numberOfAdult: 0,
    numberOfChildren: 0,
    numberOfBaby: 0,
    departureDate: '',
    tourId: -1,
    active: true,
    createdAt: '',
    tourName: '',
    destinitation: '',
    userId: -1,
    fullName: '',
    email: '',
    payment: {
      id: -1,
      paymentName: '',
      amount: 0,
      createdAt: '',
      bookTourId: -1,
      active: false,
    },
  });
  

  const fetchBookings = async (page = PAGE, pageSize = PAGESIZE) => {
    if (fetchCalled) return; // Tránh gọi API nhiều lần
    setFetchCalled(true); // Đánh dấu là đã gọi API

    try {
      if(!TOKEN) return;
      // Gọi API với TOKEN
      console.log("page", page)
      const data: AllPaymentResponse = await getBookingInfo(page, pageSize, TOKEN);
      
      // Nếu dữ liệu không hợp lệ hoặc rỗng, không xử lý
      if (!data || data.bookTour.length === 0) {
        console.error("Dữ liệu không hợp lệ hoặc không có dữ liệu.");
        setError(true);
        return;
      }
      
      setTotalPage(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalElement(data.totalElements);
      console.log("Các tour đã đặt với paginitation: ", data);

      setBookings((prevBookings) => {
        // Kiểm tra dữ liệu mới và chỉ thêm nếu không trùng
        const newBookings = data.bookTour.filter(
          (newBooking) => !prevBookings.some((booking) => booking.id === newBooking.id)
        );
        return [...prevBookings, ...newBookings];
      });

      // setBookings((prevBookings) => [...prevBookings, ...data.bookTour]);  // Nối mảng cũ và mảng mới
    } catch (error) {
      console.log(error);
    }finally{
      setFetchCalled(false);
    }
  };

  useEffect(() => {
    if (TOKEN) {
      console.log("Booking trang: ", currentPage, bookings);
      fetchBookings(currentPage, PAGESIZE);
    }
  }, [currentPage]);  // Chạy lại nếu TOKEN thay đổi

  // Hàm lọc
  const filterBookings = ((filter:any) => {
    const data = bookings.filter((item) =>
      item.fullName.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredData(data);
  }); // Thời gian debounce 500ms
  
  // Dùng useEffect để gọi khi filterName thay đổi
  useEffect(() => {
    filterBookings(filterName); // Gọi hàm debounce khi filterName thay đổi
  }, [filterName, bookings]); // Chạy lại khi filterName hoặc bookings thay đổi

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      payment: {
        ...formData.payment,  // Giữ nguyên các thuộc tính khác của payment
        active: value === 'paid',  // Cập nhật active dựa trên giá trị 'paid'
      },
    });
    
  };

  const handleEdit = (id: number | string) => {
    const editItem = bookings.find((item) => item.id === id);
    console.log("thông tin đơn đặt cần chỉnh sửa: ", editItem)
    if (editItem) {
        setFormData(editItem);
        setOpenForm(true);
    }
  };

  const handleFormSubmit = (() => {
    console.log(formData)
  })

  const handleSaveBookTour = (() => {

  })

  return (
    <>
    <Box p={4} mb={5}>
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
                {filteredData.length > 0 ? (
                  filteredData
                    .slice(currentPage * PAGESIZE, (currentPage + 1) * PAGESIZE) // Cắt dữ liệu theo trang hiện tại
                    .map((row, index) => (
                      <TableRow key={`booking-${row.id}`}>
                        <TableCell>{index + 1 + currentPage * PAGESIZE}</TableCell> {/* Thêm offset cho chỉ số thứ tự */}
                        <TableCell>{row.fullName}</TableCell>
                        <TableCell>{row.tourName}</TableCell>
                        <TableCell align="center">{row.departureDate}</TableCell>
                        <TableCell align="center">{row.payment.active ? "Đã thanh toán" : "Chưa Thanh Toán"}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleEdit(row.id)} color="primary">
                            <CustomEditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Không tìm thấy kết quả.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        {/* Phân trang */}
        <TablePagination
          component="div"
          page= {currentPage}  // Trang hiện tại
          count={totalElement}
          rowsPerPage={PAGESIZE}  // Số dòng mỗi trang
          onPageChange={(_, newPage) => {
            setCurrentPage(newPage);  // Cập nhật trang hiện tại
          }}
          rowsPerPageOptions={[10]}  // Cố định số dòng mỗi trang
        />
      </Card>

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
            maxHeight: '80vh',
            overflowY: 'auto',
            zIndex: 1300,
          }}
        >
          <Typography variant="h6" mb={3}>
            {formData.id != -1 ? 'Edit Booking Tour' : 'New Booking Tour'}
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              label="Tên khách hàng"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                readOnly: formData.id != -1,  // Nếu có id của booking thì chỉ có thể xem
              }}
            />
            <TextField
              fullWidth
              label="Tên tour"
              name="tourName"
              value={formData.tourName}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                readOnly: formData.id != -1,  // Nếu có id của booking thì chỉ có thể xem
              }}
            />
            <TextField
              fullWidth
              label="Điểm đến"
              name="tripName"
              value={formData.destinitation}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                readOnly: formData.id != -1,  // Nếu có id của booking thì chỉ có thể xem
              }}
            />
            <TextField
              fullWidth
              label="Ngày đặt tour"
              name="createdAt"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.createdAt}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                readOnly: formData.id != -1,  // Nếu có id của booking thì chỉ có thể xem
              }}
            />
            <TextField
              fullWidth
              label="Người lớn"
              name="numberOfAdult"
              type="number"
              value={formData.numberOfAdult}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                readOnly: formData.id != -1,  // Nếu có id của booking thì chỉ có thể xem
              }}
            />
            <TextField
              fullWidth
              label="Trẻ em"
              name="numberOfChildren"
              type="number"
              value={formData.numberOfChildren}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                readOnly: formData.id != -1,  // Nếu có id của booking thì chỉ có thể xem
              }}
            />
            <TextField
              fullWidth
              label="Em bé"
              name="numberOfBaby"
              type="number"
              value={formData.numberOfBaby}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                readOnly: formData.id != -1,  // Nếu có id của booking thì chỉ có thể xem
              }}
            />
            <TextField
              fullWidth
              label="Số tiền"
              name="amount"
              type="string"
              value={formData.payment.amount}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                readOnly: formData.id != -1,  // Nếu có id của booking thì chỉ có thể xem
              }}
            />
            
            <TextField
              fullWidth
              label="Phương thức thanh toán"
              name="paymentName"
              type="string"
              value={formData.payment.paymentName}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                readOnly: formData.id != -1,  // Nếu có id của booking thì chỉ có thể xem
              }}
            />
            <Select
              fullWidth
              name="Trạng thái thanh toán"
              value={formData.payment.active ? 'paid' : 'unpaid'} 
              onChange={handleSelectChange}
              displayEmpty
              sx={{ mt: 2, mb: 2 }}
            >
              <MenuItem value="" disabled>
                Chọn trạng thái thanh toán
              </MenuItem>
              <MenuItem value="paid">Đã thanh toán</MenuItem>
              <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
            </Select>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpenForm(false)} color="inherit">
                Hủy
              </Button>
              <Button type="submit" variant="contained" onClick={() => handleSaveBookTour()}>
                Lưu
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
    </>
  );
}
