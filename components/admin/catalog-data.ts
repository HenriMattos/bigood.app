import {
  database,
  type ServiceCatalogItem,
  type ServiceStatus,
} from "./database"

export type { ServiceCatalogItem, ServiceStatus }

export const serviceCatalog: ServiceCatalogItem[] = database.services

export const planCatalog = database.plans.map((plan) => ({
  name: plan.name,
  value: plan.price,
}))

export const paymentMethodOptions = database.paymentMethods.map(
  (method) => method.name
)

export const serviceNames = serviceCatalog.map((service) => service.name)
export const planNames = planCatalog.map((plan) => plan.name)
