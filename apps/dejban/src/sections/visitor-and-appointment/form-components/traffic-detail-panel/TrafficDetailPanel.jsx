'use client';

import { useState } from 'react';
import { IconifyLocal } from '@repo/ui/iconify-local';
import {
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import { BiSolidPencil } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import moment from 'moment-jalaali';
import { toast } from 'src/components/snackbar';
import { useGetDoors } from 'src/services/doors/doors.service';
import { TrafficModal } from './TrafficModal';

// ----------------------------------------------------------------------

export function TrafficDetailPanel({ appointmentId, appointmentData, onRefresh }) {
  const [trafficList, setTrafficList] = useState(appointmentData?.trafficRecords || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTraffic, setEditingTraffic] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trafficToDelete, setTrafficToDelete] = useState(null);

  const { data: doorsData } = useGetDoors();
  const doorsOptions =
    doorsData?.items?.map((door) => ({
      id: door.id,
      label: door.doorName,
    })) || [];

  const handleAddTraffic = (newTraffic) => {
    const updated = [
      ...trafficList,
      {
        ...newTraffic,
        id: crypto.randomUUID(),
        appointmentId,
      },
    ];
    setTrafficList(updated);
    onRefresh();
    toast.success('تردد با موفقیت ثبت شد');
  };

  const handleUpdateTraffic = (updatedTraffic) => {
    const updated = trafficList.map((t) => (t.id === updatedTraffic.id ? updatedTraffic : t));
    setTrafficList(updated);
    setEditingTraffic(null);
    onRefresh();
    toast.success('تردد با موفقیت ویرایش شد');
  };

  const handleDeleteTraffic = () => {
    if (trafficToDelete) {
      const updated = trafficList.filter((t) => t.id !== trafficToDelete.id);
      setTrafficList(updated);
      onRefresh();
      toast.success('تردد با موفقیت حذف شد');
    }
    setDeleteDialogOpen(false);
    setTrafficToDelete(null);
  };

  const openEditModal = (traffic) => {
    setEditingTraffic(traffic);
    setModalOpen(true);
  };

  const openDeleteDialog = (traffic) => {
    setTrafficToDelete(traffic);
    setDeleteDialogOpen(true);
  };

  const getRowBgColor = (traffic) => {
    if (traffic.isEmergency) return '#fff3e0';
    return 'inherit';
  };

  const getDateColor = (traffic) => {
    if (traffic.isEmergency) return 'warning.main';
    return 'info.main';
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ width: '100%', overflow: 'hidden' }}>
        <Table size="small" stickyHeader sx={{ '& .MuiTableCell-root': { py: 0.5, px: 1 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#e0e0e0', width: '100%' }}>
              <TableCell width="120">تاریخ و ساعت ورود</TableCell>
              <TableCell width="120">تاریخ و ساعت خروج</TableCell>
              <TableCell width="100">درب</TableCell>
              <TableCell width="70" align="center">
                عملیات
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trafficList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary" py={2} variant="body2">
                    هیچ ترددی ثبت نشده است
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              trafficList.map((traffic) => (
                <TableRow
                  key={traffic.id}
                  sx={{
                    bgcolor: getRowBgColor(traffic),
                    '&:hover': { bgcolor: 'action.hover' },
                    height: 40,
                  }}
                >
                  <TableCell>
                    <Tooltip
                      title={traffic.isEmergency ? 'تردد اضطراری' : 'تردد عادی'}
                      arrow
                      placement="top"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: getDateColor(traffic),
                          fontWeight: traffic.isEmergency ? 500 : 400,
                          cursor: 'default',
                        }}
                      >
                        {traffic.entryDateTime
                          ? moment(traffic.entryDateTime).format('jYYYY/jMM/jDD HH:mm')
                          : '-'}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Tooltip
                      title={traffic.isEmergency ? 'تردد اضطراری' : 'تردد عادی'}
                      arrow
                      placement="top"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: getDateColor(traffic),
                          fontWeight: traffic.isEmergency ? 500 : 400,
                          cursor: 'default',
                        }}
                      >
                        {traffic.exitDateTime
                          ? moment(traffic.exitDateTime).format('jYYYY/jMM/jDD HH:mm')
                          : '-'}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{traffic.doorName || traffic.doorId}</Typography>
                  </TableCell>

                  <TableCell align="center" sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => openEditModal(traffic)}
                        sx={{ p: 0.5 }}
                      >
                        <IconifyLocal>
                          <BiSolidPencil size={14} />
                        </IconifyLocal>
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openDeleteDialog(traffic)}
                        sx={{ p: 0.5 }}
                      >
                        <IconifyLocal>
                          <MdDelete size={14} />
                        </IconifyLocal>
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <TrafficModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTraffic(null);
        }}
        onSave={editingTraffic ? handleUpdateTraffic : handleAddTraffic}
        initialData={editingTraffic}
        isEmergency={false}
        doorsOptions={doorsOptions}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ py: 1.5, fontSize: '1rem' }}>تأیید حذف</DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <Typography variant="body2">آیا از حذف این تردد اطمینان دارید؟</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5 }}>
          <Button onClick={handleDeleteTraffic} color="error" variant="contained" size="small">
            حذف
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="primary"
            variant="outlined"
            size="small"
          >
            انصراف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
