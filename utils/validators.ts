export const checkEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const passwordValidator = (password: string) => {
  return password.length >= 5;
};

export const nameValidator = (name: string): boolean => {
  const hasMinimumLength = name.trim().length >= 3;
  const isValidCharacters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name);
  return hasMinimumLength && isValidCharacters;
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

  if (!checkEmail(email)) {
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

  return "";
};

// mascaras para pago
export const cardNumberMask = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{4})(?=\d)/g, "$1-")
    .slice(0, 19);
};
export const expiryDateMask = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(?=\d)/g, "$1/")
    .slice(0, 5);
};
export const cvvMask = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 3);
};

//validaciones de pago
export const isValidCardNumber = (value: string): boolean => {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.length === 16;
};
export const isValidExpiryDate = (value: string): boolean => {
  const regex = /^(\d{2})\/(\d{2})$/;
  const match = value.match(regex);

  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);

  const isMonthValid = month >= 1 && month <= 12;
  const isYearValid = year !== 0;

  return isMonthValid && isYearValid;
};
export const isValidCVV = (value: string): boolean => {
  const digitsOnly = value.replace(/\D/g, "");
  return /^\d{3}$/.test(digitsOnly);
};

export const paymentValidator = (
  cardNumber: string,
  expiryDate: string,
  cvv: string,
  fullName: string,
  address: string
): string => {
  if (
    isEmpty(cardNumber) &&
    isEmpty(expiryDate) &&
    isEmpty(cvv) &&
    isEmpty(fullName) &&
    isEmpty(address)
  ) {
    return "Ingrese todos los datos";
  }

  if (isEmpty(cardNumber)) {
    return "Ingrese el número de tarjeta";
  }
  if (isEmpty(expiryDate)) {
    return "Ingrese la fecha de expiración";
  }
  if (isEmpty(cvv)) {
    return "Ingrese el número cvv";
  }
  if (isEmpty(fullName)) {
    return "Ingrese el nombre del titular";
  }
  if (isEmpty(address)) {
    return "Ingrese la dirección de la tarjeta";
  }
  if (!isValidCardNumber(cardNumber)) {
    return "Numero de tarjeta invalido";
  }
  if (!isValidExpiryDate(expiryDate)) {
    return "Fecha inválida";
  }
  if (!isValidCVV(cvv)) {
    return "Número CVV  inválido";
  }
  if (!nameValidator(fullName)) {
    return "Nombre inválido";
  }

  return "";
};
