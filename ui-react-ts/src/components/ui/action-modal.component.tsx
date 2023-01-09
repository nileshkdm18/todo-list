import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
interface IActionModalProps {
  show: boolean;
  onModelCloseClick?: () => void;
  onActionClick?: () => void;
  allowKeyboardClose?: boolean;
  allowBackdropClose?: boolean;
  titleText?: string;
  bodyMessage: string;
  actionButtonVariant: string;
  actionButtonText: string;
}
function ActionModal({
  show,
  onModelCloseClick,
  onActionClick,
  allowKeyboardClose = true,
  allowBackdropClose = true,
  titleText = 'Modal',
  bodyMessage,
  actionButtonVariant,
  actionButtonText
}: IActionModalProps) {
  return (
    <Modal
      show={show}
      size='sm'
      onHide={onModelCloseClick}
      centered
      keyboard={allowKeyboardClose}
      backdrop={allowBackdropClose}
      data-testid='action-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{titleText}</Modal.Title>
      </Modal.Header>
      <Modal.Body data-testid='action-modal-body'>
        <p data-testid='action-modal-body-text'>{bodyMessage}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onModelCloseClick} data-testid='button-close'>
          Close
        </Button>
        <Button variant={actionButtonVariant} onClick={onActionClick} data-testid='button-action'>
          {actionButtonText || 'Perform Action'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ActionModal;
