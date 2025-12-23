const bcrypt = require('bcryptjs');
const { argv, exit } = require('process');

const password = argv[2];
const saltRounds = 10;

const hashedPassword = bcrypt.hashSync(password, saltRounds);

console.log(`Hashed Password:\n${hashedPassword}`);