const container = document.getElementById("container");

// load all data books from database with API
const loadBooks = async (con = "", filter = "") => {
  if (con == "" && filter == "") {
    try {
      const res = await fetch("http://localhost:9000/books");
      const data = await res.json();
      dataBooks = await data.data.books;
      return dataBooks;
    } catch (err) {
      console.log(err);
    }
  } else if (con == "reading" && filter == "1") {
    try {
      const res = await fetch("http://localhost:9000/books?reading=1");
      const data = await res.json();
      dataBooks = await data.data.books;
      return dataBooks;
    } catch (err) {
      console.log(err);
    }
  } else if (con == "reading" && filter == "0") {
    try {
      const res = await fetch("http://localhost:9000/books?reading=0");
      const data = await res.json();
      dataBooks = await data.data.books;
      return dataBooks;
    } catch (err) {
      console.log(err);
    }
  } else if (con == "finished" && filter == "1") {
    try {
      const res = await fetch("http://localhost:9000/books?finished=1");
      const data = await res.json();
      dataBooks = await data.data.books;
      return dataBooks;
    } catch (err) {
      console.log(err);
    }
  } else if (con == "finished" && filter == "0") {
    try {
      const res = await fetch("http://localhost:9000/books?finished=0");
      const data = await res.json();
      dataBooks = await data.data.books;
      return dataBooks;
    } catch (err) {
      console.log(err);
    }
  }
};

document.addEventListener("DOMContentLoaded", async function () {
  // Load all books for the first time
  const allBooks = await loadBooks();
  while (container.firstChild) {
    container.firstChild.remove();
  }
  allBooks.forEach((element) => {
    const div = document.createElement("div");
    div.innerHTML = `<div class="card border border-dark mx-2 my-2 shadow-lg" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">${element.name}</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">${element.publisher}</h6>
              <p class="card-text">Data ini diambil dari database menggunakan perantara Restful API dengan id '<strong>${element.id}</strong>' yang dibuat dengan nanoid</p>
            <button type="button" class="btn btn-primary" id="${element.id}">
                Details
            </button>
            </div>
          </div>`;
    container.append(div);
  });

  // get book by id and show details
  container.addEventListener("click", async function (e) {
    if (e.target.innerText == "Details") {
      const detailsBooks = await loadBooks();
      const promises = detailsBooks.map(async (element) => {
        if (e.target.id == element.id) {
          try {
            const res = await fetch(`http://localhost:9000/books/${e.target.id}`);
            const data = await res.json();
            detailsDataBooks = await data.data.book;
            return detailsDataBooks;
          } catch (err) {
            console.log(err);
          }
        }
      });
      const result = (await Promise.all(promises)).filter(Boolean)[0];

      // make card for book detail
      while (container.firstChild) {
        container.firstChild.remove();
      }
      async function makeCardForBookDetail() {
        if ((await result) !== undefined) {
          const div = document.createElement("div");
          div.innerHTML = `<div class="card border border-dark mx-2 my-2 shadow-lg" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">title->${result.name}</h5>
          <h6 class="card-subtitle mb-2">publisher->${result.publisher}</h6>
          <h6 class="card-subtitle mb-2">author->${result.author}</h6>
          <h6 class="card-subtitle mb-2">finished status->${result.finished == true ? "Finished Already" : "Unfinished"}</h6>
          <h6 class="card-subtitle mb-2">reading status->${result.reading == true ? "Readed" : "Unreaded"}</h6>
          <p class="card-text">Data ini diambil dari database menggunakan perantara Restful API dengan id '<strong>${result.id}</strong>' yang dibuat dengan nanoid</p>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" id="editButton" data-bs-target="#EditModal">
            Edit this book
        </button>
        <button type="button" class="btn btn-primary my-2" id="deleteButton">
            Delete this book
        </button>
        </div>
      </div>`;
          container.append(div);
        }
      }

      // Pick the action button that clicked
      async function actionButton() {
        await makeCardForBookDetail();
        const card = document.getElementsByClassName("card")[0];

        card.addEventListener("click", async function (e) {
          if (e.target.innerText == "Edit this book") {
            // Edit selected book
            //   load data and add in modal
            const editForm = document.getElementById("editform");
            async function fillFormWithValueFromDB() {
              if ((await result) !== undefined) {
                editForm["name"]["value"] = result.name;
                editForm["year"]["value"] = result.year;
                editForm["author"]["value"] = result.author;
                editForm["summary"]["value"] = result.summary;
                editForm["publisher"]["value"] = result.publisher;
                editForm["pageCount"]["value"] = result.pageCount;
                editForm["readPage"]["value"] = result.readPage;
              }
            }
            fillFormWithValueFromDB();

            // event submit for edit data selected
            editForm.addEventListener("submit", async function (e) {
              e.preventDefault();
              const name = editForm.name.value;
              const year = editForm.year.value;
              const author = editForm.author.value;
              const summary = editForm.summary.value;
              const publisher = editForm.publisher.value;
              const pageCount = editForm.pageCount.value;
              const readPage = editForm.readPage.value;
              const reading = editForm.reading.value == "true" ? true : false;

              // fetch function
              async function editBooks(url = "", data = {}) {
                const response = await fetch(url, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: data,
                });
                return response.json();
              }

              // Book data to Change
              const data = {
                name: name,
                year: year,
                author: author,
                summary: summary,
                publisher: publisher,
                pageCount: pageCount,
                readPage: readPage,
                reading: reading,
              };

              // console.log(data)
              if ((await result) !== undefined) {
                // validation of front
                if (name.trim() == "") {
                  window.alert("Name tidak boleh kosong");
                } else if (year.trim() == "") {
                  window.alert("Year tidak boleh kosong");
                } else if (author.trim() == "") {
                  window.alert("Author tidak boleh kosong");
                } else if (summary.trim() == "") {
                  window.alert("Summary tidak boleh kosong");
                } else if (publisher.trim() == "") {
                  window.alert("Publisher tidak boleh kosong");
                } else if (pageCount.trim() == "") {
                  window.alert("Page count tidak boleh kosong");
                } else if (readPage.trim() == "") {
                  window.alert("Read page tidak boleh kosong");
                } else if (pageCount < readPage) {
                  window.alert("Read Page tidak boleh lebih besar dari Page Count");
                }
                // fetching
                editBooks(`http://localhost:9000/books/${result.id}`, JSON.stringify(data))
                  .then((res) => {
                    if (res.statusCode == 200) {
                      window.alert("Data Buku Berhasil Diubah");
                      window.location.reload();
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            });
          } else if (e.target.innerText == "Delete this book") {
            // Delete selected book
            if ((await result) !== undefined) {
              try {
                const res = await fetch(`http://localhost:9000/books/${result.id}`, {
                  method: "DELETE",
                });
                const data = await res.json();
                if (data.statusCode == 200) {
                  window.alert(data.message);
                  window.location.reload();
                }
              } catch (err) {
                console.log(err);
              }
            }
          }
        });
      }
      actionButton();
    }
  });

  // get all books without filter
  const allBooksButton = document.getElementById("allbooks");
  allBooksButton.addEventListener("click", async function () {
    const allBooks = await loadBooks();
    while (container.firstChild) {
      container.firstChild.remove();
    }
    allBooks.forEach((element) => {
      const div = document.createElement("div");
      div.innerHTML = `<div class="card border border-dark mx-2 my-2 shadow-lg" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${element.name}</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">${element.publisher}</h6>
                  <p class="card-text">Data ini diambil dari database menggunakan perantara Restful API dengan id '<strong>${element.id}</strong>' yang dibuat dengan nanoid</p>
                <button type="button" class="btn btn-primary" id="${element.id}">
                Details
                </button>
                </div>
              </div>`;
      container.append(div);
    });
  });

  // get Readed Books
  const readedButton = document.getElementById("readed");
  readedButton.addEventListener("click", async function () {
    const readedBooks = await loadBooks("reading", "1");
    while (container.firstChild) {
      container.firstChild.remove();
    }
    readedBooks.forEach((element) => {
      const div = document.createElement("div");
      div.innerHTML = `<div class="card border border-dark mx-2 my-2 shadow-lg" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${element.name}</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">${element.publisher}</h6>
                  <p class="card-text">Data ini diambil dari database menggunakan perantara Restful API dengan id '<strong>${element.id}</strong>' yang dibuat dengan nanoid</p>
                <button type="button" class="btn btn-primary" id="${element.id}">
                Details
                </button>
                </div>
              </div>`;
      container.append(div);
    });
  });

  // get Unreaded Books
  const unreadedButton = document.getElementById("unreaded");
  unreadedButton.addEventListener("click", async function () {
    const unreadedBooks = await loadBooks("reading", "0");
    while (container.firstChild) {
      container.firstChild.remove();
    }
    unreadedBooks.forEach((element) => {
      const div = document.createElement("div");
      div.innerHTML = `<div class="card border border-dark mx-2 my-2 shadow-lg" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${element.name}</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">${element.publisher}</h6>
                  <p class="card-text">Data ini diambil dari database menggunakan perantara Restful API dengan id '<strong>${element.id}</strong>' yang dibuat dengan nanoid</p>
                <button type="button" class="btn btn-primary" id="${element.id}">
                    Details
                </button>
                </div>
              </div>`;
      container.append(div);
    });
  });

  // get finished books
  const finishedButton = document.getElementById("finished");
  finishedButton.addEventListener("click", async function () {
    const finishedBooks = await loadBooks("finished", "1");
    while (container.firstChild) {
      container.firstChild.remove();
    }
    finishedBooks.forEach((element) => {
      const div = document.createElement("div");
      div.innerHTML = `<div class="card border border-dark mx-2 my-2 shadow-lg" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${element.name}</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">${element.publisher}</h6>
                  <p class="card-text">Data ini diambil dari database menggunakan perantara Restful API dengan id '<strong>${element.id}</strong>' yang dibuat dengan nanoid</p>
                <button type="button" class="btn btn-primary" id="${element.id}">
                Details
                </button>
                </div>
              </div>`;
      container.append(div);
    });
  });

  // get unfinished books
  const unfinishedButton = document.getElementById("unfinished");
  unfinishedButton.addEventListener("click", async function () {
    const unfinishedBooks = await loadBooks("finished", "0");
    while (container.firstChild) {
      container.firstChild.remove();
    }
    unfinishedBooks.forEach((element) => {
      const div = document.createElement("div");
      div.innerHTML = `<div class="card border border-dark mx-2 my-2 shadow-lg" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${element.name}</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">${element.publisher}</h6>
                  <p class="card-text">Data ini diambil dari database menggunakan perantara Restful API dengan id '<strong>${element.id}</strong>' yang dibuat dengan nanoid</p>
                <button type="button" class="btn btn-primary" id="${element.id}">
                    Details
                </button>
                </div>
              </div>`;
      container.append(div);
    });
  });

  // Add new book to database and some validation in Front
  const form = document.getElementsByTagName("form")[0];
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = form.name.value;
    const year = form.year.value;
    const author = form.author.value;
    const summary = form.summary.value;
    const publisher = form.publisher.value;
    const pageCount = form.pageCount.value;
    const readPage = form.readPage.value;
    const reading = form.reading.value == "true" ? true : false;

    if (name.trim() == "") {
      window.alert("Name tidak boleh kosong");
    } else if (year.trim() == "") {
      window.alert("Year tidak boleh kosong");
    } else if (author.trim() == "") {
      window.alert("Author tidak boleh kosong");
    } else if (summary.trim() == "") {
      window.alert("Summary tidak boleh kosong");
    } else if (publisher.trim() == "") {
      window.alert("Publisher tidak boleh kosong");
    } else if (pageCount.trim() == "") {
      window.alert("Page count tidak boleh kosong");
    } else if (readPage.trim() == "") {
      window.alert("Read page tidak boleh kosong");
    } else if (pageCount < readPage) {
      window.alert("Read Page tidak boleh lebih besar dari Page Count");
    }

    async function postBooks(url = "", data = {}) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      return response.json();
    }

    const data = {
      name: name,
      year: year,
      author: author,
      summary: summary,
      publisher: publisher,
      pageCount: pageCount,
      readPage: readPage,
      reading: reading,
    };

    postBooks("http://localhost:9000/books", JSON.stringify(data))
      .then((res) => {
        if (res.statusCode == 201) {
          window.alert("Data Buku Berhasil Ditambahkan");
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
