const express = require('express');
const { Todo } = require('../mongo');
const router = express.Router();
const { getAsync, setAsync } = require('../redis');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });

  const currentCount = (await getAsync('added_todos')) || 0;
  await setAsync('added_todos', Number(currentCount) + 1);

  res.send(todo);
});

/* GET statistics. */
router.get('/statistics', async (req, res) => {
  const addedTodos = (await getAsync('added_todos')) || 0;
  res.json({ added_todos: Number(addedTodos) });
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.status(200).json(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const updatedTodo = req.body;
  for (const key in updatedTodo) {
    req.todo[key] = updatedTodo[key];
  }
  const savedTodo = await req.todo.save();
  res.status(200).json(savedTodo);
});

router.use('/:id', findByIdMiddleware, singleRouter);

module.exports = router;
