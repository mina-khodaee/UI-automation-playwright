'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import { FiX, FiUser } from 'react-icons/fi';
import { useTranslate } from 'src/locales';
import { useGetUsersWithSpecialClaim } from 'src/services/account-management/account-management.service';

export function SpecialUserClaims({ open, onClose, claimId }) {
  const { t } = useTranslate();
  const { data, isLoading } = useGetUsersWithSpecialClaim(claimId ? { claimId } : {});
  const users = data?.items || [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FiUser />
          <Typography variant="h6" fontWeight="bold">
            کاربران با دسترسی اختصاصی
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <FiX />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ p: 4 }}>
            کاربری یافت نشد
          </Typography>
        ) : (
          <List>
            {users.map((user, index) => (
              <ListItem key={user.id || index} divider>
                <ListItemText
                  primary={`${user.firstName} ${user.lastName}`}
                  secondary={user.nationalCode}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
