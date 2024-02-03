const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + (blog.likes || 0), 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((max, blog) => {
    if (!max || blog.likes > max.likes) {
      return { title: blog.title, author: blog.author, likes: blog.likes };
    }
    return max;
  }, null);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const blogsPerAuthor = _.countBy(blogs, "author");
  const mostBlogsAuthor = _.maxBy(
    _.keys(blogsPerAuthor),
    (author) => blogsPerAuthor[author]
  );
  return {
    author: mostBlogsAuthor,
    blogs: blogsPerAuthor[mostBlogsAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  const likesPerAuthor = _(blogs)
    .groupBy("author")
    .map((posts, author) => ({
      author: author,
      likes: _.sumBy(posts, "likes"),
    }))
    .value();
  const mostLikedAuthor = _.maxBy(likesPerAuthor, "likes");
  return mostLikedAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
