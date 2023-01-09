// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorText(err: any) {
  if (err.response) {
    if (err.response.data) {
      if (err.response.data.message) {
        return err.response.data.message;
      } else if (typeof err.response.data === 'string') {
        return err.response.data;
      } else {
        return 'An error occurred, no details available.';
      }
    }
  }

  return err.toString();
}
