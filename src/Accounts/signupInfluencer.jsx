import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";
import useUsernameCheck from "./useUsernameCheck";
import usePasswordStrength from "./usePasswordStrength";

export default function SignupInfluencer() {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    displayName: "",
    bio: "",
    email: "",
    contactEmail: "",
    phone: "",
    address: "",
    bookingUrl: "",
    password: "",
    password2: "",
    image: null,
  });

  const { availability, availabilityClass, usernameChecked, usernameAvailable } =
    useUsernameCheck(form.username, 5);
  const { pwHint, pwHintClass } = usePasswordStrength(form.password);

  const displayNameDirty = useRef(false);
  const contactEmailDirty = useRef(false);

  // Autofill helpers
  useEffect(() => {
    if (!displayNameDirty.current) {
      setForm((f) => ({
        ...f,
        displayName: `${f.firstName} ${f.lastName}`.trim(),
      }));
    }
  }, [form.firstName, form.lastName]);

  useEffect(() => {
    if (!contactEmailDirty.current) {
      setForm((f) => ({ ...f, contactEmail: f.email }));
    }
  }, [form.email]);

  // Button validation
  const { disabled, btnText } = useMemo(() => {
    let reason = "";
    if (!form.username) reason = "Enter username";
    else if (!usernameChecked) reason = "Checking username...";
    else if (!usernameAvailable) reason = "Choose another username";
    else if (!form.firstName) reason = "Enter first name";
    else if (!form.email.includes("@")) reason = "Enter valid email";
    else if (!form.contactEmail.includes("@"))
      reason = "Enter valid contact email";
    else if (!form.displayName) reason = "Enter display name";
    else if (!form.password) reason = "Enter password";
    else if (form.password.length < 8) reason = "Password too short";
    else if (!form.password2) reason = "Confirm password";
    else if (form.password !== form.password2)
      reason = "Passwords don’t match";

    return {
      disabled: !!reason,
      btnText: reason || "Create Influencer Account",
    };
  }, [form, usernameChecked, usernameAvailable]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "displayName") displayNameDirty.current = true;
    if (name === "contactEmail") contactEmailDirty.current = true;

    setForm((f) => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    console.log(form);
  };

  return (
    <div className="signup-container">
      <h1 className="form-title">Create Your Influencer Profile</h1>

      <form onSubmit={handleSubmit} className="signup-form">
        {/* Username */}
        <div>
          <label className="input-label">Username *</label>
          <div className="relative">
            <input
              name="username"
              className="username-input"
              onChange={handleChange}
            />
            <span className={`availability-span ${availabilityClass}`}>
              {availability}
            </span>
          </div>
        </div>

        {/* Names */}
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

        {/* Display name */}
        <input
          name="displayName"
          placeholder="Display name *"
          className="input-field"
          onChange={handleChange}
        />

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
            placeholder="Contact email *"
            className="input-field"
            onChange={handleChange}
          />
        </div>

        {/* Extras */}
        <input
          name="phone"
          placeholder="Phone"
          className="input-field"
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          className="input-field"
          onChange={handleChange}
        />
        <input
          name="bookingUrl"
          placeholder="Booking URL"
          className="input-field"
          onChange={handleChange}
        />

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          name="image"
          className="input-field"
          onChange={handleChange}
        />

        {/* Passwords */}
        <div className="grid-two">
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password *"
              className="input-field"
              onChange={handleChange}
            />
            <p className={`password-hint ${pwHintClass}`}>{pwHint}</p>
          </div>
          <input
            type="password"
            name="password2"
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
