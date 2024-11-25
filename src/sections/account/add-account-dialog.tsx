import { useState, useEffect  } from 'react';
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

type AddAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (account: { username: string; password: string; role: string }) => void;
};

export function AddAccountDialog({ open, onClose, onAdd }: AddAccountDialogProps) {
  const [newAccount, setNewAccount] = useState({
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

  const resetForm = () => {
    setNewAccount({ username: '', password: '', confirmPassword: '', role: '' });
    setPasswordMismatch(false);
    setUsernameError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    setRoleError(false);
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAccount((prev) => ({ ...prev, [name]: value }));

    // Reset errors when typing
    if (name === 'username') setUsernameError(false);
    if (name === 'password') setPasswordError(false);
    if (name === 'confirmPassword') {
      setConfirmPasswordError(false);
      setPasswordMismatch(false); // Reset mismatch error when typing
    }
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setNewAccount((prev) => ({ ...prev, role: event.target.value }));
    setRoleError(false); // Reset role error when selecting
  };

  const handleSubmit = () => {
    let valid = true;

    // Validate username
    if (!newAccount.username) {
      setUsernameError(true);
      valid = false;
    }

    // Validate password
    if (!newAccount.password) {
      setPasswordError(true);
      valid = false;
    } else if (newAccount.password.length < 6) {
      setPasswordError(true);
      valid = false;
    }

    // Validate confirm password
    if (!newAccount.confirmPassword) {
      setConfirmPasswordError(true);
      valid = false;
    } else if (newAccount.password !== newAccount.confirmPassword) {
      setPasswordMismatch(true);
      valid = false;
    }

    // Validate role
    if (!newAccount.role) {
      setRoleError(true);
      valid = false;
    }

    if (valid) {
      setPasswordMismatch(false);
      onAdd(newAccount);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm tài khoản mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên tài khoản"
          type="text"
          fullWidth
          variant="outlined"
          name="username"
          value={newAccount.username}
          onChange={handleInputChange}
          error={usernameError}
          helperText={usernameError ? "Tên tài khoản không được để trống!" : ""}
        />
        <TextField
          margin="dense"
          label="Mật khẩu"
          type="password"
          fullWidth
          variant="outlined"
          name="password"
          value={newAccount.password}
          onChange={handleInputChange}
          error={passwordError}
          helperText={passwordError ? "Mật khẩu không được để trống và phải ít nhất 6 ký tự!" : ""}
        />
        <TextField
          margin="dense"
          label="Xác nhận mật khẩu"
          type="password"
          fullWidth
          variant="outlined"
          name="confirmPassword"
          value={newAccount.confirmPassword}
          onChange={handleInputChange}
          error={confirmPasswordError}
          helperText={confirmPasswordError ? "Xác nhận mật khẩu không được để trống!" : ""}
        />
        <FormControl fullWidth margin="dense" error={roleError}>
          <InputLabel>Vai trò</InputLabel>
          <Select
            value={newAccount.role}
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
        <Button onClick={handleSubmit} color="primary">Thêm</Button>
      </DialogActions>
    </Dialog>
  );
}
