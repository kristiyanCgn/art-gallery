const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/env');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minlength: 4,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
    },
    address: {
        type: String,
        required: true,
        maxlength: 20,
    },
    publications: [{
        type: mongoose.Types.ObjectId,
        ref: 'Publication',
    }],
    shares: [{
        type: mongoose.Types.ObjectId,
        ref: 'Publication',
    }],
});

userSchema.pre('save', function(next){
    bcrypt.hash(this.password, SALT_ROUNDS)
        .then(hashedPassword => {
            this.password = hashedPassword;

            next();
        });
});

const User = mongoose.model('User', userSchema);

module.exports = User;