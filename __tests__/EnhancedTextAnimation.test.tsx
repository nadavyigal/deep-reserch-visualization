import { render, waitFor } from '@testing-library/react';
import EnhancedTextAnimation from '../src/app/components/EnhancedTextAnimation';

jest.mock('animejs', () => ({
  default: {
    timeline: jest.fn(() => ({ add: jest.fn().mockReturnThis() })),
    setDashoffset: jest.fn()
  }
}));

describe('EnhancedTextAnimation', () => {
  it('creates animation timeline on mount', async () => {
    const { container } = render(
      <EnhancedTextAnimation text="React testing of anime animations" />
    );
    await waitFor(() => {
      expect(container.querySelectorAll('.enhanced-text-animation').length).toBe(1);
    });
    const anime = await import('animejs');
    expect(anime.default.timeline).toHaveBeenCalled();
  });
});
