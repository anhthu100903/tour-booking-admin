import React, { useState, useEffect, useCallback } from 'react';
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
  TextField,
  IconButton,
  SvgIcon,
  Popover,
  MenuList
} from '@mui/material';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Iconify } from 'src/components/iconify';
import { getToken } from 'src/service/localStorage';
import { getAllToursWithPagination, createTour } from 'src/service/tourService';
import { createDeparture } from 'src/service/tourDepartureService';
import { getAllTourTypes } from 'src/service/tourTypeService';
import { TourModal } from './modal-tour';
import { AddProgramModal } from './modal-add-program';
import { AddImageModal } from '../modal-add-image';
import { AddDepartureModal } from './modal-add-departure';
import { Tour, TourCreate, TypeDTO, Result, tourRequest, PriceDetailRequest, TourDepartureRequest} from '../type'

const CustomEditIcon = () => (
  <SvgIcon>
    <path d="M3 17.25V21h3.75L18.81 10.94l-3.75-3.75L3 17.25zm2.88-.98L13.02 8.9l3.75 3.75-7.22 7.22L5.88 16.27zm9.58-9.58l1.34-1.34c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.34 1.34 1.41 1.41 1.34-1.34z" />
  </SvgIcon>
);

export function TourView() {
  const TOKEN = getToken();
  const LIMIT = 10;
  const [filterName, setFilterName] = useState('');
  const [filteredData, setFilterData] = useState<Tour[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<TourCreate>({
    id: 0,
    name: '',
    description: '',
    destinationLocation: '',
    departureLocation: '',
    numberOfDays: '',
    tourTypeDTO: null,
    quantity: 0,
    departureDate: '',
    adultPrice: 0,
    childrenPrice: 0,
    babyPrice: 0,
    extraFee: 0,
    images: '',
  });
  const [tourData, setTourData] = useState<Tour[]>([]);
  const [tourTypeData, setTourTypeData] = useState<TypeDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddProgramDialog, setOpenAddProgramDialog] = useState(false);
  const [openAddDepartureDialog, setOpenAddDepartureDialog] = useState(false);
  const [openAddImageDialog, setOpenAddImageDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false); // State cho dialog xem chi tiết
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
    handleClosePopover();
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenAddImageDialog = () => {
    setOpenAddImageDialog(true);
    handleClosePopover();
  };

  const handleOpenAddProgramDialog = () => {
    setOpenAddProgramDialog(true);
    handleClosePopover();
  };
  const handleOpenAddDepartureDialog = () => {
    setOpenAddDepartureDialog(true);
    handleClosePopover();
  };

  const handleOpenDetailDialog = () => {
    setOpenDetailDialog(true);
    handleClosePopover();
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };
  const addTour = ( async() => {
    if(!TOKEN) return;
    if(!formData.tourTypeDTO?.id) {
      alert("Vui lòng điền đủ thông tin");
      return;
    }
    try {
      const tour: tourRequest = {
        name: formData.name,
        description: formData.description,
        destinationLocation: formData.destinationLocation,
        departureLocation: formData.departureLocation,
        numberOfDays: formData.numberOfDays,
        tourTypeId: formData.tourTypeDTO.id,
        images: formData.images,
        active: true,
      };
      const tourResult = await createTour(TOKEN, tour);
      if (tourResult.id) {
        const price: PriceDetailRequest = {
          adultPrice: formData.adultPrice,
          childrenPrice: formData.childrenPrice,
          babyPrice: formData.childrenPrice,
          extraFee: formData.extraFee,
          active: true,
        };
  
        const departure: TourDepartureRequest = {
          departureDate: formData.departureDate,
          quantity: formData.quantity,
          available: formData.quantity,
          tourID: tourResult.id,
          active: true,
          priceDetail: price,
        };
        console.log(departure)
        const departureResult = await createDeparture(TOKEN, departure);
        console.log(departureResult)
        alert("Thêm thành công");
      }
    } catch (error) {
      console.error("Error adding tour or departure:", error);
      // Display error message or notification
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  })
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTour();
    setOpenForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      name: '',
      description: '',
      destinationLocation: '',
      departureLocation: '',
      numberOfDays: '',
      tourTypeDTO: null,
      images: '',
      quantity: 0,
      departureDate: '',
      adultPrice: 0,
      childrenPrice: 0,
      babyPrice: 0,
      extraFee: 0,
    });
  };

  const handleEdit = (id: number | string) => {
    const editTour = tourData.find(item => item.id === id);
    if (editTour) {
      // setFormData(editTour);
      setOpenForm(true);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setCurrentPage(newPage + 1);
  };

  const fetchAllTour = async (limit = LIMIT, page = currentPage) => {
    if (TOKEN === null) {
      alert("Vui lòng đăng nhập");
      return;
    }
    try {
      setLoading(true);
      const tourData: Result = await getAllToursWithPagination(limit, page, TOKEN);
      if (tourData.tours && Array.isArray(tourData.tours)) {
        setTotalElements(tourData.totalElements);
        setTourData(tourData.tours);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTourTypes = async () => {
    if (TOKEN === null) {
      alert("Vui lòng đăng nhập");
      return;
    }

    try {
      const tourTypeResult = await getAllTourTypes(TOKEN);
      if (!Array.isArray(tourTypeResult)) {
        console.error("Expected an array, but got:", tourTypeResult);
        return;
      }
      setTourTypeData(tourTypeResult);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllTour(LIMIT, currentPage);
    fetchAllTourTypes();
  }, [currentPage, TOKEN]);

  useEffect(() => {
    const filteredTour = tourData.filter(item =>
      item.name && item.name.toLowerCase().includes(filterName.toLowerCase())
    );
    setFilterData(filteredTour);
  }, [filterName, tourData]);


  return (
    <Box p={4} mb={5}>
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
                <TableCell>Mô tả</TableCell>
                <TableCell>Điểm khởi hành</TableCell>
                <TableCell>Điểm đến</TableCell>
                <TableCell>Số ngày đi</TableCell>
                <TableCell>Loại Tour</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{(currentPage - 1) * LIMIT + index + 1}</TableCell>
                    <TableCell sx={{ width: '200px' }}>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.departureLocation}</TableCell>
                    <TableCell>{row.destinationLocation}</TableCell>
                    <TableCell>{row.numberOfDays}</TableCell>
                    <TableCell>{row.tourTypeDTO?.name || 'Không xác định'}</TableCell>
                    <TableCell>
                      {/* <IconButton onClick={() => handleEdit(row.id)} color="primary">
                        <CustomEditIcon />
                      </IconButton> */}
                      
                      <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không tìm thấy kết quả.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <Popover
              open={!!openPopover}
              anchorEl={openPopover}
              onClose={handleClosePopover}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuList
                disablePadding
                sx={{
                  p: 0.5,
                  gap: 0.5,
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  [`& .${menuItemClasses.root}`]: {
                    px: 1,
                    gap: 2,
                    borderRadius: 0.75,
                    [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                  },
                }}
              >
                <MenuItem onClick={handleOpenEditDialog}>
                  Chỉnh Sửa
                </MenuItem>
                
                <MenuItem onClick={handleOpenAddImageDialog}>
                  Thêm ảnh
                </MenuItem>
                <MenuItem onClick={handleOpenAddProgramDialog}>
                  Thêm chương trình tour
                </MenuItem>
                <MenuItem onClick={handleOpenAddDepartureDialog}>
                  Thêm ngày khởi hành
                </MenuItem>
                <MenuItem onClick={handleOpenDetailDialog}>
                  Xem Chi Tiết
                </MenuItem>
              </MenuList>
            </Popover>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalElements}
          rowsPerPage={LIMIT}
          page={currentPage - 1}
          onPageChange={handlePageChange}
          rowsPerPageOptions={[10]}
        />
      </Card>

      <TourModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        tourTypeData={tourTypeData}
      />
      <AddProgramModal
        open={openAddProgramDialog}
        onClose={() => setOpenAddProgramDialog(false)}
      />
      
      <AddImageModal
        open={openAddImageDialog}
        onClose={() => setOpenAddImageDialog(false)}
      />
      <AddDepartureModal
        open={openAddDepartureDialog}
        onClose={() => setOpenAddDepartureDialog(false)}
      />
    </Box>
  );
}
