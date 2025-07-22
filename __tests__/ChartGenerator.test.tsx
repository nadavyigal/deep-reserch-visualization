import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChartGenerator from '../src/app/components/ChartGenerator';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ chartData: [{ name: 'Jan', value1: 1, value2: 2 }], chartType: 'line' })
})) as jest.Mock;

test('calls API when generating chart', async () => {
  render(<ChartGenerator text="Some text" />);
  fireEvent.click(screen.getByText('Chart'));
  await waitFor(() => expect(fetch).toHaveBeenCalled());
});
