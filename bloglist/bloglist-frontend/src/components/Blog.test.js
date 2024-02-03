import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const blog = {
  title: 'my blog',
  author: 'mr Bean',
  url: 'www.beans.com',
  likes: 69,
  user: { username: 'Pedro' },
};

const user = {
  username: 'Pedro',
};

const mockHandler = jest.fn();

describe('<Blog />', () => {
  test('renders only blogs title and author', () => {
    render(<Blog blog={blog} currentUser={user} />);
    const title = screen.getByText('my blog', { exact: false });
    const author = screen.getByText('mr Bean', { exact: false });

    expect(title).toBeInTheDocument();
    expect(author).toBeInTheDocument();

    expect(screen.queryByText('www.beans.com', { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText('69', { exact: false })).not.toBeInTheDocument();
  });

  test('renders all details after [view] button press', async () => {
    render(<Blog blog={blog} currentUser={user} />);
    const viewButton = screen.getByRole('button', { name: 'view' });
    userEvent.click(viewButton);

    const url = await screen.findByText('www.beans.com', { exact: false });
    const likes = await screen.findByText('69', { exact: false });

    expect(url).toBeInTheDocument();
    expect(likes).toBeInTheDocument();
    expect(screen.getByText('my blog', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('mr Bean', { exact: false })).toBeInTheDocument();
  });

  test('view button callback is called twice', async () => {
    render(<Blog blog={blog} currentUser={user} addLike={mockHandler} />);
    const appUser = userEvent.setup();

    const viewButton = screen.getByRole('button', { name: 'view' });
    await appUser.click(viewButton);

    const likeButton = await screen.findByRole('button', { name: 'like' });
    await appUser.click(likeButton);
    await appUser.click(likeButton);

    await expect(mockHandler).toHaveBeenCalledTimes(2);
  });
});
