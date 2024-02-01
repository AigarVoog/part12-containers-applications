import React from 'react';
import { render, screen } from '@testing-library/react';
import Todo from './Todo';

test('renders Todo component', () => {
  const todo = { _id: '1', text: 'Test Todo', done: false };
  render(<Todo todo={todo} deleteTodo={() => {}} completeTodo={() => {}} />);

  expect(screen.getByText('Test Todo')).toBeInTheDocument();
  expect(screen.getByText('This todo is not done')).toBeInTheDocument();
});
