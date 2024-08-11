import express from "express";
import { Book } from "../models/bookModel.js";


const router = express.Router();

// Route for saving or creating a new Book
router.post("/", async (req, res) => {
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
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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

export default router;