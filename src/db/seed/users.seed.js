const { Seeder } = require('mongoose-data-seed');
const User = require('../../model/userModel');
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);

const data = [
    {
      email: 'team37240@gmail.com',
      role: "SuperAdmin",
      password: bcrypt.hashSync("superadmin", salt),
      name: "admin"
    },
];

class UsersSeeder extends Seeder {
  async shouldRun() {
    return User.countDocuments()
      .exec()
      .then(count => count === 0);
  }

  async run() {
    return User.create(data);
  }
}

module.exports = UsersSeeder;