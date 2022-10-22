import { Place } from '../domain/Place.js'
import { FavoritePlace } from '../domain/FavoritePlace.js'

import {
  getSearchedPlace, 
  renderSearchResults
} from './search-form-handler.js'
import { getUserData } from '../lib.js'
import { renderUserBlock } from '../user.js'

const LSTORAGE_FAVORITES = 'favorites'

export function addClickHandlerForFavoriteIcon() {
  const favoriteIcons = [...document.querySelectorAll<HTMLElement>('[data-favorite-id]')]
  
  favoriteIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const placeId = icon.dataset['favoriteId']
      if (!placeId) {
        return
      }

      const place = getSearchedPlace(placeId)
      if (place == null) {
        return
      }
      toggleFavoriteItem(place)
      place.favorite = !place.favorite

      setFavoritesAmount();
      renderSearchResults();
    })
  })
}

export function setFavoriteStatus(places: Place[]) {
  const favorites = getFavoriteItems()

  places.forEach(place => {
    place.favorite = favorites.some(favorite => favorite.id === place.id)
  })
}

export function getFavoritesAmount(): number {
  const favorites = getFavoriteItems()
  return favorites.length
}

function setFavoritesAmount() {
  const { username, avatarUrl } = getUserData(localStorage.getItem('user'))
  const favoritesAmount = getFavoritesAmount();
  
  renderUserBlock(username, avatarUrl, favoritesAmount)
}

function toggleFavoriteItem(place: Place) {
  let favorites = getFavoriteItems()
  const existFavorite = favorites.filter(item => item.id === place.id)

  if (!existFavorite.length) {
    favorites.push({
      id: place.id,
      name: place.name,
      image: place.image
    })
  } else {
    favorites = favorites.filter(item => item.id !== existFavorite[0]?.id)
  }
  
  setFavoriteItems(favorites)
}

function getFavoriteItems(): FavoritePlace[] {
  const jsonStr = localStorage.getItem(LSTORAGE_FAVORITES)
  const favoriteItems = []
  let brokenJSON = false

  if (typeof jsonStr !== 'string') {
    return []
  }

  favoriteItems.push(...JSON.parse(jsonStr))

  favoriteItems.forEach(item => {
    if (!instanceofFavoritePlace(item)) {
      brokenJSON = true
      return
    }
  });

  return (brokenJSON) ? [] : favoriteItems
}

function setFavoriteItems(favoriteItems: FavoritePlace[]) {
  localStorage.setItem(LSTORAGE_FAVORITES, JSON.stringify(favoriteItems))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function instanceofFavoritePlace(data: any): data is FavoritePlace {
  return ('id' in data) && ('name' in data) && ('image' in data)
}
