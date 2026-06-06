import { toast } from 'sonner';
import { MdDelete } from 'react-icons/md';
import { HiOutlinePlus } from "react-icons/hi2";
import { IconifyLocal } from '@repo/ui/iconify-local';
import { useState, useCallback, useEffect } from 'react';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { useBoolean, useDebounce, useSetState } from 'minimal-shared';

import IconButton from '@mui/material/IconButton';
import { Button, Card, Table, TableBody, Box, Skeleton, TableRow, TableCell, TablePagination, TableContainer } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { deleteAccessGroup, sendBiometricDataToDevices, useGetAccessGroups } from 'src/actions/access-group';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { emptyRows, TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedAction, useTable } from 'src/components/table';

import { AccessGroupTableRow } from '../access-group-table-row';
import { AccessGroupDetials } from '../access-group-detail-dialog';
import { AccessGroupTableToolbar } from '../access-group-table-toolbar';

// ----------------------------------------------------------------------

export function AccessGroupListView() {

  const { t: t_device } = useTranslate('device');
  const { t: t_common } = useTranslate();
  const TABLE_HEAD = [
    { id: 'name', label: t_device('formsInputs.accessGroupName'), align: 'center', width: 300 },
    { id: 'aclCalendar', label: t_device('formsInputs.calendarName'), align: 'center', width: 300 },
    { id: 'description', label: t_device('formsInputs.description'), align: 'center', width: 300 },
    { id: 'isDefault', label: t_device('formsInputs.defaultAccessGroup'), align: 'center', width: 300 },
    { id: 'editDelete', label: '', width: 200 },
  ];
  const ACCESS_GROUP_SORT_OPTIONS = [
    { value: 'oldest', label: t_device('filters.oldest') },
    { value: 'latest', label: t_device('filters.latest') },
  ];
  const table = useTable();
  const router = useRouter();
  const multiDeleteConfirm = useBoolean();
  const setBiomericDataToDevicesConfirm = useBoolean();
  const oneDeleteConfirm = useBoolean();
  const [searchQuery, setSearchQuery] = useState();
  const [pageQuery, setPageQuery] = useState(0);
  const [pageSizeQuery, setPageSizeQuery] = useState(5);
  const [sortBy, setSortBy] = useState('oldest');
  const [sortOrderQuery, setSortOrderQuery] = useState();
  const [sortColumnQuery, setSortColumnQuery] = useState();
  const [viewRow, setViewRow] = useState();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [biometricRow, setBiometricRow] = useState();
  const [sendBiometricLoading, setSendBiometricLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const debouncedQuery = useDebounce(searchQuery);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const filters = useSetState({ search: '' });
  const { accessGroups, accessGroupsLoading, accessGroupsEmpty, accessGroupsTotalCount, mutate: localMutate } = useGetAccessGroups(debouncedQuery, pageQuery + 1, pageSizeQuery, sortOrderQuery, sortColumnQuery);

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

  const handleSort = useCallback((newValue) => {
    setSortBy(newValue);
    setSortOrderQuery(sortBy === 'latest' ? 'asc' : 'desc');
    setSortColumnQuery('createdAt');
  }, [sortBy]);

  const handleDeleteRows = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteAccessGroup(id);
      toast.success(t_device('toastMessages.deleteAccessGroup'));
      table.onSelectAllRows(false, []);
      multiDeleteConfirm.onFalse();
      setPageQuery(0);
      await localMutate();
    } catch (error) {
      toast.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSendBiometricDataToDevices = async (id) => {
    setSendBiometricLoading(true);
    try {
      await sendBiometricDataToDevices({accessGroupId: id});
      toast.success(t_device('toastMessages.sendBiometricDataToDevices'));
      setBiomericDataToDevicesConfirm.onFalse();
    } catch (error) {
      toast.error(error);
    } finally {
      setSendBiometricLoading(false);
    }
  };

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.accessGroup.edit(id));
    },
    [router]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t_device('breadCrumb.accessGroup')}
          links={[
            { name: t_device('breadCrumb.dashboard'), href: paths.dashboard.root },
            { name: t_device('breadCrumb.accessGroup') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.accessGroup.create}
              variant="contained"
              startIcon={<IconifyLocal><HiOutlinePlus /></IconifyLocal>}
            >
              {t_device('breadCrumb.newAccessGroup')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <AccessGroupTableToolbar
            filters={filters}
            onSearch={handleSearch}
            onSort={handleSort}
            sort={sortBy}
            sortOptions={ACCESS_GROUP_SORT_OPTIONS}
          />
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={accessGroupsTotalCount}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  accessGroups.map((row) => row.id)
                )
              }
              action={
                <IconButton color="error" onClick={multiDeleteConfirm.onTrue}>
                  <IconifyLocal><MdDelete /></IconifyLocal>
                </IconButton>
              }
            />
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={accessGroupsTotalCount}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      accessGroups.map((row) => row.id)
                    )
                  }
                />
                {accessGroupsLoading ? (
                  <TableBody>{
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={1}>
                          <Skeleton variant="rectangular" width="80%" height={20} />
                        </TableCell>
                        <TableCell colSpan={2}>
                          <Skeleton variant="rectangular" width="60%" height={20} />
                        </TableCell>
                        <TableCell colSpan={2}>
                          <Skeleton variant="rectangular" width="60%" height={20} />
                        </TableCell>
                        <TableCell colSpan={2}>
                          <Skeleton variant="rectangular" width="60%" height={20} />
                        </TableCell>
                        <TableCell colSpan={1}>
                          <Skeleton variant="rectangular" width="100%" height={20} />
                        </TableCell>
                      </TableRow>
                    ))}</TableBody>
                ) : (
                  <TableBody>
                    {accessGroups
                      .map((row) => (
                        <AccessGroupTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => { setSelectedRow(row.id); oneDeleteConfirm.onTrue(); }}
                          onEditRow={() => handleEditRow(row.id)}
                          onViewRow={() => {
                            setViewRow(row.id);
                            setOpenDetailsDialog(true);
                          }}
                          onSendBiometric={() => {
                            setBiometricRow(row.id);
                            setBiomericDataToDevicesConfirm.onTrue();
                          }}
                        />
                      ))}
                    <TableEmptyRows
                      height={80}
                      emptyRows={emptyRows(pageQuery - 1, pageSizeQuery, accessGroupsTotalCount)}
                    />

                    <TableNoData notFound={accessGroupsEmpty} />
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Box>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            page={pageQuery}
            count={accessGroupsTotalCount}
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
      </DashboardContent>
      {openDetailsDialog && (
        <AccessGroupDetials open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} accessGroupId={viewRow} />
      )}
      <ConfirmDialog
        open={oneDeleteConfirm.value}
        onClose={oneDeleteConfirm.onFalse}
        title={t_common('button.delete')}
        content={t_common('commonTexts.deleteConfirm')}
        action={
          <Button variant="contained" color="error" onClick={() => handleDeleteRows(selectedRow)}>
            {t_common('button.delete')}
          </Button>
        }
      />
      <ConfirmDialog
        open={setBiomericDataToDevicesConfirm.value}
        onClose={setBiomericDataToDevicesConfirm.onFalse}
        title={t_device('button.sendBiometricDataToDevices')}
        content={t_device('texts.sendBiometricDataToDevices')}
        action={
          <Button variant="contained" color='success' onClick={() => handleSendBiometricDataToDevices(biometricRow)} disabled={sendBiometricLoading}>
            {sendBiometricLoading ? t_common('button.sending') : t_device('button.sendBiometricDataToDevices')}
          </Button>
        }
      />
      <ConfirmDialog
        open={multiDeleteConfirm.value}
        onClose={multiDeleteConfirm.onFalse}
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



