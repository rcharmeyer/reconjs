import { describe, expect, test } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { defineContext, RootProvider } from '..'
import { useContext, useState } from 'react'

const theCounter = defineContext (() => {
  const [ count, setCount ] = useState (0)

  return {
    count,
    setCount,
  }
}, [])

function Counter (props: { label: string }) {
  const { count, setCount } = useContext (theCounter)

  return (
    <div>
      <h1>{props.label}: {count}</h1>
      <button data-testid={props.label} onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}

describe('Global Counter', () => {
  test('works in RootProvider', async () => {
    const rendered = render (
      <RootProvider>
        <Counter label="first" />
        <Counter label="second" />
      </RootProvider>,
    )

    await waitFor (() => rendered.getByText('first: 0'))
    await waitFor (() => rendered.getByText('second: 0'))

    await waitFor (() => rendered.getByText('first: 1'))
    await waitFor (() => rendered.getByText('second: 1'))
  })

  test ("error if no RootProvider", () => {
    const rendered = render (
      <div>
        <Counter label="first" />
        <Counter label="second" />
      </div>
    )

    expect(() => rendered.getByText('first: 0')).toThrow()
  })
})