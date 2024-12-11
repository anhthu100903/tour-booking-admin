import type { UserProps } from './user-table-row';

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}


// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: UserProps[];
  filterName: string;
};

export function applyFilter({ inputData,  filterName }: ApplyFilterProps) { //comparator,
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.fullName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
