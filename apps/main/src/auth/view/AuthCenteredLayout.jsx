import { merge } from 'es-toolkit';
import { useState, useEffect } from 'react';
import { BsTelephoneInboundFill } from "react-icons/bs";
import { SettingsButton } from '@repo/ui/settings-button';
import { useSettingsContext } from '@repo/ui/components-settings';
import { MdMarkEmailRead , MdOutlineSupportAgent } from "react-icons/md";
import { MainSection , LayoutSection , HeaderSection } from '@repo/ui/layouts-core';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { Stack } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Fade from '@mui/material/Fade';
import Tooltip from '@mui/material/Tooltip';
import { alpha, styled, useColorScheme } from '@mui/material/styles';

import { CONFIG } from 'src/global-config';

// --------------------------------------------------------------------

const ColorBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '4px',
  background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
  backgroundSize: '200% 100%',
  animation: 'gradientShift 3s ease infinite',
  zIndex: 1000,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    height: '6px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

const CustomTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontSize: '0.875rem',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '12px',
    boxShadow: theme.shadows[8],
    padding: theme.spacing(1.5, 2),
    maxWidth: 280,
  },
  '& .MuiTooltip-arrow': {
    color: theme.palette.background.paper,
    '&::before': {
      border: `1px solid ${theme.palette.divider}`,
    }
  },
}));

const StyledAuthContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '95%',
  maxWidth: '1400px',
  minHeight: '600px',
  [theme.breakpoints.down('md')]: { minHeight: 0, flexDirection: 'column' },
  borderRadius: '28px',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: `
    0 25px 70px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 ${alpha(theme.palette.common.white, 0.3)},
    inset 0 -1px 0 ${alpha(theme.palette.common.black, 0.1)}
  `,
  background: theme.palette.background.default,
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,

  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: '30px',
    background: 'linear-gradient(135deg, #ff6b6b22, #4ecdc422, #45b7d122, #96ceb422, #feca5722)',
    zIndex: -1,
    pointerEvents: 'none',
    animation: 'borderRotate 8s linear infinite',
  },
}));

const LoginCard = styled(Box)(({ theme }) => ({
  flex: '0 0 40%',
  padding: theme.spacing(4, 3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  zIndex: 10,
  background: `
    linear-gradient(135deg, 
      ${alpha(theme.palette.background.paper, 0.95)} 0%, 
      ${alpha(theme.palette.background.default, 0.98)} 100%
    )
  `,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '4px',
    background: 'linear-gradient(to bottom, transparent, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, transparent)',
    animation: 'gradientFlow 4s ease infinite',
    boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  // ✨ Dark mode overrides: force light background + black text
  ...theme.applyStyles('dark', {
    // Dark semi‑transparent background (less glassy = higher opacity)
    background: alpha(theme.palette.common.black, 0.85), // 85% opacity, 15% transparent
    // Optional: add a subtle blur, but reduce blur radius for "less glass"
    backdropFilter: 'blur(4px)', // less blur than typical glass (often 8-12px)
    color: theme.palette.common.white,
    // Keep borders or gradient border visible
    '&::before': {
      // keep the gradient border (right side) visible
      opacity: 0.7,
    },
    // Override input styles for dark background
    '& .MuiInputLabel-root': {
      color: theme.palette.grey[300],
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: alpha(theme.palette.common.black, 0.6),
      '& fieldset': {
        borderColor: theme.palette.grey[700],
      },
      '&:hover fieldset': {
        borderColor: theme.palette.grey[500],
      },
    },
    '& .MuiTypography-root': {
      color: theme.palette.common.white,
    },
  }),

  // '&::after': {
  //   content: '""',
  //   position: 'absolute',
  //   top: '50%',
  //   right: '-12px',
  //   transform: 'translateY(-50%)',
  //   width: '24px',
  //   height: '24px',
  //   borderRadius: '50%',
  //   background: theme.palette.primary.main,
  //   boxShadow: `
  //     0 0 0 6px ${theme.palette.background.default},
  //     0 0 20px ${alpha(theme.palette.primary.main, 0.5)}
  //   `,
  //   zIndex: 2,
  //   animation: 'pulse 2s ease-in-out infinite',
  // },

  [theme.breakpoints.down('md')]: {
    flex: '1',
    padding: theme.spacing(4, 3),
    borderRight: 'none',
    borderBottom: `3px solid ${theme.palette.primary.main}`,

    '&::before': {
      width: '100%',
      height: '4px',
      top: 'auto',
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to right, transparent, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, transparent)',
    },

    '&::after': {
      top: 'auto',
      right: '50%',
      bottom: '-12px',
      transform: 'translateX(50%)',
    }
  },

  '@keyframes gradientFlow': {
    '0%': {
      opacity: 0.7,
      boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)'
    },
    '50%': {
      opacity: 1,
      boxShadow: '0 0 30px rgba(78, 205, 196, 0.5)'
    },
    '100%': {
      opacity: 0.7,
      boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)'
    },
  },

  '@keyframes pulse': {
    '0%': { transform: 'translateY(-50%) scale(1)' },
    '50%': { transform: 'translateY(-50%) scale(1.1)' },
    '100%': { transform: 'translateY(-50%) scale(1)' },
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  flex: '1',
  padding: theme.spacing(5, 4),
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
  background: `
    linear-gradient(145deg, 
      ${alpha(theme.palette.background.paper, 0.9)} 0%, 
      ${alpha(theme.palette.primary.light, 0.08)} 50%,
      ${alpha(theme.palette.background.paper, 0.9)} 100%
    )
  `,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, ${alpha(theme.palette.info.light, 0.05)} 0%, transparent 50%)
    `,
    zIndex: 0,
    pointerEvents: 'none',
  },

  ...theme.applyStyles('dark', {
    background: alpha(theme.palette.common.black, 0.85),
    backdropFilter: 'blur(4px)',
    color: theme.palette.common.white,
    '&::before': {
      background: 'transparent',
      pointerEvents: 'none',
    },
    '& .NeonText': {
      WebkitTextFillColor: theme.palette.common.white,
      background: 'none',
      textShadow: 'none',
    },
  }),
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: '52px',
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 5,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: '3px',
    borderRadius: '3px 3px 0 0',
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.95rem',
    minHeight: '52px',
    color: theme.palette.text.secondary,
    position: 'relative',
    zIndex: 6,
    '&:hover': {
      color: theme.palette.primary.main,
      transform: 'translateY(-2px)',
    },
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      fontWeight: 800,
    },
  },
}));

const TabContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  minHeight: '240px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 5,
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  background: alpha(theme.palette.primary.main, 0.05),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease',

  '&:hover': {
    transform: 'translateX(8px)',
    background: alpha(theme.palette.primary.main, 0.1),
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
  },

  '& .icon': {
    fontSize: '1.5rem',
    marginLeft: theme.spacing(2),
    background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
}));

const NeonText = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundSize: '200% 200%',
  animation: 'neonShift 3s ease infinite',
  fontWeight: 800,
  textShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,

  '@keyframes neonShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

const LoginContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '420px',
  position: 'relative',
  zIndex: 10,
  pointerEvents: 'auto',
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`info-tabpanel-${index}`}
    aria-labelledby={`info-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Fade in={value === index} timeout={600}>
        <TabContent>{children}</TabContent>
      </Fade>
    )}
  </div>
);



const tabProps = (index) => ({
  id: `info-tab-${index}`,
  'aria-controls': `info-tabpanel-${index}`,
});



export function AuthCenteredLayout({ sx, cssVars, children, slotProps, layoutQuery = 'md' }) {
  const [tabValue, setTabValue] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const settings = useSettingsContext();
  const { mode, setMode, systemMode } = useColorScheme();

  useEffect(() => {
    if (mode === 'system' && systemMode) {
      settings.setState({ colorScheme: systemMode });
    }
  }, [mode, systemMode]);


  const tabCount = 3;

  // Auto-rotate tabs every 5 seconds
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setTabValue((prev) => (prev + 1) % tabCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRotate, tabCount]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setAutoRotate(false);
    const timer = setTimeout(() => setAutoRotate(true), 15000);
    return () => clearTimeout(timer);
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const renderHeader = () => {
    const headerSlotProps = { container: { maxWidth: false } };

    const headerSlots = {
      topArea: (
        <CustomTooltip
            title="به سامانه جامع دژبان خوش آمدید - سیستم مدیریت هوشمند"
            arrow
            placement="bottom"
            open={tooltipOpen}
            onOpen={handleTooltipOpen}
            onClose={handleTooltipClose}
          >
            <ColorBar
              onClick={handleTooltipOpen}
              onMouseEnter={handleTooltipOpen}
              onMouseLeave={handleTooltipClose}
            />
          </CustomTooltip>
      ),
      leftArea: (
        <>
          {/** @slot Logo */}
          {/* <Logo /> */}
        </>
      ),
      rightArea: (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
          border: settings.state.navColor === 'apparent' &&
            settings.state.colorScheme === 'dark' ? '1px solid #000000' : 'default',
          borderRadius: '16px',
          backgroundColor: settings.state.navColor === 'apparent' && settings.state.colorScheme === 'dark' ? '#1c252e' :
            settings.state.navColor === 'apparent' && settings.state.colorScheme === 'light' ? 'white' : 'default',
          px: 2,
          py: 1,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        }}>
          {/** @slot Help link */}
          {/* <Link
            href={paths.faqs}
            component={RouterLink}
            color="inherit"
            sx={{
              typography: 'subtitle2',
              fontWeight: 600,
              '&:hover': {
                color: 'primary.main',
              }
            }}
          >
            راهنما
          </Link> */}

          {/** @slot Settings button */}
          <SettingsButton type="button" />
        </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={[
          {
            position: { [layoutQuery]: 'fixed' },
            pt: '8px',
            minHeight: '72px',                     // 👈 Increase height
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[800],
            color: 'common.white',                 // 👈 Light text for contrast
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`, // optional subtle border
          },
          ...(Array.isArray(slotProps?.header?.sx)
            ? (slotProps?.header?.sx ?? [])
            : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => (
    // <MainSection
    //   {...slotProps?.main}
    //   sx={[
    //     (theme) => ({
    //       alignItems: 'center',
    //       p: theme.spacing(3, 2, 10, 2),
    //       [theme.breakpoints.up(layoutQuery)]: {
    //         justifyContent: 'center',
    //         p: theme.spacing(8, 0, 10, 0),
    //       },
    //       mt: '4px',
    //       background: `
    //         radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 40%),
    //         radial-gradient(circle at 90% 80%, ${alpha(theme.palette.secondary.light, 0.05)} 0%, transparent 40%)
    //       `,
    //     }),
    //     ...(Array.isArray(slotProps?.main?.sx)
    //       ? (slotProps?.main?.sx ?? [])
    //       : [slotProps?.main?.sx]),
    //   ]}
    // >
    <MainSection
      {...slotProps?.main}
      sx={[
        (theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          pt: 'calc(var(--layout-header-mobile-height, 64px) + 24px)',
          pb: theme.spacing(4),
          px: theme.spacing(2),
          [theme.breakpoints.up(layoutQuery)]: {
            pt: 'calc(var(--layout-header-desktop-height, 72px) + 32px)',
            pb: theme.spacing(8),
            px: 0,
          },
          background: `
        radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, ${alpha(theme.palette.secondary.light, 0.05)} 0%, transparent 40%)
      `,
        }),
        ...(Array.isArray(slotProps?.main?.sx)
          ? (slotProps?.main?.sx ?? [])
          : [slotProps?.main?.sx]),
      ]}
    >

      <StyledAuthContainer>
        <LoginCard>
          <LoginContentWrapper>
            {children}
          </LoginContentWrapper>
        </LoginCard>

        <InfoCard>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <NeonText sx={{
              textAlign: 'center',
              fontSize: '1.8rem',
              mb: 1,
              fontWeight: 800
            }}>
              سامانه کنترل دسترسی دژبان
            </NeonText>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{
                color: 'text.secondary',
                fontSize: '1rem',
                fontWeight: 500
              }}>
                سیستم مدیریت هوشمند ترددها
              </Box>
            </Box>

            <StyledTabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="info tabs"
              variant="fullWidth"
            >
              {/* <Tab label="اخبار و اطلاعیه ها" {...tabProps(0)} /> */}
              <Tab label="امکانات سیستم" {...tabProps(0)} />
              <Tab label="راهنمای استفاده" {...tabProps(1)} />
              <Tab label="پشتیبانی" {...tabProps(2)} />
            </StyledTabs>


            {/* <TabPanel value={tabValue} index={0}> */}
            {/* <FeatureItem>
                <Box className="icon">⚡</Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    راه اندازی سامانه حضور و غیاب جدید
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.5 }}>
                    سامانه حضور و غیاب جدید فعال شد و از این پس جهت انجام عملیات حضور و غیاب از این سامانه استفاده میشود.
                  </Box>
                </Box>
              </FeatureItem> */}
            {/* 
              <FeatureItem>
                <Box className="icon">📊</Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    خیلی مهم: درخواست ها و مجوز ها
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.5 }}>
                    از روز شنبه مورخ 1404/08/01 تمامی مجوز ها در سامانه جدید معتبر بوده و در صورت ثبت درخواست در سامانه قبلی نسبت به ثبت مجدد در این سامانه اقدام گردد.
                  </Box>
                </Box>
              </FeatureItem> */}

            {/* <FeatureItem>
                <Box className="icon">🔒</Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    نام کاربری و رمز عبور
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.5 }}>
                    نام کاربری افراد کد ملی میباشد
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.5 }}>
                    بعد از ورود به سیستم نسبت به تغییر رمز عبور خود اقدام کنید...!
                  </Box>
                </Box>
              </FeatureItem> */}
            {/* </TabPanel> */}

            <TabPanel value={tabValue} index={0}>
              {/* <Box sx={{ textAlign: 'center', mb: 3 }}>
                <h3 style={{ marginBottom: '24px', color: 'primary.main' }}>
                  قابلیت‌های پیشرفته سیستم
                </h3>
              </Box> */}

              <FeatureItem>
                <Box className="icon">⚡</Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    ثبت لحظه‌ای تردد
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.5 }}>
                    ثبت خودکار تردد با دقت میلی‌ثانیه
                  </Box>
                </Box>
              </FeatureItem>

              {/* <FeatureItem>
                <Box className="icon">📊</Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    گزارش‌های تحلیلی
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.5 }}>
                    آنالیز پیشرفته و نمودارهای تعاملی
                  </Box>
                </Box>
              </FeatureItem> */}

              <FeatureItem>
                <Box className="icon">🔒</Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    امنیت فوق‌العاده
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.5 }}>
                    رمزنگاری پیشرفته و احراز هویت چندمرحله‌ای
                  </Box>
                </Box>
              </FeatureItem>
            </TabPanel>



            <TabPanel value={tabValue} index={1}>
              <FeatureItem>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    مرحله ۱: وارد کردن اطلاعات کاربری
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.5 }}>
                    نام کاربری و رمز عبور اختصاصی خود را وارد کنید تا سیستم هویت شما را بررسی کند.
                  </Box>
                </Box>
              </FeatureItem>

              <FeatureItem>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    مرحله ۲: تایید و ورود
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.5 }}>
                    روی دکمه ورود کلیک کنید تا اطلاعات شما اعتبارسنجی شده و به سامانه متصل شوید.
                  </Box>
                </Box>
              </FeatureItem>

              <FeatureItem>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    مرحله ۳: دسترسی به داشبورد
                  </Box>
                  <Box sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.5 }}>
                    پس از تأیید هویت، به داشبورد اصلی و بخش‌های مجاز منتقل می‌شوید.
                  </Box>
                </Box>
              </FeatureItem>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box
                sx={(theme) => ({
                  textAlign: 'center',
                  mb: 3,
                  p: 3,
                  borderRadius: '16px',
                  color: theme.palette.text.primary,
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.grey[900], 0.95)
                      : theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 10px 30px rgba(0, 0, 0, 0.35)'
                      : '0 8px 24px rgba(0, 0, 0, 0.08)',
                })}
              >
                <Box
                  sx={{
                    fontSize: '3rem',
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'primary.main',
                  }}
                >
                  <MdOutlineSupportAgent style={{ fontSize: 50 }} />
                </Box>

                <Box sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#111', mb: 1 }}>
                  تیم پشتیبانی فنی
                </Box>

                <Box sx={{ fontSize: '0.95rem', color: 'text.secondary', lineHeight: 1.6 }}>
                  ما ۲۴/۷ آماده پاسخگویی به سوالات و مشکلات فنی شما هستیم
                </Box>

                <Box
                  sx={(theme) => ({
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                    mt: 3,
                  })}
                >
                  <Box
                    sx={(theme) => ({
                      textAlign: 'center',
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.grey[800], 0.95)
                          : '#e0e0e0',
                      border: `1px solid ${theme.palette.divider}`,
                    })}
                  >
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                      <BsTelephoneInboundFill style={{ fontSize: 18, color: 'inherit' }} />
                      <Box sx={{ fontWeight: 700, color: 'primary.main' }}>تلفن</Box>
                    </Stack>
                    <Box sx={{ fontSize: '0.9rem', color: 'text.primary', mt: 1 }}>026-34059100</Box>
                  </Box>

                  <Box
                    sx={(theme) => ({
                      textAlign: 'center',
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.grey[800], 0.95)
                          : '#e0e0e0',
                      border: `1px solid ${theme.palette.divider}`,
                    })}
                  >
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                      <MdMarkEmailRead style={{ fontSize: 18, color: 'inherit' }} />
                      <Box sx={{ fontWeight: 700, color: 'primary.main' }}>ایمیل</Box>
                    </Stack>
                    <Box sx={{ fontSize: '0.9rem', color: 'text.primary', mt: 1 }}>support@dejban.ir</Box>
                  </Box>
                </Box>
              </Box>
            </TabPanel>
          </Box>
        </InfoCard>
      </StyledAuthContainer >
    </MainSection >
  );

  return (
    <LayoutSection
      headerSection={renderHeader()}
      footerSection={renderFooter()}
      cssVars={{ '--layout-auth-content-width': '420px', overflow: "hidden", ...cssVars }}
      sx={[
        (theme) => ({
          position: 'relative',
          '&::before': backgroundStyles(theme)
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}

// ----------------------------------------------------------------------

const backgroundStyles = (theme) => ({
  ...theme.mixins.bgGradient({
    images: [`url(${CONFIG.assetsDir}/assets/background/backGround-10.jpg)`],
  }),
  zIndex: 1,
  opacity: 0.24,
  width: '100%',
  height: '100%',
  content: "''",
  position: 'absolute',
  ...theme.applyStyles('dark', {
    opacity: 0.08,
  }),
});