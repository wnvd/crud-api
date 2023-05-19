const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema({
    title: {
        type: String,
        trime: true,
        required: [true, 'Please add a review title.'],
        maxLength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 an 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
});

// Prevent User from submitting more than one review per bootcamp
ReviewsSchema.index({bootcamp: 1, user: 1}, {unique: true});
