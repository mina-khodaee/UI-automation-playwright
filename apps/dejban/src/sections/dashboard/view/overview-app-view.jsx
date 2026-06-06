'use client';

import { useMemo } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Grid,
  Typography,
  Stack,
  LinearProgress,
  Avatar,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  PeopleAlt,
  DoorBack,
  AssignmentTurnedIn,
  FolderSpecial,
  VerifiedUser,
  EventNote,
  Security,
  GppGood,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  // Stats data for security dashboard
  const stats = useMemo(
    () => [
      {
        title: 'کل پرسنل',
        value: '۱,۲۴۷',
        icon: <PeopleAlt sx={{ fontSize: 32 }} />,
        color: '#2196f3',
        trend: '+۲۳',
        subText: 'نفر جدید',
      },
      {
        title: 'تردد امروز',
        value: '۸۴۲',
        icon: <DoorBack sx={{ fontSize: 32 }} />,
        color: '#4caf50',
        trend: '+۱۲',
        subText: 'نفر وارد شده',
      },
      {
        title: 'ارباب رجوع امروز',
        value: '۱۵۶',
        icon: <FolderSpecial sx={{ fontSize: 32 }} />,
        color: '#ff9800',
        trend: '+۸',
        subText: 'نفر',
      },
      {
        title: 'کارتابل باز',
        value: '۲۳',
        icon: <AssignmentTurnedIn sx={{ fontSize: 32 }} />,
        color: '#f44336',
        trend: '-۳',
        subText: 'نیاز به بررسی',
      },
    ],
    []
  );

  // Weekly traffic data
  const trafficData = [
    { name: 'شنبه', ورود: '۳۴۲', خروج: '۳۳۸', میهمان: '۱۲' },
    { name: 'یکشنبه', ورود: '۴۵۱', خروج: '۴۴۷', میهمان: '۱۸' },
    { name: 'دوشنبه', ورود: '۴۸۹', خروج: '۴۸۵', میهمان: '۲۲' },
    { name: 'سه‌شنبه', ورود: '۴۶۷', خروج: '۴۶۳', میهمان: '۱۹' },
    { name: 'چهارشنبه', ورود: '۴۴۳', خروج: '۴۴۰', میهمان: '۱۵' },
    { name: 'پنجشنبه', ورود: '۲۳۱', خروج: '۲۲۸', میهمان: '۸' },
  ];

  // Personnel distribution by department
  const personnelDistribution = [
    { name: 'اداری', value: '۴۵', color: '#ff6384' },
    { name: 'حراست', value: '۱۲', color: '#36a2eb' },
    { name: 'فنی', value: '۲۸', color: '#ffce56' },
    { name: 'مدیریت', value: ' ۸', color: '#4bc0c0' },
    { name: 'پشتیبانی', value: '۷', color: '#9966ff' },
  ];

  // Security requests work items
  const workItems = [
    {
      id: 1,
      title: 'درخواست تردد ویژه',
      requester: 'احمد رضایی',
      unit: 'واحد فنی',
      status: 'در انتظار',
      priority: 'بالا',
      date: '۱۴۰۳/۰۲/۱۵',
    },
    {
      id: 2,
      title: 'صدور کارت پرسنلی',
      requester: 'سارا محمدی',
      unit: 'حراست',
      status: 'در حال بررسی',
      priority: 'متوسط',
      date: '۱۴۰۳/۰۲/۱۴',
    },
    {
      id: 3,
      title: 'درخواست ملاقات',
      requester: 'علی کریمی',
      unit: 'واحد بازرگانی',
      status: 'تأیید شده',
      priority: 'پایین',
      date: '۱۴۰۳/۰۲/۱۴',
    },
    {
      id: 4,
      title: 'ممیزی امنیتی',
      requester: 'مریم حسینی',
      unit: 'مدیریت',
      status: 'در انتظار',
      priority: 'فوری',
      date: '۱۴۰۳/۰۲/۱۳',
    },
  ];

  // Weapons and equipment inventory
  const weaponsItems = [
    {
      id: 1,
      weapon: 'کلت کمری',
      serial: 'IR-۱۲۳۴۵۶',
      officer: 'سرهنگ کریمی',
      status: 'تحویل موقت',
      returnDate: '۱۴۰۳/۰۲/۲۰',
      condition: 'سالم',
    },
    {
      id: 2,
      weapon: 'تفنگ ژ۳',
      serial: 'G۳-۷۸۹۰۱',
      officer: 'سرگرد حسنی',
      status: 'در اسلحه‌خانه',
      returnDate: '-',
      condition: 'در حال تعمیر',
    },
    {
      id: 3,
      weapon: 'گلوله زنده',
      serial: 'AM-۴۵۶۷۸۹',
      officer: 'سروان رضایی',
      status: 'تحویل شده',
      returnDate: '۱۴۰۳/۰۲/۱۸',
      condition: 'تست شده',
    },
    {
      id: 4,
      weapon: 'بی سیم دستی',
      serial: 'RW-۳۳۴۴۵',
      officer: 'سروان نوری',
      status: 'در انتظار تحویل',
      returnDate: '-',
      condition: 'نو',
    },
    {
      id: 5,
      weapon: 'دوربین دید در شب',
      serial: 'NV-۲۲۱۱۴',
      officer: 'ستوان احمدی',
      status: 'تحویل موقت',
      returnDate: '۱۴۰۳/۰۲/۲۲',
      condition: 'سالم',
    },
  ];

  // Recent visitors data
  const recentVisitors = [
    {
      id: 1,
      name: 'شرکت تدبیر',
      representative: 'حسین کامروا',
      purpose: 'مذاکره تجاری',
      enterTime: '۱۰:۳۰',
      exitTime: '۱۲:۱۵',
    },
    {
      id: 2,
      name: 'اداره مالیاتی',
      representative: 'علی اصغری',
      purpose: 'بازرسی',
      enterTime: '۰۹:۱۵',
      exitTime: '۱۱:۴۵',
    },
    {
      id: 3,
      name: 'پیمانکار پروژه',
      representative: 'مهدی احمدی',
      purpose: 'گزارش پیشرفت',
      enterTime: '۱۴:۰۰',
      exitTime: '۱۶:۳۰',
    },
    {
      id: 4,
      name: 'بازرس محترم',
      representative: 'نادر کریمی',
      purpose: 'بازدید میدانی',
      enterTime: '۱۱:۲۰',
      exitTime: '۱۳:۰۰',
    },
  ];

  // Helper functions for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'در انتظار':
        return 'warning';
      case 'در حال بررسی':
        return 'info';
      case 'تأیید شده':
        return 'success';
      case 'رد شده':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'فوری':
        return 'error';
      case 'بالا':
        return 'warning';
      case 'متوسط':
        return 'info';
      case 'پایین':
        return 'success';
      default:
        return 'default';
    }
  };

  const getWeaponStatusColor = (status) => {
    switch (status) {
      case 'تحویل موقت':
        return 'warning';
      case 'تحویل شده':
        return 'success';
      case 'در اسلحه‌خانه':
        return 'info';
      case 'در انتظار تحویل':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="داشبورد سامانه جامع دژبان"
        links={[{ name: 'داشبورد', href: paths.dashboard.root }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Main container with flex row layout */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Left column - Stats and Work tables */}
        <Box sx={{ flex: '1 1 45%', minWidth: 0 }}>
          {/* Stats cards row */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats.map((stat, index) => (
              <Grid key={index} size={{ xs: 12, md: 3, sm:6 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4">{stat.value}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TrendingUp sx={{ fontSize: 16, color: stat.color }} />
                        <Typography variant="caption" color={stat.color}>
                          {stat.trend}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.subText}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Avatar
                      sx={{
                        bgcolor: `${stat.color}20`,
                        color: stat.color,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    sx={{ mt: 2, height: 6, borderRadius: 3 }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Security requests table */}
          <Card sx={{ mb: 3, height: 'auto' }}>
            <CardHeader
              title="کارتابل درخواست‌های حراست"
              subheader={`${workItems.length} مورد نیاز به بررسی`}
              action={
                <Chip
                  icon={<VerifiedUser />}
                  label="آخرین بروزرسانی: امروز"
                  color="primary"
                  variant="outlined"
                />
              }
            />
            <TableContainer component={Paper} elevation={0}>
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.neutral' }}>
                    <TableCell>عنوان درخواست</TableCell>
                    <TableCell>متقاضی</TableCell>
                    <TableCell>وضعیت</TableCell>
                    <TableCell>اولویت</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.title}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.requester}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          color={getStatusColor(item.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.priority}
                          size="small"
                          color={getPriorityColor(item.priority)}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Weapons and equipment table */}
          <Card sx={{ height: 'auto' }}>
            <CardHeader
              title="کارتابل تجهیزات و اسلحه‌خانه"
              subheader={`${weaponsItems.length} قلم تجهیزات در گردش`}
              action={
                <Chip icon={<GppGood />} label="امنیت: سطح بالا" color="error" variant="outlined" />
              }
            />
            <TableContainer component={Paper} elevation={0}>
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.neutral' }}>
                    <TableCell>تجهیزات/اسلحه</TableCell>
                    <TableCell>سریال</TableCell>
                    <TableCell>متولی</TableCell>
                    <TableCell>وضعیت</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weaponsItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Security sx={{ fontSize: 18, color: '#f44336' }} />
                          <Typography variant="body2" fontWeight="medium">
                            {item.weapon}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" fontFamily="monospace">
                          {item.serial}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.officer}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          color={getWeaponStatusColor(item.status)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>

        {/* Right column - Charts and Visitors */}
        <Box sx={{ flex: '1 1 50%', minWidth: 0 }}>
          {/* Traffic line chart */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="نمودار تردد هفتگی" subheader="آمار ورود، خروج و میهمانان" />
            <Box sx={{ p: 3, pt: 1, height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ورود"
                    stroke="#2196f3"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="خروج"
                    stroke="#4caf50"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="میهمان"
                    stroke="#ff9800"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>

          {/* Visitors list */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title="ارباب رجوع‌های امروز"
              subheader="مراجعین حاضر در سازمان"
              action={<EventNote color="action" />}
            />
            <Stack divider={<Divider />} sx={{ p: 2, maxHeight: 360, overflow: 'auto' }}>
              {recentVisitors.map((visitor) => (
                <Stack
                  key={visitor.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1.5}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {visitor.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      نماینده: {visitor.representative}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      علت: {visitor.purpose}
                    </Typography>
                  </Stack>
                  <Stack alignItems="flex-end" spacing={0.5}>
                    <Chip label={`ورود: ${visitor.enterTime}`} size="small" icon={<DoorBack />} />
                    <Typography variant="caption" color="text.secondary">
                      خروج: {visitor.exitTime}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Card>

          {/* Violations bar chart */}
          <Card>
            <CardHeader
              title="آمار تخلفات و هشدارهای امنیتی"
              subheader="۳۰ روز گذشته"
              action={<WarningIcon color="error" />}
            />
            <Box sx={{ p: 3, height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'تأخیر', value: '۲۳' },
                    { name: 'خروج غیرمجاز', value: '۱۲' },
                    { name: 'مهمان بدون هماهنگی', value: '۸' },
                    { name: 'مدارک ناقص', value: '۱۵' },
                    { name: 'سایر', value: '۷' },
                  ]}
                  layout="vertical"
                  margin={{ left: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f44336" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Box>
      </Box>
    </DashboardContent>
  );
}
