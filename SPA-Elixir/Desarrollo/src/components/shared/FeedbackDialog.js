import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from '@mui/material';

const FeedbackDialog = ({
  open,
  onClose,
  title = 'Mensaje',
  message = '',
  severity = 'info',
  buttonText = 'Cerrar',
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Alert severity={severity} sx={{ mt: 1 }}>
        {message}
      </Alert>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="contained">
        {buttonText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default FeedbackDialog;
