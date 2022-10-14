import { Place, PlaceProvider } from '../Place.js'

import { getSearchFormData, getSearchedPlace } from '../search/search-form-handler.js'
import { renderToast } from '../lib.js'

import { FlatRentSdk } from '../typescript-flatrent-api/flat-rent-sdk.js'

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
  const { provider } = getSearchedPlace(placeId);
  
  if (provider == null) {
    return
  }

  if (provider === PlaceProvider.homy) {
    bookHomyRequest(placeId, checkInDate.toString(), checkOutDate.toString())
      .then(place => {
        const textMessage = `${place.name} успешно забронировано!`
        createNotification(textMessage, 'success')
      })
      .catch(e => {
        createNotification(e.message, 'error')
      })
  }
  
  if (provider === PlaceProvider.flatRent) {
    bookFlatRentRequest(placeId, new Date(checkInDate), new Date(checkOutDate))
      .then(() => {
        const textMessage = 'Бронирование успешно завершено!'
        createNotification(textMessage, 'success')
      })
      .catch(e => {
        createNotification(e.message, 'error')
      })
  }
}

async function bookHomyRequest(placeId: string, checkInDate: string, checkOutDate: string): Promise<Place> {
  const url = 'http://localhost:3030/places/' + placeId
  
  return fetch(url + '?' + new URLSearchParams({
    checkInDate,
    checkOutDate
  }), {
    method: 'PATCH'
  })
    .then(res => {
      if (res.status === 400) {
        throw new Error('На указанные даты мест нет. Выберите другие даты')
      }
      else if (!res.ok) {
        throw new Error(res.statusText)
      }

      return res.json()
    })
}

async function bookFlatRentRequest(flatId: string, checkInDate: Date, checkOutDate: Date): Promise<number> {
  const flatRentSdk = new FlatRentSdk()

  return flatRentSdk.book(flatId, checkInDate, checkOutDate)
}


function createNotification(text: string, type: 'success' | 'error') {
  renderToast(
    {text: text, type},
    {name: 'ОК', handler: () => {console.log(text)}}
  )
}
