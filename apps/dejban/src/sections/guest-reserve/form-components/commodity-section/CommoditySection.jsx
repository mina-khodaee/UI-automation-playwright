'use client';

import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Grid, TextField, Autocomplete, Box } from '@mui/material';
import { useGetVisitorItemTypes } from 'src/services/visitorItemTypes/visitorItemTypes.service';
import { useGetVisitorItems } from 'src/services/visitorItems/VisitorItems.service';

export function CommoditySection({ control }) {
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const { data: groupsData, refetch: refetchGroups } = useGetVisitorItemTypes({}, false);

  const { data: itemsData, refetch: refetchItems } = useGetVisitorItems({}, false);

  const filteredItems = useMemo(() => {
    if (!selectedGroupId) return [];
    return itemsData?.items?.filter((item) => item?.visitorItemType?.id === selectedGroupId) || [];
  }, [selectedGroupId, itemsData]);

  const inputSx = {
    '& .MuiInputBase-root': { height: 38, fontSize: 13 },
    '& .MuiInputBase-input': { padding: '6px 10px' },
    '& .MuiInputLabel-root': { fontSize: 12, top: '-3px' },
    '& .MuiOutlinedInput-notchedOutline': { borderRadius: 1 },
  };

  return (
    <Grid size={{ xs: 6 }}>
      <Grid size={{ xs: 12}}>
        <Box display="flex" gap={2}>
          {/* گروه کالا */}
          <Grid
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1,
              width: '33rem',
            }}
          >
            {/* ===================== TOP ROW ===================== */}

            <Autocomplete
              fullWidth
              options={groupsData?.items || []}
              value={groupsData?.items?.find((g) => g.id === selectedGroupId) || null}
              onChange={(_, value) => {
                setSelectedGroupId(value?.id || '');
              }}
              onOpen={() => {
                if (!groupsData?.items?.length) refetchGroups();
              }}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="دسته‌بندی کالا" size="small" sx={inputSx} />
              )}
            />

            {/* آیتم‌ها */}
            <Controller
              name="visitorItemIds"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={filteredItems}
                  value={filteredItems.filter((i) => field.value?.includes(i.id))}
                  onChange={(_, value) => {
                    field.onChange(value.map((v) => v.id));
                  }}
                  getOptionLabel={(option) => option.name}
                  onOpen={() => {
                    if (!itemsData?.items?.length) refetchItems();
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="کالاها و اقلام همراه" size="small" sx={inputSx} />
                  )}
                />
              )}
            />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
