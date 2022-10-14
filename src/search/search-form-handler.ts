import { SearchFormData } from './SearchFormData.js'
import { SearchHandler } from './SearchHandler.js'
import { Place, PlaceProvider } from '../Place.js'

import { renderToast } from '../lib.js'

import { setFavoriteStatus } from '../favorite/favorite-handler.js'
import { renderSearchFormBlock } from '../search-form.js'
import { renderSearchResultsBlock, renderSearchStubBlock } from '../search-results.js'

import {
  FlatRentSdk,
  Flat
} from '../typescript-flatrent-api/flat-rent-sdk.js'

let SearchFormData: SearchFormData;
let SearchedPlaces: Record<string, Place>;
let timerId = 0;

export function getSearchFormData() {
  return SearchFormData
}

export function getSearchedPlace(placeId: string) {
  return SearchedPlaces[placeId]
}

export function reRenderSearchResultsBlock() {
  renderSearchResultsBlock(Object.values(SearchedPlaces))
}

export function addSubmitHandlerForSearchForm() {
  const form = document.querySelector('form');

  if (form === null) {
    return
  }

  form.onsubmit = () => {
    search(
      {
        city: getInputValue(form.querySelector<HTMLInputElement>('#city')),
        coordinates: getInputValue(form.querySelector<HTMLInputElement>('#latlng')),
        checkInDate: convertStringToUnixTSDate(getInputValue(form.querySelector<HTMLInputElement>('#check-in-date'))),
        checkOutDate: convertStringToUnixTSDate(getInputValue(form.querySelector<HTMLInputElement>('#check-out-date'))),
        maxPrice: +getInputValue(form.querySelector<HTMLInputElement>('#max-price')),
        homy: getCheckBoxValue(form.querySelector<HTMLInputElement>('#homy')),
        flatRent: getCheckBoxValue(form.querySelector<HTMLInputElement>('#flatRent'))
      },
      (error, data) => {
        console.log('data: ', data)
        if (error === null && data != null) {
          setFavoriteStatus(data)
          SearchedPlaces = convertArrayToRecord(data)
          renderSearchResultsBlock(data);
          return;
        }

        console.log('error: ', error);
      }
    )

    return false; // prevent reload
  };
}

function convertStringToUnixTSDate(date: string): number {
  return new Date(date).valueOf();
}

function getInputValue(input: HTMLInputElement | null): string {
  if (input === null) {
    return ''
  }

  return input.value
}

function getCheckBoxValue(cb: HTMLInputElement | null): boolean {
  if (cb === null) {
    return false
  }

  return cb.checked
}

async function search(data: SearchFormData, handler?: SearchHandler): Promise<void> {
  const allPlaces: Place[] = []
  
  SearchFormData = data;
  console.log('SearchFormData: ', data);

  if (!handler) {
    return
  }

  if (data.homy) {
    const places = await searchHomyRequest(data)
      .then((data) => data)
      .catch((error) => handler(error))
    if (places) {
      setProvider(PlaceProvider.homy, places)
      allPlaces.push(...places)
    }
  }

  if (data.flatRent) {
    const flats = await searchFlatRentRequest(data)
      .then((flats) => flats)
      .catch((error) => handler(error))
    if (flats) {
      const days = Math.round((data.checkOutDate - data.checkInDate) / (1000 * 3600 * 24))
      const places = convertFlatsToPlaces(flats, days)
      setProvider(PlaceProvider.flatRent, places)
      allPlaces.push(...places)
    }
  }

  handler(null, allPlaces)
}

async function searchHomyRequest(data: SearchFormData): Promise<Place[]> {
  const url = 'http://localhost:3030/places';

  return fetch(url + '?' + new URLSearchParams({
    coordinates: data.coordinates,
    checkInDate: data.checkInDate.toString(),
    checkOutDate: data.checkOutDate.toString(),
    maxPrice: data.maxPrice.toString()
  }))
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return res.json();
    })
}

async function searchFlatRentRequest(data: SearchFormData): Promise<Flat[]> {
  const flatRentSdk = new FlatRentSdk()
  const parameters = {
    city: data.city,
    checkInDate: new Date(data.checkInDate),
    checkOutDate: new Date(data.checkOutDate),
    priceLimit: data.maxPrice
  }

  return flatRentSdk.search(parameters)
}

function convertFlatsToPlaces(flats: Flat[], days: number): Place[] {
  return flats.map<Place>(flat => ({
    id: flat.id,
    image: flat.photos[0],
    name: flat.title,
    description: flat.details,
    remoteness: 0,
    bookedDates: flat.bookedDates,
    price: Math.round(flat.totalPrice / days),
    favorite: false
  }))
}

function setProvider(provider: PlaceProvider, places: Place[]) {
  places.forEach(place => place.provider = provider)
}

function convertArrayToRecord(data: Place[]): Record<string, Place> {
  return data.reduce((obj, item) => ({
    ...obj,
    [item.id]: item
  }), {})
}

export function addChangeHandlerForDateInput() {
  const inputs = [...document.querySelectorAll('[type=date]')]

  inputs.forEach(input => {
    input.addEventListener('change', () => {
      resetTimerOfActualDates()
      timerId = setTimeout(() => { 
        createNeedUpdateDatesNotification('Данные поиска устарели! Необходимо обновить данные')
      }, 5000*60)
    })
  })
}

function resetTimerOfActualDates() {
  if (timerId !== 0) {
    clearTimeout(timerId)
    timerId = 0
  }
}

function createNeedUpdateDatesNotification(text: string) {
  renderToast(
    {text: text, type: 'error'},
    {name: 'ОБНОВИТЬ', handler: () => {
      console.log(text)
      renderSearchFormBlock()
      renderSearchStubBlock()
    }}
  )
}
