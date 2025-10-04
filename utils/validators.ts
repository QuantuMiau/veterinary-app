export const emailValidator = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const passwordValidator = (password: string) => {
  return password.length >= 5;
};

export const nameValidator = (name: string) => {
  return name.length >= 2;
};

export const phoneValidator = (phone: string) => {
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(phone);
};

export const ageValidator = (age: number) => {
  return age > 0 && age < 120;
};

export const petNameValidator = (name: string) => {
  return name.length >= 2;
};

export const petAgeValidator = (age: number) => {
  return age >= 0 && age < 50;
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};
