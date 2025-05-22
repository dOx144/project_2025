import { useEffect } from "react";
import { useState } from "react";
import {useNavigate} from 'react-router-dom'

const Login = () => {

  const [userData, setUserData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [error, setError] = useState(null)
  const [response, setResponse] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setError(null)
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const validateLogin = (email, password) => {
  email = email.trim();
  password = password.trim();

  if (!email) {
    alert('Please enter your email or username.');
    return false;
  }

  if (!password) {
    alert('Please enter your password.');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.includes('@') && !emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return false;
  }

  return true; // Validation passed
};

const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);

  const email = userData.email || '';
  const password = userData.password || '';

  const isValid = validateLogin(email, password);
  if (!isValid) return;

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.message || 'Login failed');
      return;
    }

    const data = await res.json();
    console.log(data);

    const user = data.user;

    if (user) {
      if (user.role === 'admin') {
        localStorage.setItem('adminData', JSON.stringify(user));
        navigate('/OAH/admin-panel');
      } else {
        const storage = userData.remember ? localStorage : sessionStorage;
        storage.setItem('userData', JSON.stringify(user));
        navigate(-1);
      }
    }

  } catch (err) {
    setError(err.message || 'Something went wrong');
  }
};

useEffect(()=>{
  document.title = 'O.A.H Login'
  localStorage.clear()
  sessionStorage.clear()
},[])


  return (
    <div className="dark:bg-[#1E1E1E] dark:text-white bg-[#e5e5e5a6] min-h-screen min-w-screen flex items-center flex-col p-4 space-y-5 *:transition-all">
      {/* <Header/> */}
      <div className="flex-1 grid place-content-center">
        <div className="bg-[#1e1e1ecf] md:ring-1 text-white max-w-sm  space-y-4 p-3 md:px-5 py-22 md:rounded-xl">
        <div className="text-center">
          <h2 className="text-2xl lg:text-4xl mb-4">Welcome Back!</h2>
          <p>Login to your Online Auction House</p>
        </div>

        <form className=" space-y-2" onSubmit={handleLogin}>
          <input 
          className="focus:outline-none rounded-lg bg-white text-black w-full p-2 ring-1 font-semibold" 
          type="email"
          name="email" 
          placeholder="Email" 
          value={userData.email}
          onChange={handleChange}
          />

          <input 
          className="focus:outline-none rounded-lg bg-white text-black w-full p-2 ring-1 font-semibold"
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
           />

          <div className="flex w-full justify-between">
            <div className="flex gap-1">
              <input
              type="checkbox"
              name="remember"
              checked={userData.remember} 
              onChange={handleChange}
              />
              <label htmlFor="remember">Remember me!</label>
            </div>            
            <a href="#">Forgot Password?</a>
          </div>          

          <button className="w-full cursor-pointer p-3 text-xl bg-white text-black rounded-md active:scale-95 active:ring-1 active:bg-[#1E1E1E] active:text-white" type="submit">Login</button>     
        </form>

        <p>Don't have an account yet? <a className="underline font-semibold" href="/register">SignUp now!</a></p>
      </div>
      </div>
       {error && <p className="text-red-600 mt-4">{error}</p>}
      {response && <pre className="mt-4 text-green-600">{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};

export default Login;
