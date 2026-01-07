class ByHTTPConnector {
  private readonly apiUrl

  constructor(url?: string) {
    if (url) {
      this.apiUrl = url
    } else {
      this.apiUrl = 'http://localhost:8080'
    }
  }

  async api<T>(path: string): Promise<T> {
    try {
      const response = await fetch(`${this.apiUrl}/${path}`)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return (await response.json()) as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Неизвестная ошибка')
    }
  }

  async getServerStatus(): Promise<boolean> {
    try {
      const answer = await this.api<{ status: boolean }>('status')
      return answer.status
    } catch (error) {
      console.log('🚀 ~ ByHTTPConnector ~ getServerStatus ~ error:', error)
      return false
    }
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
export default ByHTTPConnector
