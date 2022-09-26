import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  console.log('test');
  render(<App />);
  const linkElement = screen.getByText(/Hello I am Al Mamun Khan/i);
  expect(linkElement).toBeInTheDocument();
});
