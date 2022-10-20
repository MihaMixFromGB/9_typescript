import { Place } from '../../domain/Place.js'
import { Provider } from '../../domain/Provider.js'
import { SearchForm } from '../../domain/SearchForm.js'

import { HttpHelper } from '../../utils/HttpHelper.js'

import { Place as HomyPlace } from './response.js'

export class HomyProvider implements Provider {
  static provider = 'homy'
  static apiUrl = 'http://localhost:3030/places'

  public async search(parameters: SearchForm): Promise<Place[]> {
    return HttpHelper.fetchAsJson<HomyPlace[]>(
      HomyProvider.apiUrl + '?' + this.convertSearchFormToQueryString(parameters)
    )
      .then((response) => {
        return this.convertPlaceListResponse(response)
      })
  }

  public async book(id: string, checkInDate: Date, checkOutDate: Date): Promise<string> {
    return HttpHelper.fetchAsJson<HomyPlace>(
      HomyProvider.apiUrl + `/${id}?` + new URLSearchParams({
        checkInDate: checkInDate.valueOf().toString(),
        checkOutDate: checkOutDate.valueOf().toString(),
      }), {
        method: 'PATCH'
      })
      .then(() => {
        return 'You successfully created your booking!'
      })
  }

  private convertSearchFormToQueryString(parameters: SearchForm): string {
    return new URLSearchParams({
      coordinates: parameters.coordinates,
      checkInDate: this.convertStringToUnixTSDate(parameters.checkInDate),
      checkOutDate: this.convertStringToUnixTSDate(parameters.checkOutDate),
      maxPrice: parameters.maxPrice.toString()
    }).toString()
  }

  private convertPlaceListResponse(response: HomyPlace[]): Place[] {
    return response.map(item => this.convertPlaceResponse(item))
  }

  private convertPlaceResponse(item: HomyPlace): Place {
    return new Place(
      HomyProvider.provider,
      String(item.id),
      item.name,
      item.description,
      item.image,
      item.remoteness,
      item.price,
      false
    )
  }

  private convertStringToUnixTSDate(date: string): string {
    return new Date(date).valueOf().toString();
  }
}
