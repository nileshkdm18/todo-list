import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import Toaster from '../../../../src/components/ui/toaster.component';

describe('Toaster Component', () => {
  it('Renders Component', async () => {
    render(
      <div>
        <Toaster show={true} message='Test'></Toaster>
      </div>
    );
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    const toasterBody = await screen.findByTestId('toaster-body');
    expect(toasterBody).toBeInTheDocument();
    expect(toasterBody.innerHTML).toBe('Test');
  });

  it('Test Auto Close True', async () => {
    render(
      <div>
        <Toaster show={true} message='Test' delay={100} autoHide={true}></Toaster>
      </div>
    );
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    const toasterBody = await screen.findByTestId('toaster-body');
    let isElementRemoved: boolean | null = null;
    await waitForElementToBeRemoved(toasterBody, { timeout: 150 })
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

  it('Test Auto Close False', async () => {
    render(
      <div>
        <Toaster show={true} message='Test' delay={100} autoHide={false}></Toaster>
      </div>
    );
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    const toasterBody = await screen.findByTestId('toaster-body');
    let isElementRemoved: boolean | null = null;
    await waitForElementToBeRemoved(toasterBody, { timeout: 150 })
      .then(() => {
        isElementRemoved = true;
        console.log('Element no longer in DOM');
      })
      .catch(() => {
        isElementRemoved = false;
        console.log('Element still there in DOM, after timeout');
      });
    expect(isElementRemoved).toBeFalsy();
  });
});
