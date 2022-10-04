import { renderBlock } from './lib.js'

export function renderUserBlock (user: string, avatar: string, favoriteItemsAmount: number) {
  user = user || 'Wade Warren';
  avatar = avatar || '/img/avatar.png';
  
  const favoritesCaption = favoriteItemsAmount ? favoriteItemsAmount : 'ничего нет'
  const hasFavoriteItems = favoriteItemsAmount ? true : false

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${avatar}" alt="${user}" />
      <div class="info">
          <p class="name">${user}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}
