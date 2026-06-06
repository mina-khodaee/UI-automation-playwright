import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { FormControlLabel, Switch } from '@mui/material';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function ConfirmDialog({ open, title, action, content, flag, onFlagChange, onClose, ...other }) {
  const { t } = useTranslate();
  const { t: t_user } = useTranslate('user');
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2, textAlign: 'center' }}>{title}</DialogTitle>

      {content && (
        <DialogContent sx={{ typography: 'body2', textAlign: 'center' }}>
          {content}
        </DialogContent>
      )}

      {typeof flag !== 'undefined' && (
        <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={flag}
                onChange={(e) => onFlagChange(e.target.checked)}
              />
            }
            label={t_user('formsInputs.syncWithDevicesInUserAccessGroups')}
            labelPlacement="end"
          />
        </DialogContent>
      )}

      <DialogActions sx={{ justifyContent: 'center' }}>
        {action}
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('button.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
