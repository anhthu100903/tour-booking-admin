// src/components/TourModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Modal,
  SelectChangeEvent
} from '@mui/material';
import { TypeDTO, Tour, TourCreate } from "../type"; // Update the import based on your structure

interface TourModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: TourCreate;
  setFormData: React.Dispatch<React.SetStateAction<TourCreate>>;
  tourTypeData: TypeDTO[];
}

export const TourModal: React.FC<TourModalProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  tourTypeData,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    const { value } = event.target;
    const selectedType = tourTypeData.find((type) => type.id === value);
    if (selectedType) {
      setFormData((prevState) => ({
        ...prevState,
        tourTypeDTO: selectedType,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        tourTypeDTO: null,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files)
      // setFormData({ ...formData, images: e.target.files });
    }
  };

  

  return (
    <Modal open={open} onClose={onClose}>
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
      maxHeight: '80vh', // Đảm bảo modal không quá lớn, giới hạn chiều cao
      overflow: 'auto',  // Cho phép cuộn nếu nội dung vượt quá chiều cao
    }}
  >
    <Typography variant="h5">{formData.id ? 'Chỉnh sửa Tour' : 'Tạo mới Tour'}</Typography>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
        onClose();
      }}
    >
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Tên Tour"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Mô Tả"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Điểm khởi hành"
            name="departureLocation"
            value={formData.departureLocation}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Điểm đến"
            name="destinationLocation"
            value={formData.destinationLocation}
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
            label="Số ngày đi"
            name="numberOfDays"
            value={formData.numberOfDays}
            onChange={handleInputChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            fullWidth
            name="tourType"
            value={formData.tourTypeDTO?.id || ''}
            onChange={handleSelectChange}
            displayEmpty
            required
          >
            <MenuItem value="">
              <em>Chọn loại tour</em>
            </MenuItem>
            {tourTypeData.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Số lượng"
            name="quantity"
            value={formData.quantity}
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
            label="Ngày khởi hành"
            name="departureDate"
            value={formData.departureDate}
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
            label="Giá người lớn"
            name="adultPrice"
            value={formData.adultPrice}
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
            label="Giá trẻ em"
            name="childrenPrice"
            value={formData.childrenPrice}
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
            label="Giá em bé"
            name="babyPrice"
            value={formData.babyPrice}
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
            label="Phụ phí"
            name="extraFee"
            value={formData.extraFee}
            onChange={handleInputChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
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
  );
};
