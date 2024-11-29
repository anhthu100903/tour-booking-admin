import React, { useState, useEffect } from 'react';
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
import { getToken } from 'src/service/localStorage';
import { getAllTours } from 'src/service/tourService';

type Tour = {
  id: number | string;
  name: string;
  description: string,
  destinationLocation: string;
  departureLocation: string;
  numberOfDays: string;
  tourTypeDTO: TypeDTO | null;
  images?: File[];  // Optional: for handling image uploads
};

type TypeDTO = {
  id: string | number;
  name: string;
  active: boolean;
}

type Result = {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  tours: Array<Tour>;
}

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
  const TOKEN = getToken();
  const LIMIT = 20;
  const [filterName, setFilterName] = useState('');
  const [filteredData, setFilterData] =  useState<Tour[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Tour>({
    id: 0,
    name: '',
    description: '',
    destinationLocation: '',
    departureLocation: '',
    numberOfDays: '',
    tourTypeDTO: null,
    images: [],
  });
  const [data, setData] = useState(mockData);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalElements, setTotalElements] = useState(1);

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
    // if (!formData.price || isNaN(Number(formData.price))) {
    //   alert("Giá không hợp lệ!");
    //   return;
    // }
    if (!formData.numberOfDays || isNaN(Number(formData.numberOfDays))) {
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
      name: '',
      description: '',
      destinationLocation: '',
      departureLocation: '',
      // price: '',
      // startDate: '',
      numberOfDays: '',
      tourTypeDTO: null,
      images: [],
    });
  };

  const handleEdit = (id: number | string) => {
    const editTour = data.find((item) => item.id === id);
    if (editTour) {
      setFormData({
        ...editTour,
        images: [], // Reset images if not needed
      });
      setOpenForm(true); // Open the form for editing
    }
  };

  const handleDelete = (id: number | string) => {
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



  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
    setPage(newPage);
  };


  const fetchAllTour = async (limit = LIMIT, page = currentPage) => {
    if (TOKEN === null) {
      alert("Vui lòng đăng nhập");
      return;
    }
    try{
      setLoading(true);
      const data: Result = await getAllTours(limit, page, TOKEN)
      if(data && data.tours && Array.isArray(data.tours)){
        setTotalPage(data.totalPages);
        setCurrentPage(data.currentPage);
        setTotalElements(data.totalElements);

        const toursData: Tour[] = data.tours.map((tour) => ({
          id: tour.id,
          name: tour.name || '',
          description: tour.description || '',
          destinationLocation: tour.destinationLocation || '',
          departureLocation: tour.departureLocation || '',
          numberOfDays: tour.numberOfDays || 0,  // Ensure it's a number (or 0 as fallback)
          tourTypeDTO: tour.tourTypeDTO || null
        }));
        console.log(toursData);
        setData(toursData);
      }
    }catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  }

  // Trong useEffect, lọc dữ liệu khi filterName thay đổi
  useEffect(() => {
    // Nếu filterName không có giá trị, không lọc và giữ nguyên data
    const filteredTour = data.filter((item) =>
      item.name && item.name.toLowerCase().includes(filterName.toLowerCase())  // Add a check to ensure `name` is a string
    );
    setFilterData(filteredTour);
  }, [filterName, data]);

  useEffect(()  => {
    fetchAllTour(LIMIT, currentPage, TOKEN)
  }, [TOKEN]);

  
   // Hiển thị loading hoặc lỗi nếu có
  if (loading) {
  return <div>Loading...</div>;
  }

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
          Thêm tour
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
                <TableCell>STT</TableCell>
                <TableCell>Tên Tour</TableCell>
                <TableCell>Điểm khởi hành</TableCell>
                <TableCell>Điểm đến</TableCell>
                <TableCell>Số ngày đi</TableCell>
                <TableCell>Loại Tour</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
            {filteredData.length > 0 ? (
              // Paginate the data based on current page and rows per page
              filteredData
                .slice(0, LIMIT) // Slicing data based on current page
                .map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell sx={{ width: '200px' }}>{row.name}</TableCell>
                    <TableCell>{row.departureLocation}</TableCell>
                    <TableCell>{row.destinationLocation}</TableCell>
                    <TableCell>{row.numberOfDays}</TableCell>
                    <TableCell>{row.tourTypeDTO?.name || 'Không xác định'}</TableCell> {/* Fallback value */}
                    <TableCell>
                      <IconButton onClick={() => handleEdit(row.id)} color="primary">
                        <CustomEditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row.id)} color="error">
                        <CustomDeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
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
          count={totalElements}
          rowsPerPage={LIMIT}
          page={currentPage-1}
          onPageChange={(_, newpage) => {
            setCurrentPage(newpage+1);
          } }
          rowsPerPageOptions={[20]}
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
                  value={formData.name}
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
                  value={formData.departureLocation}
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
                  value={formData.destinationLocation}
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
                  value={formData.numberOfDays}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Số ngày"
                  name="days"
                  type="number"
                  value={formData.tourTypeDTO?.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid> */}
              <Grid item xs={12}>
                <Select
                  fullWidth
                  name="tourType"
                  value={formData.tourTypeDTO?.name}
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
