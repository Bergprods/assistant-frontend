import { ApiClient } from './ApiClient'

export class ChatClient extends ApiClient {
  async sendMessage(conversationId, message, context = {}) {
    return this.post('/router/query', { conversation_id: conversationId, message, context })
  }
}
