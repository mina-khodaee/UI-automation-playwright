'use client';

import { Controller, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  IconButton,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableBody,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Scrollbar } from 'src/components/scrollbar';
import { ToggleSwitchGroup } from '@repo/ui/custom-mui-switch';

const defaultCompanion = {
  firstName: '',
  lastName: '',
  gender: 'Male',
  nationalCode: '',
  phoneNumber: '',
};
export function CompanionSection({ control }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'companions',
  });

  // FIX 1: Define errors state correctly as an object
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    nationalCode: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const emptyIndex = fields.findIndex((item) => !item.firstName && !item.lastName);
    if (emptyIndex !== -1) {
      remove(emptyIndex);
    }
  }, []);

  // Local state to handle the "New Entry" inputs
  const [newCompanion, setNewCompanion] = useState({ ...defaultCompanion });

  // // Function to handle adding the companion
  // const handleAddCompanion = () => {
  //   // Validation
  //   if (!newCompanion.firstName || !newCompanion.lastName) {
  //     alert('لطفاً نام را وارد کنید');
  //     return;
  //
  //     if (!newCompanion.firstName || !newCompanion.lastName) {
  //       alert('لطفاً  نام خانوادگی را وارد کنید');
  //       return;
  //
  //       if (!newCompanion.firstName || !newCompanion.lastName) {
  //         alert('لطفاً کدملی را وارد کنید');
  //         return;
  //         if (!newCompanion.firstName || !newCompanion.lastName) {
  //           alert('لطفاً جنیست را وارد کنید');
  //           return;
  //           if (!newCompanion.firstName || !newCompanion.lastName) {
  //             alert('لطفاً تلفن همراه را وارد کنید');
  //             return;
  //
  //           }

  // Function to handle adding the companion
  const handleAddCompanion = () => {
    // Validation
    if (!newCompanion.firstName || !newCompanion.lastName) {
      alert('لطفاً نام و نام خانوادگی را وارد کنید');
      return;
    }

    // Add to form state (Table)
    append({ ...newCompanion });

    // Reset input fields
    setNewCompanion({ ...defaultCompanion });
  };

  return (
    <Grid container>
      {/* INPUT SECTION */}
      <Box sx={{ py: 2, width: '66%' }}>
        <Box
          sx={{
            display: 'grid',
            rowGap: 2,
            columnGap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr 1fr auto auto 1fr' },
            alignItems: 'start',
          }}
        >
          <TextField
            label="نام"
            size="small"
            value={newCompanion.firstName}
            onChange={(e) => setNewCompanion({ ...newCompanion, firstName: e.target.value })}
          />
          <TextField
            label="نام خانوادگی"
            size="small"
            value={newCompanion.lastName}
            onChange={(e) => setNewCompanion({ ...newCompanion, lastName: e.target.value })}
          />

          <TextField
            label="کد ملی"
            size="small"
            value={newCompanion.nationalCode}
            onChange={(e) => setNewCompanion({ ...newCompanion, nationalCode: e.target.value })}
          />
          <TextField
            label="شماره تماس"
            size="small"
            value={newCompanion.phoneNumber}
            onChange={(e) => setNewCompanion({ ...newCompanion, phoneNumber: e.target.value })}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <ToggleSwitchGroup
                value={newCompanion.gender}
                onChange={(val) => setNewCompanion({ ...newCompanion, gender: val })}
                options={[
                  { label: 'مرد', value: 'Male' },
                  { label: 'زن', value: 'Female' },
                ]}
              />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCompanion}>
              افزودن
            </Button>
          </Box>
        </Box>
      </Box>

      {/* TABLE SECTION - Moved to be a sibling Grid item */}
      {fields.length > 0 && (
        <Grid size={{ xs: 12 }} sx={{ width: '55%' }}>
          <Scrollbar sx={{ width: '100%' }}>
            <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ px: 1, py: 0.5 }}>نام</TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>نام خانوادگی</TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>جنسیت</TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>کد ملی</TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>شماره تماس</TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }} align="right">
                    عملیات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((item, index) => {
                  const companion = control._formValues?.companions?.[index] || {};
                  return (
                    <TableRow key={item.id} sx={{ height: 36, '& > *': { borderBottom: 'none' } }}>
                      <TableCell sx={{ px: 1, py: 0.5 }}>{companion.firstName}</TableCell>
                      <TableCell sx={{ px: 1, py: 0.5 }}>{companion.lastName}</TableCell>
                      <TableCell sx={{ px: 1, py: 0.5 }}>
                        {companion.gender === 'Male'
                          ? 'مرد'
                          : companion.gender === 'Female'
                            ? 'زن'
                            : ''}
                      </TableCell>
                      <TableCell sx={{ px: 1, py: 0.5 }}>{companion.nationalCode}</TableCell>
                      <TableCell sx={{ px: 1, py: 0.5 }}>{companion.phoneNumber}</TableCell>
                      <TableCell sx={{ px: 1, py: 0.5 }} align="right">
                        <IconButton color="error" onClick={() => onDelete(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        </Grid>
      )}
    </Grid>
  );
}
