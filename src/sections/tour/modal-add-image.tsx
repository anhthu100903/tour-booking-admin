// src/components/TourModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Modal,
} from '@mui/material';
interface AddImageModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddImageModal: React.FC<AddImageModalProps> = ({
  open,
  onClose
}) => {
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
    <Typography variant="h5">{'Thêm ảnh cho tour'}</Typography>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Tên ảnh"
            name="name"
            required
          />
        </Grid>
        <Grid item xs={12}>
          <input
            type="file"
            multiple
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >Thêm
          </Button>
        </Grid>
      </Grid>
    </form>
  </Box>
</Modal>
  );
};
