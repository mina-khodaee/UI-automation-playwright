'use client';

import { useFieldArray } from 'react-hook-form';
import {
  Grid,
  TextField,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Scrollbar } from 'src/components/scrollbar';

export function VehicleSection({ control }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'vehicles',
  });

  const [tempVehicle, setTempVehicle] = useState({
    plateNumber: '',
    model: '',
  });

  const [errors, setErrors] = useState({
    plateNumber: '',
    model: '',
  });

  const inputSx = {
    '& .MuiInputBase-root': { height: 38, fontSize: 13 },
    '& .MuiInputBase-input': { padding: '6px 10px' },
    '& .MuiInputLabel-root': { fontSize: 12, top: '-3px' },
    '& .MuiOutlinedInput-notchedOutline': { borderRadius: 1 },
  };

  const handleAddVehicle = () => {
    if (!tempVehicle.plateNumber) {
      setErrors({ ...errors, plateNumber: 'شماره پلاک الزامی است' });
      return;
    }

    if (!tempVehicle.model) {
      setErrors({ ...errors, model: 'مدل خودرو الزامی است' });
      return;
    }

    append({
      id: Date.now(),
      plateNumber: tempVehicle.plateNumber,
      model: tempVehicle.model,
    });

    setTempVehicle({ plateNumber: '', model: '' });
    setErrors({ plateNumber: '', model: '' });
  };

  const handleDeleteVehicle = (index) => {
    remove(index);
  };

  return (
    <Grid container>
      <Box sx={{ py: 2, width: '100%' }}>
        <Box
          sx={{
            display: 'grid',
            rowGap: 2,
            columnGap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr 1fr' },
            alignItems: 'start',
          }}
        >
          {/* شماره پلاک */}
          <TextField
            label="شماره پلاک"
            size="small"
            value={tempVehicle.plateNumber}
            onChange={(e) => setTempVehicle({ ...tempVehicle, plateNumber: e.target.value })}
            error={!!errors.plateNumber}
            helperText={errors.plateNumber}
            sx={inputSx}
          />

          {/* مدل خودرو */}
          <TextField
            label="مدل خودرو"
            size="small"
            value={tempVehicle.model}
            onChange={(e) => setTempVehicle({ ...tempVehicle, model: e.target.value })}
            error={!!errors.model}
            helperText={errors.model}
            sx={inputSx}
          />

          {/* دکمه افزودن */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddVehicle}>
              افزودن
            </Button>
          </Box>
        </Box>
      </Box>

      {/* TABLE SECTION */}
      {fields.length > 0 && (
        <Grid size={{ xs: 12 }} sx={{ width: '55%' }}>
          <Scrollbar sx={{ width: '100%' }}>
            <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ px: 1, py: 0.5 }}>شماره پلاک</TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }}>مدل خودرو</TableCell>
                  <TableCell sx={{ px: 1, py: 0.5 }} align="right">
                    عملیات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '& > *': { borderBottom: 'none' },
                      height: 36,
                    }}
                  >
                    <TableCell sx={{ px: 1, py: 0.5 }}>{row.plateNumber}</TableCell>
                    <TableCell sx={{ px: 1, py: 0.5 }}>{row.model}</TableCell>
                    <TableCell sx={{ px: 1, py: 0.5 }} align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteVehicle(index)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </Grid>
      )}
    </Grid>
  );
}
