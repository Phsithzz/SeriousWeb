import './login.css';
import { Link } from 'react-router-dom';
function Login() {
  return (
    <div className="login-container">
      <div className="login-box">

        <div className="close-btn-area">
            <Link to="/">
          <span className="close-btn">&times;</span>
            
            </Link>
        </div>

        <h2>Login</h2>

        <form>
          <div className="input-group">
            <label className="email-title">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="input-email"
            />
          </div>

          <div className="input-group">
            <label className="password-title">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input-password"
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;