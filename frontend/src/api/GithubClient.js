import { ApiClient } from './ApiClient'

// Placeholder GitHub integration client (adjust endpoints to match backend routes)
export class GithubClient extends ApiClient {
  createIssue(payload) { return this.post('/github/issues', payload) }
  listIssues() { return this.get('/github/issues') }
}
