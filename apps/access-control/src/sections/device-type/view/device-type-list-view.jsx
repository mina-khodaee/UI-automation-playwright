import { toast } from 'sonner';
import { MdDelete } from 'react-icons/md';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useCallback, useEffect } from 'react';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { useBoolean, useDebounce, useSetState } from 'minimal-shared';

import IconButton from '@mui/material/IconButton';
import { Button, Card, Table, TableBody, Box, Skeleton, TableRow, TableCell, TablePagination, TableContainer, Paper } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { deleteDeviceType, useGetBrands, useGetDeviceTypes } from 'src/actions/device-type';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { emptyRows, TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedAction, useTable } from 'src/components/table';

import { DeviceTypeTableRow } from '../device-type-table-row';
import { DeviceTypeTableToolbar } from '../device-type-table-toolbar';

// ----------------------------------------------------------------------

export function DeviceTypeListView() {
  const deleteConfirm = useBoolean();
  const { t: t_device } = useTranslate('device');
  const { t: t_common } = useTranslate();
  const TABLE_HEAD = [
    { id: 'brand', label: t_device('formsInputs.brand'), align: 'center', width: 180, sortable: true  },
    { id: 'model', label: t_device('formsInputs.model'), align: 'center', width: 180, sortable: true  },
    { id: 'description', label: t_device('formsInputs.description'), align: 'center', width: 180, sortable: false  },
    { id: 'usesTerminalId', label: t_device('formsInputs.usesTerminalId'), align: 'center', width: 180, sortable: false  },
    { id: 'usesSerialNumber', label: t_device('formsInputs.usesSerialNumber'), align: 'center', width: 180, sortable: false  },
    { id: 'hasCamera', label: t_device('formsInputs.hasCamera'), align: 'center', width: 180, sortable: false  },
    { id: 'editDelete', label: '', width: 180 },
  ];
  
  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();
  const [searchQuery, setSearchQuery] = useState();
  const [pageQuery, setPageQuery] = useState(0);
  const [pageSizeQuery, setPageSizeQuery] = useState(5);
  const [sortOrderQuery, setSortOrderQuery] = useState();
  const [sortColumnQuery, setSortColumnQuery] = useState();
  const [ selectedRow, setSelectedRow ] = useState();
  const debouncedQuery = useDebounce(searchQuery);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filterState, setFilterState] = useState();
  const filters = useSetState({ brand: [], filterBrand: '', search: '' });
  const { deviceTypes, deviceTypesLoading, deviceTypesEmpty, deviceTypesTotalCount, mutate: localMutate } = useGetDeviceTypes(filterState, debouncedQuery, pageQuery + 1, pageSizeQuery, sortOrderQuery, sortColumnQuery);

  const { brands } = useGetBrands();
  const handleSearch = useCallback((e) => {
    if (e.target.value?.length > 2) {
      setSearchQuery(e.target.value)
    }
    else {
      setSearchQuery();
    }
    filters.setState({ search: e.target.value });
  }, [filters]);

  useEffect(() => {
    localMutate();
  }, [pageQuery]);

  const handleFilter = (brand) => {
    if (brand.length < 1) setFilterState('');
    else {
      brand.map((b) => {
        if (filters.state.filterBrand.length === 0)
          filters.state.filterBrand += `brand|eq|${b}`;
        else
          filters.state.filterBrand += ` OR brand|eq|${b}`;
        setFilterState(filters.state.filterBrand);
        return null;
      });
    }
  };

  const handleSort = (column, direction) => {
    setSortColumnQuery(column);
    setSortOrderQuery(direction);
  };


  const handleDeleteRows = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteDeviceType(id);
      toast.success(t_device('toastMessages.deleteDeviceType'));
      table.selected.forEach((Id) => {
        table.onSelectRow(Id, false, true);
      });
      await localMutate();
      setPageQuery(0);
      confirm.onFalse();
      deleteConfirm.onFalse();
    } catch (error) {
      toast.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.deviceType.edit(id));
    },
    [router]
  );
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t_device('breadCrumb.deviceType')}
          links={[
            { name: t_device('breadCrumb.dashboard'), href: paths.dashboard.root },
            { name: t_device('breadCrumb.deviceType') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.deviceType.create}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_device('button.createDeviceType')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Paper elevation={12}>
          <Card>
            <DeviceTypeTableToolbar
              filters={filters}
              options={{ brand: brands }}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
            <Box sx={{ position: 'relative' }}>
              <TableSelectedAction
                numSelected={table.selected.length}
                rowCount={deviceTypes.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    deviceTypes.map((row) => row.id)
                  )
                }
                action={
                  <IconButton color="error" onClick={confirm.onTrue}>
                    <MdDelete />
                  </IconButton>
                }
              />
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHeadCustom
                    order={sortOrderQuery}
                    orderBy={sortColumnQuery}
                    headLabel={TABLE_HEAD}
                    rowCount={deviceTypesTotalCount}
                    numSelected={table.selected.length}
                    onSort={(column, direction) => handleSort(column, direction)}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        deviceTypes.map((row) => row.id)
                      )
                    }
                  />
                  {deviceTypesLoading ? (
                    <TableBody>{
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={1}>
                            <Skeleton variant="rectangular" width="100%" height={50} />
                          </TableCell>
                          <TableCell colSpan={2}>
                            <Skeleton variant="rectangular" width="100%" height={50} />
                          </TableCell>
                          <TableCell colSpan={2}>
                            <Skeleton variant="rectangular" width="100%" height={50} />
                          </TableCell>
                          <TableCell colSpan={2}>
                            <Skeleton variant="rectangular" width="100%" height={50} />
                          </TableCell>
                          <TableCell colSpan={3}>
                            <Skeleton variant="rectangular" width="100%" height={50} />
                          </TableCell>
                        </TableRow>
                      ))}</TableBody>
                  ) : (
                    <TableBody>
                      {deviceTypes
                        .map((row) => (
                          <DeviceTypeTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => {setSelectedRow(row.id); deleteConfirm.onTrue()}}
                            onEditRow={() => handleEditRow(row.id)}
                          />
                        ))}
                      <TableEmptyRows
                        height={56 + 20}
                        emptyRows={emptyRows(pageQuery - 1, pageSizeQuery, deviceTypesTotalCount)}
                      />

                      <TableNoData notFound={deviceTypesEmpty} />
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Box>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              page={pageQuery}
              count={deviceTypesTotalCount}
              rowsPerPage={pageSizeQuery}
              onPageChange={(event, newPage) =>
                setPageQuery(newPage)
              }
              onRowsPerPageChange={(e) => setPageSizeQuery(parseInt(e.target.value, 10))
              }
              component="div"
              sx={{ borderTopColor: 'transparent' }}
            />
          </Card>
        </Paper>

      </DashboardContent>

      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        title={t_common('button.delete')}
        content={t_common('commonTexts.deleteConfirm')}
        action={
          <Button variant="contained" color="error" onClick={() => handleDeleteRows(selectedRow)}>
             {deleteLoading ? t_common('button.deleteLoading') : t_common('button.delete')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t_common('button.delete')}
        content={
          <>
            {t_common('commonTexts.deleteItemsConfirm', { count: table.selected.length })}
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={() => handleDeleteRows(table.selected)}>
            {deleteLoading ? t_common('button.deleteLoading') : t_common('button.delete')}
          </Button>
        }
      />
    </>
  );
}



