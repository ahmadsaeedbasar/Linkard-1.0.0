import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { disabled, buttonText } = useMemo(() => {
    let reason = "";
    if (!username.trim()) reason = "Enter username/email";
    else if (!password) reason = "Enter password";

    return {
      disabled: !!reason,
      buttonText: reason || "Login",
    };
  }, [username, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🔌 Hook backend here
    console.log({ username, password });
    // Assuming login is successful, redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <main className="accounts-main">
      <div className="login-container">
        <h1 className="form-title">Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="input-label">Username or Email</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={disabled} className="login-button">
            {buttonText}
          </button>
        </form>

        <p className="link-text">
          Don&apos;t have an account?{" "}
          <a className="link-anchor" href="/signup/client">
            Sign up as Client
          </a>{" "}
          or{" "}
          <a className="link-anchor" href="/signup/influencer">
            Sign up as Influencer
          </a>
        </p>
      </div>
    </main>
  );
}
