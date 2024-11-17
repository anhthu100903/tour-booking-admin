import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import {
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';

type EditAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  account: { username: string; password: string; role: string } | null;
  onUpdate: (account: { username: string; password?: string; role: string }) => void; // Thêm dấu hỏi cho password
};

export function EditAccountDialog({ open, onClose, account, onUpdate }: EditAccountDialogProps) {
  const [editedAccount, setEditedAccount] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false); // Trạng thái để hiển thị trường mật khẩu

  useEffect(() => {
    if (account) {
      setEditedAccount({
        username: account.username,
        password: '',
        confirmPassword: '',
        role: account.role,
      });
    }
  }, [account]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedAccount((prev) => ({ ...prev, [name]: value }));

    // Reset errors when typing
    if (name === 'username') setUsernameError(false);
    if (name === 'password') setPasswordError(false);
    if (name === 'confirmPassword') {
      setConfirmPasswordError(false);
      setPasswordMismatch(false); // Reset mismatch error when typing
    }
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setEditedAccount((prev) => ({ ...prev, role: event.target.value }));
    setRoleError(false); // Reset role error when selecting
  };

  const handleSubmit = () => {
    let valid = true;

    // Validate username
    if (!editedAccount.username) {
      setUsernameError(true);
      valid = false;
    }

    // Validate password only if it's provided
    if (showPasswordFields) {
      if (!editedAccount.password) {
        setPasswordError(true); // Thêm validation cho mật khẩu mới
        valid = false;
      } else if (editedAccount.password.length < 6) {
        setPasswordError(true);
        valid = false;
      }

      // Validate confirm password
      if (editedAccount.confirmPassword && editedAccount.password !== editedAccount.confirmPassword) {
        setPasswordMismatch(true);
        valid = false;
      }
    }

    // Validate role
    if (!editedAccount.role) {
      setRoleError(true);
      valid = false;
    }

    if (valid) {
      setPasswordMismatch(false);
      onUpdate({ username: editedAccount.username, password: showPasswordFields ? editedAccount.password : undefined, role: editedAccount.role });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên tài khoản"
          type="text"
          fullWidth
          variant="outlined"
          name="username"
          value={editedAccount.username}
          onChange={handleInputChange}
          error={usernameError}
          helperText={usernameError ? "Tên tài khoản không được để trống!" : ""}
        />

        {/* Nút đổi mật khẩu ở vị trí dễ nhìn hơn */}
        <Button 
          onClick={() => setShowPasswordFields(!showPasswordFields)} 
          variant="outlined" 
          color={showPasswordFields ? "secondary" : "primary"} 
          sx={{ marginTop: '10px', marginBottom: '10px' }}
        >
          {showPasswordFields ? "Giữ mật khẩu hiện tại" : "Đổi mật khẩu"}
        </Button>

        {showPasswordFields && (
          <>
            <TextField
              margin="dense"
              label="Mật khẩu mới"
              type="password"
              fullWidth
              variant="outlined"
              name="password"
              value={editedAccount.password}
              onChange={handleInputChange}
              error={passwordError}
              helperText={passwordError ? "Mật khẩu không được để trống và phải ít nhất 6 ký tự!" : ""}
            />
            <TextField
              margin="dense"
              label="Xác nhận mật khẩu mới"
              type="password"
              fullWidth
              variant="outlined"
              name="confirmPassword"
              value={editedAccount.confirmPassword}
              onChange={handleInputChange}
              error={confirmPasswordError}
              helperText={confirmPasswordError ? "Xác nhận mật khẩu không được để trống!" : ""}
            />
          </>
        )}

        <FormControl fullWidth margin="dense" error={roleError}>
          <InputLabel>Vai trò</InputLabel>
          <Select
            value={editedAccount.role}
            onChange={handleRoleChange}
            label="Vai trò"
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </Select>
          {roleError && <Alert severity="warning" sx={{ mt: 1 }}>Vai trò không được để trống!</Alert>}
        </FormControl>

        {passwordMismatch && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Mật khẩu và xác nhận mật khẩu không khớp!
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Hủy</Button>
        <Button onClick={handleSubmit} color="primary">Cập nhật</Button>
      </DialogActions>
    </Dialog>
  );
}
