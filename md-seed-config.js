const dotenv = require('dotenv').config()
const mongoose = require('mongoose');

const UsersSeeder = require('./src/db/seed/users.seed.js');

const mongoURL = process.env.MONGO_URI;

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
const seedersList = {
  UsersSeeder
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
const connect = async () =>
  await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
const dropdb = async () => mongoose.connection.db.dropDatabase();

module.exports = {
  seedersList,
  connect,
  dropdb
}
