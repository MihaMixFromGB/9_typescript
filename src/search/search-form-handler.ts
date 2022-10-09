import { SearchFormData } from './SearchFormData.js';
import { SearchHandler } from './SearchHandler.js'
import { Place } from '../Place.js';

import { renderToast } from '../lib.js'

import { setFavoriteStatus } from '../favorite/favorite-handler.js';
import { renderSearchFormBlock } from '../search-form.js'
import { renderSearchResultsBlock, renderSearchStubBlock } from '../search-results.js';

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
        coordinates: getInputValue(form.querySelector<HTMLInputElement>('#latlng')),
        checkInDate: convertStringToUnixTSDate(getInputValue(form.querySelector<HTMLInputElement>('#check-in-date'))),
        checkOutDate: convertStringToUnixTSDate(getInputValue(form.querySelector<HTMLInputElement>('#check-out-date'))),
        maxPrice: +getInputValue(form.querySelector<HTMLInputElement>('#max-price'))
      },
      (error, data) => {
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

  return input.value;
}

function search(data: SearchFormData, handler?: SearchHandler): void {
  SearchFormData = data;
  console.log('SearchFormData: ', data);

  if (handler != null) {
    searchRequest(data)
      .then((data) => handler(null, data))
      .catch((error) => handler(error))
  }
}

async function searchRequest(data: SearchFormData): Promise<Place[]> {
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
