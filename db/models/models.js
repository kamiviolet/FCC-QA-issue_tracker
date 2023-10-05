const mongoose = require("mongoose");

const { Schema } = mongoose;

const IssueSchema = new Schema({
  issue_title: String,
  issue_text: String,
  created_on: String,
  updated_on: String,
  created_by: String,
  assigned_to: String,
  open: Boolean,
  status_text: String,
  project: String
})

const IssueModel = mongoose.model("issues", IssueSchema)

module.exports = IssueModel;