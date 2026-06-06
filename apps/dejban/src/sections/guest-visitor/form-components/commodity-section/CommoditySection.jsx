'use client';

import { useFieldArray } from 'react-hook-form';
import {
  Grid,
  TextField,
  Autocomplete,
  Card,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useGetVisitorItemTypes } from 'src/services/visitorItemTypes/visitorItemTypes.service';
import { useGetVisitorItems } from 'src/services/visitorItems/VisitorItems.service';
import AddIcon from '@mui/icons-material/Add';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useBoolean } from 'minimal-shared/hooks';

export function CommoditySection({ control }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'commodities',
  });

  const [tempInput, setTempInput] = useState({
    groupId: '',
    visitorItemIds: [],
  });

  // FIX 1: Define errors state correctly as an object
  const [errors, setErrors] = useState({
    groupId: '',
    visitorItemIds: '',
  });

  const { data: groupsData, refetch: refetchGroupsData } = useGetVisitorItemTypes({}, false);
  const { data: itemsData, refetch: refetchItemsData } = useGetVisitorItems({}, false);

  const filteredItems = useMemo(() => {
    if (!tempInput.groupId) return [];
    return (
      itemsData?.items?.filter((item) => item?.visitorItemType?.id === tempInput.groupId) || []
    );
  }, [tempInput.groupId, itemsData]);

  const handleAddCommodity = () => {
    // FIX 2: Update the specific key using spread syntax
    if (!tempInput.groupId) {
      setErrors({ ...errors, groupId: 'لطفاً گروه را انتخاب کنید' });
      return;
    }

    if (tempInput.visitorItemIds.length === 0) {
      setErrors({ ...errors, visitorItemIds: 'لطفاً حداقل یک آیتم را انتخاب کنید' });
      return;
    }

    const groupObj = groupsData?.items?.find((g) => g.id === tempInput.groupId);
    const selectedItemsObjs = filteredItems.filter((i) => tempInput.visitorItemIds.includes(i.id));

    append({
      id: Date.now(),
      groupId: tempInput.groupId,
      groupName: groupObj?.name || '',
      visitorItemIds: tempInput.visitorItemIds,
      itemNames: selectedItemsObjs.map((i) => i.name),
    });

    setTempInput({ groupId: '', visitorItemIds: [] });
  };

  const handleDeleteItem = (index) => {
    remove(index);
  };

  return (
    <Grid container spacing={2}>
      {/* --- بخش ورودی (فرم موقت) --- */}
      <Card sx={{ p: 2, width: '100%' }}>
        <Box
          sx={{
            display: 'grid',
            rowGap: 2,
            columnGap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr auto' },
            alignItems: 'start',
          }}
        >
          {/* گروه */}
          <Autocomplete
            options={groupsData?.items || []}
            value={groupsData?.items?.find((g) => g.id === tempInput.groupId) || null}
            onChange={(_, v) => {
              setTempInput({ ...tempInput, groupId: v?.id ?? '', visitorItemIds: [] });
            }}
            onOpen={() => {
              if (!groupsData?.items?.length) refetchGroupsData();
            }}
            getOptionLabel={(o) => o.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="انتخاب دسته بندی کالا"
                size="small"
                error={!!errors.groupId}
                helperText={errors.groupId}
              />
            )}
          />

          {/* آیتم‌ها */}
          <Autocomplete
            multiple
            options={filteredItems}
            value={filteredItems.filter((i) => tempInput.visitorItemIds.includes(i.id))}
            onChange={(_, v) => {
              setTempInput({ ...tempInput, visitorItemIds: v.map((i) => i.id) });
            }}
            getOptionLabel={(o) => o.name}
            onOpen={() => {
              if (!itemsData?.items?.length) refetchItemsData();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="انتخاب آیتم‌ها"
                size="small"
                error={!!errors.visitorItemIds}
                helperText={errors.visitorItemIds}
              />
            )}
          />

          {/* دکمه افزودن */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCommodity}>
              افزودن
            </Button>
          </Box>
        </Box>
      </Card>

      {/* TABLE SECTION */}
      {fields.length > 0 && (
        <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ width: '100%' }}>
              <Scrollbar sx={{ minHeight: 200 }}>
                <Table sx={{ minWidth: 800, width: '100%', border: '1px solid #e0e0e0' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>گروه</TableCell>
                      <TableCell>آیتم‌ها</TableCell>
                      <TableCell align="right">عملیات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields?.map((row) => (
                      <CollapsibleTableRow key={row.id} row={row} onDelete={handleDeleteItem} />
                    ))}
                  </TableBody>
                </Table>
              </Scrollbar>
            </Box>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}

// ----------------------------------------------------------------------
// Custom Table Row Component
// ----------------------------------------------------------------------
function CollapsibleTableRow({ row, onDelete }) {
  const collapsible = useBoolean();

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            color={collapsible.value ? 'inherit' : 'default'}
            onClick={collapsible.onToggle}
          >
            <Iconify
              icon={collapsible.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.groupName}
        </TableCell>
        <TableCell>
          {row.itemNames?.map((name, index) => (
            <span key={index}>
              {name}
              {index < row.itemNames.length - 1 ? ' - ' : ''}
            </span>
          ))}
        </TableCell>
        <TableCell align="right">
          <IconButton color="error" onClick={() => onDelete(row.id)}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={4}>
          <Collapse in={collapsible.value} timeout="auto" unmountOnExit>
            <Paper
              variant="outlined"
              sx={[
                (theme) => ({
                  py: 2,
                  mb: 2,
                  borderRadius: 1.5,
                  ...(collapsible.value && { boxShadow: theme.vars.customShadows.z20 }),
                }),
              ]}
            ></Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
