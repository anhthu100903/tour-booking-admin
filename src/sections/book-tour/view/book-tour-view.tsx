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
import { debounce, update } from 'lodash';

import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState, useRef} from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { getToken } from 'src/service/localStorage';
import { getBookingInfo } from 'src/service/bookTourService';
import { BookingProps, AllPaymentResponse } from '../bookingInterface';
import  BookingFormModal from '../modal-add-tour';
import { updatePaymentStatus } from 'src/service/paymentService';

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
  const resetForm = {
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
  }
  const [formData, setFormData] = useState<BookingProps>(resetForm);
  

  const fetchBookings = async (page = PAGE, pageSize = PAGESIZE) => {
    if (fetchCalled) return; // Tránh gọi API nhiều lần
    setFetchCalled(true); // Đánh dấu là đã gọi API

    try {
      if(!TOKEN) return;
      // Gọi API với TOKEN
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
        // Cập nhật các booking mới hoặc đã thay đổi
        const updatedBookings = prevBookings.map((prevBooking) => {
          // Tìm booking mới với cùng ID
          const newBooking = data.bookTour.find((newBooking) => newBooking.id === prevBooking.id);
          return newBooking ? newBooking : prevBooking; // Nếu có thay đổi, thay thế, nếu không giữ nguyên
        });
  
        // Lọc ra những booking chưa có trong danh sách hiện tại
        const newBookings = data.bookTour.filter(
          (newBooking) => !prevBookings.some((booking) => booking.id === newBooking.id)
        );
  
        // Trả về danh sách đã cập nhật
        return [...updatedBookings, ...newBookings];
      });

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

  const handleSaveBookTour = (async () => {
    console.log("cập nhật");
    if(!TOKEN) return;
    if(formData.id != -1 && formData.payment.id != -1){
      console.log(formData.payment.active, TOKEN);
      const result = await updatePaymentStatus(formData.payment.id, formData.payment.active, TOKEN);
      if(result) {
        alert("Cập nhật thành công");
        fetchBookings(PAGE, PAGESIZE);
        setOpenForm(false);
        return;
      }
    }
    alert("Cập nhật thất bại. Vui lòng thử lại");
  });

  const handleOpenForm = (() => {
    setFormData(resetForm);
    setOpenForm(true);
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
          onClick={() => handleOpenForm()}
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

      <BookingFormModal
        openForm={openForm}
        setOpenForm={setOpenForm}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleFormSubmit={handleFormSubmit}
        handleSaveBookTour={handleSaveBookTour}
      />
    </Box>
    </>
  );
}
