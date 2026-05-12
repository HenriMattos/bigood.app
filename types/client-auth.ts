export type ClientAuthUser = {
  id: string
  name: string
  email: string
  phone: string
  barbershopSlug: string
  createdAt: string
}

export type ClientAuthState = {
  user: ClientAuthUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export type ClientLoginInput = {
  identifier: string
  password: string
}

export type ClientRegisterInput = {
  name: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}
