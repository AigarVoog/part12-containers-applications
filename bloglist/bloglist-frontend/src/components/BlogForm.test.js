import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  test('calls the event handler with the right details when a new blog is created', async () => {
    const createBlogMock = jest.fn();
    render(<BlogForm createBlog={createBlogMock} />);

    const user = userEvent.setup();
    const titleInput = screen.getByLabelText('title:', { selector: 'input' });
    const authorInput = screen.getByLabelText('author:', { selector: 'input' });
    const urlInput = screen.getByLabelText('url:', { selector: 'input' });

    await user.type(titleInput, 'test title');
    await user.type(authorInput, 'test author');
    await user.type(urlInput, 'www.test.com');
    await user.click(screen.getByRole('button', { name: 'create' }));

    expect(createBlogMock).toHaveBeenCalledWith({
      title: 'test title',
      author: 'test author',
      url: 'www.test.com',
    });
  });
});
