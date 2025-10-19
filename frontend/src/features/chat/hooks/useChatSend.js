import { useRef, useState } from 'react'
import { AgentsClient } from '@services/AgentsClient'
import { cleanDescription, summarizeTask } from '@utils/textHelpers'
import { detectHaIntent } from '@utils/taskHelpers'

import { ChatClient } from '@services/ChatClient'

export function useChatSend({ conversationId, selectedChatId, append, appendTo, addTask, t, model, engine = 'orchestrator' }) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
				const agentsClient = new AgentsClient()
			const routerClient = new ChatClient()
		const workflowId = import.meta.env?.VITE_OPENAI_WORKFLOW_ID
				const smalltalkerWorkflowId = import.meta.env?.VITE_SMALLTALKER_WORKFLOW_ID
	const seenTurnIdsRef = useRef(new Set())

	async function sendMessage(text, chatIdOverride) {
		const targetChatId = chatIdOverride || selectedChatId
		if (!text.trim() || !targetChatId) return
		// Always use the chat id as conversation id to keep threads aligned
		const convId = targetChatId
		;(appendTo ? appendTo(targetChatId, 'user', text) : append('user', text))
		setLoading(true); setError(null)
		try {
								let data = null
								if (engine === 'router') {
									data = await routerClient.sendMessage(convId, text.trim(), { model })
									;(appendTo ? appendTo(targetChatId, 'assistant', data.reply ?? JSON.stringify(data.raw)) : append('assistant', data.reply ?? JSON.stringify(data.raw)))
								} else {
								// Try SSE streaming first
									let done = false
									let finalText = ''
									let parsed = null
									let lastTurnId = null
								// Stream without inserting a placeholder message; show loader via loading state
									try {
										const result = await new Promise(async (resolve) => {
											let sseMetadata = null
											try {
												agentsClient.streamMessage(convId, text.trim(), { workflowId, smalltalkerWorkflowId }, {
																									onMessage: (evt) => {
														if (!evt) return
														if (typeof evt.reply === 'string') finalText = evt.reply
														if (evt.parsed) parsed = evt.parsed
														if (evt.metadata) sseMetadata = evt.metadata
																										if (evt.turn_id) lastTurnId = evt.turn_id
																																																					// Create a task from orchestrator decision if present
																																								try {
																																									const orch = evt.orchestrator
																																									if (orch && typeof orch === 'object') {
																																															const title = `Orchestrator: ${orch.intent}`
																																																							const slotStr = orch.slots ? Object.entries(orch.slots).filter(([_,v])=>v).map(([k,v])=>`${k}: ${v}`).join(', ') : ''
																																															const description = orch.summary || `Intent: ${orch.intent}\nCommand: ${orch.command}${slotStr ? `\nSlots: ${slotStr}` : ''}`
																																									if (String(orch.intent).toLowerCase() !== 'smalltalk') {
																																										const thisTurn = lastTurnId
																																										if (!thisTurn || !seenTurnIdsRef.current.has(thisTurn)) {
																																											addTask({ id: Date.now() + Math.random().toString(36).slice(2,9), ts: new Date().toISOString(), agent: 'orchestrator', description, summary: title, entity: orch?.slots?.device || null, service: orch?.slots?.action || null, taskgiver: 'System', status: 'info', details: { ...orch, turn_id: thisTurn } })
																																											if (thisTurn) seenTurnIdsRef.current.add(thisTurn)
																																										}
																																									}
																																									}
																																								} catch {}
													},
													onDone: () => {
														done = true
														;(appendTo ? appendTo(targetChatId, 'assistant', finalText) : append('assistant', finalText))
																												resolve({ parsed, reply: finalText, metadata: sseMetadata, turn_id: lastTurnId })
													},
																									onError: async () => {
														if (done) return
														// Fallback to non-streaming
														try {
																																											const fallback = await agentsClient.sendMessage(convId, text.trim(), { model, workflowId, smalltalkerWorkflowId })
															;(appendTo ? appendTo(targetChatId, 'assistant', fallback.reply ?? JSON.stringify(fallback.raw)) : append('assistant', fallback.reply ?? JSON.stringify(fallback.raw)))
																													// Create orchestrator task if available on fallback
																													try {
																																												const orch = fallback.raw?.orchestrator
																														if (orch && typeof orch === 'object') {
																															const title = `Orchestrator: ${orch.intent}`
																															const slotStr = orch.slots ? Object.entries(orch.slots).filter(([_,v])=>v).map(([k,v])=>`${k}: ${v}`).join(', ') : ''
																																													const description = orch.summary || `Intent: ${orch.intent}\nCommand: ${orch.command}${slotStr ? `\nSlots: ${slotStr}` : ''}`
																																													const turnId = fallback.raw?.turn_id || lastTurnId
																																													if (String(orch.intent).toLowerCase() !== 'smalltalk') {
																																														if (!turnId || !seenTurnIdsRef.current.has(turnId)) {
																																															addTask({ id: Date.now() + Math.random().toString(36).slice(2,9), ts: new Date().toISOString(), agent: 'orchestrator', description, summary: title, entity: orch?.slots?.device || null, service: orch?.slots?.action || null, taskgiver: 'System', status: 'info', details: { ...orch, turn_id: turnId } })
																																															if (turnId) seenTurnIdsRef.current.add(turnId)
																																														}
																																													}
																														}
																													} catch {}
																																											resolve({ parsed: fallback.parsed || fallback.output_parsed, reply: fallback.reply, metadata: fallback.metadata, orchestrator: fallback.raw?.orchestrator, turn_id: fallback.raw?.turn_id })
														} catch (fe) {
															resolve(null)
														}
													}
												})
											} catch {
												try {
																																							const fallback = await agentsClient.sendMessage(convId, text.trim(), { model, workflowId, smalltalkerWorkflowId })
													;(appendTo ? appendTo(targetChatId, 'assistant', fallback.reply ?? JSON.stringify(fallback.raw)) : append('assistant', fallback.reply ?? JSON.stringify(fallback.raw)))
																									// Create orchestrator task if available
																									try {
																																								const orch = fallback.raw?.orchestrator
																										if (orch && typeof orch === 'object') {
																											const title = `Orchestrator: ${orch.intent}`
																											const slotStr = orch.slots ? Object.entries(orch.slots).filter(([_,v])=>v).map(([k,v])=>`${k}: ${v}`).join(', ') : ''
																																									const description = orch.summary || `Intent: ${orch.intent}\nCommand: ${orch.command}${slotStr ? `\nSlots: ${slotStr}` : ''}`
																																									const turnId = fallback.raw?.turn_id || lastTurnId
																																									if (String(orch.intent).toLowerCase() !== 'smalltalk') {
																																										if (!turnId || !seenTurnIdsRef.current.has(turnId)) {
																																											addTask({ id: Date.now() + Math.random().toString(36).slice(2,9), ts: new Date().toISOString(), agent: 'orchestrator', description, summary: title, entity: orch?.slots?.device || null, service: orch?.slots?.action || null, taskgiver: 'System', status: 'info', details: { ...orch, turn_id: turnId } })
																																											if (turnId) seenTurnIdsRef.current.add(turnId)
																																										}
																																									}
																										}
																									} catch {}
																																							resolve({ parsed: fallback.parsed || fallback.output_parsed, reply: fallback.reply, metadata: fallback.metadata, orchestrator: fallback.raw?.orchestrator, turn_id: fallback.raw?.turn_id })
												} catch (fe) {
													resolve(null)
												}
											}
										})
										if (result) {
											// create a lightweight task from parsed intent (if available)
											try {
												const p = result.parsed
												if (p && typeof p === 'object' && p.intent && String(p.intent).toLowerCase() !== 'smalltalk') {
													const description = `[${p.intent}] ${p.command}`
													const turnId = result.turn_id || lastTurnId
													if (!turnId || !seenTurnIdsRef.current.has(turnId)) {
														addTask({ id: Date.now() + Math.random().toString(36).slice(2,9), ts: new Date().toISOString(), agent: 'orchestrator', description, summary: description, entity: p?.slots?.device || null, service: p?.slots?.action || null, taskgiver: 'User', status: 'info', details: { ...p, turn_id: turnId } })
														if (turnId) seenTurnIdsRef.current.add(turnId)
													}
												}
											} catch {}
											// HA-style metadata task if present (SSE or fallback)
											try {
												const metadata = result.metadata || {}
												if (Object.keys(metadata).length > 0) {
													const entity = metadata.entity_id || null
													const service = metadata.service || null
													const replyText = (result.reply || '').toString()
													const isHaCandidate = detectHaIntent({ replyText, userText: text, entity, metadata })
													const description = cleanDescription(metadata.reason || replyText || '')
													addTask({
														id: Date.now() + Math.random().toString(36).slice(2,9),
														ts: new Date().toISOString(),
														agent: (isHaCandidate ? 'HA' : 'assistant'),
														description,
														summary: metadata.summary || summarizeTask(description, { isHa: !!metadata.ha_injected, ha_injected: !!metadata.ha_injected }),
														entity,
														service,
														taskgiver: 'User',
														status: metadata.ha_error ? 'error' : (metadata.ha_injected ? 'info' : (metadata.ha_result ? 'success' : 'info')),
														details: metadata
													})
												}
											} catch {}
										}
									} catch {
										// If streaming setup fails entirely, we already attempted a fallback above
									}
							}
							// Router path extra: add HA-style tasks if metadata present
							try {
								if (data) {
									// Deduplicate orchestrator task creation across SSE + fallback within same turn
									const turnId = data.raw?.turn_id || lastTurnId
									const routed = data.routed_to || data.route_to
									const metadata = data.metadata || {}
									const entity = data.entity_id || metadata.entity_id || null
									const service = data.service || metadata.service || null
									const ha_result = metadata.ha_result
									const ha_error = metadata.ha_error
									if (routed || Object.keys(metadata).length > 0) {
										const replyText = (data.reply || '').toString()
										const isHaCandidate = detectHaIntent({ replyText, userText: text, entity, metadata })
										const description = cleanDescription(metadata.reason || data.reply || '')
										const task = {
											id: Date.now() + Math.random().toString(36).slice(2,9),
											ts: new Date().toISOString(),
											agent: routed || (isHaCandidate ? 'HA' : 'assistant'),
											description,
											summary: metadata.summary || summarizeTask(description, { isHa: (routed && routed.toLowerCase?.().includes('smart')) || !!metadata.ha_injected, ha_injected: !!metadata.ha_injected }),
											entity,
											service,
											taskgiver: 'User',
											status: ha_error ? 'error' : (metadata.ha_injected ? 'info' : (ha_result ? 'success' : 'info')),
											details: { ...metadata, turn_id: turnId }
										}
										addTask(task)
									}
								}
							} catch {}
		} catch (e) {
			setError(String(e))
			append('assistant', 'Fel vid anrop: ' + String(e))
		} finally { setLoading(false) }
	}

	return { sendMessage, loading, error }
}
