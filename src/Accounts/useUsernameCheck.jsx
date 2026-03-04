import { useEffect, useRef, useState } from "react";

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const USERNAME_MAX = 30;

export default function useUsernameCheck(username, minLength) {
  const [availability, setAvailability] = useState("");
  const [availabilityClass, setAvailabilityClass] = useState("text-gray-600");
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const debounceRef = useRef(null);

  const checkUsername = async (u) => {
    setAvailability("Checking…");
    setAvailabilityClass("text-gray-600");
    setUsernameChecked(false);
    setUsernameAvailable(false);

    if (!u) return;

    if (u.length < minLength) {
      setAvailability(`✗ Too short (min ${minLength})`);
      setAvailabilityClass("font-medium text-red-600");
      setUsernameChecked(true);
      return;
    }

    if (u.length > USERNAME_MAX) {
      setAvailability(`✗ Too long (max ${USERNAME_MAX})`);
      setAvailabilityClass("font-medium text-red-600");
      setUsernameChecked(true);
      return;
    }

    if (!USERNAME_REGEX.test(u)) {
      setAvailability("✗ Invalid (letters, numbers, _ only)");
      setAvailabilityClass("font-medium text-red-600");
      setUsernameChecked(true);
      return;
    }

    try {
      const res = await fetch(
        `/accounts/check-username/?username=${encodeURIComponent(u)}`
      );
      const data = await res.json();
      setUsernameAvailable(!!data.available);
      setUsernameChecked(true);

      if (data.available) {
        setAvailability("✓ Available");
        setAvailabilityClass("font-medium text-emerald-600");
      } else {
        setAvailability("✗ Taken");
        setAvailabilityClass("font-medium text-red-600");
      }
    } catch {
      setAvailability("Error");
      setAvailabilityClass("font-medium text-red-600");
      setUsernameChecked(true);
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!username) {
      setAvailability("");
      return;
    }
    debounceRef.current = setTimeout(
      () => checkUsername(username.trim()),
      350
    );
  }, [username]);

  return { availability, availabilityClass, usernameChecked, usernameAvailable };
}