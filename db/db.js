const mongoose = require("mongoose")

async function main() {
  const URI = process.env.MONGO_URI;

  try {
    await mongoose.connect(URI, { dbname: "IssueTrackerDB" });
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;

    db.once("open", ()=>console.log("Connected successfully"))
  } catch (e) {
    console.error(e);
    throw new Error("Unable to Connect to Database");
  }
}


module.exports = main;
