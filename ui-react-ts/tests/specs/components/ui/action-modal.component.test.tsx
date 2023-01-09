import React, { useEffect, useState } from 'react';
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import ActionModal from '../../../../src/components/ui/action-modal.component';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

interface IActionModalProps {
  show: boolean;
  onActionClick?: () => void;
  allowKeyboardClose?: boolean;
  allowBackdropClose?: boolean;
  titleText: string;
  bodyMessage: string;
  actionButtonVariant: string;
  actionButtonText: string;
}

describe('Action Modal Component', () => {
  const onActionClick = jest.fn();
  const TestComponent = (props: IActionModalProps) => {
    const [modalShow, setModalShow] = useState(false);
    useEffect(() => {
      setModalShow(props.show);
    }, [props.show]);
    const onModelCloseClick = () => {
      setModalShow(false);
    };
    return (
      <div>
        <ActionModal
          show={modalShow}
          bodyMessage={props.bodyMessage}
          actionButtonVariant={props.actionButtonVariant}
          actionButtonText={props.actionButtonText}
          onModelCloseClick={onModelCloseClick}
          onActionClick={props.onActionClick}></ActionModal>
      </div>
    );
  };
  beforeEach(async () => {
    await act(async () => {
      render(
        <TestComponent
          show={true}
          titleText='Title'
          bodyMessage='Test'
          actionButtonVariant='success'
          actionButtonText='Click Me'
          onActionClick={onActionClick}
        />
      );
    });
  });
  it('Renders Component', async () => {
    const modal = await screen.findByTestId('action-modal');
    expect(modal).toBeInTheDocument();
    const modalBody = await screen.findByTestId('action-modal-body');
    expect(modalBody).toBeInTheDocument();
    const modalBodyText = await screen.findByTestId('action-modal-body-text');
    expect(modalBodyText).toBeInTheDocument();
    expect(modalBodyText.innerHTML).toBe('Test');
  });

  it('Test Action: Action Button', async () => {
    const buttonAction = await screen.findByTestId('button-action');
    await userEvent.click(buttonAction);
    expect(onActionClick).toHaveBeenCalled();
  });

  it('Test Action: Close Button', async () => {
    const modal = await screen.findByTestId('action-modal');
    expect(modal).toBeInTheDocument();
    const buttonClose = await screen.findByTestId('button-close');
    await userEvent.click(buttonClose);
    let isElementRemoved: boolean | null = null;
    await waitForElementToBeRemoved(modal, { timeout: 10 })
      .then(() => {
        isElementRemoved = true;
        console.log('Element no longer in DOM');
      })
      .catch(() => {
        isElementRemoved = false;
        console.log('Element still there in DOM, after timeout');
      });
    expect(isElementRemoved).toBeTruthy();
  });

  it('Test Action: Esc Key Press', async () => {
    const modal = await screen.findByTestId('action-modal');
    expect(modal).toBeInTheDocument();
    await fireEvent.keyDown(modal, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27
    });
    // await fireEvent.keyDown(modal, { key: 'enter', keyCode: 13 });
    let isElementRemoved: boolean | null = null;
    await waitForElementToBeRemoved(modal, { timeout: 10 })
      .then(() => {
        isElementRemoved = true;
        console.log('Element no longer in DOM');
      })
      .catch(() => {
        isElementRemoved = false;
        console.log('Element still there in DOM, after timeout');
      });
    expect(isElementRemoved).toBeTruthy();
  });
});
