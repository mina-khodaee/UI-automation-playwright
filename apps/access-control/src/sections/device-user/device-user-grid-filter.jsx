import React, { useCallback, useState } from 'react';

import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField, Box, MenuItem, Checkbox, OutlinedInput, Select, InputLabel, FormControl, Stack } from '@mui/material';

import { useTranslate } from 'src/locales';
import { getUserTypes } from 'src/actions/device-user';

// ----------------------------------------------------------------------

export const UserNameFilterInput = ({ item, applyValue, focusElementRef }) => {
  const { t } = useTranslate('report');

  const handleChange = (event) => {
    applyValue({ ...item, value: event.target.value });
  };
  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}
    >
      <TextField
        label={t('filterLabels.value')}
        value={item?.value || ''}
        onChange={handleChange}
        ref={focusElementRef}
        variant="outlined"
        sx={{ width: '100%' }}
      />
    </Box>
  );
};

// ----------------------------------------------------------------------

export const CreateTimeBetweenFilterInput = ({ item, applyValue, focusElementRef }) => {
  const { t: t_report } = useTranslate('report');
  const { t: t_common } = useTranslate();

  const [filterValueState, setFilterValueState] = useState([null, null]);

  const handleLowerFilterChange = (newValue) => {
  
    setFilterValueState([newValue, filterValueState[1]]);
    
    applyValue({
      ...item,
      value: {
        lowerValue: newValue,
        upperValue: filterValueState[1],
      }
    });
  };

  const handleUpperFilterChange = (newValue) => {
  
    setFilterValueState([filterValueState[0], newValue]);
  
    applyValue({
      ...item,
      value: {
        lowerValue: filterValueState[0],
        upperValue: newValue,
      }
    });
  };

  return (
    <LocalizationProvider>
      <Box
        sx={{
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "start",
          height: 48,
          pl: "20px",
        }}
      >
        {/* Lower DateTime Picker */}
        <DateTimePicker
          ampm={false}
          label={t_report('filterLabels.from')}
          value={filterValueState[0]} 
          onChange={(newValue) => handleLowerFilterChange(newValue)} 
          localeText={{
            okButtonLabel: t_common('button.ok'),
          }}
          slotProps={{
            textField: {
              name:"lower-bound-input",
              placeholder:t_report('filterLabels.from'),
              variant:"outlined",
              inputRef:{focusElementRef},
              sx:{ mx: 2, width: '100%' }
            },
          }}
        />

        {/* Upper DateTime Picker */}
        <DateTimePicker
          ampm={false}
          label={t_report('filterLabels.to')}
          value={filterValueState[1]} 
          onChange={(newValue) => handleUpperFilterChange(newValue)}
          localeText={{
            okButtonLabel: t_common('button.ok')
          }}
          slotProps={{
            textField: {
              name:"upper-bound-input",
              placeholder:t_report('filterLabels.to'),
              variant:"outlined",
              inputRef:{focusElementRef},
              sx:{ width: '100%' }
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

// ----------------------------------------------------------------------

export const CreateTimeBeforeFilterInput = ({ item, applyValue, focusElementRef }) => {
  const { t: t_report } = useTranslate('report');
  const { t: t_common } = useTranslate();
  const [filterValue, setFilterValue] = useState(item.value || null);
  const handleChange = (newValue) => {
    applyValue({ ...item, value: newValue });
    setFilterValue(newValue);
  };
  return (
    <LocalizationProvider >
      <Box
        sx={{
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "end",
          height: 48,
          pl: "20px",
        }}
      >
        <DateTimePicker
          ampm={false}
          label={t_report('filterLabels.to')}
          value={filterValue} 
          onChange={(newValue) => {handleChange(newValue)}} 
          localeText={{
            okButtonLabel: t_common('button.ok')
          }}
          slotProps={{
            textField: {
              name:"upper-bound-input",
              placeholder:t_report('filterLabels.to'),
              variant:"outlined",
              inputRef:{focusElementRef},
              sx:{ width: '100%' }
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

// ----------------------------------------------------------------------

export const CreateTimeAfterFilterInput = ({ item, applyValue, focusElementRef }) => {
  const { t: t_report } = useTranslate('report');
  const { t: t_common } = useTranslate();
  const [filterValue, setFilterValue] = useState(item.value || null);
  const handleChange = (newValue) => {
    applyValue({ ...item, value: newValue });
    setFilterValue(newValue);
  };
  return (
    <LocalizationProvider >
      <Box
        sx={{
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "end",
          height: 48,
          pl: "20px",
        }}
      >
        <DateTimePicker
          ampm={false}
          label={t_report('filterLabels.from')}
          value={filterValue}
          onChange={(newValue) => handleChange(newValue)}
          localeText={{
            okButtonLabel: t_common('button.ok')
          }}
          slotProps={{
            textField: {
              name:"lower-bound-input",
              placeholder:t_report('filterLabels.from'),
              variant:"outlined",
              inputRef:{focusElementRef},
              sx:{ width: '100%' }
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

// ----------------------------------------------------------------------

export const IsBlacklistFilterInput = ({ item, applyValue, focusElementRef }) => {
  const handleChange = (event) => {
    console.log(event.target.value);
    applyValue({ ...item, value: event.target.value });
  };
  const { t } = useTranslate('report');
  const { t: t_user } = useTranslate('user');
  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}
    >
      <TextField
        select
        label={t('filterLabels.value')}
        value={item.value || ''}
        onChange={handleChange}
        precision={0.5}
        sx={{ width: '100%' }}
        ref={focusElementRef}
      >
        <MenuItem value="">
          {t('filterLabels.all')}
        </MenuItem>
        <MenuItem value="false">{t_user('columns.isBlacklist')}</MenuItem>
      </TextField>
    </Box>

  );
};

export const UserTypeFilter = ({ onFilter }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState('');

  const { t: t_user } = useTranslate("user");
  const { t: t_common } = useTranslate();
  const language = localStorage.getItem("i18nextLng");

  const handleFilterUserType = useCallback(
    (event) => {
      const newValue =
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value;
      setFilters(newValue);
      onFilter(newValue);
    },
    [filters, onFilter]
  );

  const fetchUserTypes = async () => {
    if (options.length > 0) return;
    setLoading(true);
    try {
      const result = await getUserTypes();
      setOptions(result || []);
    } catch (error) {
      console.error("Error fetching user types:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: "flex-end", md: "center" }}
    >
      <FormControl sx={{ flexShrink: 0, width: { xs: 200} }}>
        <InputLabel htmlFor="user-type-filter-select-label">
          {t_user("columns.userType")}
        </InputLabel>
        <Select
          multiple
          value={filters || []}
          onOpen={fetchUserTypes}
          onChange={handleFilterUserType}
          input={<OutlinedInput label={t_user("columns.userType")} />}
          renderValue={(selected) => selected.map((value) => {
            const matchedOption = options.find((option) => option.value === value);
            return matchedOption?.displayValues[language] || value;
          })
            .join(", ")}
          inputProps={{ id: "user-type-filter-select-label" }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
        >
          {loading ? (
            <MenuItem disabled>
              <em>{t_common('button.isLoading')}</em>
            </MenuItem>
          ) : options.length === 0 ? (
            <MenuItem disabled>
              <em>{t_common('commonTexts.noData')}</em>
            </MenuItem>
          ) : (
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters?.includes(option.value)}
                />
                {option.displayValues[language]}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Stack>
  );
};
