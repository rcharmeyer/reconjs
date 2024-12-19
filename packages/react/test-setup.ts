import '@testing-library/jest-dom/vitest'
import { cleanup as cleanupRTL } from '@testing-library/react'
import { cleanup as cleanupRRS } from '@testing-library/react-render-stream'
import { afterEach } from 'vitest'

// https://testing-library.com/docs/react-testing-library/api#cleanup
afterEach(() => {
  cleanupRTL()
  cleanupRRS()
})