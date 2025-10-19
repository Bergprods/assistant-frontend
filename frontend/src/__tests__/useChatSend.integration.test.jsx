import { renderHook, act } from '@testing-library/react'
import { useChatSend } from '../features/chat/hooks/useChatSend'

vi.mock('@services/ChatClient', async () => {
  return {
    ChatClient: class {
      async sendMessage(conversationId, message) {
        return { reply: `Echo: ${message}`, raw: { conversation_id: conversationId } }
      }
    }
  }
})

vi.mock('@services/AgentsClient', async () => {
  return {
    AgentsClient: class {
      async sendMessage(conversationId, message) {
        return { reply: `EchoAgent: ${message}`, raw: { conversation_id: conversationId } }
      }
      streamMessage() { throw new Error('no stream in test') }
    }
  }
})

describe('useChatSend integration', () => {
  it('appends assistant reply when sending via router engine', async () => {
    const appended = []
    const { result } = renderHook(() => useChatSend({
      conversationId: 'conv-1',
      selectedChatId: 'chat-1',
      append: (role, text) => appended.push({ role, text }),
      appendTo: undefined,
      addTask: () => {},
      t: (x) => x,
      model: 'gpt-4o-mini',
      engine: 'router'
    }))

    await act(async () => {
      await result.current.sendMessage('Hej test')
    })

    expect(appended[0]).toEqual({ role: 'user', text: 'Hej test' })
    expect(appended[1].role).toBe('assistant')
    expect(appended[1].text).toMatch(/Echo:/)
  })
})
