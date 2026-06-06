'use client';

import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip, Stack } from '@mui/material';
import { TbMapPinPlus } from 'react-icons/tb';
import { IoCloseCircleOutline } from "react-icons/io5";
import CustomTreeItem from './custom-tree-item';

const LocationTreeView = ({
  locationTree,
  selectedItem,
  onNodeSelect,
  onUnselect,
  onAddCountry,
  isEmpty,
}) => {
  return (
    <Paper sx={{ px: 3, py: 1, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Stack direction="row" spacing={1}>
          <Tooltip title="افزودن کشور جدید">
            <IconButton onClick={onAddCountry} color="primary">
              <TbMapPinPlus />
            </IconButton>
          </Tooltip>

          <Tooltip title="لغو انتخاب">
            <IconButton onClick={onUnselect} color="error" disabled={!selectedItem}>
              <IoCloseCircleOutline />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Box
        sx={{
          height: 500,
          overflow: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
        }}
      >
        {isEmpty ? (
          <Typography color="text.secondary" textAlign="center" sx={{ mt: 10 }}>
            هیچ کشوری یافت نشد
          </Typography>
        ) : (
          locationTree.map((country) => (
            <CustomTreeItem key={country.id} node={country} onSelect={onNodeSelect} />
          ))
        )}
      </Box>
    </Paper>
  );
};

export default LocationTreeView;
