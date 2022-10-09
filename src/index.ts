import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock } from './user.js'
import {
  // renderToast,
  getUserData,
} from './lib.js'
import { getFavoritesAmount } from './favorite/favorite-handler.js'

window.addEventListener('DOMContentLoaded', () => {
  const userData = getUserData(localStorage.getItem('user'))
  const favoritesAmount = getFavoritesAmount()

  renderUserBlock(userData.username, userData.avatarUrl, favoritesAmount)
  renderSearchFormBlock()
  renderSearchStubBlock()
  // renderToast(
  //   {text: 'Это пример уведомления. Используйте его при необходимости', type: 'success'},
  //   {name: 'Понял', handler: () => {console.log('Уведомление закрыто')}}
  // )
})
