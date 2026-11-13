const Author = require("../models/Author");
const Book = require("../models/Book");

exports.createAuthor = async (req, res) => {
    try {
        const author = await Author.create(req.body);
        res.status(201).json(author); }
        catch (error) {
            res.status(400).json({ message: error.message }); }
        };

exports.getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors); }
        catch (error) {
            res.status(500).json({ message: error.message }); }
        };

exports.getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: "Author not found" }); }
            res.json(author); }
            catch (error) {
                res.status(400).json({ message: error.message }); }
            };

exports.updateAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(
            req.params.id, req.body, {
                new: true, runValidators: true });
                if (!author) {
                    return res.status(404).json({ message: "Author not found" }); }
                    res.json(author); }
                    catch (error) {
                        res.status(400).json({ message: error.message }); }
                    };

exports.deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: "Author not found" }); }
            const hasBooks = await Book.exists({ author: author._id });
            if (hasBooks) {
                return res.status(409).json({ message: "Cannot delete an author who still has books" }); }
                await author.deleteOne();
                res.json({ message: "Author deleted" });}
                catch (error) {
                    res.status(400).json({ message: error.message }); }
                };

exports.getAuthorBooks = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).json({ message: "Author not found" });
        const books = await Book.find({ author: author._id });
        res.json(books); } 
        catch (error) {
            res.status(400).json({ message: error.message }); }
        };

exports.getAuthorStats = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: "Author not found" }); 
        }
        const books = await Book.find({ author: author._id });
        const bookCount = books.length;
        const averagePrice = bookCount
        ? books.reduce((sum, book) => sum + book.price, 0) / bookCount: 0;
        const cheapestBook = bookCount
        ? books.reduce((cheapest, book) => book.price < cheapest.price ? book : cheapest).title 
        : null;
        const mostExpensiveBook = bookCount
        ? books.reduce((mostExpensive, book) => book.price > mostExpensive.price ? book : mostExpensive).title
        : null;
        res.json({
            author: author.name,
            bookCount,
            averagePrice,
            cheapestBook,
            mostExpensiveBook }); 
        }
        catch (error) {
            res.status(400).json({ message: error.message }); } 
        };