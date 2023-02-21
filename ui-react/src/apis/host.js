export default function getHost() {
  const host = process.env.REACT_APP_API_HOST;
  if (host) {
    return host;
  }
  throw new Error('No API Host Found');
}
