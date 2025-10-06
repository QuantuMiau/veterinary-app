export const checkEmail = (email: string) => {
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

export const isEmpty = (value: string): boolean => {
  value = value.trim();
  if (value == "" || value.length <= 0 || value == null) {
    return true;
  } else {
    return false;
  }
};

export const loginValidator = (email: string, password: string): string => {
  if (isEmpty(email) && isEmpty(password)) {
    return "Ingrese los datos";
  }

  if (isEmpty(email)) {
    return "Ingrese el correo";
  }
  if (isEmpty(password)) {
    return "Ingrese la contraseña";
  }

  if (!emailValidator(email)) {
    return "Correo invalido";
  }
  if (!passwordValidator(password)) {
    return "Contraseña invalida";
  }
  return "";
};

export const registerValidator = (
  name: string,
  lastName: string,
  motherLastName: string,
  email: string,
  phone: string,
  password: string
): string => {
  if (
    isEmpty(name) ||
    isEmpty(lastName) ||
    isEmpty(motherLastName) ||
    isEmpty(email) ||
    isEmpty(phone) ||
    isEmpty(password)
  ) {
    return "Ingrese todos los datos";
  }
  if (!nameValidator(name)) {
    return "Nombre debe tener mínimo 2 caracteres";
  }
  if (!checkEmail(email)) {
    return `Correo invalido`;
  }
  if (!phoneValidator(phone)) {
    return "El teléfono debe tener 10 dígitos";
  }
  if (!passwordValidator(password)) {
    return "La contraseña debe tener mínimo 5 caracteres";
  }

  return "";
};

export const formatPhone = (text: string): string => {
  const numeric = text.replace(/[^0-9]/g, "");
  return numeric.slice(0, 10);
};

export const emailValidator = (email: string): string => {
  if (!email || email.trim() === "") {
    return "El email no puede estar vacío";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "El email no es válido";
  }

  return ""; // todo correcto
};
