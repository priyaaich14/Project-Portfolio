const mongoose = require('mongoose')

const configureDB = () => {
  mongoose.connect('mongodb://localhost:27017/portfolio-Marh-24')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err))
}
module.exports = configureDB
