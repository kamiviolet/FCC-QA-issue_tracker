const mongoose = require("mongoose")
const db = require("./db")
const issueModel = require("./models/models")

db()

const resetDB = async () => {
  await issueModel.deleteMany({})
  console.log("reset successfully");
}

resetDB().then(() => mongoose.disconnect());
