import { render, screen, waitFor } from '@testing-library/react';
import FlowchartGenerator from '../src/app/components/FlowchartGenerator';
import mermaid from 'mermaid';

jest.mock('mermaid', () => ({
  mermaidAPI: { reset: jest.fn() },
  initialize: jest.fn(),
  render: jest.fn(() => Promise.resolve({ svg: '<svg></svg>' })),
  parse: jest.fn(() => Promise.resolve(true))
}));

it('renders a flowchart container', async () => {
  render(<FlowchartGenerator initialCode="graph TD; A-->B" />);
  await waitFor(() => expect(mermaid.render).toHaveBeenCalled());
  expect(screen.getByText(/Edit Flowchart/)).toBeInTheDocument();
});
