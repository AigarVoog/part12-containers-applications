const listHelper = require("../utils/list_helper");

const blog = [
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
];

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const mostLikedBlog = {
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12,
};

const mostBlogsMany = {
  author: "Robert C. Martin",
  blogs: 3,
};

const mostBlogsSingle = {
  author: "Edsger W. Dijkstra",
  blogs: 1,
};

const mostLikedMany = {
  author: "Edsger W. Dijkstra",
  likes: 17
}

const mostLikedSingle = {
  author: "Edsger W. Dijkstra",
  likes: 12
}

describe("dummy", () => {
  test("dummy returns one", () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test("when list has only one blog equals the likes of that", () => {
    expect(listHelper.totalLikes(blog)).toBe(12);
  });

  test("of a bigger list is calculated right", () => {
    expect(listHelper.totalLikes(blogs)).toBe(36);
  });
});

describe("most liked blog", () => {
  test("of empty list is null", () => {
    expect(listHelper.favoriteBlog([])).toEqual(null);
  });

  test("when list has only one blog, most liked one is that", () => {
    expect(listHelper.favoriteBlog(blog)).toEqual(mostLikedBlog);
  });

  test("finds the most liked blog from a bigger list", () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual(mostLikedBlog);
  });
});

describe("author with most blogs", () => {
  test("of empty list is null", () => {
    expect(listHelper.mostBlogs([])).toEqual(null);
  });

  test("when list has only one blog, author with most blogs is that", () => {
    expect(listHelper.mostBlogs(blog)).toEqual(mostBlogsSingle);
  });

  test("finds the author with the most blogs from a bigger list", () => {
    expect(listHelper.mostBlogs(blogs)).toEqual(mostBlogsMany);
  });
});

describe("author with most likes", () => {
  test("of empty list is null", () => {
    expect(listHelper.mostLikes([])).toEqual(null);
  });

  test("when list has only one blog, author with most blogs is that", () => {
    expect(listHelper.mostLikes(blog)).toEqual(mostLikedSingle);
  });

  test("finds the author with the most likes from a bigger list", () => {
    expect(listHelper.mostLikes(blogs)).toEqual(mostLikedMany);
  });
});
