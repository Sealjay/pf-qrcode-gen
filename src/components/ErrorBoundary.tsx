import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor (props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError (error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch (error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error)
    console.error('Component stack:', errorInfo.componentStack)
  }

  render (): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise default error message
      return (
        this.props.fallback || (
          <div className='error-boundary'>
            <h2>Something went wrong</h2>
            <p>
              We're sorry, but an error occurred. Please try refreshing the
              page.
            </p>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
