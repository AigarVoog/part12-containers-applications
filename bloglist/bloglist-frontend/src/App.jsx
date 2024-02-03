import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [notificationMessage, setNotificationMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setIsError(true);
      setNotificationMessage('wrong credentials');
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    window.location.reload();
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      let returnedBlog = await blogService.create(blogObject);
      returnedBlog = {
        ...returnedBlog,
        user: {
          id: returnedBlog.user,
          username: user.username,
          name: user.name,
        },
      };
      setBlogs(blogs.concat(returnedBlog));

      const message = `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`;
      setIsError(false);
      setNotificationMessage(message);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (error) {
      setIsError(true);
      setNotificationMessage(error.message);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const addLike = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id);
      const newBlogObject = { ...blog, likes: blog.likes + 1 };

      const returnedBlog = await blogService.update(id, newBlogObject);
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));

      const message = `a like for blog ${returnedBlog.title} added successfully`;
      setIsError(false);
      setNotificationMessage(message);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (error) {
      setIsError(true);
      setNotificationMessage(error.message);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      const message = 'blog removed successfully';
      setIsError(false);
      setNotificationMessage(message);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (error) {
      setIsError(true);
      setNotificationMessage(error.message);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type='submit'>
        login
      </button>
    </form>
  );

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  return (
    <div>
      {user ? <h2>blogs</h2> : <h2>log in to application</h2>}
      <Notification message={notificationMessage} isError={isError} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <h2>create new</h2>
          {blogForm()}
          <br />
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                addLike={addLike}
                removeBlog={removeBlog}
                currentUser={user}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
