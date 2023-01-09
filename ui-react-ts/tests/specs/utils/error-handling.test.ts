import { getErrorText } from '../../../src/utils/error-handling';

describe('error-handling', () => {
  it('getErrorText - err.response.data', () => {
    const err = {
      response: {
        data: 'No record found.'
      }
    };
    expect(getErrorText(err)).toEqual('No record found.');
  });

  it('getErrorText - err.response.data.message', () => {
    const err = {
      response: {
        data: {
          message: 'No record found.'
        }
      }
    };
    expect(getErrorText(err)).toEqual('No record found.');
  });

  it('getErrorText - err.response.data not a string', () => {
    const err = {
      response: {
        data: {}
      }
    };
    expect(getErrorText(err)).toEqual('An error occurred, no details available.');
  });

  it('getErrorText - fallback - err is a plain string', () => {
    const err = 'test';
    expect(getErrorText(err)).toEqual('test');
  });
});
