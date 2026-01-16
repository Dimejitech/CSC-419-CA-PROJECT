import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './Input'

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('shows required indicator when required is true', () => {
    render(<Input label="Email" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('does not show required indicator when required is false', () => {
    render(<Input label="Email" required={false} />)
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('renders hint text when provided', () => {
    render(<Input hint="Enter your email address" />)
    expect(screen.getByText('Enter your email address')).toBeInTheDocument()
  })

  it('renders error text and applies error styles', () => {
    render(<Input error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('shows error text instead of hint when both are provided', () => {
    render(<Input hint="Hint text" error="Error text" />)
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument()
  })

  it('renders left icon when provided', () => {
    render(<Input leftIcon={<span data-testid="left-icon">📧</span>} />)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders right icon when provided', () => {
    render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('handles onChange events', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Type here" />)
    const input = screen.getByPlaceholderText('Type here')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('handles onFocus events', () => {
    const handleFocus = vi.fn()
    render(<Input onFocus={handleFocus} placeholder="Focus me" />)
    const input = screen.getByPlaceholderText('Focus me')
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalled()
  })

  it('handles onBlur events', () => {
    const handleBlur = vi.fn()
    render(<Input onBlur={handleBlur} placeholder="Blur me" />)
    const input = screen.getByPlaceholderText('Blur me')
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalled()
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
  })

  it('respects type prop', () => {
    render(<Input type="email" placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('type', 'email')
  })

  describe('Password Toggle', () => {
    it('shows password toggle button when showPasswordToggle is true and type is password', () => {
      render(<Input type="password" showPasswordToggle />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('toggles password visibility when toggle button is clicked', () => {
      render(<Input type="password" showPasswordToggle placeholder="Password" />)
      const input = screen.getByPlaceholderText('Password')
      const toggleButton = screen.getByRole('button')

      // Initially password type
      expect(input).toHaveAttribute('type', 'password')

      // Click to show password
      fireEvent.click(toggleButton)
      expect(input).toHaveAttribute('type', 'text')

      // Click again to hide password
      fireEvent.click(toggleButton)
      expect(input).toHaveAttribute('type', 'password')
    })

    it('does not show toggle button when type is not password', () => {
      render(<Input type="text" showPasswordToggle />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('does not show right icon when password toggle is shown', () => {
      render(
        <Input
          type="password"
          showPasswordToggle
          rightIcon={<span data-testid="right-icon">X</span>}
        />
      )
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument()
    })
  })
})
