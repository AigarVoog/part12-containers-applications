import { useState } from 'react';

const Blog = ({ blog, addLike, removeBlog, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const blogStyle = {
    border: 'solid 1px',
    padding: '5px',
    margin: '5px',
    marginLeft: '0px',
  };
  const isCreator = blog.user.username === currentUser.username;

  const handleRemove = (id) => {
    if (
      window.confirm(`Are you sure you want to remove the blog "${blog.title}" by ${blog.author}?`)
    ) {
      removeBlog(id);
    }
  };

  return (
    <div className='blog'>
      {isOpen ? (
        <div style={blogStyle}>
          {blog.title} {blog.author} <button onClick={() => setIsOpen(!isOpen)}>hide</button> <br />
          {blog.url} <br />
          <span className='likes'>{blog.likes}</span>
          <button onClick={() => addLike(blog.id)}>like</button> <br />
          {blog.user.username} <br />
          {isCreator && <button className='remove-button' onClick={() => handleRemove(blog.id)}>remove</button>}
        </div>
      ) : (
        <div style={blogStyle}>
          {blog.title} {blog.author} <button onClick={() => setIsOpen(!isOpen)}>view</button>
        </div>
      )}
    </div>
  );
};

export default Blog;
