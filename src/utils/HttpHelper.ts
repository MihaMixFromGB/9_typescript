export abstract class HttpHelper {
  public static async fetchAsJson<Response>(input: RequestInfo, init?: RequestInit):  Promise<Response> {
    return fetch(input, init)
      .then<Response>(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        
        return response.json()
      })
  }
}
