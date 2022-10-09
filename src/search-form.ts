import { renderBlock } from './lib.js'

import {
  addSubmitHandlerForSearchForm,
  addChangeHandlerForDateInput
} from './search/search-form-handler.js'

export function renderSearchFormBlock (arrival?: Date, departure?: Date) {
  arrival = getArrivalDay(arrival);
  departure = getDepartureDay(departure, arrival);

  const minDate = getDateString(new Date());
  const maxDate = getDateString(getLastDayOfNextMonth());
  
  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input id="latlng" type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${getDateString(arrival)}" min="${minDate}" max="${maxDate}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${getDateString(departure)}" min="${minDate}" max="${maxDate}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button type="submit">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )

  addSubmitHandlerForSearchForm()
  addChangeHandlerForDateInput()
}

function getArrivalDay(date: Date | undefined): Date {
  if (date == null) {
    return addDays(new Date(), 1);
  }
  
  return isValidDate(date) ? date: addDays(new Date(), 1);
}

function getDepartureDay(date: Date | undefined, arrival: Date): Date {
  if (date == null) {
    return addDays(arrival, 2);
  }
  
  return isValidDate(date) ? date: addDays(arrival, 2);
}

function isValidDate(date: Date): boolean {
  const now = new Date();
  const lastDayOfNextMonth = getLastDayOfNextMonth();

  return !!date && date > now && date < lastDayOfNextMonth;
}

function getLastDayOfNextMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 2, 0);
}

function addDays(date: Date, days: number): Date {
  const newDate = new Date(date.toISOString());
  newDate.setDate(newDate.getDate() + days);

  return newDate;
}

function getDateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = ('0' + (date.getMonth() + 1)).slice(-2);
  const dd = ('0' + date.getDate()).slice(-2);
  
  return `${yyyy}-${mm}-${dd}`;
}
