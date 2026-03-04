import { useMemo, useState } from "react";
import "./styles.css";
import useUsernameCheck from "./useUsernameCheck";
import usePasswordStrength from "./usePasswordStrength";

export default function SignupClient() {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    bio: "",
    email: "",
    contactEmail: "",
    password: "",
    password2: "",
    image: null,
  });

  const { availability, availabilityClass, usernameChecked, usernameAvailable } =
    useUsernameCheck(form.username, 3);
  const { pwHint, pwHintClass } = usePasswordStrength(form.password);

  const { disabled, btnText } = useMemo(() => {
    let reason = "";
    if (!form.username) reason = "Enter username";
    else if (!usernameChecked) reason = "Checking username...";
    else if (!usernameAvailable) reason = "Choose another username";
    else if (!form.firstName) reason = "Enter first name";
    else if (!form.email) reason = "Enter email";
    else if (!form.email.includes("@")) reason = "Enter valid email";
    else if (!form.password) reason = "Enter password";
    else if (form.password.length < 8) reason = "Password too short";
    else if (!form.password2) reason = "Confirm password";
    else if (form.password !== form.password2)
      reason = "Passwords don’t match";

    return {
      disabled: !!reason,
      btnText: reason || "Create Client Account",
    };
  }, [form, usernameChecked, usernameAvailable]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: files ? files[0] : value,
      contactEmail:
        name === "email" && !f.contactEmail ? value : f.contactEmail,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    console.log(form);
  };

  return (
    <div className="signup-container">
      <h1 className="form-title">Create Your Client Account</h1>

      <form onSubmit={handleSubmit} className="signup-form">
        {/* Username */}
        <div>
          <label className="input-label">Username *</label>
          <div className="relative">
            <input
              name="username"
              className="username-input"
              onChange={handleChange}
              required
            />
            <span className={`availability-span ${availabilityClass}`}>
              {availability}
            </span>
          </div>
        </div>

        {/* Name */}
        <div className="grid-two">
          <input
            name="firstName"
            placeholder="First name *"
            className="input-field"
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Last name"
            className="input-field"
            onChange={handleChange}
          />
        </div>

        {/* Bio */}
        <textarea
          name="bio"
          rows={1}
          placeholder="Write a short bio about yourself…"
          className="input-field resize-none"
          onChange={handleChange}
        />

        {/* Email */}
        <div className="grid-two">
          <input
            name="email"
            type="email"
            placeholder="Email *"
            className="input-field"
            onChange={handleChange}
          />
          <input
            name="contactEmail"
            placeholder="Contact email"
            className="input-field"
            onChange={handleChange}
          />
        </div>

        {/* Image */}
        <input
          name="image"
          type="file"
          accept="image/*"
          className="input-field"
          onChange={handleChange}
        />

        {/* Password */}
        <div className="grid-two">
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password *"
              className="input-field"
              onChange={handleChange}
            />
            <p className={`password-hint ${pwHintClass}`}>{pwHint}</p>
          </div>
          <input
            name="password2"
            type="password"
            placeholder="Confirm password *"
            className="input-field"
            onChange={handleChange}
          />
        </div>

        <button disabled={disabled} className="submit-button">
          {btnText}
        </button>
      </form>
    </div>
  );
}
