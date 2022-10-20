import { sortSearchResults, renderSearchResults } from './search-form-handler.js'

export function addClickHandlerForResultsFilter() {
  const filter = document.querySelector<HTMLSelectElement>('#searchResultsFilter')
  if (!filter) {
    return
  }

  filter.addEventListener('change', () => {
    const filterCriteria = filter.value
    sortSearchResults(filterCriteria)
    renderSearchResults()
  })
}
