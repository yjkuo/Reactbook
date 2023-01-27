const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  salt: {
    type: String,
    // required: [true, 'Salt is required']
  },
  hash: {
    type: String,
    // required: [true, 'Hash is required']
  },
  thirdPartyId: {
    type: String
  }
})

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  headline: {
    type: String,
    required: [true, 'Headline is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  zipcode: {
    type: Number,
    required: [true, 'Zipcode is required']
  },
  phone: {
    type: String,
    required: [true, 'phone is required']
  },
  dob: {
    type: String,
    required: [true, 'Dob is required']
  },
  following: {
    type: Array,
    required: [true, 'Following is required']
  },
  picture: {
    type: String,
    required: [true, 'Picture is required']
  }
})

const articleSchema = new mongoose.Schema({
  pid: {
    type: Number,
    required: [true, 'pid is required']
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  text: {
    type: String,
    required: [true, 'Content is required']
  },
  date: {
    type: Date,
    required: [true, 'Created date is required']
  },
  comments: {
    type: Array,
    required: [true, 'Comments is required']
  },
  image: {
    type: String,
  }
})
module.exports = {userSchema, profileSchema, articleSchema};
