export type ValidationErrors = Partial<Record<string, string>>

export function validateRegister(input: {
  name: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!input.name.trim()) {
    errors.name = "Nome é obrigatório"
  }

  if (!input.phone.trim()) {
    errors.phone = "WhatsApp é obrigatório"
  }

  if (!input.email.trim()) {
    errors.email = "E-mail é obrigatório"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = "E-mail inválido"
  }

  if (!input.password) {
    errors.password = "Senha é obrigatória"
  } else if (input.password.length < 6) {
    errors.password = "Senha deve ter pelo menos 6 caracteres"
  }

  if (!input.confirmPassword) {
    errors.confirmPassword = "Confirme sua senha"
  } else if (input.password !== input.confirmPassword) {
    errors.confirmPassword = "Senhas não conferem"
  }

  return errors
}

export function validateLogin(input: {
  identifier: string
  password: string
}): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!input.identifier.trim()) {
    errors.identifier = "Informe WhatsApp ou e-mail"
  }

  if (!input.password) {
    errors.password = "Senha é obrigatória"
  }

  return errors
}
