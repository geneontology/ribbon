import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import component from 'demo/src/'

describe('component', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('displays a welcome message', () => {
    render(<component/>, node, () => {
      expect(node.innerHTML).toContain('Welcome to React components')
    })
  })
})
