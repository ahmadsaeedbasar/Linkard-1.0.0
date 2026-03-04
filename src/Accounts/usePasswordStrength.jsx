import { useMemo } from "react";

export default function usePasswordStrength(password) {
  const { pwHint, pwHintClass } = useMemo(() => {
    const v = password;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[a-z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    const levels = [
      "Very weak",
      "Weak",
      "Okay",
      "Good",
      "Strong",
      "Very strong",
    ];
    const colors = [
      "text-red-600",
      "text-orange-600",
      "text-yellow-600",
      "text-blue-600",
      "text-indigo-600",
      "text-emerald-600",
    ];

    if (!v) {
      return {
        pwHint: "8+ characters with letters, numbers, and symbols",
        pwHintClass: "text-gray-500",
      };
    } else {
      return {
        pwHint: `Strength: ${levels[Math.min(score, 5)]}`,
        pwHintClass: colors[Math.min(score, 5)],
      };
    }
  }, [password]);

  return { pwHint, pwHintClass };
}