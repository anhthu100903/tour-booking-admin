import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Snackbar,
  Alert,
} from "@mui/material";


import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';
import { applyFilter} from '../utils';
import { getAllUser, createUser, updateUser } from 'src/service/userService';
import { getToken } from 'src/service/localStorage';
import type { UserProps, UserResponse } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {
  const TOKEN = getToken();
  const LIMIT = 10;
  // const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);  // State to handle dialog visibility
  const [users, setUsers] = useState<UserProps[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProps[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [loadingMore, setLoadingMore] = useState(false); // Trạng thái đang tải thêm
  const [totalPage, setTotalPage] = useState(1);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const handleCloseSnackBar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackBarOpen(false);
  };

  const [newUser, setNewUser] = useState({
    fullName: '',
    username: '',
    address: '',
    password: '',
    email: '',
    phoneNumber: '',
    gender: '',
    role: '',
    active: true,
  });

  //lấy dữ liệu các user với paginition
  const fetchAllUser = async (limit = LIMIT, page = currentPage) => {
    if (TOKEN === null) {
      setSnackBarMessage("Vui lòng đăng nhập");
      setSnackBarOpen(true);
      return;
    }
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const data: UserResponse = await getAllUser(limit, page, TOKEN);
      console.log("Tất cả người dùng với patination: ", data);

      if (data && data.users && Array.isArray(data.users)) {
        setTotalPage(data.totalPages);
        setCurrentPage(data.currentPage);
  
        const usersData = data.users.map((item: UserProps) => ({
          ...item,
          user_name: item.username || '',
          full_name: item.fullName || '',
          email: item.email || '',
          phone: item.phoneNumber || '',
          address: item.address || '',
          role: item.role || '',
          gender: item.gender || '',
          is_active: item.active,
        }));
  
        setUsers(usersData);
      }
    } catch (error) {
      setSnackBarMessage("Lỗi khi lấy dữ liệu");
      setSnackBarOpen(true);
    } finally {
      setLoadingMore(false);
    }
  };
  
  useEffect(() => {
    if (TOKEN) { // Kiểm tra thêm điều kiện loadingMore để tránh gọi lại khi đang tải
      fetchAllUser(LIMIT, currentPage);
    }
  }, [currentPage]); // Gọi lại khi `TOKEN` hoặc `currentPage` thay đổi
  
  useEffect(() => {
    const dataFiltered: UserProps[] = applyFilter({
      inputData: users,
      filterName,
    });
    // Cập nhật lại filteredUsers và notFound
    setFilteredUsers(dataFiltered);
    setNotFound(!dataFiltered.length && !!filterName);
  }, [users, filterName]); // Khi `users` hoặc `filterName` thay đổi, cập nhật `filteredUsers`
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  //thêm 1 user
  const handleSubmit = async () => {
    if(!TOKEN) {
      setSnackBarMessage("Vui lòng đăng nhập!");
      setSnackBarOpen(true);
      return;
    }
    setOpenDialog(true);
    try{
      const data = await createUser(newUser, TOKEN);
      setSnackBarMessage("Thêm người dùng thành công!");
      setSnackBarOpen(true);
    }catch(error){
      console.log(error);
      setSnackBarMessage("Thêm người dùng thất bại!");
      setSnackBarOpen(true);
    }finally{
      setNewUser({
        fullName: '',
        username: '',
        address: '',
        password: '',
        email: '',
        phoneNumber: '',
        gender: '',
        role: '',
        active: true,
      })
      setOpenDialog(false);  // Close dialog after submission
    }
  };
  
  //cập nhật user
  const handleUpdateUser = async (userUpdate: UserProps) => {
    if(!TOKEN) {
      setSnackBarMessage("Vui lòng đăng nhập!");
      setSnackBarOpen(true);
      return;
    }
    try{
      console.log(userUpdate.active)
      const data = await updateUser(TOKEN, userUpdate, userUpdate.username);
      setSnackBarMessage("Cập nhật thành công");
      setSnackBarOpen(true);
      fetchAllUser();
    }catch (error) {
      console.log(error);
      setSnackBarMessage("Cập nhật thất bại");
      setSnackBarOpen(true);
    }
  }

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUser({
      fullName: '',
      username: '',
      address: '',
      password: '',
      email: '',
      phoneNumber: '',
      gender: '',
      role: '',
      active: true,
    });
  };


  return (
    <>
    <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Tài khoản
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          // onClick={handleOpenDialog}  // Open dialog when clicked
          onClick={handleOpenDialog}
        >
          Thêm
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                headLabel={[
                  { id: 'stt', label: 'STT'},
                  { id: 'full_name', label: 'Tên Đầy Đủ' },
                  { id: 'username', label: 'Tên Đăng Nhập' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Số Điện Thoại' },
                  { id: 'role', label: 'Vai Trò' },
                  { id: 'gender', label: 'Giới Tính' },
                  { id: 'is_active', label: 'Trạng Thái' },
                  { id: '', label: ''},
                ]}
              />
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.slice(
                    0,  // Cắt dữ liệu từ vị trí trang hiện tại
                    LIMIT // Đến vị trí của trang kế tiếp
                  ).map((row, index) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      index={index + 1}  
                      onSaveChanges={(updatedUser : UserProps) => {
                        handleUpdateUser(updatedUser);
                      }}        
                    />
                  ))
                ) : (
                  <TableNoData searchQuery={filterName} />
                )}
              </TableBody>
              {notFound && <TableNoData searchQuery={filterName} />}

            </Table>
          </TableContainer>
        </Scrollbar>

        {/* Phân trang */}
        <TablePagination
          component="div"
          page= {currentPage-1}  // Trang hiện tại
          count={totalPage*LIMIT} // Tổng số trang
          rowsPerPage={LIMIT}  // Số dòng mỗi trang
          onPageChange={(_, newPage) => {
            setCurrentPage(newPage+1);  // Cập nhật trang hiện tại
          }}
          rowsPerPageOptions={[20]}  // Cố định số dòng mỗi trang
          onRowsPerPageChange={(event) => {
          }}
        />
      </Card>

      {/* Dialog for Adding New User */}
      {openDialog && 
        <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên đầy đủ"
            fullWidth
            margin="normal"
            name="fullName"
            value={newUser.fullName}
            onChange={handleChange}
          />
          <TextField
            label="Tên đăng nhập"
            fullWidth
            margin="normal"
            name="username"
            value={newUser.username}
            onChange={handleChange}
          />
          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            name="password"
            value={newUser.password}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            name="email"
            value={newUser.email}
            onChange={handleChange}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            margin="normal"
            name="phoneNumber"
            value={newUser.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            label="Địa chỉ"
            fullWidth
            margin="normal"
            name="address"
            value={newUser.address}
            onChange={handleChange}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            name="gender"
            value={newUser.gender}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="">Chọn giới tính</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </TextField>
          <TextField
            select
            fullWidth
            margin="normal"
            name="role"
            value={newUser.role}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="">Chọn vai trò</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Thêm
          </Button>
        </DialogActions>
        </Dialog>
      }
      
    </DashboardContent >
    </>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
  };
}
