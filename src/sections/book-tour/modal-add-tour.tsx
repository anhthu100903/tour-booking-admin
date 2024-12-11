import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, MenuItem, Button, Select, SelectChangeEvent, Snackbar, Alert } from '@mui/material';
import { getUserByUsername } from 'src/service/userService';
import { getToken } from 'src/service/localStorage';
import { getAllTours } from 'src/service/tourService';
import { getDepartureByTourId } from 'src/service/tourDepartureService';
import { createBooking } from 'src/service/bookTourService';

interface Payment {
  amount: number;
  paymentName: string;
  active: boolean;
}

interface BookingProps {
  id: number | null;
  fullName: string;
  tourName: string;
  destinitation: string;
  createdAt: string;
  numberOfAdult: number;
  numberOfChildren: number;
  numberOfBaby: number;
  payment: Payment;
}

interface BookingFormModalProps {
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  formData: BookingProps;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  handleSaveBookTour: () => void;
}

interface TourDeparture {
  id: number;
  departureDate: string;
  quantity: number;
  available: number;
  active: boolean;
  priceDetails: {
    adultPrice: number;
    childrenPrice: number;
    babyPrice: number;
    extraFee: number;
  };
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({
  openForm,
  setOpenForm,
  formData,
  handleInputChange,
  handleSelectChange,
  handleSaveBookTour,
}) => {
  const TOKEN = getToken();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(-1);
  const [error, setError] = useState(false);
  const [snackbarMessenger, setSnackbarMessenger] = useState('');
  const [selectedTour, setSelectedTour] = useState<string>('');
  const [selectedDeparture, setSelectedDeparture] = useState<string>('');
  const [departures, setDepartures] = useState<TourDeparture[]>([]);
  const [amount, setAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUsername(value);
  };

  useEffect(() => {
    if (!openForm) {
      setUsername('');
    }
  }, [openForm]);

  const handleBluUsername = async () => {
    if (!TOKEN) return;
    try {
      const user = await getUserByUsername(username, TOKEN);
      if (user) {
        handleInputChange({ target: { name: 'fullName', value: user.fullName } });
        setUserId(user.id);
      }
    } catch (error) {
      alert("Không tìm thấy thông tin người dùng!");
      setUsername('');
    }
  };

  const [tourList, setTourList] = useState<{ id: number; name: string }[]>([]);
  useEffect(() => {
    const fetchAllTours = async () => {
      if (!TOKEN) return;
      const tours = await getAllTours(TOKEN);
      if (tours) {
        const filteredTours = tours.map((tour: any) => ({
          id: tour.id,
          name: tour.name,
          destinationLocation: tour.destinationLocation,
        }));
        setTourList(filteredTours);
      }
    };
    fetchAllTours();
  }, [TOKEN]);

  const fetchDepartureByTourId = async (id: number) => {
    const data = await getDepartureByTourId(id);
    setDepartures(data);
  };

  const handleTourSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTourId = event.target.value;
    setSelectedTour(selectedTourId);
    const tour = tourList.find((tour) => tour.id === Number(selectedTourId));
    if (tour) {
      handleInputChange({
        target: { name: 'destinitation', value: tour.destinationLocation },
      });
      fetchDepartureByTourId(tour.id);
    } else {
      alert("Không tìm thấy tour");
    }
  };

  const handleDepartureSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDepartureId = event.target.value;
    setSelectedDeparture(selectedDepartureId);
  };

  const handlePaymentChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setSelectedPayment(value);
  };

  useEffect(() => {
    const departure = departures.find((item) => item.id === Number(selectedDeparture));
    const calculateAmount = () => {
      if (!departure?.priceDetails) return 0;
      const { adultPrice = 0, childrenPrice = 0, babyPrice = 0 } = departure.priceDetails;
      const totalAdult = adultPrice * (formData.numberOfAdult || 0);
      const totalChildren = childrenPrice * (formData.numberOfChildren || 0);
      const totalBaby = babyPrice * (formData.numberOfBaby || 0);
      return totalAdult + totalChildren + totalBaby;
    };
    setAmount(calculateAmount());
  }, [formData.numberOfAdult, formData.numberOfChildren, formData.numberOfBaby, selectedDeparture, departures]);

  const handleAddBookTour = async () => {
    const paymentData = {
      amount: amount,
      paymentName: selectedPayment,
    };

    const departure = departures.find((item) => item.id === Number(selectedDeparture));
    const bookingDTO = {
      numberOfAdult: formData.numberOfAdult,
      numberOfChildren: formData.numberOfChildren,
      numberOfBaby: formData.numberOfBaby,
      departureDate: departure?.departureDate,
      tourId: Number(selectedTour), 
      userId: userId,
    };

    const bookingRequest = {
      bookingDTO,
      payment: paymentData,
    };

    try {
      const result = await createBooking(bookingRequest);
      if (result.code === 1000) {
        setOpenForm(false);
        setSnackbarMessenger("Thêm thành công!");
        setError(true);
      }
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Alert severity="error" onClose={() => setError(false)}>
          {snackbarMessenger}
        </Alert>
      </Snackbar>
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <Box sx={{
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
        }}>
          <Typography variant="h6" mb={3}>
            {formData.id !== -1 ? 'Edit Booking Tour' : 'New Booking Tour'}
          </Typography>

          {formData.id === -1 && (
            <TextField
              fullWidth
              label="Tên đăng nhập"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleBluUsername}
              margin="normal"
              required
            />
          )}
          <TextField
            fullWidth
            label="Tên khách hàng"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            margin="normal"
            required
            InputProps={{
              readOnly: true,
            }}
          />
          {formData.id === -1 ? (
            <TextField
              select
              label="Chọn Tour"
              value={selectedTour}
              onChange={handleTourSelect}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="">-- Chọn một tour --</MenuItem>
              {tourList.map((tour) => (
                <MenuItem key={tour.id} value={tour.id}>
                  {tour.name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              fullWidth
              label="Tên tour"
              name="tourName"
              value={formData.tourName}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                readOnly: formData.id !== -1,
              }}
            />
          )}

          <TextField
            fullWidth
            label="Điểm đến"
            name="tripName"
            value={formData.destinitation}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          {formData.id === -1 ? (
            <TextField
              select
              label="Chọn Ngày"
              value={selectedDeparture}
              onChange={handleDepartureSelect}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="">-- Chọn ngày khởi hành --</MenuItem>
              {departures.map((departure) => (
                <MenuItem key={departure.id} value={departure.id}>
                  {departure.departureDate}
                </MenuItem>
              ))}
            </TextField>
          ) : (
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
                readOnly: formData.id !== -1,
              }}
            />
          )}

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
              readOnly: formData.id !== -1,
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
              readOnly: formData.id !== -1,
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
              readOnly: formData.id !== -1,
            }}
          />
          <TextField
            fullWidth
            label="Số tiền"
            name="amount"
            type="string"
            value={formData.id !== -1 ? formData.payment.amount : amount}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{
              readOnly: formData.id !== -1,
            }}
          />
          {formData.id === -1 ? (
            <TextField
              select
              label="Chọn Phương Thức Thanh Toán"
              value={selectedPayment}
              onChange={handlePaymentChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="">-- Chọn phương thức thanh toán --</MenuItem>
              <MenuItem key="vnpay" value="vnpay">VNPAY</MenuItem>
              <MenuItem key="cash" value="cash">Tiền mặt</MenuItem>
            </TextField>
          ) : (
            <TextField
              fullWidth
              label="Phương thức thanh toán"
              name="paymentName"
              type="string"
              value={formData.payment.paymentName}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
                readOnly: formData.id !== -1,
              }}
            />
          )}
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
            <Button
              type="submit"
              variant="contained"
              onClick={() => { formData.id !== -1 ? handleSaveBookTour() : handleAddBookTour(); }}
            >
              Lưu
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BookingFormModal;
