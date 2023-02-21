import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';

function ActionModal({
  onModelCloseClick,
  onActionClick,
  allowKeyboardClose,
  allowBackdropClose,
  bodyMessage,
  actionButtonVariant,
  actionButtonText,
  ...otherProps
}) {
  return (
    <Modal
      {...otherProps}
      size="sm"
      onHide={onModelCloseClick}
      centered
      keyboard={allowKeyboardClose}
      backdrop={allowBackdropClose}
      data-testid="modal-delete-task">
      <Modal.Header closeButton>
        <Modal.Title>Delete Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{bodyMessage}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onModelCloseClick}>
          Close
        </Button>
        <Button variant={actionButtonVariant} onClick={onActionClick} data-testid="button-action">
          {actionButtonText || 'Perform Action'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ActionModal.propTypes = {
  allowKeyboardClose: true,
  allowBackdropClose: true,
  actionButtonVariant: 'primary'
};

ActionModal.propTypes = {
  onModelCloseClick: PropTypes.func.isRequired,
  onActionClick: PropTypes.func.isRequired,
  allowKeyboardClose: PropTypes.bool,
  allowBackdropClose: PropTypes.bool,
  bodyMessage: PropTypes.string.isRequired,
  showActionButton: PropTypes.bool,
  actionButtonVariant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ]),
  actionButtonText: PropTypes.string.isRequired
};

export default ActionModal;
