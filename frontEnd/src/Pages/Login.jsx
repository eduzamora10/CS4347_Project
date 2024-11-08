import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [isStaff, setIsStaff] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Store user type in localStorage
    localStorage.setItem('userType', isStaff ? 'staff' : 'student');
    // Redirect to home page
    navigate('/Home');
  };

  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5">
      <div className="row align-items-center g-lg-5 py-5">
        <div className="col-md-10 mx-auto col-lg-5">
          <form
            className="login-form p-4 p-md-5 border rounded-3 bg-body-tertiary"
            id="loginForm"
            onSubmit={handleSubmit}
          >
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="ID"
                required
              />
              <label htmlFor="floatingInput">ID</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                required
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="userTypeToggle"
                checked={isStaff}
                onChange={() => setIsStaff(!isStaff)}
              />
              <label className="form-check-label" htmlFor="userTypeToggle">
                Check if you are a staff member!
              </label>
            </div>

            <button className="w-100 btn btn-lg" type="submit">
              Sign in
            </button>
            <hr className="my-4" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
