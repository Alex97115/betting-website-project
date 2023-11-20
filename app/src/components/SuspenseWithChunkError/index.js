import React, { Suspense } from 'react'

class SuspenseWithChunkError extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error) {
    const isJsChunkLoadError = error.name === 'ChunkLoadError'
    const isCssChunkLoadError = error.code === 'CSS_CHUNK_LOAD_FAILED'
    const isChunkLoadError = isJsChunkLoadError || isCssChunkLoadError

    const isRecoveringFromChunkError = !!window.history.state?.isRecoveringFromChunkError

    // If was a chunk load error, refresh the page
    if (isChunkLoadError && !isRecoveringFromChunkError) {
      const nextState = { ...window.history.state, isRecoveringFromChunkError: true }
      window.history.replaceState(nextState, '')
      window.location.reload()
      return
    }

    throw error
  }

  render() {
    const { hasError } = this.state
    const { fallback } = this.props

    if (hasError) return fallback

    return <Suspense {...this.props} />
  }
}

export default SuspenseWithChunkError
