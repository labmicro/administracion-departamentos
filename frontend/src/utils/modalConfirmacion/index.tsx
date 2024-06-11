import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface ModalConfirmacionProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({ open, onClose, onConfirm }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-confirmacion-title"
    aria-describedby="modal-confirmacion-description"
  >
    <Box sx={style}>
      <Typography id="modal-confirmacion-title" variant="h6" component="h2">
        Confirmar Eliminación
      </Typography>
      <Typography id="modal-confirmacion-description" sx={{ mt: 2 }}>
        ¿Estás seguro?
      </Typography>
      <Button variant="contained" color="error" onClick={onConfirm} >
        Eliminar
      </Button>
      <Button onClick={onClose} variant="contained" color='primary' style={{ marginLeft: '8px' }}>
        Cancelar
      </Button>
    </Box>
  </Modal>
);

export default ModalConfirmacion;