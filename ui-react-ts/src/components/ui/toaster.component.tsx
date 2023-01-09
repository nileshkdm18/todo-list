import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
// import PropTypes from 'prop-types';
type bg = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
type ToastPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'middle-start'
  | 'middle-center'
  | 'middle-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';
interface ToasterProps {
  bg?: bg;
  show: boolean;
  position?: ToastPosition;
  delay?: number;
  autoHide?: boolean;
  closeButton?: boolean;
  showHeader?: boolean;
  headerMessage?: string;
  message: string;
}
function Toaster({
  show,
  bg = 'success',
  position = 'top-center',
  delay = 3000,
  autoHide = true,
  closeButton = true,
  showHeader = true,
  headerMessage = 'Alert',
  message
}: ToasterProps) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setShowToast(show);
  }, [show]);

  return (
    <ToastContainer className='p-3' position={position}>
      <Toast
        bg={bg}
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={delay}
        autohide={autoHide}
        data-testid='toaster'>
        {showHeader && (
          <Toast.Header closeButton={closeButton}>
            <strong className='me-auto'>{headerMessage}</strong>
          </Toast.Header>
        )}
        <Toast.Body data-testid='toaster-body'>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default Toaster;
