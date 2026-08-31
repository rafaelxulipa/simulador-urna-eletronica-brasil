import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RotateDeviceHint } from '@/components/common/RotateDeviceHint'

describe('RotateDeviceHint', () => {
  it('shows the rotate instruction and dismisses on "Continuar assim mesmo"', async () => {
    render(<RotateDeviceHint />)

    expect(screen.getByText('Gire seu celular')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Continuar assim mesmo' }))

    expect(screen.queryByText('Gire seu celular')).not.toBeInTheDocument()
  })
})
