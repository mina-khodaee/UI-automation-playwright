import { Grid } from '@mui/material';
import { Field } from 'src/components/hook-form';

export function VehicleSection() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field.Text name="vehicle.plateNumber" label="شماره پلاک" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field.Text name="vehicle.model" label="مدل خودرو" />
      </Grid>
    </Grid>
  );
}
