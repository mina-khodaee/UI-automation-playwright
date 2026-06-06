import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import StepButton from '@mui/material/StepButton';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgba(0, 255, 200, 1) 0%, rgba(129, 129, 129, 1) 50%, rgba(0, 255, 221, 1) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      },
    },
  ],
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;
  return (
    <ColorlibStepIconRoot sx={{bgcolor:'primary.main'}} ownerState={{ completed, active }} className={className}>
      {icon}
    </ColorlibStepIconRoot>
  );
}

export default function CustomizedSteppers({ steps = [], getActiveStep }) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
    getActiveStep(step);
  };

  return (
    <Stack sx={{ width: '100%' }} spacing={5}>
      <Stepper alternativeLabel nonLinear activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((item, index) => (
          <Step key={index}>
            <StepButton onClick={handleStep(index)}>
              <StepLabel
                StepIconComponent={(props) => <ColorlibStepIcon  {...props} icon={item.icon} />}
              >
                {item.title}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}
