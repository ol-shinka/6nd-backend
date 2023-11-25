const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");
const User = require("./models/user");
const Book = require("./models/book");

dotenv.config();

app.use("/users", userRouter);
app.use("/books", bookRouter);

const {
  PORT = 3005,
  HOST = "127.0.0.1",
  MONGO_URL = "mongodb://127.0.0.1:27017/mybd",
} = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error", err));

app.get("/", (req, res) => {
  res.send("Вас приветствует электронная библиотека книг!");
});

app.use(cors());

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Получить список всех пользователей
app.get("/users", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Получить данные по пользователю на основе id
app.get("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Изменить данные пользователя на основе id
app.put("/users/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Создать пользователя
app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((savedUser) => {
      res.json(savedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Удалить данные пользователя на основе id
app.delete("/users/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Получить список всех книг
app.get("/books", (req, res) => {
  Book.find()
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Получить данные по книге на основе id
app.get("/books/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        res.status(404).send("Book not found");
      } else {
        res.json(book);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Изменить данные книги на основе id
app.put("/books/:id", (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((book) => {
      if (!book) {
        res.status(404).send("Book not found");
      } else {
        res.json(book);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Создать книгу
app.post("/books", (req, res) => {
  const book = new Book(req.body);
  book
    .save()
    .then((savedBook) => {
      res.json(savedBook);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Удалить данные книги на основе id
app.delete("/books/:id", (req, res) => {
  Book.findByIdAndRemove(req.params.id)
    .then((book) => {
      if (!book) {
        res.status(404).send("Book not found");
      } else {
        res.json(book);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Middleware для логирования
app.use((req, res, next) => {
  console.log(`Request received: ${req.originalUrl}`);
  next();
});

// Обработчик для несуществующих маршрутов
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Обработчик ошибок сервера
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error");
  next();
});

app.listen(PORT, HOST, () => {
  console.log(`Сервер запущен по адресу http://${HOST}:${PORT}`);
});
