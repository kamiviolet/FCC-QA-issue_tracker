const db = require("../db/db.js");
const issueModel = require("../db/models/models")
const ObjectId = require('mongoose').Types.ObjectId;

db();

function apiroutes(app) {
  app.route("/api/issues/:project")
    .get(async (req, res) => {
      let project = req.params.project;
      let queryObj = { project };
      let { open, assigned_to } = req.query;

      if (assigned_to) queryObj["assigned_to"] = assigned_to;

      if (open) {
        if (open == "false") {
          queryObj["open"] = false
        } else if (open == "true") {
          queryObj["open"] = true
        }
      }
      console.log(queryObj)
      let listOfIssuesByProject = await issueModel.find({ ...req.query, project: req.params.project }, "-project");
      console.log(listOfIssuesByProject)
      return res.send(listOfIssuesByProject);
    })
    .post(async (req, res) => {
      let project = req.params.project;

      let {
        issue_title,
        issue_text,
        created_by,
        assigned_to = "",
        status_text = "",
      } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      let newIssue = await issueModel.create({
        issue_title,
        issue_text,
        created_by,
        open: true,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        assigned_to,
        status_text,
        project,
      });

      return res.json(newIssue);
    })
    .put(async (req, res) => {
      let { _id, ...update } = req.body;

      if (!_id) {
        return res.send({ error: 'missing _id' })
      }
      if (!Object.keys(update).length) {
        return res.json({ error: 'no update field(s) sent', '_id': _id })
      }
      if (!ObjectId.isValid(_id)) {
        return res.send({ error: 'could not update', '_id': _id })
      }

      let id = new ObjectId(_id);
      
      const result = await issueModel.findOne({ '_id': id })
      if (!result) {
        return res.send({ error: 'could not update', '_id': _id })
      }

      await issueModel.updateOne({ '_id': id }, { ...update, updated_on: new Date().toUTCString() })

      return res.json({ result: 'successfully updated', '_id': _id })
    })
    .delete(async (req, res) => {
      let { _id } = req.body;

      if (!_id) {
        return res.send({ error: 'missing _id' })
      }

      if (!ObjectId.isValid(_id)) {
        return res.json({
          error: 'could not delete',
          '_id': _id
        })
      }
      let id = new ObjectId(_id);

      const result = await issueModel.findOne({ _id: id })
      if (!result) {
        return res.json({
          error: 'could not delete',
          '_id': _id
        })
      }

      await issueModel.deleteOne({ _id: id })
      return res.json({
        result: 'successfully deleted',
        '_id': _id
      })
    });
}

module.exports = apiroutes;