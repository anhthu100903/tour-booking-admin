import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Modal,
  Grid,
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
} from '@mui/material';

type Tour = {
  id: number;
  tripName: string;
  location: string;
  price: string;
  startDate: string;
  days: number;
  tourType: string;
  images?: File[];  // Optional: for handling image uploads
};

const mockData: Tour[] = [
  {
    id: 1,
    tripName: 'Tour Đà Lạt',
    location: 'Đà Lạt',
    price: '2000000',
    startDate: '2024-12-01',
    days: 3,
    tourType: 'Nội địa',
  },
  {
    id: 2,
    tripName: 'Tour Nha Trang',
    location: 'Nha Trang',
    price: '3000000',
    startDate: '2024-12-10',
    days: 5,
    tourType: 'Nội địa',
  },
];

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

export function TourView() {
  const [filterName, setFilterName] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState<Tour>({
    id: 0,
    tripName: '',
    location: '',
    price: '',
    startDate: '',
    days: 0,
    tourType: '',
    images: [],
  });
  const [data, setData] = useState(mockData);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' ? value : value });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: string }>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name || '']: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.price || isNaN(Number(formData.price))) {
      alert("Giá không hợp lệ!");
      return;
    }
    if (!formData.days || isNaN(Number(formData.days))) {
      alert("Số ngày không hợp lệ!");
      return;
    }

    if (formData.id !== 0) {
      setData((prevData) =>
        prevData.map((item) => (item.id === formData.id ? { ...formData } : item))
      );
    } else {
      setData((prevData) => [
        ...prevData,
        { ...formData, id: prevData.length + 1 },
      ]);
    }
    setOpenForm(false); // Close form
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      tripName: '',
      location: '',
      price: '',
      startDate: '',
      days: 0,
      tourType: '',
      images: [],
    });
  };

  const handleEdit = (id: number) => {
    const editTour = data.find((item) => item.id === id);
    if (editTour) {
      setFormData({
        ...editTour,
        images: [], // Reset images if not needed
      });
      setOpenForm(true); // Open the form for editing
    }
  };

  const handleDelete = (id: number) => {
    setOpenDeleteDialog(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    setData((prevData) => prevData.filter((item) => item.id !== deleteId));
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  const filteredData = data.filter((item) =>
    item.tripName.toLowerCase().includes(filterName.toLowerCase())
  );

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Box p={4}>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Tours
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CustomEditIcon />}
          onClick={() => setOpenForm(true)}
        >
          New Tour
        </Button>
      </Box>

      <Card>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Tìm kiếm Tour"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên Tour</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Ngày khởi hành</TableCell>
                <TableCell>Số ngày</TableCell>
                <TableCell>Loại Tour</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.tripName}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.days}</TableCell>
                  <TableCell>{row.tourType}</TableCell>
                  <TableCell>
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
                  <TableCell colSpan={7} align="center">
                    Không tìm thấy kết quả.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredData.length}
          rowsPerPage={5}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      {/* Modal Form */}
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
          <Typography variant="h5">{formData.id ? 'Chỉnh sửa Tour' : 'Tạo mới Tour'}</Typography>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Tên Tour"
                  name="tripName"
                  value={formData.tripName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Địa điểm"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Giá"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Ngày khởi hành"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Số ngày"
                  name="days"
                  type="number"
                  value={formData.days}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  name="tourType"
                  value={formData.tourType}
                  onChange={handleSelectChange}
                  displayEmpty
                  required
                >
                  <MenuItem value="">
                    <em>Chọn loại tour</em>
                  </MenuItem>
                  <MenuItem value="Nội địa">Nội địa</MenuItem>
                  <MenuItem value="Nước ngoài">Nước ngoài</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {formData.id ? 'Cập nhật Tour' : 'Tạo mới Tour'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tour này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
