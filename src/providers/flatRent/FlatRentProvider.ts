import { Place } from '../../domain/Place.js'
import { Provider } from '../../domain/Provider.js'
import { SearchForm } from '../../domain/SearchForm.js'

import {
  FlatRentSdk,
  SearchParameters,
  Flat
} from '../../typescript-flatrent-api/flat-rent-sdk.js'

export class FlatRentProvider implements Provider {
  public static provider = 'flatRent'
  private readonly sdk: FlatRentSdk

  constructor() {
    this.sdk = new FlatRentSdk()
  }

  public async search(parameters: SearchForm): Promise<Place[]> {
    return this.sdk.search(this.convertSearchForm(parameters))
      .then((flats) => {
        const days = this.getDaysCount(
          new Date(parameters.checkInDate),   // <-- !!! непонятно будет ли работать замыкание на parameters
          new Date(parameters.checkOutDate))
        // alert(`getDaysCount: ${days}`);  // <-- !!! непонятно будет ли работать замыкание на parameters
        return this.convertFlatList(flats, days)
      })
  }

  public async book(id: string, checkInDate: Date, checkOutDate: Date): Promise<string> {
    return this.sdk.book(id, checkInDate, checkOutDate)
      .then(() => 'You successfully created your booking!')
  }

  private convertSearchForm(parameters: SearchForm): SearchParameters {
    return {
      city: parameters.city,
      checkInDate: new Date(parameters.checkInDate),
      checkOutDate: new Date(parameters.checkOutDate),
      priceLimit: parameters.maxPrice
    }
  }

  private convertFlatList(flats: Flat[], days: number): Place[] {
    return flats.map<Place>(flat => new Place(
      FlatRentProvider.provider,
      flat.id,
      flat.title,
      flat.details,
      flat.photos[0],
      0,
      Math.round(flat.totalPrice / days),
      false
    ))
  }

  private getDaysCount(checkInDate: Date, checkOutDate: Date) {
    return Math.round((checkOutDate.valueOf() - checkInDate.valueOf()) / (1000 * 3600 * 24))
  }
}
