import React, { useEffect } from 'react'
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap'
import { useI18n } from '@i18n'
import { useHealthPanel } from '@hooks'

export function HealthPage() {
  const { t } = useI18n()
  const { healthLoading, healthError, healthData, dbHealthData,
    containersOpen, setContainersOpen, databasesOpen, setDatabasesOpen, lastHealthTs, fetchHealth, autoRefresh, setAutoRefresh } = useHealthPanel()
  useEffect(()=>{ fetchHealth() },[])
  const containerOk = s=>s.status==='running'
  const dbOk = d=>d.status==='running'
  return (
    <Container className="py-3">
      <Row className="mb-3"><Col><h3>{t('health.title')}</h3></Col></Row>
      {healthError && <div className="text-danger small mb-2">{t('tasks.status.error')}: {healthError}</div>}
      <Row><Col md={12}>
        <div className="mb-3 border rounded p-2">
          <div className="d-flex align-items-center mb-2">
            <h5 className="mb-0 me-3">{t('health.containers')}</h5>
            <Button size="sm" variant="outline-secondary" onClick={fetchHealth} disabled={healthLoading}>{healthLoading ? t('chat.status.reading') : t('health.update')}</Button>
            <Form.Check type="switch" id="auto-refresh" className="ms-3" label={t('health.auto')} checked={autoRefresh} onChange={e=>setAutoRefresh(e.target.checked)} />
            {lastHealthTs && <small className="ms-3 text-muted">{new Intl.DateTimeFormat('sv-SE',{hour:'2-digit',minute:'2-digit'}).format(lastHealthTs)}</small>}
          </div>
          <div className="accordion-section">
            <div className="acc-header" onClick={()=>setContainersOpen(o=>!o)} style={{cursor:'pointer'}}>
              <span className="arrow">{containersOpen ? '▾':'▸'}</span>
              <span className="ms-1">{t('health.containers')}</span>
              <span className="ms-auto small text-muted">{healthData.filter(containerOk).length} OK / {healthData.filter(s=>!containerOk(s)).length} {t('tasks.status.error')}</span>
            </div>
            {containersOpen && (
              <div className="acc-body mt-2">
                <Table size="sm" bordered variant="dark">
                  <thead><tr><th></th><th>Namn</th><th>Status</th><th>HTTP</th><th>Latency</th><th>Kommentar</th></tr></thead>
                  <tbody>
                    {healthData.map(s=>{ const ok=containerOk(s); return <tr key={s.key} className={ok?'ok-row':'fail-row'}><td><span className={`status-dot ${ok?'ok':'fail'}`}></span></td><td>{s.name}</td><td>{ok?'OK':t('tasks.status.error')}</td><td>{s.http_status??'-'}</td><td>{s.latency_ms??'-'}</td><td>{s.message||''}</td></tr> })}
                    {healthData.length===0 && <tr><td colSpan={6} className="text-center text-muted">{t('health.none')}</td></tr>}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
        <div className="mb-3 border rounded p-2">
          <div className="d-flex align-items-center mb-2"><h5 className="mb-0 me-3">{t('health.databases')}</h5></div>
          <div className="accordion-section">
            <div className="acc-header" onClick={()=>setDatabasesOpen(o=>!o)} style={{cursor:'pointer'}}>
              <span className="arrow">{databasesOpen ? '▾':'▸'}</span>
              <span className="ms-1">{t('health.databases')}</span>
              <span className="ms-auto small text-muted">{dbHealthData.filter(dbOk).length} OK / {dbHealthData.filter(d=>!dbOk(d)).length} {t('tasks.status.error')}</span>
            </div>
            {databasesOpen && (
              <div className="acc-body mt-2">
                {dbHealthData.length === 0 && <div className="text-muted small">{t('health.db.none')}</div>}
                {dbHealthData.length > 0 && (
                  <Table size="sm" bordered variant="dark">
                    <thead><tr><th></th><th>Namn</th><th>Host:Port</th><th>Status</th><th>Latency</th><th>Kommentar</th></tr></thead>
                    <tbody>
                      {dbHealthData.map(db=>{ const ok=dbOk(db); return <tr key={db.key} className={ok?'ok-row':'fail-row'}><td><span className={`status-dot ${ok?'ok':'fail'}`}></span></td><td>{db.name}</td><td>{db.host}:{db.port}</td><td>{ok?'OK':t('tasks.status.error')}</td><td>{db.latency_ms??'-'}</td><td>{db.message||''}</td></tr> })}
                    </tbody>
                  </Table>
                )}
              </div>
            )}
          </div>
        </div>
      </Col></Row>
    </Container>
  )
}
