import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock } from './user.js'
import {
  // renderToast,
  getUserData,
  getFavoritesAmount,
  addSubmitHandlerForSearchForm
} from './lib.js'

window.addEventListener('DOMContentLoaded', () => {
  const userData = getUserData(localStorage.getItem('user'))
  const favoritesAmount = getFavoritesAmount(localStorage.getItem('favoritesAmount'))

  renderUserBlock(userData.username, userData.avatarUrl, favoritesAmount)
  renderSearchFormBlock()
  renderSearchStubBlock()
  // renderToast(
  //   {text: 'Это пример уведомления. Используйте его при необходимости', type: 'success'},
  //   {name: 'Понял', handler: () => {console.log('Уведомление закрыто')}}
  // )
  addSubmitHandlerForSearchForm()
})
