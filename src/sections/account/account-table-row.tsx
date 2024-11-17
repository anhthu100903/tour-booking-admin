import { useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material'; // Di chuyển import này lên trước
import { Iconify } from 'src/components/iconify';
import { EditAccountDialog } from './edit-account-dialog';

// ----------------------------------------------------------------------

export type AccountProps = {
  id: string;
  name: string;
  role: string;
  password: string;
};

type AccountTableRowProps = {
  row: AccountProps;
  selected: boolean;
  onSelectRow: () => void;
  onUpdateAccount: (account: { username: string; password?: string; role: string; id: string }) => void; 
  onDeleteAccount: (id: string) => void; // Thêm hàm xóa tài khoản
};

export function AccountTableRow({ row, selected, onSelectRow, onUpdateAccount, onDeleteAccount }: AccountTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Trạng thái cho dialog xác nhận xóa

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEditClick = () => {
    handleClosePopover();
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleUpdateAccount = (updatedAccount: { username: string; password?: string; role: string }) => {
    onUpdateAccount({ ...updatedAccount, id: row.id });
    handleCloseEditDialog();
  };

  const handleDeleteClick = () => {
    handleClosePopover();
    setOpenDeleteDialog(true); // Mở dialog xác nhận xóa
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    onDeleteAccount(row.id); // Gọi hàm xóa tài khoản
    handleCloseDeleteDialog();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.name}</TableCell>

        <TableCell>{row.role}</TableCell>

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
          <MenuItem onClick={handleEditClick}>
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>

          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </Popover>

      <EditAccountDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        account={{ username: row.name, password: row.password, role: row.role }}
        onUpdate={handleUpdateAccount}
      />

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error">Xóa</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
