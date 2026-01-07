//  Based on https://stackoverflow.com/questions/41103360/how-to-use-fetch-in-typescript
class communicationManager {
  private apiUrl = 'http://localhost:8080'

  async api<T>(path: string): Promise<T> {
    const response = await fetch(`${this.apiUrl}/${path}`)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return (await response.json()) as T
  }

  async getGameState() {
    return await this.api<string[]>('state')
  }

  async getGameLog() {
    return await this.api<string[]>('log-game')
  }

  async getAllLog() {
    return await this.api<string[]>('log')
  }
}
export default communicationManager
