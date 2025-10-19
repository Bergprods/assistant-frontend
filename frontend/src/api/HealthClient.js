import { ApiClient } from './ApiClient'

export class HealthClient extends ApiClient {
  async fetchContainers() {
    return this.get('/health/containers')
  }
  async fetchDatabases() {
    try {
      return await this.get('/health/databases')
    } catch {
      // Gracefully fallback with empty list
      return { databases: [] }
    }
  }
}
