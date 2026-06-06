'use client'

import { useState } from 'react';
import { Field } from 'src/components/hook-form';
import Box from '@mui/material/Box';
import { useGetStaffWithPagination } from 'src/services/staff/staff.service';

const VehicleOwnershipFields = ({ ownershipType, siteOptions, unitOptions, t_staff }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: staffData, isLoading } = useGetStaffWithPagination({
    page: 1,
    pageSize: 10,
    searchTerm: searchTerm,
  });

  const staffOptions = staffData?.items?.map((staff) => ({
    label: `${staff.firstName} ${staff.lastName} ${staff.personnelCode ? `- ${staff.personnelCode}` : ''}`,
    value: staff.id,
  })) || [];

  if (ownershipType === 1) {
    return (
      <>

        <Box sx={{ gridColumn: { sm: 'span 6' } }}>
          <Field.Autocomplete
            name="ownerId"
            label="انتخاب پرسنل"
            options={staffOptions}
            size='small'
            loading={isLoading}
            onInputChange={(event, value) => {
              setSearchTerm(value);
            }}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return option.label || '';
            }}
            noOptionsText="نتیجه‌ای یافت نشد"
            placeholder="جستجو با نام، نام خانوادگی یا کد پرسنلی..."
            fullWidth
          />
        </Box>

        <Field.Select
          name="siteIds"
          label={t_staff('formsInputs.siteId')}
          data={siteOptions}
          displayExp="label"
          valueExp="value"
          size='small'
          sx={{ gridColumn: { sm: 'span 3' } }}
        />

        {/* <Field.Select
          name="unitId"
          label={t_staff('formsInputs.unitId')}
          data={unitOptions}
          displayExp="label"
          valueExp="value"
          size='small'
          sx={{ gridColumn: { sm: 'span 3' } }}
        /> */}
      </>
    );
  }

  if (ownershipType === 4 || ownershipType === 2) {
    return (
      <>
        <Field.Select
          name="siteIds"
          label={t_staff('formsInputs.siteId')}
          data={siteOptions}
          displayExp="label"
          valueExp="value"
          size='small'
        />
        {/* <Field.Select
          name="unitId"
          label={t_staff('formsInputs.unitId')}
          data={unitOptions}
          displayExp="label"
          valueExp="value"
          size='small'
        /> */}
      </>
    );
  }

  return null;
};

export default VehicleOwnershipFields;