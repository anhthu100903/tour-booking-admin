import React, { useState } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
} from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';

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

export function BookTourView() {
  const [data, setData] = useState(mockData);
  const [filterName, setFilterName] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    customerName: '',
    tourInfo: '',
    tripName: '',
    bookingDate: '',
    adults: '',
    children: '',
    paymentStatus: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name || '']: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      // Update data
      setData((prevData) =>
        prevData.map((item) => (item.id === formData.id ? { ...formData } : item))
      );
    } else {
      // Add new data
      setData((prevData) => [
        ...prevData,
        { id: prevData.length + 1, ...formData },
      ]);
    }
    setOpenForm(false); // Close form
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: null,
      customerName: '',
      tourInfo: '',
      tripName: '',
      bookingDate: '',
      adults: '',
      children: '',
      paymentStatus: '',
    });
  };

  const handleEdit = (id: number) => {
    const editItem = data.find((item) => item.id === id);
    if (editItem) {
      setFormData(editItem);
      setOpenForm(true);
    }
  };

  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const filteredData = data.filter((item) =>
    item.customerName.toLowerCase().includes(filterName.toLowerCase())
  );

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
          New Booking Tour
        </Button>
      </Box>

      <Card>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search by Customer Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </Box>
        <Scrollbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Tour Info</TableCell>
                  <TableCell align="center">Booking Date</TableCell>
                  <TableCell align="center">Payment Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>{row.tourInfo}</TableCell>
                    <TableCell align="center">{row.bookingDate}</TableCell>
                    <TableCell align="center">{row.paymentStatus}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEdit(row.id)} color="primary">
                        <CustomEditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row.id)} color="error">
                        <CustomDeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
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
          }}
        >
          <Typography variant="h6" mb={3}>
            {formData.id ? 'Edit Booking Tour' : 'New Booking Tour'}
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Tour Info"
              name="tourInfo"
              value={formData.tourInfo}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Trip Name"
              name="tripName"
              value={formData.tripName}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Booking Date"
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
              label="Adults"
              name="adults"
              type="number"
              value={formData.adults}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Children"
              name="children"
              type="number"
              value={formData.children}
              onChange={handleInputChange}
              margin="normal"
            />
            <Select
              fullWidth
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleSelectChange}
              displayEmpty
              sx={{ mt: 2, mb: 2 }}
            >
              <MenuItem value="" disabled>
                Select Payment Status
              </MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
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
      </Modal>
    </Box>
  );
}
