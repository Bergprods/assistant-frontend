import { ApiClient } from './ApiClient'

// Placeholder for Home Assistant specific endpoints
export class HaClient extends ApiClient {
  listEntities() { return this.get('/ha/entities').catch(() => []) }
  // Add more HA-specific methods here as backend expands
}
