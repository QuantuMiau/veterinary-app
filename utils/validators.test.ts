import {
  checkEmail,
  passwordValidator,
  nameValidator,
  phoneValidator,
  isEmpty,
  loginValidator,
  registerValidator,
  formatPhone,
  emailValidator,
  cardNumberMask,
  expiryDateMask,
  cvvMask,
  isValidCardNumber,
  isValidExpiryDate,
  isValidCVV,
  paymentValidator,
} from "./validators";

describe("Email Validation", () => {
  describe("checkEmail", () => {
    test("debe validar emails correctos", () => {
      expect(checkEmail("usuario@ejemplo.com")).toBe(true);
      expect(checkEmail("nombre.apellido@empresa.mx")).toBe(true);
      expect(checkEmail("test123@dominio.org")).toBe(true);
    });

    test("debe rechazar emails inválidos", () => {
      expect(checkEmail("invalido")).toBe(false);
      expect(checkEmail("@ejemplo.com")).toBe(false);
      expect(checkEmail("usuario@")).toBe(false);
      expect(checkEmail("usuario@dominio")).toBe(false);
      expect(checkEmail("")).toBe(false);
    });
  });

  describe("emailValidator", () => {
    test("debe retornar string vacío para emails válidos", () => {
      expect(emailValidator("usuario@ejemplo.com")).toBe("");
    });

    test("debe retornar mensaje de error para email vacío", () => {
      expect(emailValidator("")).toBe("El email no puede estar vacío");
      expect(emailValidator("   ")).toBe("El email no puede estar vacío");
    });

    test("debe retornar mensaje de error para email inválido", () => {
      expect(emailValidator("invalido")).toBe("El email no es válido");
      expect(emailValidator("@ejemplo.com")).toBe("El email no es válido");
    });
  });
});

describe("Password Validation", () => {
  describe("passwordValidator", () => {
    test("debe aceptar contraseñas con 5 o más caracteres", () => {
      expect(passwordValidator("12345")).toBe(true);
      expect(passwordValidator("password123")).toBe(true);
      expect(passwordValidator("abc12")).toBe(true);
    });

    test("debe rechazar contraseñas con menos de 5 caracteres", () => {
      expect(passwordValidator("1234")).toBe(false);
      expect(passwordValidator("abc")).toBe(false);
      expect(passwordValidator("")).toBe(false);
    });
  });
});

describe("Name Validation", () => {
  describe("nameValidator", () => {
    test("debe validar nombres correctos", () => {
      expect(nameValidator("Juan")).toBe(true);
      expect(nameValidator("María García")).toBe(true);
      expect(nameValidator("José Luis Pérez")).toBe(true);
      expect(nameValidator("Ñoño")).toBe(true);
    });

    test("debe rechazar nombres con menos de 3 caracteres", () => {
      expect(nameValidator("Ab")).toBe(false);
      expect(nameValidator("")).toBe(false);
    });

    test("debe rechazar nombres con caracteres inválidos", () => {
      expect(nameValidator("Juan123")).toBe(false);
      expect(nameValidator("María@García")).toBe(false);
      expect(nameValidator("Test_Name")).toBe(false);
    });

    test("debe rechazar nombres que son solo espacios", () => {
      expect(nameValidator("   ")).toBe(false);
    });
  });
});

describe("Phone Validation", () => {
  describe("phoneValidator", () => {
    test("debe validar teléfonos de 10 dígitos", () => {
      expect(phoneValidator("1234567890")).toBe(true);
      expect(phoneValidator("5551234567")).toBe(true);
    });

    test("debe rechazar teléfonos con longitud incorrecta", () => {
      expect(phoneValidator("123456789")).toBe(false);
      expect(phoneValidator("12345678901")).toBe(false);
      expect(phoneValidator("")).toBe(false);
    });

    test("debe rechazar teléfonos con caracteres no numéricos", () => {
      expect(phoneValidator("555-123-4567")).toBe(false);
      expect(phoneValidator("(555)1234567")).toBe(false);
    });
  });

  describe("formatPhone", () => {
    test("debe eliminar caracteres no numéricos", () => {
      expect(formatPhone("555-123-4567")).toBe("5551234567");
      expect(formatPhone("(555) 123-4567")).toBe("5551234567");
    });

    test("debe limitar a 10 dígitos", () => {
      expect(formatPhone("12345678901234")).toBe("1234567890");
    });

    test("debe retornar string vacío para entrada sin números", () => {
      expect(formatPhone("abc-def-ghij")).toBe("");
    });
  });
});

describe("Utility Functions", () => {
  describe("isEmpty", () => {
    test("debe detectar strings vacíos", () => {
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(true);
    });

    test("debe detectar strings no vacíos", () => {
      expect(isEmpty("texto")).toBe(false);
      expect(isEmpty("  texto  ")).toBe(false);
    });
  });
});

describe("Form Validators", () => {
  describe("loginValidator", () => {
    test("debe retornar string vacío para datos válidos", () => {
      expect(loginValidator("usuario@ejemplo.com", "12345")).toBe("");
    });

    test("debe detectar cuando ambos campos están vacíos", () => {
      expect(loginValidator("", "")).toBe("Ingrese los datos");
      expect(loginValidator("  ", "  ")).toBe("Ingrese los datos");
    });

    test("debe detectar cuando falta el email", () => {
      expect(loginValidator("", "12345")).toBe("Ingrese el correo");
    });

    test("debe detectar cuando falta la contraseña", () => {
      expect(loginValidator("usuario@ejemplo.com", "")).toBe(
        "Ingrese la contraseña"
      );
    });

    test("debe detectar email inválido", () => {
      expect(loginValidator("invalido", "12345")).toBe("Correo invalido");
    });

    test("debe detectar contraseña inválida", () => {
      expect(loginValidator("usuario@ejemplo.com", "123")).toBe(
        "Contraseña invalida"
      );
    });
  });

  describe("registerValidator", () => {
    test("debe retornar string vacío para datos válidos", () => {
      const result = registerValidator(
        "Juan",
        "Pérez",
        "García",
        "juan@ejemplo.com",
        "5551234567",
        "password123"
      );
      expect(result).toBe("");
    });

    test("debe detectar cuando faltan datos", () => {
      const result = registerValidator("", "", "", "", "", "");
      expect(result).toBe("Ingrese todos los datos");
    });

    test("debe validar nombre inválido", () => {
      const result = registerValidator(
        "A",
        "Pérez",
        "García",
        "juan@ejemplo.com",
        "5551234567",
        "password123"
      );
      expect(result).toBe("Nombre debe tener mínimo 2 caracteres");
    });

    test("debe validar email inválido", () => {
      const result = registerValidator(
        "Juan",
        "Pérez",
        "García",
        "invalido",
        "5551234567",
        "password123"
      );
      expect(result).toBe("Correo invalido");
    });

    test("debe validar teléfono inválido", () => {
      const result = registerValidator(
        "Juan",
        "Pérez",
        "García",
        "juan@ejemplo.com",
        "123",
        "password123"
      );
      expect(result).toBe("El teléfono debe tener 10 dígitos");
    });

    test("debe validar contraseña inválida", () => {
      const result = registerValidator(
        "Juan",
        "Pérez",
        "García",
        "juan@ejemplo.com",
        "5551234567",
        "123"
      );
      expect(result).toBe("La contraseña debe tener mínimo 5 caracteres");
    });
  });
});

describe("Payment Validation", () => {
  describe("cardNumberMask", () => {
    test("debe formatear número de tarjeta correctamente", () => {
      expect(cardNumberMask("1234567890123456")).toBe("1234-5678-9012-3456");
    });

    test("debe eliminar caracteres no numéricos", () => {
      expect(cardNumberMask("1234-5678-9012-3456")).toBe("1234-5678-9012-3456");
      expect(cardNumberMask("1234 5678 9012 3456")).toBe("1234-5678-9012-3456");
    });

    test("debe limitar a 19 caracteres (16 dígitos + 3 guiones)", () => {
      expect(cardNumberMask("12345678901234567890")).toBe(
        "1234-5678-9012-3456"
      );
    });
  });

  describe("expiryDateMask", () => {
    test("debe formatear fecha de expiración correctamente", () => {
      expect(expiryDateMask("1225")).toBe("12/25");
    });

    test("debe eliminar caracteres no numéricos", () => {
      expect(expiryDateMask("12/25")).toBe("12/25");
    });

    test("debe limitar a 5 caracteres", () => {
      expect(expiryDateMask("122567")).toBe("12/25");
    });
  });

  describe("cvvMask", () => {
    test("debe eliminar caracteres no numéricos", () => {
      expect(cvvMask("123")).toBe("123");
      expect(cvvMask("abc123")).toBe("123");
    });

    test("debe limitar a 3 dígitos", () => {
      expect(cvvMask("1234")).toBe("123");
    });
  });

  describe("isValidCardNumber", () => {
    test("debe validar números de tarjeta de 16 dígitos", () => {
      expect(isValidCardNumber("1234567890123456")).toBe(true);
      expect(isValidCardNumber("1234-5678-9012-3456")).toBe(true);
    });

    test("debe rechazar números de tarjeta inválidos", () => {
      expect(isValidCardNumber("123456789012345")).toBe(false);
      expect(isValidCardNumber("12345678901234567")).toBe(false);
      expect(isValidCardNumber("")).toBe(false);
    });
  });

  describe("isValidExpiryDate", () => {
    test("debe validar fechas de expiración válidas", () => {
      expect(isValidExpiryDate("12/25")).toBe(true);
      expect(isValidExpiryDate("01/99")).toBe(true);
    });

    test("debe rechazar fechas con mes inválido", () => {
      expect(isValidExpiryDate("13/25")).toBe(false);
      expect(isValidExpiryDate("00/25")).toBe(false);
    });

    test("debe rechazar año cero", () => {
      expect(isValidExpiryDate("12/00")).toBe(false);
    });

    test("debe rechazar formatos incorrectos", () => {
      expect(isValidExpiryDate("1225")).toBe(false);
      expect(isValidExpiryDate("12-25")).toBe(false);
      expect(isValidExpiryDate("")).toBe(false);
    });
  });

  describe("isValidCVV", () => {
    test("debe validar CVV de 3 dígitos", () => {
      expect(isValidCVV("123")).toBe(true);
      expect(isValidCVV("999")).toBe(true);
    });

    test("debe rechazar CVV inválidos", () => {
      expect(isValidCVV("12")).toBe(false);
      expect(isValidCVV("1234")).toBe(false);
      expect(isValidCVV("abc")).toBe(false);
      expect(isValidCVV("")).toBe(false);
    });
  });

  describe("paymentValidator", () => {
    test("debe retornar string vacío para datos de pago válidos", () => {
      const result = paymentValidator(
        "1234567890123456",
        "12/25",
        "123",
        "Juan Pérez",
        "Calle Principal 123"
      );
      expect(result).toBe("");
    });

    test("debe detectar cuando todos los campos están vacíos", () => {
      const result = paymentValidator("", "", "", "", "");
      expect(result).toBe("Ingrese todos los datos");
    });

    test("debe detectar número de tarjeta faltante", () => {
      const result = paymentValidator(
        "",
        "12/25",
        "123",
        "Juan Pérez",
        "Calle Principal 123"
      );
      expect(result).toBe("Ingrese el número de tarjeta");
    });

    test("debe detectar fecha de expiración faltante", () => {
      const result = paymentValidator(
        "1234567890123456",
        "",
        "123",
        "Juan Pérez",
        "Calle Principal 123"
      );
      expect(result).toBe("Ingrese la fecha de expiración");
    });

    test("debe detectar CVV faltante", () => {
      const result = paymentValidator(
        "1234567890123456",
        "12/25",
        "",
        "Juan Pérez",
        "Calle Principal 123"
      );
      expect(result).toBe("Ingrese el número cvv");
    });

    test("debe detectar nombre del titular faltante", () => {
      const result = paymentValidator(
        "1234567890123456",
        "12/25",
        "123",
        "",
        "Calle Principal 123"
      );
      expect(result).toBe("Ingrese el nombre del titular");
    });

    test("debe detectar dirección faltante", () => {
      const result = paymentValidator(
        "1234567890123456",
        "12/25",
        "123",
        "Juan Pérez",
        ""
      );
      expect(result).toBe("Ingrese la dirección de la tarjeta");
    });

    test("debe validar número de tarjeta inválido", () => {
      const result = paymentValidator(
        "123456",
        "12/25",
        "123",
        "Juan Pérez",
        "Calle Principal 123"
      );
      expect(result).toBe("Numero de tarjeta invalido");
    });

    test("debe validar fecha inválida", () => {
      const result = paymentValidator(
        "1234567890123456",
        "13/25",
        "123",
        "Juan Pérez",
        "Calle Principal 123"
      );
      expect(result).toBe("Fecha inválida");
    });

    test("debe validar CVV inválido", () => {
      const result = paymentValidator(
        "1234567890123456",
        "12/25",
        "12",
        "Juan Pérez",
        "Calle Principal 123"
      );
      expect(result).toBe("Número CVV  inválido");
    });

    test("debe validar nombre inválido", () => {
      const result = paymentValidator(
        "1234567890123456",
        "12/25",
        "123",
        "AB",
        "Calle Principal 123"
      );
      expect(result).toBe("Nombre inválido");
    });
  });
});
