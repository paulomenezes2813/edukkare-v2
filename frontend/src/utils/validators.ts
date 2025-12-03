// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de senha (mínimo 6 caracteres)
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Validação de código de atividade (formato: E101CG01)
export const isValidActivityCode = (code: string): boolean => {
  const codeRegex = /^E\d{3}[A-Z]{2}\d{2}$/;
  return codeRegex.test(code);
};

// Validação de código de rubrica (formato: RUB-E101CG01-001)
export const isValidRubricCode = (code: string): boolean => {
  const codeRegex = /^RUB-[A-Z0-9]+-\d{3}$/;
  return codeRegex.test(code);
};

// Validação de nota (0 a 10)
export const isValidGrade = (grade: number): boolean => {
  return grade >= 0 && grade <= 10;
};

// Validação de telefone brasileiro
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}[-.\s]?\d{4})$/;
  return phoneRegex.test(phone);
};

