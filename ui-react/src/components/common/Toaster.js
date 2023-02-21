import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import PropTypes from 'prop-types';

function Toaster({
  bg,
  show,
  position,
  delay = 3000,
  closeButton,
  showHeader = true,
  headerMessage = '',
  message
}) {
  const [showToast, setShowToast] = useState(false);
  const [autoHide, setAutoHide] = useState(false);

  useEffect(() => {
    setShowToast(show);
  }, [show]);

  useEffect(() => {
    if (delay > 0) {
      setAutoHide(true);
    } else {
      setAutoHide(false);
    }
  }, [delay]);

  return (
    <ToastContainer className="p-3" position={position}>
      <Toast
        bg={bg}
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={delay}
        autohide={autoHide}>
        {showHeader && (
          <Toast.Header closeButton={closeButton}>
            <strong className="me-auto">{headerMessage}</strong>
          </Toast.Header>
        )}
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
Toaster.defaultProps = {
  show: false,
  bg: 'success',
  position: 'top-center',
  delay: 5000,
  showHeader: true,
  headerMessage: 'Alert'
};
Toaster.propTypes = {
  show: PropTypes.bool,
  bg: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ]),
  position: PropTypes.oneOf([
    'top-start',
    'top-center',
    'top-end',
    'middle-start',
    'middle-center',
    'middle-end',
    'bottom-start',
    'bottom-center',
    'bottom-end'
  ]),
  delay: PropTypes.number,
  closeButton: PropTypes.bool,
  showHeader: PropTypes.bool,
  headerMessage: function (props, propName, componentName) {
    if (!(typeof props[propName] === 'string')) {
      return new Error(`${propName} is should be string in ${componentName}.`);
    }
    if (props['showHeader'] && !props[propName]) {
      return new Error(`${propName} is required when showHeader is true in ${componentName}.`);
    }
  },
  message: PropTypes.string.isRequired
};

export default Toaster;
