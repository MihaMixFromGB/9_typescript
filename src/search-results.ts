import { renderBlock } from './lib.js'
import { Place } from './Place.js'

import { addClickHandlerForFavoriteIcon } from './favorite/favorite-handler.js';
import { addClickHandlerForBookBtn } from './booking/booking-handler.js';

export function renderSearchStubBlock () {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock (reasonMessage: string) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

export function renderSearchResultsBlock (places: Place[]) {
  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    ${getResultItems(places)}
    `
  )

  addClickHandlerForFavoriteIcon()
  addClickHandlerForBookBtn()
}

function getResultItems(places: Place[]): string {
  return `
    <ul class="results-list">
      ${places.map(place => getResultItem(place))}
    </ul>
  `
}

function getResultItem(place: Place): string {
  return `
    <li class="result">
      <div class="result-container">
        <div class="result-img-container">
          <div data-favorite-id="${place.id}" class="favorites${place.favorite ? ' active': ''}"}"></div>
          <img class="result-img" src="${place.image}" alt="">
        </div>
        <div class="result-info">
          <div class="result-info--header">
            <p>${place.name}</p>
            <p class="price">${place.price}&#8381;</p>
          </div>
          <div class="result-info--map"><i class="map-icon"></i> ${place.remoteness}км от вас</div>
          <div class="result-info--descr">${place.description}</div>
          <div class="result-info--footer">
            <div>
              <button data-book-id="${place.id}">Забронировать</button>
            </div>
          </div>
        </div>
      </div>
    </li>
  `
}
