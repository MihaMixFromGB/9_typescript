import { Place } from '../Place.js'

import { getSearchFormData } from '../search/search-form-handler.js'
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
  
  bookRequest(placeId, checkInDate.toString(), checkOutDate.toString())
    .then(place => {
      const textMessage = `${place.name} успешно забронировано!`
      createNotification(textMessage, 'success')
    })
    .catch(e => {
      const textMessage = `${e.message}`
      createNotification(textMessage, 'error')
    })
}

async function bookRequest(placeId: string, checkInDate: string, checkOutDate: string): Promise<Place> {
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

function createNotification(text: string, type: 'success' | 'error') {
  renderToast(
    {text: text, type},
    {name: 'ОК', handler: () => {console.log(text)}}
  )
}
