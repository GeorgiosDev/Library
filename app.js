/** User interface */
const buttonModal = document.querySelector(".modal-button")
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const card = document.querySelector(".card")

/** Functions for book modal */
function toggleModal() {
    modal.classList.toggle("show-modal");
    UI.clearModal();
}

function modalClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

/** Events for book modal */
buttonModal.addEventListener("click", toggleModal)
closeButton.addEventListener("click", toggleModal)
window.addEventListener("click", modalClick)

/** Book Class */
class Book {
    constructor(title, author, pages, isRead = false) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

/** UI class with functions to display, add remove book */
class UI {

    static displayBooks() {
        let books = Store.getBooks();
        const card = document.getElementById("card");
        card.innerHTML = '';
        books.forEach((book) => UI.addBook(book));
    }

    static addBook(book) {
        const card = document.getElementById("card")
        const form = document.createElement("div")
        const status = document.createElement("p")
        const html = `<div class="new-card ${book.title}">
                           <div class="book-title" id="card-title" name="title" ">${book.title}</div><br>
                           <div id="card-author" name="author">Author:${book.author}</div><br>        
                           <div id="card-pages" name="pages">Pages:${Number(book.pages)}</div><br>
                           <div id="card-status" name="status">Status:${status.innerHTML}</div><br>
                           <button type="button" class="btn-delete ${book.title}"> Remove Book </button>
                     </div>`;

        status.innerHTML ? book.isRead = "Read it!" : "Not read it yet!";
        form.innerHTML = html;
        card.appendChild(form);
    }

    static clearModal() {
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("pages").value = "";
    }

    static deleteBook(element) {
        const parent = element.parentElement;

        if (element.classList.contains("btn-delete")) {
            const bookTitle = parent.querySelector('.book-title').innerHTML;
            Store.removeBook(bookTitle)
            UI.displayBooks();
        }

    }
}

/** Store */
class Store {

    static getBooks() {
        return !localStorage.getItem('books') ? [] : JSON.parse(localStorage.getItem('books'));
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(bookTitle) {
        const books = Store.getBooks();
        const newBooks = books.filter(book => book.title.trim() !== bookTitle.toString().trim());
        localStorage.setItem('books', JSON.stringify(newBooks));
    }
}

/** Event that displays book when page is loaded */
document.addEventListener("DOMContentLoaded", UI.displayBooks)

/** Rendering Error */
const renderError = () => {
    const alert_msg = document.createElement("p");
    alert_msg.classList.add("alert-message");
    alert_msg.textContent = `Please fill all fields properly.Title : 5-150 characters.Author : 5-100 characters.Pages : 15-1500`;
    modal.appendChild(alert_msg);
    setTimeout(() => {
        alert_msg.remove();
        UI.clearModal();
    }, 4000);
};

/** Event to add new book from modal */
document.getElementById("addBookForm")
        .addEventListener("submit", (e) => {

            e.preventDefault()
            const title = document.querySelector("#title").value
            const author = document.querySelector("#author").value
            const pages = document.querySelector("#pages").value
            const isRead = document.getElementById("isRead").checked;

            const isFormCorrect = title && author && pages > 15 && !isNaN(pages);

            if (isFormCorrect && author.length >= 5  && title.length >= 5 && pages < 1500 && title.length <= 150 && author.length < 100)  {
                toggleModal();
                Store.addBook(new Book(title, author, pages, isRead));
                UI.displayBooks();
                
            } else {
                renderError();
            }
    });

/** Event to delete book from list */
document
    .querySelector(".card-grid")
    .addEventListener("click", (e) => {
        UI.deleteBook(e.target)
    });



