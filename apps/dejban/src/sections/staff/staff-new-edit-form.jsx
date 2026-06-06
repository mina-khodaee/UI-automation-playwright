import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { Form, Field } from 'src/components/hook-form';
import { PiUserThin, PiBuilding, PiIdentificationBadge, PiCar } from 'react-icons/pi';
import CustomizedSteppers from './staff-stepper';
import { Accordion, AccordionDetails, AccordionSummary, Dialog, DialogContent, DialogTitle, Typography, } from '@mui/material';
import { useGetEmploymentType } from 'src/services/employment-type/emp-type.service';
import { useGetOccupationTypeType } from 'src/services/occupation-type/occupation-type.service';
import { useGetPositions } from 'src/services/position/position.service';
import { useGetSites } from 'src/services/siteManagement/site.service';
import { useGetUnitsWithOutPagination } from 'src/services/units/units.service';
import { useCreateStaff, useUpdateStaff } from 'src/services/staff/staff.service';
import { useGetContractors } from 'src/services/contractor/contractor.service';
import { useGetContract } from 'src/services/contracts/contract.service';

import { useTranslate } from 'src/locales';
import { useEffect, useState } from 'react';
import moment from 'moment-jalaali';
import { DatePicker } from '@mui/x-date-pickers';
import {
  useGetCities,
  useGetCountries,
  useGetProviences,
} from 'src/services/location/location.service';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { buildSiteUnitTree } from '@repo/ui/utils';
import { DropdownTreeSelect } from 'src/components/tree-select/dropdown-tree-select';

// ----------------------------------------------------------------------
export function GridFormSpacing({ children }) {
  return (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      sx={{ mt: 5, mb: 5 }}
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
      }}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function StaffNewEditForm({ open, onClose, currentStaff, onRefetch }) {
  // Required Validation For Form Fields
  // const staffSchema = z
  //   .object({
  //     personnelCode: z
  //       .string({
  //         required_error: 'کد پرسنلی الزامی است',
  //         invalid_type_error: 'کد پرسنلی باید رشته باشد',
  //       })
  //       .min(1, 'کد پرسنلی الزامی است'),

  //     firstName: z
  //       .string({
  //         required_error: 'نام الزامی است',
  //         invalid_type_error: 'نام باید رشته باشد',
  //       })
  //       .min(1, 'نام الزامی است'),

  //     lastName: z
  //       .string({
  //         required_error: 'نام خانوادگی الزامی است',
  //         invalid_type_error: 'نام خانوادگی باید رشته باشد',
  //       })
  //       .min(1, 'نام خانوادگی الزامی است'),

  //     nationalCode: z
  //       .string({
  //         required_error: 'کد ملی الزامی است',
  //         invalid_type_error: 'کد ملی باید رشته باشد',
  //       })
  //       .min(1, 'کد ملی الزامی است'),

  //     gender: z
  //       .string({
  //         required_error: 'جنسیت الزامی است',
  //         invalid_type_error: 'جنسیت باید رشته باشد',
  //       })
  //       .min(1, 'جنسیت الزامی است'),

  //     contractStartDate: z
  //       .string({
  //         required_error: 'تاریخ شروع قرارداد الزامی است',
  //       })
  //       .regex(
  //         /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
  //         'فرمت تاریخ باید مطابق RFC 3339 باشد'
  //       ),

  //     contractEndDate: z
  //       .string({
  //         required_error: 'تاریخ پایان قرارداد الزامی است',
  //       })
  //       .regex(
  //         /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
  //         'فرمت تاریخ باید مطابق RFC 3339 باشد'
  //       ),

  //     employmentTypeId: z
  //       .string({
  //         required_error: 'نوع استخدام الزامی است',
  //       })
  //       .uuid('شناسه نوع استخدام باید UUID معتبر باشد'),

  //     employmentStatusId: z
  //       .string({
  //         required_error: 'وضعیت استخدام الزامی است',
  //       })
  //       .uuid('شناسه وضعیت استخدام باید UUID معتبر باشد'),

  //     dateOfBirth: z
  //       .string({
  //         required_error: 'تاریخ تولد الزامی است',
  //       })
  //       .regex(
  //         /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
  //         'فرمت تاریخ باید مطابق RFC 3339 باشد'
  //       ),

  //     fatherName: z
  //       .string({
  //         required_error: 'نام پدر الزامی است',
  //         invalid_type_error: 'نام پدر باید رشته باشد',
  //       })
  //       .min(1, 'نام پدر الزامی است'),

  //     birthCertificateCode: z
  //       .string({
  //         required_error: 'شماره شناسنامه الزامی است',
  //         invalid_type_error: 'شماره شناسنامه باید رشته باشد',
  //       })
  //       .min(1, 'شماره شناسنامه الزامی است'),

  //     birthCertificateIssuePlace: z
  //       .string({
  //         required_error: 'محل صدور شناسنامه الزامی است',
  //         invalid_type_error: 'محل صدور شناسنامه باید رشته باشد',
  //       })
  //       .min(1, 'محل صدور شناسنامه الزامی است'),

  //     birthPlace: z
  //       .string({
  //         required_error: 'محل تولد الزامی است',
  //         invalid_type_error: 'محل تولد باید رشته باشد',
  //       })
  //       .min(1, 'محل تولد الزامی است'),

  //     contractorsId: z
  //       .string({
  //         required_error: 'شرکت قرا دادالزامی است',
  //         invalid_type_error: 'شرکت قرا دادباید رشته باشد',
  //       })
  //       .min(1, 'شرکت قرا دادالزامی است'),

  //     mobileNumber: z.string().optional(),
  //     countryIdForCertificatePlace: z.string().optional(),
  //     provienceIdForCertificatePlace: z.string().optional(),
  //     countryIdForBirthPlace: z.string().optional(),
  //     provienceIdForBirthPlace: z.string().optional(),
  //     positionId: z.string().optional(),
  //     siteId: z.string().optional(),
  //     unitId: z.string().optional(),
  //     locationId: z.string().optional(),
  //   })
  //   .refine(
  //     (data) => {
  //       if (data.contractStartDate && data.contractEndDate) {
  //         const startDate = new Date(data.contractStartDate);
  //         const endDate = new Date(data.contractEndDate);
  //         return endDate >= startDate;
  //       }
  //       return true;
  //     },
  //     {
  //       message: 'تاریخ پایان قرارداد باید بعد از تاریخ شروع قرارداد باشد',
  //       path: ['contractEndDate'],
  //     }
  //   );
  const staffSchema = z
    .object({
      personnelCode: z
        .string({
          required_error: 'کد پرسنلی الزامی است',
          invalid_type_error: 'کد پرسنلی باید رشته باشد',
        })
        .min(1, 'کد پرسنلی الزامی است'),

      firstName: z
        .string({
          required_error: 'نام الزامی است',
          invalid_type_error: 'نام باید رشته باشد',
        })
        .min(1, 'نام الزامی است'),

      lastName: z
        .string({
          required_error: 'نام خانوادگی الزامی است',
          invalid_type_error: 'نام خانوادگی باید رشته باشد',
        })
        .min(1, 'نام خانوادگی الزامی است'),

      nationalCode: z
        .string({
          required_error: 'کد ملی الزامی است',
          invalid_type_error: 'کد ملی باید رشته باشد',
        })
        .min(1, 'کد ملی الزامی است'),

      gender: z
        .string({
          required_error: 'جنسیت الزامی است',
          invalid_type_error: 'جنسیت باید رشته باشد',
        })
        .min(1, 'جنسیت الزامی است'),

      contractStartDate: z
        .string({
          required_error: 'تاریخ شروع قرارداد الزامی است',
        })
        .regex(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
          'فرمت تاریخ باید مطابق RFC 3339 باشد'
        ),

      contractEndDate: z
        .string({
          required_error: 'تاریخ پایان قرارداد الزامی است',
        })
        .regex(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
          'فرمت تاریخ باید مطابق RFC 3339 باشد'
        ),

      employmentTypeId: z
        .string({
          required_error: 'نوع استخدام الزامی است',
        })
        .uuid('شناسه نوع استخدام باید UUID معتبر باشد'),

      employmentStatusId: z
        .string({
          required_error: 'وضعیت استخدام الزامی است',
        })
        .uuid('شناسه وضعیت استخدام باید UUID معتبر باشد'),

      dateOfBirth: z
        .string({
          required_error: 'تاریخ تولد الزامی است',
        })
        .regex(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
          'فرمت تاریخ باید مطابق RFC 3339 باشد'
        ),

      fatherName: z
        .string({
          required_error: 'نام پدر الزامی است',
          invalid_type_error: 'نام پدر باید رشته باشد',
        })
        .min(1, 'نام پدر الزامی است'),

      birthCertificateCode: z
        .string({
          required_error: 'شماره شناسنامه الزامی است',
          invalid_type_error: 'شماره شناسنامه باید رشته باشد',
        })
        .min(1, 'شماره شناسنامه الزامی است'),

      birthCertificateIssuePlace: z
        .string({
          required_error: 'محل صدور شناسنامه الزامی است',
          invalid_type_error: 'محل صدور شناسنامه باید رشته باشد',
        })
        .min(1, 'محل صدور شناسنامه الزامی است'),

      birthPlace: z
        .string({
          required_error: 'محل تولد الزامی است',
          invalid_type_error: 'محل تولد باید رشته باشد',
        })
        .min(1, 'محل تولد الزامی است'),


      contractorsId: z.string().nullable().optional(),

      mobileNumber: z.string().min(1, 'شماره تلفن همراه الزامی است'),
      countryIdForCertificatePlace: z.string().optional(),
      provienceIdForCertificatePlace: z.string().optional(),
      countryIdForBirthPlace: z.string().optional(),
      provienceIdForBirthPlace: z.string().optional(),
      positionId: z.string().optional(),
      siteId: z.string().optional(),
      unitId: z.string().optional(),
      locationId: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.contractStartDate && data.contractEndDate) {
          const startDate = new Date(data.contractStartDate);
          const endDate = new Date(data.contractEndDate);
          return endDate >= startDate;
        }
        return true;
      },
      {
        message: 'تاریخ پایان قرارداد باید بعد از تاریخ شروع قرارداد باشد',
        path: ['contractEndDate'],
      }
    );

  // Default Values For Form Fields
  const defaultValues = useMemo(
    () => ({
      personnelCode: currentStaff?.personnelCode || '',
      firstName: currentStaff?.firstName || '',
      lastName: currentStaff?.lastName || '',
      nationalCode: currentStaff?.nationalCode || '',
      gender: currentStaff?.gender || '',
      contractStartDate: currentStaff?.contractStartDate || null,
      contractEndDate: currentStaff?.contractEndDate || null,
      employmentTypeId: currentStaff?.employmentType?.id || null,
      employmentStatusId: currentStaff?.employmentStatus?.id || null,
      positionId: currentStaff?.position?.id || null,
      siteId: currentStaff?.site?.id || null,
      contractorsId: currentStaff?.contractors?.id || null,
      ContractId: currentStaff?.ContractId?.id || null,
      unitId: currentStaff?.unit?.id || null,
      dateOfBirth: currentStaff?.dateOfBirth || null,
      mobileNumber: currentStaff?.mobileNumber || '',
      fatherName: currentStaff?.fatherName || '',
      birthCertificateCode: currentStaff?.birthCertificateCode || '',
      birthCertificateIssuePlace: currentStaff?.birthCertificateIssuePlace || '',
      countryIdForCertificatePlace: '',
      countryIdForBirthPlace: '',
      provienceIdForCertificatePlace: '',
      provienceIdForBirthPlace: '',
      birthPlace: currentStaff?.birthPlace || '',
      locationId: currentStaff?.siteId || currentStaff?.unitId || null,
      //Cars Value
      // vehiclesType: 'Car',
    }),
    [currentStaff]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(staffSchema),
    defaultValues,
  });

  const onError = (errors) => {
  console.log('Validation errors:', errors);
  // می‌توانید یک toast یا پیام کلی هم نشان دهید
};


  const {
    reset,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const employmentTypeId = watch('employmentTypeId');
  const contractorsIdData = watch('contractorsId');
  const vehicleTypeData = watch('vehicleType');

  // Translate Hook For Different Languages
  const { t: t_staff } = useTranslate('staff');
  const { t: t_common } = useTranslate();

  // Create/Update Hook Api
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();

  // Get Data For Select Box Fields
  const genders = [
    { label: 'مرد', value: 'Male' },
    { label: 'زن', value: 'feMale' },
  ];

  const gendersOptions = genders?.map((g) => ({
    label: g.label,
    value: g.value,
  }));

  const { data: getEmpType } = useGetEmploymentType();
  const getAllEmpType = getEmpType?.items || [];

  const empTypeOptions = getAllEmpType?.map((e) => ({
    label: e.name,
    value: e.id,
  }));
  const selectedEmpType = empTypeOptions.find((item) => item.value === employmentTypeId);

  const { data: getOccuType } = useGetOccupationTypeType();
  const getAllOccuType = getOccuType?.items || [];

  const occuTypeOptions = getAllOccuType?.map((o) => ({
    label: o.name,
    value: o.id,
  }));

  const { data: getPosition } = useGetPositions();
  const getAllPosition = getPosition?.items || [];

  const positionOptions = getAllPosition?.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const { data: getSites } = useGetSites();
  const getAllSite = getSites?.items || [];

  const siteOptions = getAllSite?.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const { data: getContractors } = useGetContractors();
  const getAllContractors = getContractors?.items || [];
  const Contractors = getAllContractors?.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const contractParams = contractorsIdData
    ? {
      Filters: {
        id: contractorsIdData,
      },
    }
    : undefined;

  const { data: getContract } = useGetContract(contractParams);
  const getAllContract = getContract?.items || [];
  const Contract = getAllContract?.map((s) => ({
    label: s.subject,
    value: s.id,
  }));

  const { data: getCountries } = useGetCountries();
  const allCountry = getCountries?.items || [];

  const countryOptionsForCertificatePlace = allCountry?.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const countryOptionsForBirthPlace = allCountry?.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const { data: getUnits } = useGetUnitsWithOutPagination();

  const [siteUnitTree, setSiteUnitTree] = useState([]);
  const getAllUnit = getUnits?.items || [];

  useEffect(() => {
    if (getAllSite?.length) {
      const tree = buildSiteUnitTree(getAllSite, getAllUnit);
      setSiteUnitTree(tree);
    }
  }, [getAllSite, getAllUnit]);


  const unitOptions = getAllUnit
    ?.filter((a) => a?.site?.id == values.siteId)
    ?.map((u) => ({
      label: u.name,
      value: u.id,
    }));

  const { data: getProviences } = useGetProviences();
  const allProvience = getProviences?.items || [];

  const provienceOptionsForCertificatePlace = allProvience
    ?.filter((a) => a?.countryId == values?.countryIdForCertificatePlace)
    ?.map((p) => ({
      label: p.name,
      value: p.id,
    }));

  const provienceOptionsForBirthPlace = allProvience
    ?.filter((a) => a?.countryId == values?.countryIdForBirthPlace)
    ?.map((p) => ({
      label: p.name,
      value: p.id,
    }));

  const { data: getCities } = useGetCities();
  const allCity = getCities?.items || [];

  const cityOptionsForCertificatePlace =
    allCity
      ?.filter((a) => {
        if (values?.provienceIdForCertificatePlace) {
          return a?.provinceId == values?.provienceIdForCertificatePlace;
        }

        if (currentStaff?.birthCertificateIssuePlace && allCity) {
          const city = allCity.find((c) => c.name === currentStaff.birthCertificateIssuePlace);
          if (city && city.provinceId === a.provinceId) {
            return true;
          }
        }

        return false;
      })
      ?.map((p) => ({
        label: p.name,
        value: p.name,
      })) || [];

  const cityOptionsForBirthPlace =
    allCity
      ?.filter((a) => {
        if (values?.provienceIdForBirthPlace) {
          return a?.provinceId == values?.provienceIdForBirthPlace;
        }
        if (currentStaff?.birthPlace) {
          const city = allCity.find((c) => c.name === currentStaff.birthPlace);
          return city ? a?.provinceId == city.provinceId : false;
        }
        return false;
      })
      ?.map((p) => ({
        label: p.name,
        value: p.name,
      })) || [];

  const [activeStep, setActiveStep] = React.useState(0);

  //Vehicle Data
  const fuelType = [
    { label: 'Gasoline', value: 'Gasoline' },
    { label: 'Diesel', value: 'Diesel' },
    { label: 'Electric', value: 'Electric' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'CNG', value: 'CNG' },
    { label: 'LPG', value: 'LPG' },
    { label: 'None', value: 'None' },
  ];

  const fuelOptions = fuelType?.map((o) => ({
    label: o.label,
    value: o.value,
  }));

  const plateType = [
    { label: 'استاندارد', value: 'Standard' },
    { label: 'موتور', value: 'Motorcycle' },
    { label: 'بین المللی', value: 'Internal' },
  ];

  const plateOptions = plateType?.map((o) => ({
    label: o.label,
    value: o.value,
  }));

  const plateLettersType = [
    { label: 'الف', value: 'Sedan' },
    { label: 'ب', value: 'SUV' },
    { label: 'پ', value: 'Hatchback' },
    { label: 'ت', value: 'Van' },
    { label: 'ث', value: 'Motorcycle' },
  ];

  const plateLettersOptions = plateLettersType?.map((o) => ({
    label: o.label,
    value: o.value,
  }));

  const VehiclesType = [
    { label: 'خودرو', value: 'Car' },
    { label: 'موتور سیکلت', value: 'Motorcycle' },
  ];

  const VehicleOptions = VehiclesType?.map((o) => ({
    label: o.label,
    value: o.value,
  }));

  const vehicleType = watch('vehicleType');

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentStaff) {
        await updateStaff.mutateAsync({ id: currentStaff.id, ...data });
      } else {
        await createStaff.mutateAsync(data);
      }
      onClose();
      onRefetch();
      reset();
    } catch (error) { /* empty */ }
  });

  useEffect(() => {
    if (!contractorsIdData) {
      setValue('contractId', null);
    }
  }, [contractorsIdData, setValue]);

  useEffect(() => {
    if (open) {
      reset({
        personnelCode: currentStaff?.personnelCode || '',
        firstName: currentStaff?.firstName || '',
        lastName: currentStaff?.lastName || '',
        nationalCode: currentStaff?.nationalCode || '',
        gender: currentStaff?.gender || null,
        contractStartDate: currentStaff?.contractStartDate || null,
        contractEndDate: currentStaff?.contractEndDate || null,
        employmentTypeId: currentStaff?.employmentType?.id || null,
        employmentStatusId: currentStaff?.employmentStatus?.id || null,
        positionId: currentStaff?.position?.id || null,
        siteId: currentStaff?.site?.id || null,
        contractorsId: currentStaff?.contractors?.id || null,
        unitId: currentStaff?.unit?.id || null,
        locationId: currentStaff?.siteId || currentStaff?.unitId || null,
        dateOfBirth: currentStaff?.dateOfBirth || null,
        mobileNumber: currentStaff?.mobileNumber || '',
        fatherName: currentStaff?.fatherName || '',
        birthCertificateCode: currentStaff?.birthCertificateCode || '',
        birthPlace: currentStaff?.birthPlace || '',
        birthCertificateIssuePlace: currentStaff?.birthCertificateIssuePlace || '',
      });
    }
  }, [currentStaff, open, reset]);

  // Form Fields With Tab
  const renderStaffInfo = (
    <>
      <Field.Text name="personnelCode" label={t_staff('formsInputs.personnelCode')} size="small" required />
      <Field.Text name="firstName" label={t_staff('formsInputs.firstName')} size="small" required />
      <Field.Text name="lastName" label={t_staff('formsInputs.lastName')} size="small" required />
      <Field.Text name="nationalCode" label={t_staff('formsInputs.nationalCode')} size="small" required />
      <Field.Select
        name="gender"
        label={t_staff('formsInputs.gender')}
        data={gendersOptions}
        displayExp="label"
        valueExp="value"
        size="small"
      />
    </>
  );

  const renderOrganizationInfo = (
    <>
      <Controller
        name="contractStartDate"
        control={methods.control}
        render={({ field, fieldState }) => (
          <DatePicker
            label={t_staff('formsInputs.contractStartDate')}
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
            required
          />
        )}
      />

      <Controller
        name="contractEndDate"
        control={methods.control}
        render={({ field, fieldState }) => (
          <DatePicker
            label={t_staff('formsInputs.contractEndDate')}
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

      <Field.Select
        name="employmentTypeId"
        label={t_staff('formsInputs.employmentTypeId')}
        data={empTypeOptions}
        displayExp="label"
        valueExp="value"
        size="small"
        required
      />

      {selectedEmpType?.label === 'پیمانکار' ? (
        <>
          <Field.Select
            name="contractorsId"
            label={t_staff('formsInputs.contractorsId')}
            data={Contractors}
            displayExp="label"
            valueExp="value"
            size="small"
            required
          />
          <Field.Select
            name="contractId"
            label={t_staff('formsInputs.contractId')}
            data={Contract}
            displayExp="label"
            valueExp="value"
            size="small"
            disabled={!contractorsIdData}
            required
          />
        </>
      ) : (
        <Controller
          name="locationId"
          control={control}
          render={({ field, fieldState }) => (
            <DropdownTreeSelect
              data={siteUnitTree}
              value={field.value}
              onChange={(id, selectedNode) => {
                field.onChange(id);
                if (selectedNode?.type === 'site') {
                  setValue('siteId', id);
                  setValue('unitId', null);
                } else if (selectedNode?.type === 'unit') {
                  setValue('unitId', id);
                  setValue('siteId', selectedNode?.parentSiteId);
                }
              }}
              placeholder="انتخاب مرکز یا واحد"
              searchPlaceholder="جستجو..."
              searchMode="filter"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      )}

      <Field.Select
        name="employmentStatusId"
        label={t_staff('formsInputs.employmentStatusId')}
        data={occuTypeOptions}
        displayExp="label"
        valueExp="value"
        size="small"
        required
      />
      <Field.Select
        name="positionId"
        label={t_staff('formsInputs.positionId')}
        data={positionOptions}
        displayExp="label"
        valueExp="value"
        size="small"
        required
      />
    </>
  );

  const renderVehicleInfo = (
    <>
      <Field.Select
        name="vehicleType"
        label="نوع خودرو"
        data={VehicleOptions}
        displayExp="label"
        valueExp="value"
        size="small"
        sx={{ mt: 3.5 }}
      />

      <Field.Select
        name="plateType"
        label="نوع پلاک"
        data={plateOptions}
        displayExp="label"
        valueExp="value"
        size="small"
        sx={{ mt: 3.5 }}
      />

      <Box
        sx={{
          gridColumn: { sm: 'span 2' },
          display: 'flex',
          flexDirection: (vehicleType || 'Car') === 'Motorcycle' ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 0.5,
          px: 1,
          border: '1px solid #333',
          borderRadius: 1,
          backgroundColor: '#fff',
          direction: 'rtl',
          gap: 0.5,
          width: '100%',
          maxWidth: (vehicleType || 'Car') === 'Motorcycle' ? '150px' : '300px',
        }}
      >
        {(vehicleType || 'Car') === 'Motorcycle' ? (
          <>
            <Field.Text
              name="motorPlateTop"
              size="small"
              sx={{
                width: '100%',
                textAlign: 'center',
                '& .MuiInputBase-input': { py: 0.5, height: '1.5em' },
              }}
              inputProps={{ maxLength: 3, style: { textAlign: 'center', fontSize: '1.2rem' } }}
            />

            <Box sx={{ width: '100%', height: '1px', backgroundColor: '#333' }} />

            <Field.Text
              name="motorPlateBottom"
              size="small"
              sx={{
                width: '100%',
                textAlign: 'center',
                '& .MuiInputBase-input': { py: 0.5, height: '1.5em' },
              }}
              inputProps={{ maxLength: 5, style: { textAlign: 'center', fontSize: '1.2rem' } }}
            />
          </>
        ) : (
          <>
            <Field.Text
              name="plateTwoDigits"
              size="small"
              sx={{ width: '15%', textAlign: 'center' }}
              inputProps={{ maxLength: 2, style: { textAlign: 'center', fontSize: '1.2rem' } }}
            />

            <Field.Select
              name="plateLetters"
              data={plateLettersOptions}
              displayExp="label"
              valueExp="value"
              size="small"
              sx={{ width: '30%', textAlign: 'center', mt: 2.5 }}
            />

            <Field.Text
              name="plateThreeDigits"
              size="small"
              sx={{ width: '20%', textAlign: 'center' }}
              inputProps={{ maxLength: 3, style: { textAlign: 'center', fontSize: '1.2rem' } }}
            />

            <Box sx={{ width: '2px', height: '30px', backgroundColor: '#333' }} />

            <Field.Text
              name="plateCode"
              size="small"
              sx={{ width: '15%', textAlign: 'center' }}
              inputProps={{ maxLength: 2, style: { textAlign: 'center', fontSize: '1.2rem' } }}
            />
          </>
        )}
      </Box>

      <Box />

      <Box />

      <Accordion
        sx={{ gridColumn: { sm: 'span 4' }, boxShadow: 0, border: '1px solid #ddd' }}
        defaultExpanded={false}
      >
        <AccordionSummary
          expandIcon={<GridExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            minHeight: 48,
            '& .MuiAccordionSummary-content.Mui-expanded': { margin: '12px 0' },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            اطلاعات تکمیلی
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 0 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Field.Text name="model" label="مدل" size="small" />

            <Field.Text name="color" label="رنگ" size="small" />

            <Field.Select
              name="fuelType"
              label="نوع سوخت"
              data={fuelOptions}
              displayExp="label"
              valueExp="value"
              size="small"
            />

            <Box />

            <Field.Text name="chassisNumber" label="شماره شاسی" size="small" />

            <Field.Text name="vinNumber" label="شماره vin" size="small" />

            <Field.Text name="engineNumber" label="شماره موتور" size="small" />
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );

  const renderPersonnalInfo = (
    <>
      <Controller
        name="dateOfBirth"
        control={methods.control}
        render={({ field, fieldState }) => (
          <DatePicker
            label={t_staff('formsInputs.dateOfBirth')}
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
            required
          />
        )}
      />
      --
      <Field.Text name="mobileNumber" label={t_staff('formsInputs.phoneNumber')} size="small" required />
      <Field.Text name="fatherName" label={t_staff('formsInputs.fatherName')} size="small" required />
      <Field.Text
        name="birthCertificateCode"
        label={t_staff('formsInputs.birthCertificateCode')}
        size="small"
        required
      />
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 2,
          mb: 2,
          gridColumn: { sm: 'span 2' },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          {t_staff('formsInputs.birthCertificateIssuePlace')}
        </Typography>

        <Stack spacing={2} direction="row">
          <Field.Select
            name="countryIdForCertificatePlace"
            label="کشور"
            data={countryOptionsForCertificatePlace}
            displayExp="label"
            valueExp="value"
            size="small"
            required
          />

          <Field.Select
            name="provienceIdForCertificatePlace"
            label="استان"
            data={provienceOptionsForCertificatePlace}
            displayExp="label"
            valueExp="value"
            size="small"
            required
          />

          <Field.Select
            name="birthCertificateIssuePlace"
            label="شهر"
            data={cityOptionsForCertificatePlace}
            displayExp="label"
            valueExp="value"
            size="small"
            required
          />
        </Stack>
      </Box>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 2,
          mb: 2,
          gridColumn: { sm: 'span 2' },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          {t_staff('formsInputs.birthPlace')}
        </Typography>

        <Stack spacing={2} direction="row">
          <Field.Select
            name="countryIdForBirthPlace"
            label="کشور"
            data={countryOptionsForBirthPlace}
            displayExp="label"
            valueExp="value"
            size="small"
            required
          />

          <Field.Select
            name="provienceIdForBirthPlace"
            label="استان"
            data={provienceOptionsForBirthPlace}
            displayExp="label"
            valueExp="value"
            size="small"
            required
          />

          <Field.Select
            name="birthPlace"
            label="شهر"
            data={cityOptionsForBirthPlace}
            displayExp="label"
            valueExp="value"
            size="small"
            required
          />
        </Stack>
      </Box>
    </>
  );

  // Tabs Name
  const stepperList = [
    {
      title: t_staff('tabs.staff'),
      icon: <PiIdentificationBadge style={{ fontSize: 25 }} />,
      renderForm: renderStaffInfo,
    },
    {
      title: t_staff('tabs.personal'),
      icon: <PiUserThin style={{ fontSize: 25 }} />,
      renderForm: renderPersonnalInfo,
    },
    {
      title: t_staff('tabs.organization'),
      icon: <PiBuilding style={{ fontSize: 25 }} />,
      renderForm: renderOrganizationInfo,
    },
    {
      title: t_staff('tabs.vehicle'),
      icon: <PiCar style={{ fontSize: 25 }} />,
      renderForm: renderVehicleInfo,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: '700px', maxWidth: '90%' } }}
      fullWidth
    >
      <DialogTitle textAlign="center">
        {currentStaff ? t_staff('title.updateStaffs') : t_staff('title.insertStaffs')}
      </DialogTitle>

      <DialogContent>
        <Form methods={methods}   onSubmit={methods.handleSubmit(onSubmit, onError)} >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Card sx={{ p: 2 }}>
                <CustomizedSteppers steps={stepperList} getActiveStep={(e) => setActiveStep(e)} />
                {activeStep == 0 && <GridFormSpacing>{renderStaffInfo}</GridFormSpacing>}
                {activeStep == 1 && <GridFormSpacing>{renderPersonnalInfo}</GridFormSpacing>}
                {activeStep == 2 && <GridFormSpacing>{renderOrganizationInfo}</GridFormSpacing>}
                {activeStep == 3 && <GridFormSpacing>{renderVehicleInfo}</GridFormSpacing>}

                <Stack alignItems="flex-start" direction="row" gap={1} sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    size="small"
                  >
                    {currentStaff ? 'ویرایش' : 'ثبت'}
                  </LoadingButton>
                  <LoadingButton onClick={onClose} color="error" variant="contained" size="small">
                    انصراف
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
