import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PitNav } from './pit-nav';
vi.mock('@/lib/prototype-fonts', () => ({ anton: { className: '' } }));
describe('section navigation', () => {
  it('opens an explicitly named dialog and closes with its close control', async () => {
    render(<PitNav onGo={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open section menu' }));
    expect(await screen.findByRole('dialog', { name: 'Section navigation' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('does not navigate on global number keys while closed', () => {
    const go = vi.fn();
    render(<PitNav onGo={go} />);
    fireEvent.keyDown(window, { key: '3' });
    expect(go).not.toHaveBeenCalled();
  });
});
