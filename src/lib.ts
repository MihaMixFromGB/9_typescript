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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function instanceofIUserData(data: any): data is IUserData {
  return ('username' in data) && ('avatarUrl' in data);
}
