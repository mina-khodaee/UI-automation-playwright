import { toast } from 'sonner';
import { useBoolean } from 'minimal-shared';
import { HiOutlinePlus } from 'react-icons/hi2';
import { LiaClipboardSolid } from "react-icons/lia";
import { IconifyLocal } from '@repo/ui/iconify-local';
import { useCallback, useEffect, useState } from 'react';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { useDebounce, useSetState } from 'minimal-shared/hooks';

import { Card, Table, TableBody, Skeleton, TableRow, TableCell, Button, TablePagination, TableContainer, Paper, Alert, IconButton, Box, Tooltip } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useAPIKeyActions } from 'src/stores/api-key-actions-store';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { emptyRows, TableEmptyRows, TableHeadCustom, TableNoData } from 'src/components/table';

import { APIKeyTableRow } from '../api-key-table-row';
import { APIKeyTableToolbar } from '../api-key-table-toolbar';
import { APIKeyNewEditFormDialog } from '../api-key-new-edit-form-dialog';

// ----------------------------------------------------------------------

export function APIKeyListView() {
  const { getAPIKeys, loading, totalCount, deleteAPIKeys, allAPIKeys, createdKey } = useAPIKeyActions();
  const { t: t_user } = useTranslate('user');
  const { t: t_common } = useTranslate();
  const confirm = useBoolean();

  const [pageQuery, setPageQuery] = useState(0);
  const [pageSizeQuery, setPageSizeQuery] = useState(5);
  const [searchQuery, setSearchQuery] = useState();
  const debouncedQuery = useDebounce(searchQuery);
  const [fetchFlag, setFetchFlag] = useState(false);

  const [openNewAPIKeyDialog, setOpenNewAPIKeyDialog] = useState(false);
  const [currentAPIKey, setCurrentAPIKey] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sortColumnQuery, setSortColumnQuery] = useState();
  const [sortOrderQuery, setSortOrderQuery] = useState();

  const TABLE_HEAD = [
    { id: 'name', label: t_user('formsInputs.apiKeyName'), align: 'center', width: 220, sortable: true },
    { id: 'creatorName', label: t_user('formsInputs.creatorName'), align: 'center', width: 220, sortable: false },
    { id: 'scopes', label: t_user('formsInputs.scopes'), align: 'center', width: 200, sortable: false },
    { id: 'description', label: t_user('formsInputs.description'), align: 'center', width: 220, sortable: false },
    { id: 'expirationDate', label: t_user('formsInputs.expirationDate'), align: 'center', width: 250, sortable: true },
    { id: 'createdAt', label: t_user('formsInputs.createdAt'), align: 'center', width: 250, sortable: true },
    { id: 'editDelete', label: '', width: 200, sortable: false },
  ];

  const [key, setKey] = useState(null);
  const filters = useSetState({ filterScope: '', search: '' });

  useEffect(() => {
    const fetchData = async () => {
      await getAPIKeys(pageSizeQuery, pageQuery + 1, debouncedQuery);
    };
    fetchData();
  }, []);

  const refetch = async (pageSize, page, search, sortColumn, sortOrder) => {
    await getAPIKeys(pageSize, page + 1, search, sortColumn, sortOrder);
  };

  const handleSearch = useCallback((e) => {
    if (e.target.value?.length > 2) {
      setSearchQuery(e.target.value)
      setFetchFlag(true);
      refetch(pageSizeQuery, pageQuery, e.target.value);
    }
    else {
      setSearchQuery();
      if (e.target.value?.length <= 2 && fetchFlag) {
        refetch(pageSizeQuery, pageQuery, null);
        setFetchFlag(false);
      }
    }
    filters.setState({ search: e.target.value });
  }, [filters]);

  const handleSort = (column, direction) => {
    setSortColumnQuery(column);
    setSortOrderQuery(direction);
    refetch(pageSizeQuery, pageQuery, searchQuery, column, direction);
  };

  const handleDeleteRow = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteAPIKeys(id);
      toast.success(t_user('toastMessages.deleteAPIKey'));
      setPageQuery(0);
      await getAPIKeys(pageSizeQuery, 1);
      confirm.onFalse();
    } catch (error) {
      toast.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(key).then(() => {
      toast.success(t_user('toastMessages.copy'));
    }).catch((err) => {
      toast.error(err);
    });
  };

  return (
    <DashboardContent >
      <CustomBreadcrumbs
        heading={t_user('breadcrumb.APIKeys')}
        links={[
          { name: t_user('breadcrumb.dashboard'), href: paths.dashboard.root },
          { name: t_user('breadcrumb.APIKeys') },
        ]}
        action={
          <Button variant='contained'
            onClick={() => { setCurrentAPIKey(null); setOpenNewAPIKeyDialog(true) }}
            color='inherit'
            startIcon={<HiOutlinePlus />}
          >
            {t_user('buttons.newAPIKey')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {
        createdKey &&
        <Alert severity="success" sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <IconifyLocal sx={{ mr: 2 }}>
              <Tooltip title={t_common('button.copy')} arrow placement="top">
                <IconButton onClick={handleCopy}>
                  <LiaClipboardSolid />
                </IconButton>
              </Tooltip>
            </IconifyLocal>
            <Box>{t_user('toastMessages.createAPIKey', { key: createdKey })}</Box>
          </Box>
        </Alert>
      }
      <Paper elevation={12} sx={{ borderRadius: 2 }}>
        <APIKeyTableToolbar
          filters={filters}
          onSearch={handleSearch}
        />
        <Card>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                order={sortOrderQuery}
                orderBy={sortColumnQuery}
                onSort={(column, direction) => handleSort(column, direction)}
                rowCount={totalCount}
                sx={{ whiteSpace: 'nowrap' }}
              />
              <TableBody>
                {loading.fetch ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={1}>
                        <Skeleton variant="rectangular" width="100%" height={20} />
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Skeleton variant="rectangular" width="80%" height={20} />
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Skeleton variant="rectangular" width="80%" height={20} />
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Skeleton variant="rectangular" width="80%" height={20} />
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Skeleton variant="rectangular" width="70%" height={20} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    {allAPIKeys.map((row) => (
                      <APIKeyTableRow
                        key={row.id}
                        row={row}
                        onEditRow={() => {
                          setCurrentAPIKey(row);
                          setOpenNewAPIKeyDialog(true);
                        }}
                        onDeleteRow={() => {
                          setCurrentAPIKey(row);
                          confirm.onTrue();
                        }}
                      />
                    ))}
                    <TableEmptyRows
                      height={80}
                      emptyRows={emptyRows(pageQuery, pageSizeQuery, totalCount)}
                    />
                    <TableNoData notFound={totalCount === 0} />
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            page={pageQuery}
            count={totalCount ?? 0}
            rowsPerPage={pageSizeQuery}
            onPageChange={async (event, newPage) => {
              setPageQuery(newPage)
              await refetch(pageSizeQuery, newPage)
            }}
            onRowsPerPageChange={async (e) => {
              setPageSizeQuery(parseInt(e.target.value, 10))
              await refetch(parseInt(e.target.value, 10), pageQuery)
            }}
            component="div"
            sx={{ borderTopColor: 'transparent' }}
          />
        </Card>
      </Paper>

      {openNewAPIKeyDialog && (
        <APIKeyNewEditFormDialog
          open={openNewAPIKeyDialog}
          onClose={() => setOpenNewAPIKeyDialog(false)}
          currentAPIKey={currentAPIKey}
          onRefetch={() => refetch(pageSizeQuery, pageQuery)}
          onOpenShowKey={(APIKey) => setKey(APIKey)}
        />
      )}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t_common('button.delete')}
        content={t_common('commonTexts.deleteConfirm')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(currentAPIKey.id);
            }}
            disabled={deleteLoading}
          >
            {deleteLoading ? t_common('button.deleteLoading') : t_common('button.delete')}
          </Button>
        }
      />
    </DashboardContent>
  );
}
