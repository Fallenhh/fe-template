import { act } from '@testing-library/react'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '../App'

let container: HTMLDivElement | null = null
beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
})

afterEach(() => {
  document.body.removeChild(container!)
  container = null
})

describe('test App', () => {
  it('render success', () => {
    act(() => {
      createRoot(container!).render(<App/>)
    })

    const title = container?.querySelector('h1')!
    expect(title.textContent).toBe('Hello world!')
  })
})
