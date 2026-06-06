import { FaTrashAlt } from "react-icons/fa";
import { IconifyLocal } from '@repo/ui/iconify-local';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';


// ----------------------------------------------------------------------

export const chipProps = { size: 'small', variant: 'soft' };

// ----------------------------------------------------------------------

export function FiltersResult({ sx, onReset, children, totalResults, ...other }) {
  return (
    <ResultRoot sx={sx} {...other}>
      <ResultLabel>
        <strong>{totalResults}</strong>
        <span> results found</span>
      </ResultLabel>

      <ResultContent>
        {children}

        <Button
          color="error"
          onClick={onReset}
          startIcon={<IconifyLocal><FaTrashAlt /></IconifyLocal>}
        >
          Clear
        </Button>
      </ResultContent>
    </ResultRoot>
  );
}

// ----------------------------------------------------------------------

const ResultRoot = styled('div')``;

const ResultLabel = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  marginBottom: theme.spacing(1.5),
  '& span': { color: theme.vars.palette.text.secondary },
}));

const ResultContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
