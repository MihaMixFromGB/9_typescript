import { SearchForm } from '../domain/SearchForm.js'
import { SearchHandler } from '../domain/SearchHandler.js'
import { Place } from '../domain/Place.js'

import { HomyProvider } from '../providers/homy/HomyProvider.js'
import { FlatRentProvider } from '../providers/flatRent/FlatRentProvider.js'

import { renderSearchResultsBlock, renderSearchStubBlock } from '../search-results.js'
import { renderToast } from '../lib.js'
import { renderSearchFormBlock } from '../search-form.js'

import { setFavoriteStatus } from '../handlers/favorites-handler.js'

const RESULTS_FILTER_DEFAULT = 'lessPrice'

let SearchFormData: SearchForm
let SearchedPlaces: Place[]
let timerId = 0
let resultsFilter = ''

export function getSearchFormData() {
  return SearchFormData
}

export function getSearchedPlace(placeId: string) {
  return SearchedPlaces.find(item => item.id === placeId)
}

export function renderSearchResults() {
  renderSearchResultsBlock(SearchedPlaces, resultsFilter)
}

export function sortSearchResults(criteria: string) {
  resultsFilter = criteria || RESULTS_FILTER_DEFAULT
  
  if (resultsFilter === 'lessPrice') {
    SearchedPlaces.sort((a, b) => a.price - b.price)
  } else if (resultsFilter === 'morePrice') {
    SearchedPlaces.sort((a, b) => b.price - a.price)
  } else if (resultsFilter === 'lessRemoteness') {
    SearchedPlaces.sort((a, b) => a.remoteness - b.remoteness)
  } else {
    resultsFilter = RESULTS_FILTER_DEFAULT
    return
  }
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
        checkInDate: getInputValue(form.querySelector<HTMLInputElement>('#check-in-date')),
        checkOutDate: getInputValue(form.querySelector<HTMLInputElement>('#check-out-date')),
        maxPrice: +getInputValue(form.querySelector<HTMLInputElement>('#max-price')),
        homy: getCheckBoxValue(form.querySelector<HTMLInputElement>('#homy')),
        flatRent: getCheckBoxValue(form.querySelector<HTMLInputElement>('#flatRent'))
      },
      (error, data) => {
        if (error === null && data != null) {
          setFavoriteStatus(data)
          SearchedPlaces = data
          sortSearchResults(RESULTS_FILTER_DEFAULT)
          renderSearchResults()
          return
        }

        console.log('error: ', error)
      }
    )

    return false; // prevent reload
  };
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

async function search(parameters: SearchForm, handler?: SearchHandler): Promise<void> {
  SearchFormData = parameters
  console.log('SearchFormData: ', parameters)

  if (!handler) {
    return
  }

  const providers = getProvidersForSearch(parameters)
  Promise.all(providers)
    .then(results => {
      const allPlaces: Place[] = []
      results.forEach(result => allPlaces.push(...result))
      handler(null, allPlaces)
    })
    .catch(error => handler(error))
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

function getProvidersForSearch(parameters: SearchForm): Promise<Place[]>[] {
  const providers = []

  if (parameters.homy) {
    const provider = new HomyProvider()
    providers.push(provider.search(parameters))
  }
  if (parameters.flatRent) {
    const provider = new FlatRentProvider()
    providers.push(provider.search(parameters))
  }

  return providers
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
      renderSearchFormBlock()
      renderSearchStubBlock()
    }}
  )
}
