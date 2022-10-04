export function renderBlock (elementId: string, html: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = html;
  }
}

interface IMessage {
  text: string,
  type: string
}

interface IAction {
  name: string,
  handler: () => void
}

export function renderToast (message: IMessage | null, action?: IAction) {
  let messageText = ''
  
  if (message != null) {
    messageText = `
      <div id="info-block" class="info-block ${message.type}">
        <p>${message.text}</p>
        <button id="toast-main-action">${action?.name || 'Закрыть'}</button>
      </div>
    `
  }
  
  renderBlock(
    'toast-block',
    messageText
  )

  const button = document.getElementById('toast-main-action')
  if (button != null) {
    button.onclick = function() {
      if (action != null && action.handler != null) {
        action.handler()
      }
      renderToast(null)
    }
  }
}

export interface IUserData {
  username: string,
  avatarUrl: string
}

export function getUserData(jsonStr: unknown): IUserData {
  let data = {};
  if (typeof jsonStr === 'string') {
    data = JSON.parse(jsonStr);
  }
  
  if (instanceofIUserData(data)) { 
    return { ...data }
  }

  return {
    username: '',
    avatarUrl: ''
  }
}

export function getFavoritesAmount(jsonStr: unknown): number {
  if (typeof jsonStr === 'number') {
    return jsonStr;
  }

  if (typeof jsonStr === 'string' && !isNaN(+jsonStr)) {
    return +jsonStr;
  }

  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function instanceofIUserData(data: any): data is IUserData {
  return ('username' in data) && ('avatarUrl' in data);
}

export function addSubmitHandlerForSearchForm() {
  const form = document.querySelector('form');

  if (form === null) {
    return
  }

  form.onsubmit = () => {
    search(
      {
        city: getInputValue(form.querySelector<HTMLInputElement>('#city')),
        checkInDate: new Date(getInputValue(form.querySelector<HTMLInputElement>('#check-in-date'))),
        checkOutDate: new Date(getInputValue(form.querySelector<HTMLInputElement>('#check-out-date'))),
        maxPrice: +getInputValue(form.querySelector<HTMLInputElement>('#max-price'))
      },
      (error, data) => {
        if (error === null && data !== null) {
          console.log('data: ', data);
          return;
        }

        console.log('error: ', error);
      }
    )

    return false; // prevent reload
  };
}

function getInputValue(input: HTMLInputElement | null): string {
  if (input === null) {
    return ''
  }

  return input.value;
}

interface SearchFormData {
  city: string,
  checkInDate: Date,
  checkOutDate: Date,
  maxPrice: number
}

type SearchHandler = (error: Error | null, data?: Place[]) => void;

interface Place {
  value: string
}

function search(data: SearchFormData, handler?: SearchHandler): void {
  console.log('SearchFormData: ', data);

  if (handler != null) {
    searchRequest()
      .then((data) => handler(null, data))
      .catch((error) => handler(error))
  }
}

function searchRequest(): Promise<Place[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const done = Math.round(Math.random())
      const result: Place[] = []

      if (done) {
        resolve(result)
      } else {
        reject(new Error('error message'));
      }
      
    }, 3000)
  })
}
