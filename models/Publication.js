const mongoose = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)/;

const publicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 6,
    },
    paintingTechnique: {
        type: String,
        required: true,
        maxlength: 15,
    },
    artPicture: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return URL_PATTERN.test(value);
            },
            message: 'Image must be a valid URL!'
        },
    },
    certificate: {
        type: String,
        enum: ['Yes', 'No'],
        required: true,
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    usersShared: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
});

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;