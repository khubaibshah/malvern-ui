export interface GetAllCarsResponse {
  cars: Car[];
}
export interface Car {
  id: number
  make: string
  model: string
  year: string
  description: string
  registration: string
  registration_date: string
  variant: string
  price: string
  featured: number
  plus_vat: number
  vat_qualifying: number
  mileage: number
  fuel_type: string
  colour: string
  body_style: string
  doors: number
  gearbox: string
  keys: string
  engine_size: string
  veh_type: string
  vehicle_status?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
  images: string[]
}
