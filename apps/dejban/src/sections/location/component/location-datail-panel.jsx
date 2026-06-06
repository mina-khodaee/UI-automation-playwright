'use client'

import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Stack 
} from '@mui/material';
import { MdDelete } from 'react-icons/md';
import { TbMapPinPlus } from 'react-icons/tb';
import { getAddButtonLabel } from './constants';

const LocationDetailsPanel = ({
  selectedItem,
  onAddLocation,
  onEdit,
  onDelete,
  onAddCountry
}) => {
  const getTypeLabel = (type) => {
    switch (type) {
      case 'country': return 'کشور';
      case 'province': return 'استان';
      case 'city': return 'شهر';
      default: return '';
    }
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {selectedItem ? selectedItem.label : 'اطلاعات انتخاب شده'}
        </Typography>

        {selectedItem ? (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                نوع:
              </Typography>
              <Typography variant="body1">
                {getTypeLabel(selectedItem.type)}
              </Typography>
            </Box>

            {selectedItem.data?.enName && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  نام انگلیسی:
                </Typography>
                <Typography variant="body1">
                  {selectedItem.data.enName}
                </Typography>
              </Box>
            )}

            {selectedItem.data?.latitude && selectedItem.data?.longitude && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  مختصات:
                </Typography>
                <Typography variant="body1">
                  {selectedItem.data.latitude}, {selectedItem.data.longitude}
                </Typography>
              </Box>
            )}

            {selectedItem.data?.phoneCode && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  کد تلفن:
                </Typography>
                <Typography variant="body1">
                  {selectedItem.data.phoneCode}
                </Typography>
              </Box>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={onAddLocation}
                disabled={selectedItem.type === 'city'}
                fullWidth
              >
                {getAddButtonLabel(selectedItem.type)}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onClick={onEdit}
                sx={{ flex: 1 }}
              >
                ویرایش
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={onDelete}
                startIcon={<MdDelete />}
                fullWidth
              >
                حذف
              </Button>
            </Stack>
          </Stack>
        ) : (
          <>
            <Typography 
              color="text.secondary" 
              textAlign="center" 
              sx={{ mt: 5, mb: 3 }}
            >
              یک آیتم از درخت انتخاب کنید
            </Typography>
            <Button
              variant="contained"
              startIcon={<TbMapPinPlus />}
              onClick={onAddCountry}
              fullWidth
              size="large"
            >
              افزودن کشور جدید
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default LocationDetailsPanel;