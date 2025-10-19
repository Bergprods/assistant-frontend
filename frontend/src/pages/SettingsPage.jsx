import React from 'react'
import { Container } from 'react-bootstrap'
import { useI18n } from '@i18n'

export function SettingsPage() {
  const { t } = useI18n()
  return (
    <Container className="py-3">
      <h3>{t('nav.settings') || 'Settings'}</h3>
      <p className="text-muted">(Coming soon)</p>
    </Container>
  )
}
