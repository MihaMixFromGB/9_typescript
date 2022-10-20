import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock } from './user.js'
import {
  getUserData,
} from './lib.js'
import { getFavoritesAmount } from './handlers/favorites-handler.js'

window.addEventListener('DOMContentLoaded', () => {
  const userData = getUserData(localStorage.getItem('user'))
  const favoritesAmount = getFavoritesAmount()

  renderUserBlock(userData.username, userData.avatarUrl, favoritesAmount)
  renderSearchFormBlock()
  renderSearchStubBlock()
})
