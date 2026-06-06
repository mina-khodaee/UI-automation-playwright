// 'use client';

// import { Box, Typography, Stack, IconButton, Divider, Button, Grid } from '@mui/material';
// import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
// import { DatePicker } from '@mui/x-date-pickers';
// import moment from 'moment-jalaali';
// import { Field } from 'src/components/hook-form';
// import { useGetCountries } from 'src/services/location/location.service';
// import { useGetCities, useGetProviences } from 'src/services/location/location.service';
// import { useGetPositions } from 'src/services/position/position.service';
// import { useGetMajors } from 'src/services/majors/majors.service';
// import { useGetDegrees } from 'src/services/degrees/degrees.service';
// import { useTranslate } from 'src/locales';
// import { Iconify } from 'src/components/iconify';

// export default function BoardMemberFields() {
//     const { control, watch } = useFormContext();

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: 'boardMembers',
//     });

//     // Fetch data for selects
//     const { data: getCountries } = useGetCountries();
//     const allCountry = getCountries?.items || [];

//     const countryOptions = allCountry?.map((c) => ({
//         label: c.name,
//         value: c.id,
//     }));

//     const { data: getProviences } = useGetProviences();
//     const allProvience = getProviences?.items || [];

//     const { data: getCities } = useGetCities();
//     const allCity = getCities?.items || [];

//     const { data: getPosition } = useGetPositions();
//     const getAllPosition = getPosition?.items || [];

//     const positionOptions = getAllPosition?.map((p) => ({
//         label: p.name,
//         value: p.id,
//     }));

//     const { data: getMajors } = useGetMajors();
//     const getAllMajor = getMajors?.items || [];

//     const majorOptions = getAllMajor?.map((s) => ({
//         label: s.name,
//         value: s.id,
//     }));

//     const { data: getDegrees } = useGetDegrees();
//     const getAllDegree = getDegrees?.items || [];

//     const degreeOptions = getAllDegree?.map((s) => ({
//         label: s.name,
//         value: s.id,
//     }));

//     const handleAddMember = () => {
//         append({
//             firstName: '',
//             lastName: '',
//             fatherName: null,
//             dateOfBirth: null,
//             birthPlace: null,
//             birthCertificateCode: null,
//             birthCertificateIssuePlace: null,
//             nationalCode: '',
//             mobileNumber: '',
//             phoneNumber: null,
//             position: null,
//             educationMajor: null,
//             educationDegree: null,
//             joinDate: null,
//             sharePrecent: null,
//             leaveDate: null,
//             background: null,
//             address: null,
//         });
//     };

//     return (
//         <Box sx={{ mt: 2 }}>
//             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//                 <Typography variant="h6">
//                     اعضای هیئت مدیره
//                 </Typography>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={<Iconify icon="eva:plus-fill" />}
//                     onClick={handleAddMember}
//                     size="small"
//                 >
//                     افزودن عضو جدید
//                 </Button>
//             </Stack>

//             {fields.map((field, index) => {
//                 // Watch values for province filtering
//                 const countryIdForBirthPlace = watch(`boardMembers.${index}.birthPlaceCountry`);
//                 const provinceIdForBirthPlace = watch(`boardMembers.${index}.birthPlaceProvince`);

//                 const countryIdForCertificatePlace = watch(`boardMembers.${index}.certificateCountry`);
//                 const provinceIdForCertificatePlace = watch(`boardMembers.${index}.certificateProvince`);

//                 // Filter provinces based on selected country
//                 const provienceOptionsForBirthPlace = allProvience
//                     ?.filter((a) => a?.countryId == countryIdForBirthPlace)
//                     ?.map((p) => ({
//                         label: p.name,
//                         value: p.id,
//                     }));

//                 // Filter cities based on selected province for birth place
//                 const cityOptionsForBirthPlace = allCity
//                     ?.filter((a) => a?.provinceId == provinceIdForBirthPlace)
//                     ?.map((c) => ({
//                         label: c.name,
//                         value: c.name,
//                     }));

//                 // Filter provinces based on selected country for certificate
//                 const provienceOptionsForCertificatePlace = allProvience
//                     ?.filter((a) => a?.countryId == countryIdForCertificatePlace)
//                     ?.map((p) => ({
//                         label: p.name,
//                         value: p.id,
//                     }));

//                 // Filter cities based on selected province for certificate
//                 const cityOptionsForCertificatePlace = allCity
//                     ?.filter((a) => a?.provinceId == provinceIdForCertificatePlace)
//                     ?.map((c) => ({
//                         label: c.name,
//                         value: c.name,
//                     }));

//                 return (
//                     <Box key={field.id} sx={{ mb: 4, position: 'relative', p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
//                         <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//                             <Typography variant="subtitle1" fontWeight="bold">
//                                 عضو {index + 1}
//                             </Typography>
//                             {fields.length > 1 && (
//                                 <IconButton color="error" onClick={() => remove(index)} size="small">
//                                     <Iconify icon="eva:trash-2-outline" />
//                                 </IconButton>
//                             )}
//                         </Stack>

//                         <Divider sx={{ mb: 3 }} />

//                         <Grid container spacing={2}>
//                             <Grid item xs={12} sm={6} md={4}>
//                                 <Field.Text
//                                     name={`boardMembers.${index}.firstName`}
//                                     label="نام"
//                                     size="small"
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={4}>
//                                 <Field.Text
//                                     name={`boardMembers.${index}.lastName`}
//                                     label="نام خانوادگی"
//                                     size="small"
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={4}>
//                                 <Field.Text
//                                     name={`boardMembers.${index}.fatherName`}
//                                     label="نام پدر"
//                                     size="small"
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={4}>
//                                 <Field.Text
//                                     name={`boardMembers.${index}.nationalCode`}
//                                     label="کد ملی"
//                                     size="small"
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={4}>
//                                 <Field.Text
//                                     name={`boardMembers.${index}.birthCertificateCode`}
//                                     label="شماره شناسنامه"
//                                     size="small"
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={4}>
//                                 <Controller
//                                     name={`boardMembers.${index}.dateOfBirth`}
//                                     control={control}
//                                     render={({ field, fieldState }) => (
//                                         <DatePicker
//                                             label="تاریخ تولد"
//                                             value={field.value ? moment(field.value) : null}
//                                             onChange={(newValue) => {
//                                                 field.onChange(newValue ? newValue.toISOString() : null);
//                                             }}
//                                             slotProps={{
//                                                 textField: {
//                                                     fullWidth: true,
//                                                     size: 'small',
//                                                     error: !!fieldState.error,
//                                                     helperText: fieldState.error?.message,
//                                                 },
//                                             }}
//                                         />
//                                     )}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={4}>
//                                 <Field.Text
//                                     name={`boardMembers.${index}.mobileNumber`}
//                                     label="موبایل"
//                                     size="small"
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={4}>
//                                 <Field.Text
//                                     name={`boardMembers.${index}.phoneNumber`}
//                                     label="تلفن ثابت"
//                                     size="small"
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12}>
//                                 <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
//                                     محل تولد
//                                 </Typography>
//                             </Grid>

//                             <Grid item xs={12} sm={4}>
//                                 <Field.Select
//                                     name={`boardMembers.${index}.birthPlaceCountry`}
//                                     label="کشور محل تولد"
//                                     data={countryOptions}
//                                     displayExp="label"
//                                     valueExp="value"
//                                     size='small'
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={4}>
//                                 <Field.Select
//                                     name={`boardMembers.${index}.birthPlaceProvince`}
//                                     label="استان محل تولد"
//                                     data={provienceOptionsForBirthPlace || []}
//                                     displayExp="label"
//                                     valueExp="value"
//                                     size='small'
//                                     fullWidth
//                                     disabled={!countryIdForBirthPlace}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={4}>
//                                 <Field.Select
//                                     name={`boardMembers.${index}.birthPlace`}
//                                     label="شهر محل تولد"
//                                     data={cityOptionsForBirthPlace || []}
//                                     displayExp="label"
//                                     valueExp="value"
//                                     size='small'
//                                     fullWidth
//                                     disabled={!provinceIdForBirthPlace}
//                                 />
//                             </Grid>

//                             <Grid item xs={12}>
//                                 <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
//                                     محل صدور شناسنامه
//                                 </Typography>
//                             </Grid>

//                             <Grid item xs={12} sm={4}>
//                                 <Field.Select
//                                     name={`boardMembers.${index}.certificateCountry`}
//                                     label="کشور محل صدور"
//                                     data={countryOptions}
//                                     displayExp="label"
//                                     valueExp="value"
//                                     size='small'
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={4}>
//                                 <Field.Select
//                                     name={`boardMembers.${index}.certificateProvince`}
//                                     label="استان محل صدور"
//                                     data={provienceOptionsForCertificatePlace || []}
//                                     displayExp="label"
//                                     valueExp="value"
//                                     size='small'
//                                     fullWidth
//                                     disabled={!countryIdForCertificatePlace}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={4}>
//                                 <Field.Select
//                                     name={`boardMembers.${index}.birthCertificateIssuePlace`}
//                                     label="شهر محل صدور"
//                                     data={cityOptionsForCertificatePlace || []}
//                                     displayExp="label"
//                                     valueExp="value"
//                                     size='small'
//                                     fullWidth
//                                     disabled={!provinceIdForCertificatePlace}
//                                 />
//                             </Grid>

//                             <Grid item xs={12}>
//                                 <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
//                                     اطلاعات شغلی و تحصیلی
//                                 </Typography>
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={3}>
//                                 <Field.Select
//                                     name={`boardMembers.${index}.educationMajor`}
//                                     label="رشته تحصیلی"
//                                     data={majorOptions}
//                                     displayExp="label"
//                                     valueExp="value"
//                                     size='small'
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={3}>
//                                 <Field.Select
//                                     name={`boardMembers.${index}.educationDegree`}
//                                     label="مقطع تحصیلی"
//                                     data={degreeOptions}
//                                     displayExp="label"
//                                     valueExp="value"
//                                     size='small'
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={3}>
//                                 <Field.Select
//                                     name={`boardMembers.${index}.position`}
//                                     label="سمت"
//                                     data={positionOptions}
//                                     displayExp="label"
//                                     valueExp="value"
//                                     size='small'
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={3}>
//                                 <Field.Text
//                                     name={`boardMembers.${index}.sharePrecent`}
//                                     label="درصد سهام"
//                                     size="small"
//                                     type="number"
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={3}>
//                                 <Controller
//                                     name={`boardMembers.${index}.joinDate`}
//                                     control={control}
//                                     render={({ field, fieldState }) => (
//                                         <DatePicker
//                                             label="تاریخ عضویت"
//                                             value={field.value ? moment(field.value) : null}
//                                             onChange={(newValue) => {
//                                                 field.onChange(newValue ? newValue.toISOString() : null);
//                                             }}
//                                             slotProps={{
//                                                 textField: {
//                                                     fullWidth: true,
//                                                     size: 'small',
//                                                     error: !!fieldState.error,
//                                                     helperText: fieldState.error?.message,
//                                                 },
//                                             }}
//                                         />
//                                     )}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={6} md={3}>
//                                 <Controller
//                                     name={`boardMembers.${index}.leaveDate`}
//                                     control={control}
//                                     render={({ field, fieldState }) => (
//                                         <DatePicker
//                                             label="تاریخ پایان همکاری"
//                                             value={field.value ? moment(field.value) : null}
//                                             onChange={(newValue) => {
//                                                 field.onChange(newValue ? newValue.toISOString() : null);
//                                             }}
//                                             slotProps={{
//                                                 textField: {
//                                                     fullWidth: true,
//                                                     size: 'small',
//                                                     error: !!fieldState.error,
//                                                     helperText: fieldState.error?.message,
//                                                 },
//                                             }}
//                                         />
//                                     )}
//                                 />
//                             </Grid>

//                             <Grid item xs={12}>
//                                 <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
//                                     سایر اطلاعات
//                                 </Typography>
//                             </Grid>

//                             <Grid item xs={12}>
//                                 <Field.Text
//                                     name={`boardMembers.${index}.address`}
//                                     label="آدرس"
//                                     size="small"
//                                     multiline
//                                     rows={2}
//                                     fullWidth
//                                 />
//                             </Grid>

//                             <Grid item xs={12}>
//                                 <Field.Text
//                                     name={`boardMembers.${index}.background`}
//                                     label="سوابق"
//                                     size="small"
//                                     multiline
//                                     rows={2}
//                                     fullWidth
//                                 />
//                             </Grid>
//                         </Grid>
//                     </Box>
//                 );
//             })}
//         </Box>
//     );
// }
'use client';

import { Box, Typography, Stack, IconButton, Divider, Button, Grid, Paper } from '@mui/material';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment-jalaali';
import { Field } from 'src/components/hook-form';
import { useGetCountries } from 'src/services/location/location.service';
import { useGetCities, useGetProviences } from 'src/services/location/location.service';
import { useGetPositions } from 'src/services/position/position.service';
import { useGetMajors } from 'src/services/majors/majors.service';
import { useGetDegrees } from 'src/services/degrees/degrees.service';
import { useTranslate } from 'src/locales';
import { Iconify } from 'src/components/iconify';

export default function BoardMemberFields() {
    const { control, watch } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'boardMembers',
    });

    // Fetch data for selects
    const { data: getCountries } = useGetCountries();
    const allCountry = getCountries?.items || [];

    const countryOptions = allCountry?.map((c) => ({
        label: c.name,
        value: c.id,
    }));

    const { data: getProviences } = useGetProviences();
    const allProvience = getProviences?.items || [];

    const { data: getCities } = useGetCities();
    const allCity = getCities?.items || [];

    const { data: getPosition } = useGetPositions();
    const getAllPosition = getPosition?.items || [];

    const positionOptions = getAllPosition?.map((p) => ({
        label: p.name,
        value: p.id,
    }));

    const { data: getMajors } = useGetMajors();
    const getAllMajor = getMajors?.items || [];

    const majorOptions = getAllMajor?.map((s) => ({
        label: s.name,
        value: s.id,
    }));

    const { data: getDegrees } = useGetDegrees();
    const getAllDegree = getDegrees?.items || [];

    const degreeOptions = getAllDegree?.map((s) => ({
        label: s.name,
        value: s.id,
    }));

    const handleAddMember = () => {
        append({
            firstName: '',
            lastName: '',
            fatherName: null,
            dateOfBirth: null,
            birthPlace: null,
            birthCertificateCode: null,
            birthCertificateIssuePlace: null,
            nationalCode: '',
            mobileNumber: '',
            phoneNumber: null,
            position: null,
            educationMajor: null,
            educationDegree: null,
            joinDate: null,
            sharePrecent: null,
            leaveDate: null,
            background: null,
            address: null,
        });
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                    اعضای هیئت مدیره
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={handleAddMember}
                    size="small"
                >
                    افزودن عضو جدید
                </Button>
            </Stack>

            {fields.map((field, index) => {
                // Watch values for province filtering
                const countryIdForBirthPlace = watch(`boardMembers.${index}.birthPlaceCountry`);
                const provinceIdForBirthPlace = watch(`boardMembers.${index}.birthPlaceProvince`);

                const countryIdForCertificatePlace = watch(`boardMembers.${index}.certificateCountry`);
                const provinceIdForCertificatePlace = watch(`boardMembers.${index}.certificateProvince`);

                // Filter provinces based on selected country
                const provienceOptionsForBirthPlace = allProvience
                    ?.filter((a) => a?.countryId == countryIdForBirthPlace)
                    ?.map((p) => ({
                        label: p.name,
                        value: p.id,
                    }));

                // Filter cities based on selected province for birth place
                const cityOptionsForBirthPlace = allCity
                    ?.filter((a) => a?.provinceId == provinceIdForBirthPlace)
                    ?.map((c) => ({
                        label: c.name,
                        value: c.name,
                    }));

                // Filter provinces based on selected country for certificate
                const provienceOptionsForCertificatePlace = allProvience
                    ?.filter((a) => a?.countryId == countryIdForCertificatePlace)
                    ?.map((p) => ({
                        label: p.name,
                        value: p.id,
                    }));

                // Filter cities based on selected province for certificate
                const cityOptionsForCertificatePlace = allCity
                    ?.filter((a) => a?.provinceId == provinceIdForCertificatePlace)
                    ?.map((c) => ({
                        label: c.name,
                        value: c.name,
                    }));

                return (
                    <Paper
                        key={field.id}
                        sx={{
                            mb: 4,
                            p: 3,
                            bgcolor: 'background.neutral',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                عضو {index + 1}
                            </Typography>
                            {fields.length > 1 && (
                                <IconButton color="error" onClick={() => remove(index)} size="small">
                                    <Iconify icon="eva:trash-2-outline" />
                                </IconButton>
                            )}
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>
                            {/* اطلاعات شخصی */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Field.Text
                                    name={`boardMembers.${index}.firstName`}
                                    label="نام"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Field.Text
                                    name={`boardMembers.${index}.lastName`}
                                    label="نام خانوادگی"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Field.Text
                                    name={`boardMembers.${index}.fatherName`}
                                    label="نام پدر"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Field.Text
                                    name={`boardMembers.${index}.nationalCode`}
                                    label="کد ملی"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Field.Text
                                    name={`boardMembers.${index}.birthCertificateCode`}
                                    label="شماره شناسنامه"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Controller
                                    name={`boardMembers.${index}.dateOfBirth`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label="تاریخ تولد"
                                            value={field.value ? moment(field.value) : null}
                                            onChange={(newValue) => {
                                                field.onChange(newValue ? newValue.toISOString() : null);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: 'small',
                                                    error: !!fieldState.error,
                                                    helperText: fieldState.error?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Field.Text
                                    name={`boardMembers.${index}.mobileNumber`}
                                    label="موبایل"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Field.Text
                                    name={`boardMembers.${index}.phoneNumber`}
                                    label="تلفن ثابت"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{
                                    mt: 1,
                                    mb: 1,
                                    p: 1.5,
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                                        محل تولد
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Field.Select
                                                name={`boardMembers.${index}.birthPlaceCountry`}
                                                label="کشور محل تولد"
                                                data={countryOptions}
                                                displayExp="label"
                                                valueExp="value"
                                                size='small'
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Field.Select
                                                name={`boardMembers.${index}.birthPlaceProvince`}
                                                label="استان محل تولد"
                                                data={provienceOptionsForBirthPlace || []}
                                                displayExp="label"
                                                valueExp="value"
                                                size='small'
                                                fullWidth
                                                disabled={!countryIdForBirthPlace}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Field.Select
                                                name={`boardMembers.${index}.birthPlace`}
                                                label="شهر محل تولد"
                                                data={cityOptionsForBirthPlace || []}
                                                displayExp="label"
                                                valueExp="value"
                                                size='small'
                                                fullWidth
                                                disabled={!provinceIdForBirthPlace}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{
                                    mb: 1,
                                    p: 1.5,
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                                        محل صدور شناسنامه
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Field.Select
                                                name={`boardMembers.${index}.certificateCountry`}
                                                label="کشور محل صدور"
                                                data={countryOptions}
                                                displayExp="label"
                                                valueExp="value"
                                                size='small'
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Field.Select
                                                name={`boardMembers.${index}.certificateProvince`}
                                                label="استان محل صدور"
                                                data={provienceOptionsForCertificatePlace || []}
                                                displayExp="label"
                                                valueExp="value"
                                                size='small'
                                                fullWidth
                                                disabled={!countryIdForCertificatePlace}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Field.Select
                                                name={`boardMembers.${index}.birthCertificateIssuePlace`}
                                                label="شهر محل صدور"
                                                data={cityOptionsForCertificatePlace || []}
                                                displayExp="label"
                                                valueExp="value"
                                                size='small'
                                                fullWidth
                                                disabled={!provinceIdForCertificatePlace}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{
                                    mb: 1,
                                    p: 1.5,
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                                        اطلاعات شغلی و تحصیلی
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Field.Select
                                                name={`boardMembers.${index}.educationMajor`}
                                                label="رشته تحصیلی"
                                                data={majorOptions}
                                                displayExp="label"
                                                valueExp="value"
                                                size='small'
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Field.Select
                                                name={`boardMembers.${index}.educationDegree`}
                                                label="مقطع تحصیلی"
                                                data={degreeOptions}
                                                displayExp="label"
                                                valueExp="value"
                                                size='small'
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Field.Select
                                                name={`boardMembers.${index}.position`}
                                                label="سمت"
                                                data={positionOptions}
                                                displayExp="label"
                                                valueExp="value"
                                                size='small'
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Field.Text
                                                name={`boardMembers.${index}.sharePrecent`}
                                                label="درصد سهام"
                                                size="small"
                                                type="number"
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Controller
                                                name={`boardMembers.${index}.joinDate`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <DatePicker
                                                        label="تاریخ عضویت"
                                                        value={field.value ? moment(field.value) : null}
                                                        onChange={(newValue) => {
                                                            field.onChange(newValue ? newValue.toISOString() : null);
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                size: 'small',
                                                                error: !!fieldState.error,
                                                                helperText: fieldState.error?.message,
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Controller
                                                name={`boardMembers.${index}.leaveDate`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <DatePicker
                                                        label="تاریخ پایان همکاری"
                                                        value={field.value ? moment(field.value) : null}
                                                        onChange={(newValue) => {
                                                            field.onChange(newValue ? newValue.toISOString() : null);
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                size: 'small',
                                                                error: !!fieldState.error,
                                                                helperText: fieldState.error?.message,
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{
                                    p: 1.5,
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                                        سایر اطلاعات
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Field.Text
                                                name={`boardMembers.${index}.address`}
                                                label="آدرس"
                                                size="small"
                                                multiline
                                                rows={2}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Field.Text
                                                name={`boardMembers.${index}.background`}
                                                label="سوابق"
                                                size="small"
                                                multiline
                                                rows={2}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                );
            })}
        </Box>
    );
}