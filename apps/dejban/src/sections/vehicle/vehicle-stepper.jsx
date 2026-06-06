import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';

const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '10%',
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
                    'linear-gradient(rgba(0, 119, 255, 1) 50%',
                boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
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
        <ColorlibStepIconRoot sx={{ bgcolor: 'info.light', color: 'black' }} ownerState={{ completed, active }} className={className}>
            {icon}
        </ColorlibStepIconRoot>
    );
}

export default function CustomizedSteppers({ steps = [], activeStep, getActiveStep }) {

    const handleStep = (step) => () => {
        getActiveStep(step);
    };

    return (
        <Stack sx={{ width: '100%' }} spacing={5}>
            <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                {steps.map((item, index) => (
                    <Step key={index}>
                        <StepButton onClick={handleStep(index)}>
                            <StepLabel
                                StepIconComponent={(props) =>
                                    <ColorlibStepIcon {...props} icon={item.icon} />
                                }
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