import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'

interface WrapperProps {
  children: React.ReactNode
}

// Custom render function with all providers
const AllProviders: React.FC<WrapperProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  )
}

// Render with router only (for components that don't need auth)
const RouterWrapper: React.FC<WrapperProps> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

const renderWithRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: RouterWrapper, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render, renderWithRouter }
