export type Company = {
  corporateName: string
  tradeName: string
  cnpj: string
  email: string
  timezone: string
  phone: string
  slug: string
  primaryColor: { r: number; g: number; b: number }
  logoUrl: string
  logoAlt: string
  iconUrl: string
  chairs: string[]
  professionalRoles: string[]
  serviceCategories: string[]
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zip: string
    mapsUrl: string
  }
  social: {
    instagram: string
    whatsapp: string
    facebook: string
  }
}
