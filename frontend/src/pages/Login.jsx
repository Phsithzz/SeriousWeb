import { useState } from "react";
import "./login.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  
  const [login, setLogin] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate()
  
  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/user/login`,{email,password})
      console.log(res.data)
      setLogin(res.data.login)
      setMessage(res.data.message)
      if(res.data.login === true){
        navigate("/")
      }
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
      setLogin(false);
      setMessage(err.response.data.message || "Login failed");
    } else {
      setLogin(false);
      setMessage("Server error");
    }
      
    }
  }
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="close-btn-area">
          <Link to="/home">
            <span className="close-btn">&times;</span>
          </Link>
        </div>

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="email-title">Email</label>
            <input 
            type="email" 
            placeholder="Email"
             className="input-email" 
             onChange={(e)=>setEmail(e.target.value)}
             required
             />
          </div>

          <div className="input-group">
            <label className="password-title">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input-password"
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn hover:bg-black hover:scale-105 transition-all duration-300">
            Login
          </button>
        </form>
        {message && (
  <p className={` font-semibold text-xs ${login ? "text-green-400" : "text-red-500"}`}>
    {login ? "เข้าสู่ระบบสำเร็จ - " : "เข้าสู่ระบบผิดพลาด - "}
    {message}
  </p>
)}
        <p className="signup-link mt-4">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
