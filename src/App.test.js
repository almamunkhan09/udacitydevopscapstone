import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
var mamun;
test('renders learn react link', () => {
  console.log('test');
  render(<App />);
  const linkElement = screen.getByText(/Good/i);
  expect(linkElement).toBeInTheDocument();
});
