import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('primary')
  })

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('secondary')
  })

  it('applies ghost variant when specified', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('ghost')
  })

  it('applies outline variant when specified', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('outline')
  })

  it('applies large size by default', () => {
    render(<Button>Large</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('large')
  })

  it('applies small size when specified', () => {
    render(<Button size="small">Small</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('small')
  })

  it('applies medium size when specified', () => {
    render(<Button size="medium">Medium</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('medium')
  })

  it('applies fullWidth class when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('fullWidth')
  })

  it('does not apply fullWidth class when fullWidth is false', () => {
    render(<Button fullWidth={false}>Not Full Width</Button>)
    const button = screen.getByRole('button')
    expect(button.className).not.toContain('fullWidth')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('passes additional props to button element', () => {
    render(<Button type="submit">Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('merges custom className with default classes', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
    expect(button.className).toContain('button')
  })
})
