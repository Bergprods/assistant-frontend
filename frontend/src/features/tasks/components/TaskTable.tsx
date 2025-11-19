import React, { useEffect } from 'react'
import { Table, Button, Badge, Spinner } from 'react-bootstrap'
import { formatDate, formatTime } from '@utils/datetime'
import { summarizeTask } from '@utils/textHelpers'
import { useFilteredTasks, usePagination, useTaskEntities } from '@hooks'
import { useI18n } from '@i18n'

export function TaskTable({ tasks, agentFilter, sortBy, hideSmalltalk }) {
  const { t } = useI18n()
  const filtered = useFilteredTasks(tasks, agentFilter, sortBy, hideSmalltalk)
  const { expanded, loadingEntity, entityDetails, handleRowClick, isHaTask } = useTaskEntities(tasks)
  const { page, setPage, reset, total, totalPages, startIndex, pageItems, pageSize } = usePagination(filtered, 10)

  // Reset pagination when filter or sorting context changes
  useEffect(() => { reset() }, [tasks, agentFilter, sortBy, reset])

  if (filtered.length === 0) return <div className="text-muted">{t('tasks.empty')}</div>

  return (
    <>
      <Table hover size="sm" responsive className="task-panel" variant="dark">
        <thead>
          <tr>
            <th>{t('table.date') || 'Datum'}</th>
            <th>{t('table.time') || 'Tid'}</th>
            <th>{t('table.agent') || 'Agent'}</th>
            <th>{t('table.task') || 'Uppgift'}</th>
            <th>{t('table.giver') || 'Uppdragsgivare'}</th>
            <th>{t('table.status') || 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map(task => {
            const isHa = isHaTask(task)
            return (
              <React.Fragment key={task.id}>
                <tr
                  onClick={() => handleRowClick(task)}
                  style={{ cursor: ((task.status === 'info' && isHa) || task.status === 'error') ? 'pointer' : 'default' }}
                  title={(task.status === 'error') ? '' : JSON.stringify(task.details || {}, null, 2)}
                >
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(task.ts)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatTime(task.ts)}</td>
                  <td>{isHa ? 'HA' : (task.agent || 'assistant')}</td>
                  <td>
                    <div className="text-muted small mb-1">{task.summary || summarizeTask(task.description, { isHa: !!(task.details && (task.details.ha_injected || (task.details.routed_to && String(task.details.routed_to).toLowerCase().includes('smart')))) })}</div>
                    <div className="d-flex align-items-center gap-2">
                      <strong>{task.description}</strong>
                      {((task.status === 'info' && isHa) || task.status === 'error') && (
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{expanded[task.id] ? '▾' : '▸'}</span>
                      )}
                    </div>
                  </td>
                  <td>{task.taskgiver || (task.details && task.details.taskgiver) || '-'}</td>
                  <td>{task.status === 'success' ? <Badge bg="success">{t('tasks.status.success')}</Badge> : task.status === 'error' ? <Badge bg="danger">{t('tasks.status.error')}</Badge> : <Badge bg="secondary">{t('tasks.status.info')}</Badge>}</td>
                </tr>
                {expanded[task.id] ? (
                  <tr>
                    <td colSpan={6} style={{ background: '#071622' }}>
                      {task.status === 'error' ? (
                        <div className="alert alert-danger mt-2 mb-2" style={{ fontFamily: 'monospace' }}>
                          <div style={{ whiteSpace: 'pre-wrap' }}>
                            <strong>Fel:</strong> {task?.details?.user_message || 'Okänt fel.'}
                          </div>
                          <div className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                            {task?.details?.error_message && (<div><span style={{ color:'#ffb3b3' }}>Message:</span> {task.details.error_message}</div>)}
                            {task?.details?.error_detail && (<div><span style={{ color:'#ffb3b3' }}>Detail:</span> {task.details.error_detail.split(':{')[0]}</div>)}
                            {task?.details?.error_documentation_url && (<div><span style={{ color:'#ffb3b3' }}>Docs:</span> {task.details.error_documentation_url}</div>)}
                          </div>
                          {task?.details?.error_props && (
                            <div className="mt-2" style={{ background: '#2a0f12', padding: '6px 8px', borderRadius: 4 }}>
                              {Object.entries(task.details.error_props)
                                .filter(([k]) => !['detail','message','documentation_url'].includes(k))
                                .map(([k,v]) => (
                                  <div key={k} style={{ whiteSpace: 'pre-wrap' }}>
                                    <span style={{ color:'#ffb3b3' }}>{k}:</span> {(typeof v === 'object') ? JSON.stringify(v) : String(v)}
                                  </div>
                                ))}
                            </div>
                          )}
                          {task?.details?.connector_url && (<div className="mt-2 text-muted">Connector: {task.details.connector_url}</div>)}
                        </div>
                      ) : loadingEntity[task.id] ? (
                        <div className="d-flex align-items-center"><Spinner animation="border" size="sm" className="me-2"/>{t('loading') || 'Laddar...'}</div>
                      ) : (
                        <div>
                          {Array.isArray(entityDetails[task.id]) && entityDetails[task.id].length > 0 ? (
                            <Table size="sm" bordered variant="dark" className="mb-0">
                              <thead>
                                <tr>
                                  <th>Entity</th>
                                  <th>Domain</th>
                                  <th>Device class</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {entityDetails[task.id].map((s, idx) => {
                                  const entityId = s?.entity_id || s?.entity || s?.object_id || s?.entityId || s?.id || s?.name || null
                                  const statusVal = s?.state ?? s?.status ?? s?.state_value ?? s?.stateValue ?? null
                                  const domain = entityId && entityId.includes('.') ? entityId.split('.')[0] : (s?.domain || null)
                                  const deviceClass = s?.attributes?.device_class || s?.device_class || null
                                  return (
                                    <tr key={idx}>
                                      <td style={{ whiteSpace: 'nowrap', color: '#cfe8ff' }}>{entityId ?? 'unknown'}</td>
                                      <td style={{ color: '#d7e6f5' }}>{domain ?? '-'}</td>
                                      <td style={{ color: '#d7e6f5' }}>{deviceClass ?? '-'}</td>
                                      <td style={{ color: '#d7e6f5' }}>{statusVal ?? '-'}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </Table>
                          ) : (
                            <div className="text-muted">{t('task.entity.no_data')}</div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            )
          })}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-muted">{(t('tasks.pagination.range') || 'Visar {from}–{to} av {total}')
          .replace('{from}', Math.min(total, startIndex + 1))
          .replace('{to}', Math.min(total, startIndex + pageItems.length))
          .replace('{total}', total)}</div>
        <div className="btn-group">
          <Button size="sm" variant="outline-secondary" onClick={() => setPage(1)} disabled={page <= 1}>{t('tasks.pagination.first')}</Button>
          <Button size="sm" variant="outline-secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>{t('tasks.pagination.prev')}</Button>
          <Button size="sm" variant="outline-secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>{t('tasks.pagination.next')}</Button>
          <Button size="sm" variant="outline-secondary" onClick={() => setPage(totalPages)} disabled={page >= totalPages}>{t('tasks.pagination.last') || 'Sista'}</Button>
        </div>
        <div><small className="text-muted">{(t('pagination.page') || 'Sida {page} av {total}')
          .replace('{page}', page)
          .replace('{total}', totalPages)}</small></div>
      </div>
    </>
  )
}
