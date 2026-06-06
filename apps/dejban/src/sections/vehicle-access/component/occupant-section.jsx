import { Controller, useFieldArray } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment-jalaali';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Field } from 'src/components/hook-form';

export function OccupantSection({
  type,
  expanded,
  onToggle,
  doorsData,
  isDoorLoading,
  control,
  title,
  dateLabel,
  timeLabel,
  doorLabel,
  occupantFieldsName,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: occupantFieldsName,
  });

  const dateFieldName = `${type}Date`;
  const timeFieldName = `${type}Time`;
  const doorFieldName = `${type}DoorId`;

  const t_vehicleAccess = {
    buttons: {
      addCompanion: 'افزودن همراه',
      cancel: 'حذف',
    },
    formsInputs: {
      firstName: 'نام و نام خانوادگی',
      nationalCode: 'کد ملی',
    },
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggle}
      sx={{ mb: 1, bgcolor: 'primary.lighter', borderRadius: 1 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mx: 1 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
          <Controller
            name={dateFieldName}
            control={control}
            render={({ field, fieldState }) => (
              <DatePicker
                label={dateLabel}
                value={field.value ? moment(field.value) : null}
                onChange={(v) => field.onChange(v ? v.toISOString() : '')}
                slotProps={{
                  textField: {
                    size: 'small',
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name={timeFieldName}
            control={control}
            render={({ field, fieldState }) => (
              <TimePicker
                label={timeLabel}
                value={field.value ? moment(field.value) : null}
                onChange={(v) => field.onChange(v ? v.toISOString() : '')}
                slotProps={{
                  textField: {
                    size: 'small',
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                  },
                }}
              />
            )}
          />
          <Field.Select
            name={doorFieldName}
            label={doorLabel}
            data={doorsData}
            isLoading={isDoorLoading}
            displayExp="label"
            valueExp="value"
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => append({ id: null, fullName: '', nationalCode: '' })}
          >
            {t_vehicleAccess.buttons.addCompanion}
          </Button>
        </Box>

        {fields.length > 0 && (
          <Table size="small" sx={{ borderRadius: 1, overflow: 'hidden', mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t_vehicleAccess.formsInputs.firstName}</TableCell>
                <TableCell>{t_vehicleAccess.formsInputs.nationalCode}</TableCell>
                <TableCell align="right">{t_vehicleAccess.buttons.cancel}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((item, index) => (
                <TableRow key={item.id || index}>
                  <TableCell>
                    <Controller
                      name={`${occupantFieldsName}.${index}.fullName`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} size="small" fullWidth variant="standard" />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${occupantFieldsName}.${index}.nationalCode`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} size="small" fullWidth variant="standard" />
                      )}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => remove(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AccordionDetails>
    </Accordion>
  );
}