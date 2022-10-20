import { Place } from '../domain/Place.js'
import { Provider } from '../domain/Provider.js'
import { HomyProvider } from '../providers/homy/HomyProvider.js'
import { FlatRentProvider } from '../providers/flatRent/FlatRentProvider.js'

import { getSearchFormData, getSearchedPlace } from '../handlers/search-form-handler.js'

import { renderToast } from '../lib.js'

export function addClickHandlerForBookBtn() {
  const buttons = [...document.querySelectorAll<HTMLElement>('[data-book-id]')]
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const placeId = btn.dataset['bookId']
      if (!placeId) {
        return
      }

      book(placeId)
    })
  })
}

function book(placeId: string) {
  const { checkInDate, checkOutDate } = getSearchFormData();
  const place = getSearchedPlace(placeId);
  
  if (place == null) {
    createNotification('PlaceId is not corrected!', 'error')
    return null
  }
  
  const provider = getProvider(place)

  if (provider === null) {
    return
  }

  provider.book(place.originalId, new Date(checkInDate), new Date(checkOutDate))
    .then(result => createNotification(result, 'success'))
    .catch(error => createNotification(error.message, 'error'))
}

function getProvider(place: Place): Provider | null {
  if (place.isProvidedBy(HomyProvider.provider)) {
    return new HomyProvider()
  } else if (place.isProvidedBy(FlatRentProvider.provider)) {
    return new FlatRentProvider()
  }

  createNotification('Provider is not found!', 'error')
  return null
}

function createNotification(text: string, type: 'success' | 'error') {
  renderToast(
    {text: text, type},
    {name: 'ОК', handler: () => {console.log(text)}}
  )
}
