const Book = require("../models/Book");

const Author = require("../models/Author");

exports.createBook = async (req, res) => {
    try {
        const price = Number(req.body.price);
        const year = Number(req.body.publishedYear);
        const currentYear = new Date().getFullYear();
        if (
            !Number.isFinite(price) || 
            price <= 0 ||
            !Number.isInteger(year) ||
            year < 1450 ||
            year > currentYear ) {
                return res.status(422).json({ message: "Invalid price or published year" }); }
                const author = await Author.findOne({ name: req.body.author }).collation({ locale: "en", strength: 2 });
                if (!author) {
                    return res.status(400).json({ message: "Author does not exist" }); }
                    const duplicate = await Book.findOne({
                        author: author._id, title: req.body.title.trim()}).collation({ locale: "en", strength: 2 });
                        if (duplicate) {
                            return res.status(409).json({
                                message: "This author already has a book with that title" }); }
                                const book = await Book.create({...req.body, author: author._id});
                                res.status(201).json(book); }

                                catch (error) {
                                    res.status(400).json({ message: error.message }); }
                                };

exports.getBooks = async (req, res) => {
    try {
        const filter = {};
        if (req.query.genre) filter.genre = req.query.genre;
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice); }
            if (req.query.author) filter.author = req.query.author;
            if (req.query.search) {
                filter.$or = [{ title: { $regex: req.query.search, $options: "i" } },{ genre: { $regex: req.query.search, $options: "i" } }]; }
                const sortField = req.query.sort || "title";
                const sortOrder = req.query.order === "desc" ? -1 : 1;
                const page = Math.max(Number(req.query.page) || 1, 1);
                const limit = Math.max(Number(req.query.limit) || 10, 1);
                const skip = (page - 1) * limit;
                const total = await Book.countDocuments(filter);
                const books = await Book.find(filter).populate("author").sort({ [sortField]: sortOrder })
                .skip(skip).limit(limit);
                res.json({
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    books
                }); }
                catch (error) {
                    res.status(500).json({ message: error.message }); } 
                };

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("author");
        if (!book) {
            return res.status(404).json({ message: "Book not found" }); }
            res.json(book); }

            catch (error) {
                res.status(400).json({ message: error.message }); }
            };

exports.updateBook = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.price !== undefined) updates.price = Number(updates.price);
        if (updates.publishedYear !== undefined) updates.publishedYear = Number(updates.publishedYear);
        if ((updates.price !== undefined && (!Number.isFinite(updates.price) || updates.price <= 0)) ||
        (updates.publishedYear !== undefined && (!Number.isInteger(updates.publishedYear) || 
        updates.publishedYear < 1450 || updates.publishedYear > new Date().getFullYear()))) {
            return res.status(422).json({ message: "Invalid price or published year" }); }
            const book = await Book.findById(req.params.id);
            if (!book) return res.status(404).json({ message: "Book not found" });
            if (updates.author) {
                const author = await Author.findById(updates.author);
                if (!author) {
                    return res.status(400).json({ message: "Author does not exist" }); } }
                    const duplicate = await Book.findOne({
                        _id: { $ne: book._id },
                        author: updates.author || book.author,
                        title: (updates.title || book.title).trim()}).collation({ locale: "en", strength: 2 });
                        if (duplicate) {
                            return res.status(409).json({
                                message: "This author already has a book with that title" }); }
                                const updatedBook = await Book.findByIdAndUpdate(
                                    req.params.id,
                                    updates, { new: true, runValidators: true });
                                    res.json(updatedBook); }
                                    catch (error) {
                                        res.status(400).json({ message: error.message }); } 
                                    };

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        await book.deleteOne();
        res.json({ message: "Book deleted" }); }
        catch (error) {
            res.status(400).json({ message: error.message }); } 
        };