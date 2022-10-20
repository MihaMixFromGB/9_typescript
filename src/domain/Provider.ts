import { Place } from './Place'
import { SearchForm } from './SearchForm.js'

export interface Provider {
  search(parameters: SearchForm): Promise<Place[]>
  book(id: string, checkInDate: Date, checkOutDate: Date): Promise<string>
}
