import React from 'react'
import { Container } from 'react-bootstrap'

export function NotFound() {
  return (
    <Container className="py-5 text-center">
      <h1 style={{ fontSize: '4rem' }}>404</h1>
      <p className="lead">Page not found.</p>
      <p><a href="/">Go home</a></p>
    </Container>
  )
}
