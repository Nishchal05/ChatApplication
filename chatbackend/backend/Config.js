const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Error in connection: ${error}`);
  }
};

module.exports = connection;
