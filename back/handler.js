const { nanoid } = require("nanoid");
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookshelf",
});

connection.connect(function (err) {
  if (err) {
    console.log(`error connecting ${err.stack}`);
    return;
  }
  // console.log(`connected as id ${connection.threadId}`)
  console.log(`Berhasil terkoneksi dengan database `);
});

const addBookToBookShelf = (req, res) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === undefined) {
    res.status(400).send({ statusCode: 400, status: "fail", message: "Gagal menambahkan buku. Mohon isi nama buku" });
  } else if (readPage > pageCount) {
    res.status(400).send({ statusCode: 400, status: "fail", message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount" });
  } else {
    const post = {
      id: id,
      name: name,
      year: year,
      author: author,
      summary: summary,
      publisher: publisher,
      pageCount: pageCount,
      readPage: readPage,
      finished: finished,
      reading: reading,
      insertedAt: insertedAt,
      updatedAt: updatedAt,
    };

    connection.query(`INSERT INTO books_table SET ?`, post, function (error) {
      if (error) throw error;
      res.status(201).send({
        statusCode: 201,
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
    });
  }
};

const getAllBooks = (req, res) => {
  const { reading, finished, name } = req.query;
  if (reading === "1") {
    connection.query(`SELECT id,name,publisher FROM books_table WHERE reading = true`, function (error, result) {
      if (error) throw error;
      res.status(200).send({
        statusCode: 200,
        status: "success",
        data: {
          books: result,
        },
      });
    });
  } else if (reading === "0") {
    connection.query(`SELECT id,name,publisher FROM books_table WHERE reading = false`, function (error, result) {
      if (error) throw error;
      res.status(200).send({
        statusCode: 200,
        status: "success",
        data: {
          books: result,
        },
      });
    });
  } else if (finished === "1") {
    connection.query(`SELECT id,name,publisher FROM books_table WHERE finished = true`, function (error, result) {
      if (error) throw error;
      res.status(200).send({
        statusCode: 200,
        status: "success",
        data: {
          books: result,
        },
      });
    });
  } else if (finished === "0") {
    connection.query(`SELECT id,name,publisher FROM books_table WHERE finished = false`, function (error, result) {
      if (error) throw error;
      res.status(200).send({
        statusCode: 200,
        status: "success",
        data: {
          books: result,
        },
      });
    });
  } else if (name === "Dicoding") {
    connection.query(`SELECT id, name, publisher FROM books_table WHERE name LIKE '%Dicoding%'`, function (error, result) {
      if (error) throw error;
      res.status(200).send({
        statusCode: 200,
        status: "success",
        data: {
          books: result,
        },
      });
    });
  } else {
    connection.query(`SELECT id,name,publisher FROM books_table`, function (error, result) {
      if (error) throw error;
      res.status(200).send({
        statusCode: 200,
        status: "success",
        data: {
          books: result,
        },
      });
    });
  }
};

const getBookById = (req, res) => {
  const { bookId } = req.params;
  connection.query(`SELECT * FROM books_table WHERE id = '${bookId}'`, function (error, result) {
    if (error) throw error;
    if (result.length == 0) {
      res.status(404).send({
        statusCode: 404,
        status: "fail",
        message: "Buku tidak ditemukan",
      });
    } else {
      // console.log(result[0]['reading'])
      result[0]["reading"] == 0 ? (result[0]["reading"] = false) : (result[0]["reading"] = true);
      // console.log(result[0]['reading'])
      result[0]["finished"] == 0 ? (result[0]["finished"] = false) : (result[0]["finished"] = true);
      res.status(200).send({
        status: "success",
        data: {
          book: result[0],
        },
      });
    }
  });
};

const editBookById = (req, res) => {
  const { bookId } = req.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
  const updatedAt = new Date().toISOString();

  const update = [name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt];

  if (name === undefined) {
    res.status(400).send({
      statusCode: 400,
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
  } else if (readPage > pageCount) {
    res.status(400).send({
      statusCode: 400,
      statusCode: 400,
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
  } else {
    connection.query(`UPDATE books_table SET name = ?, year = ?, author = ?,summary = ?, publisher = ?, pageCount = ?, readPage = ?, reading = ?, updatedAt = ? WHERE id = '${bookId}'`, update, function (error, result) {
      if (error) throw error;
      if (result.affectedRows == 1) {
        res.status(200).send({
          statusCode: 200,
          status: "success",
          message: "Buku berhasil diperbarui",
        });
      } else {
        res.status(404).send({
          statusCode: 404,
          status: "fail",
          message: "Gagal memperbarui buku. Id tidak ditemukan",
        });
      }
    });
  }
};

const deleteBookById = (req, res) => {
  const { bookId } = req.params;
  connection.query(`DELETE FROM books_table WHERE id = '${bookId}'`, function (error, result) {
    if (error) throw error;
    if (result.affectedRows == 1) {
      res.status(200).send({
        statusCode: 200,
        status: "success",
        message: "Buku berhasil dihapus",
      });
    } else {
      res.status(404).send({
        statusCode: 404,
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      });
    }
  });
};

module.exports = { addBookToBookShelf, getAllBooks, getBookById, editBookById, deleteBookById };
