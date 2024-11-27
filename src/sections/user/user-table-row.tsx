import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  customer_name: string;
  full_name: string;
  user_name: string;
  address: string;
  password: string;
  email: string;
  phone: number;
  gender: string;
  role: string;
  is_active: boolean;
  created_at: Date;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onSaveChanges: (updatedRow: UserProps) => void; // Callback để lưu thay đổi
};

export function UserTableRow({ row, selected, onSelectRow, onSaveChanges }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false); // State cho dialog xem chi tiết
  const [editUser, setEditUser] = useState<UserProps>(row);

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

  const handleOpenDetailDialog = () => {
    setOpenDetailDialog(true);
    handleClosePopover();
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSave = () => {
    onSaveChanges(editUser);
    setOpenEditDialog(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.full_name} src="" />
            {row.full_name}
          </Box>
        </TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.role}</TableCell>

        <TableCell align="center">
          {row.is_active ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            <Iconify width={22} icon="solar:close-circle-bold" sx={{ color: 'error.main' }} />
          )}
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

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
            width: 140,
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
            <Iconify icon="solar:pen-bold" />
            Chỉnh Sửa
          </MenuItem>
          <MenuItem onClick={handleOpenDetailDialog}>
            <Iconify icon="solar:info-bold" />
            Xem Chi Tiết
          </MenuItem>
          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </Popover>

      {/* Dialog chỉnh sửa thông tin */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Chỉnh Sửa Người Dùng</DialogTitle>
        <DialogContent>
          <TextField
            label="Customer Name"
            fullWidth
            margin="normal"
            name="customer_name"
            value={editUser.customer_name}
            onChange={handleChange}
          />
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            name="full_name"
            value={editUser.full_name}
            onChange={handleChange}
          />
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            name="user_name"
            value={editUser.user_name}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            name="password"
            value={editUser.password}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            name="email"
            value={editUser.email}
            onChange={handleChange}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            name="phone"
            value={editUser.phone}
            onChange={handleChange}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            name="address"
            value={editUser.address}
            onChange={handleChange}
          />
          {/* Combobox for Gender */}
          <TextField
            select
            fullWidth
            margin="normal"
            name="gender"
            value={editUser.gender}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </TextField>
          {/* Combobox for Role */}
          <TextField
            select
            fullWidth
            margin="normal"
            name="role"
            value={editUser.role}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </TextField>
          <TextField
            select
            fullWidth
            margin="normal"
            name="is_active"
            value={editUser.is_active ? '1' : '0'} // Chuyển đổi boolean thành chuỗi
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="1">Kích hoạt</option>
            <option value="0">Không kích hoạt</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xem chi tiết người dùng */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog}>
        <DialogTitle>Thông Tin Chi Tiết</DialogTitle>
        <DialogContent>
          <p><strong>Tên Khách Hàng:</strong> {row.customer_name}</p>
          <p><strong>Tên Đầy Đủ:</strong> {row.full_name}</p>
          <p><strong>Tên Người Dùng:</strong> {row.user_name}</p>
          <p><strong>Email:</strong> {row.email}</p>
          <p><strong>Điện Thoại:</strong> {row.phone}</p>
          <p><strong>Địa Chỉ:</strong> {row.address}</p>
          <p><strong>Giới Tính:</strong> {row.gender}</p>
          <p><strong>Vai Trò:</strong> {row.role}</p>
          <p><strong>Trạng Thái:</strong> {row.is_active ? 'Kích hoạt' : 'Không kích hoạt'}</p>
          <p><strong>Ngày Tạo:</strong> {row.created_at ? row.created_at.toLocaleString() : 'N/A'}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}