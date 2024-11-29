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
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { getAllUser, createUser } from 'src/service/userService';
import { getToken } from 'src/service/localStorage';

import type { UserProps, UserResponse } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {
  const TOKEN = getToken();
  const LIMIT = 20;
  // const OFFSET = 0;
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);  // State to handle dialog visibility
  const [users, setUsers] = useState<UserProps[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProps[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [hasMoreData, setHasMoreData] = useState(true); // Kiểm tra có dữ liệu hay không
  const [loadingMore, setLoadingMore] = useState(false); // Trạng thái đang tải thêm
  const [totalPage, setTotalPage] = useState(1);
  
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(false); // Trạng thái lỗi

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  const [newUser, setNewUser] = useState({
    full_name: '',
    user_name: '',
    address: '',
    password: '',
    email: '',
    phone: '',
    gender: '',
    role: '',
  });

  const [paginaton, setPagination] = useState({
    page: 0,               // Trang hiện tại
    rowsPerPage: 10,       // Số dòng mỗi trang
    order: 'asc',          // Thứ tự sắp xếp
    orderBy: 'full_name',  // Cột sắp xếp
  });

  const fetchAllUser = async (limit = LIMIT, page = currentPage) => {
    if (TOKEN === null) {
      alert("Vui lòng đăng nhập");
      return;
    }
  
    console.log("hiHi",page);
    if (loadingMore) return; // Tránh gọi lại API khi đang tải dữ liệu
    setLoadingMore(true);
    
    console.log("haha",page);
    try {
      setLoading(true);
  
      // Đảm bảo getAllUser trả về đúng kiểu dữ liệu
      const data = await getAllUser(limit, page, TOKEN); // Áp dụng kiểu UserResponse
      console.log(data)
      if (data && data.users && Array.isArray(data.users)) {
        setTotalPage(data.totalPages);
        setCurrentPage(data.currentPage);
  
        // Chuyển đổi dữ liệu người dùng
        const usersData = data.users.map((item: UserProps) => ({
          ...item,
          user_name: item.username || '',  // Chuyển từ 'username'
          full_name: item.fullName || '',  // Chuyển từ 'fullName'
          email: item.email || '',
          phone: item.phoneNumber || '',  // Chuyển từ 'phoneNumber'
          address: item.address || '',
          role: item.role || '',          // Dữ liệu role từ API
          gender: item.gender || '',      // Dữ liệu gender từ API
          is_active: item.is_active,         // Dữ liệu active thành is_active
        }));
  
        setUsers(usersData); // Cập nhật state với dữ liệu người dùng đã xử lý
        
      console.log("metqua")
      setLoadingMore(false);
        // console.log('UserData:', usersData);
      } else {
        console.error('API response does not contain valid users array.');
      }
    } catch (error) {
      alert("Vui lòng lại sau");
      setError(true);
      console.error("Lỗi lấy dữ liệu: ", error);
    } finally {
      setLoading(false);
    }
  }
  
  
  useEffect(() => {
    if (TOKEN) { // Kiểm tra thêm điều kiện loadingMore để tránh gọi lại khi đang tải
      console.log("use", currentPage)
      fetchAllUser(LIMIT, currentPage);
    }
  }, [currentPage]); // Gọi lại khi `TOKEN` hoặc `currentPage` thay đổi
  
  
  useEffect(() => {
    const dataFiltered: UserProps[] = applyFilter({
      inputData: users,
      filterName,
    });
    
    console.log("Users before filter:", dataFiltered);
    // Cập nhật lại filteredUsers và notFound
    setFilteredUsers(dataFiltered);
    setNotFound(!dataFiltered.length && !!filterName);
  }, [users, filterName]); // Khi `users` hoặc `filterName` thay đổi, cập nhật `filteredUsers`
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async () => {
    setOpenDialog(true);
    try{
      setLoading(true);
      const user = {
        username: newUser.user_name,
        fullName: newUser.full_name,
        email: newUser.email,
        phoneNumber: newUser.phone,
        password: newUser.password,
        address: newUser.address,
        gender: newUser.gender,
        role: newUser.role,
        isActive: true,
      }
      const data = await createUser(user, TOKEN);
      setLoading(false);
      setSnackBarMessage("Thêm người dùng thành công!");
      setSnackBarOpen(true);
    }catch(error){
      console.log(error);
      setSnackBarMessage("Thêm người dùng thất bại!");
      setSnackBarOpen(true);
    }finally{
      setNewUser({
        full_name: '',
        user_name: '',
        address: '',
        password: '',
        email: '',
        phone: '',
        gender: '',
        role: '',
      })
      setOpenDialog(false);  // Close dialog after submission
    }
  };

  const hanndleUpdateUser = () => {

  }

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleAddUser = () => setOpenDialog(false);


   // Hiển thị loading hoặc lỗi nếu có
   if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Quay lại sau...</div>;
  }
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
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          // onClick={handleOpenDialog}  // Open dialog when clicked
          onClick={handleOpenDialog}
        >
          New User
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                onSort={table.onSort}
                headLabel={[
                  { id: 'full_name', label: 'Tên Đầy Đủ' },
                  { id: 'username', label: 'Tên Đăng Nhập' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Số Điện Thoại' },
                  { id: 'role', label: 'Vai Trò' },
                  { id: 'gender', label: 'Giới Tính' },
                  { id: 'is_active', label: 'Trạng Thái' },
                ]}
              />
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.slice(
                    0,  // Cắt dữ liệu từ vị trí trang hiện tại
                    LIMIT // Đến vị trí của trang kế tiếp
                  ).map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      onSaveChanges={hanndleUpdateUser}    
                    />
                  ))
                ) : (
                  <TableNoData searchQuery={filterName} />
                )}
              </TableBody>



                {/* {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody> */}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page= {currentPage-1}  // Trang hiện tại
          count={totalPage*LIMIT} // Tổng số trang
          rowsPerPage={LIMIT}  // Số dòng mỗi trang
          onPageChange={(_, newPage) => {
            setCurrentPage(newPage+1);  // Cập nhật trang hiện tại
            console.log("cur", currentPage)
            console.log("new", newPage)
            // fetchAllUser(LIMIT, currentPage+1);  // Gọi lại API để lấy dữ liệu cho trang mới
          }}
          rowsPerPageOptions={[15]}  // Cố định số dòng mỗi trang
          onRowsPerPageChange={(event) => {
            // Thực hiện khi thay đổi số dòng mỗi trang (có thể không cần thiết nếu bạn chỉ dùng 1 giá trị cố định)
            // setRowsPerPage(parseInt(event.target.value, 10));
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
            name="full_name"
            value={newUser.full_name}
            onChange={handleChange}
          />
          <TextField
            label="Tên đăng nhập"
            fullWidth
            margin="normal"
            name="user_name"
            value={newUser.user_name}
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
            name="phone"
            value={newUser.phone}
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
  // const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  // const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
  //   if (checked) {
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // }, []);

  // const onSelectRow = useCallback(
  //   (inputValue: string) => {
  //     const newSelected = selected.includes(inputValue)
  //       ? selected.filter((value) => value !== inputValue)
  //       : [...selected, inputValue];

  //     setSelected(newSelected);
  //   },
  //   [selected]
  // );

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
    onSort,
    orderBy,
    // selected,
    rowsPerPage,
    // onSelectRow,
    onResetPage,
    onChangePage,
    // onSelectAllRows,
    onChangeRowsPerPage,
  };
}
