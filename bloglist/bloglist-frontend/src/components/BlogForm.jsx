import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    });
    setNewBlogTitle('');
    setNewBlogAuthor('');
    setNewBlogUrl('');
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <label htmlFor='title'>title: </label>
        <input
          id='title'
          value={newBlogTitle}
          onChange={(event) => setNewBlogTitle(event.target.value)}
        />
        <br />
        <label htmlFor='author'>author: </label>
        <input
          id='author'
          value={newBlogAuthor}
          onChange={(event) => setNewBlogAuthor(event.target.value)}
        />
        <br />
        <label htmlFor='url'>url: </label>
        <input
          id='url'
          value={newBlogUrl}
          onChange={(event) => setNewBlogUrl(event.target.value)}
        />
        <br />
        <button id='submit-blog' type='submit'>create</button>
      </form>
    </div>
  );
};

export default BlogForm;
