export function generateSecurePassword(length = 20) {
  const charset = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    number: "0123456789",
    special: "!@#$%^&*()_+~`|}{[]:;?><,./-="
  };

  // 1. Ensure at least one of each required type is included
  let password = "";
  password += charset.upper[Math.floor(Math.random() * charset.upper.length)];
  password += charset.lower[Math.floor(Math.random() * charset.lower.length)];
  password += charset.number[Math.floor(Math.random() * charset.number.length)];
  password += charset.special[Math.floor(Math.random() * charset.special.length)];

  // 2. Fill the rest of the length with a mix of everything
  const allChars = Object.values(charset).join("");
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // 3. Shuffle the string so the first 4 characters aren't predictable
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

