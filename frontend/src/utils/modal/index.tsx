import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

interface BasicModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void; // Hacer que la función sea opcional
  title: string;
  content: string;
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
  textAlign: 'center' as 'center', // Alinear el contenido al centro
};

const buttonStyle = {
  marginTop: '20px', // Espacio superior para separar el botón del contenido
};


const BasicModal: React.FC<BasicModalProps> = ({ open, onClose, title, content, onConfirm = () => {}  }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {title}
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        {content}
      </Typography>
      <Button style={buttonStyle} variant="contained" color="primary" onClick={() => {
        onClose(); // Cierra el modal de éxito
        onConfirm(); // Ejecuta la función de confirmación (puede ser la función de navegación)
      }}>
        OK
      </Button>
    </Box>
  </Modal>
);

export default BasicModal;
