import { renderHook, act } from '@testing-library/react'
import { useChatSend } from '../features/chat/hooks/useChatSend'

describe('orchestrator → conversator integration (mocked fetch)', () => {
	beforeEach(() => {
		global.fetch = vi.fn(async (url, opts) => {
			if (typeof url === 'string' && url.startsWith('/conversator/respond')) {
				const body = JSON.parse(opts?.body || '{}')
				const fake = {
					payload: {
						originalMessage: body.message,
						language: body.language || 'sv-SE',
						message_analysis: { keypoints: [], tones: [] },
						intents: []
					},
					errors: [],
					generated_response: 'Hej! Detta är ett testsvar från conversator.'
				}
				return new Response(JSON.stringify(fake), { status: 200, headers: { 'Content-Type': 'application/json' } })
			}
			return new Response('not-mocked', { status: 404 })
		})
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('appends generated_response from conversator as assistant message', async () => {
		const appended = []
		const { result } = renderHook(() => useChatSend({
			conversationId: 'conv-xyz',
			selectedChatId: 'chat-xyz',
			append: (role, text) => appended.push({ role, text }),
			addTask: () => {},
			t: (x) => x,
			model: 'gpt-4o-mini',
			engine: 'orchestrator'
		}))

		await act(async () => {
			await result.current.sendMessage('Testar conversator')
		})

		expect(appended[0]).toEqual({ role: 'user', text: 'Testar conversator' })
		expect(appended[1].role).toBe('assistant')
		expect(appended[1].text).toMatch('testsvar från conversator')
		// Also ensure our fetch was called on the expected proxy path
		expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/^\/conversator\/respond\?includeRaw=false/), expect.any(Object))
	})
})

