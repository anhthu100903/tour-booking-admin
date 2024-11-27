import { useState, useCallback } from 'react';

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

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);  // State to handle dialog visibility
  const [newUser, setNewUser] = useState({
    customer_name: '',
    full_name: '',
    user_name: '',
    address: '',
    password: '',
    email: '',
    phone: '',
    gender: '',
    role: '',
    is_active: '',
  });

  const dataFiltered: UserProps[] = applyFilter({
    inputData: _users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });


  const notFound = !dataFiltered.length && !!filterName;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = () => {
    // Handle form submission (e.g., add user to the list or send data to API)
    console.log(newUser);
    setOpenDialog(false);  // Close dialog after submission
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleAddUser = () => setOpenDialog(false);
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenDialog}  // Open dialog when clicked
        >
          New User
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
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
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[

                  { id: 'customer_name', label: 'Customer_Name' },
                  { id: 'address', label: 'Address' },
                  { id: 'created_at', label: 'Created_at' },
                  { id: 'email', label: 'Email' },
                  { id: 'full_name', label: 'Full_Name' },
                  { id: 'gender', label: 'Gender' },
                  // { id: 'is_active', label: 'Is_active' },
                  // { id: 'password', label: 'Password' },
                  // { id: 'phone', label: 'Phone' },
                  // { id: 'role', label: 'Role' },
                  // { id: 'user_name', label: 'User_name' },

                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Dialog for Adding New User */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Customer Name"
            fullWidth
            margin="normal"
            name="customer_name"
            value={newUser.customer_name}
            onChange={handleChange}
          />
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            name="full_name"
            value={newUser.full_name}
            onChange={handleChange}
          />
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            name="user_name"
            value={newUser.user_name}
            onChange={handleChange}
          />
          <TextField
            label="Password"
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
            label="Phone"
            fullWidth
            margin="normal"
            name="phone"
            value={newUser.phone}
            onChange={handleChange}
          />
          <TextField
            label="Address"
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
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
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
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent >
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
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
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
