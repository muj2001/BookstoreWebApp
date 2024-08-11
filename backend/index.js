import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import booksRoute from "./routes/booksRoutes.js";
import cors from "cors";

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Middleware for handling CORS
// Option 1: Allow all origins
app.use(cors());

// Option 2: Allow only specific origins
apps.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));



app.get("/", (req, res) => {
    console.log("GET request received");
    return res.status(234).json({ message: "GET request received" });
});

app.use("/books", booksRoute);

// Route for saving or creating a new Book
app.post("/books", async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.publishYear) {
            return res.status(400).json({ message: "Send all required fields: title, author, publishYear" });
        }

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        };

        const book = await Book.create(newBook);

        return res.status(201).json({ message: "New book created", book });

    } catch (error) {
        console.log("Error saving book", error);
        return res.status(500).json({ message: error.message });
    } 
});

// Route for getting all books
app.get("/books", async (req, res) => {
    try {

        const books = await Book.find({});
        return res.status(200).json({
            message: "List of all books",
            count: books.length,
            data: books,
        });

    } catch (error) {

        console.log("Error getting books", error);
        return res.status(500).json({ message: error.message });

    }
});

// Route for getting a single book
app.get("/books/:id", async (req, res) => {
    try {
        
        const { id } = req.params;

        const book = await Book.findById(id);
        return res.status(200).json({
            message: "Book returned",
            data: book,
        });

    } catch (error) {

        console.log("Error getting books", error);
        return res.status(500).json({ message: error.message });

    }
});

// Route for updating a book
app.put("/books/:id", async (req, res) => {
    try {
        if (
            !req.body.title || 
            !req.body.author || 
            !req.body.publishYear
        ) {
            return res.status(400)
            .json({
                message: "Send all required fields: title, author, publishYear",
            });
            }
        const { id } = req.params;

        const book = await Book.findByIdAndUpdate(id, req.body);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json({ message: "Book updated successfully"});
    } catch
    {
        console.log("Error updating book", error);
        return res.status(500).json({ message: error.message});
    }

});

// Route for deleting a book
app.delete("/books/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json({ message: "Book deleted successfully"});
    } catch
    {
        console.log("Error deleting book", error);
        return res.status(500).json({ message: error.message});
    }
});

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    });