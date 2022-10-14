export interface Flat {
  id: string,
  title: string,
  details: string,
  photos: string[],
  coordinates: number[],
  bookedDates: number[],
  totalPrice: number
}

export function cloneDate(date: Date): Date
export function addDays(date: Date, days: number): Date
export const backendPort: number
export const localStorageKey: string

export interface SearchParameters {
  city: string
  checkInDate: Date
  checkOutDate: Date
  priceLimit: number
}
export class FlatRentSdk {
  constructor()

  get(id: string): Promise<Flat | null>
  search(parameters: SearchParameters): Promise<Flat[]>
  book(
    flatId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<number>
}
