import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', padding: 16
    }}>
      <h1 style={{ fontSize: 48, color: '#dc2626', margin: 0 }}>404</h1>
      <p style={{ fontSize: 18, color: '#334155', marginTop: 8 }}>Page Not Found</p>
      <Link to="/" style={{ marginTop: 16, color: '#2563eb', textDecoration: 'underline' }}>Go back to Home</Link>
    </div>
  );
}
export default NotFound;
