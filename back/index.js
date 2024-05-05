const express = require("express");
const App = express();
const port = 9000;
const cors = require("cors");
const { addBookToBookShelf, getAllBooks, getBookById, editBookById, deleteBookById } = require("./handler");

App.use(cors());

//untuk mengurai jika data yang dikirimkan dalam format json string
App.use(express.json());

//untuk dapat menerima data dari bentuk form dan diubah ke json
App.use(express.urlencoded({ extended: true }));

App.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});

App.post("/books", addBookToBookShelf);

App.get("/books", getAllBooks);

App.get("/books/:bookId", getBookById);

App.put("/books/:bookId", editBookById);

App.delete("/books/:bookId", deleteBookById);
