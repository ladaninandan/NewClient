import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./context/ConfigContext', () => ({
  useConfig: () => ({ config: {}, loading: false, error: null }),
  ConfigProvider: ({ children }) => children,
}));

test('renders app with router', () => {
  render(<App />);
  expect(screen.getByTestId('router')).toBeInTheDocument();
});
