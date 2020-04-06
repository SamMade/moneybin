import React from 'react';
import { render } from '@testing-library/react';
import TestComponent from './Overview';

test('renders learn react link', () => {
  const { getByText } = render(<TestComponent />);
  const linkElement = getByText(/main menu/i);
  expect(linkElement).toBeInTheDocument();
});
