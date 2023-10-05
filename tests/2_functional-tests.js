const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  test("/api/issues/:project - POST - 200 - with every field", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest/")
      .send({
        issue_title: "Fix error in posting data",
        issue_text: "When we post data it has an error.",
        created_by: "Joe",
        assigned_to: "Joe",
        status_text: "In QA",
      })
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.hasAllKeys(res.body,
          ["_id",
            "__v",
            "project",
            "issue_title",
            "issue_text",
            "created_on",
            "updated_on",
            "created_by",
            "assigned_to",
            "open",
            "status_text",]
        );
        assert.propertyVal(res.body, "issue_title", "Fix error in posting data");
        assert.propertyVal(
          res.body,
          "issue_text",
          "When we post data it has an error."
        );
        assert.propertyVal(res.body, "created_by", "Joe");
        assert.propertyVal(res.body, "assigned_to", "Joe");
        assert.propertyVal(res.body, "open", true);
        assert.propertyVal(res.body, "status_text", "In QA");
      });
    done();
  });

  test("/api/issues/:project - POST - 200 - with only required fields", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest/")
      .send({
        issue_title: "Fix error in posting data",
        issue_text: "When we post data it has an error.",
        created_by: "Joe",
      })
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.hasAllKeys(res.body,
          ["_id",
            "issue_title",
            "issue_text",
            "created_on",
            "__v",
            "project",
            "updated_on",
            "created_by",
            "assigned_to",
            "open",
            "status_text",]
        );
        assert.propertyVal(res.body, "issue_title", "Fix error in posting data");
        assert.propertyVal(
          res.body,
          "issue_text",
          "When we post data it has an error."
        );
        assert.propertyVal(res.body, "created_by", "Joe");
        assert.propertyVal(res.body, "assigned_to", "");
        assert.propertyVal(res.body, "open", true);
        assert.propertyVal(res.body, "status_text", "");
      });
    done();
  });

  test("/api/issues/:project - POST - 200 -  missing required fields", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest/")
      .send({
        issue_title: "Fix error in posting data",
        issue_text: "When we post data it has an error.",
      })
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: "required field(s) missing" });
      });
    done();
  })


  test("/api/issues/:project - GET - 200 - View issues on a project", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest/")
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.isArray(res.body);
      });
    done();
  });

  test("/api/issues/:project?open=true - GET - 200 - View issues on a project with one filter", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest?open=false")
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        res.body.forEach(issue => {
          assert.propertyVal(issue, "open", false)
        })
      });
    done();
  });

  test("/api/issues/:project?open=true&assigned_to=Joe - GET - 200 - View issues on a project with multiple filters", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest?open=true&assigned_to=Joe")
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        res.body.forEach(issue => {
          assert.propertyVal(issue, "open", true)
          assert.propertyVal(issue, "assigned_to", "Joe")
        })
      });
    done();
  });

  test("/api/issues/:project - PUT - 200 - Update one field on an issue", (done) => {
    const requestBody = {
      _id: "6519f418f1a0f52426ec0ea6",
      open: false,
    };
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest/")
      .send(requestBody)
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, {
          result: 'successfully updated',
          '_id': requestBody._id
        })
      });
    done();
  });

  test("/api/issues/:project - PUT - 200 - Update multiple fields on an issue", (done) => {
    const requestBody = {
      _id: "6519f418f1a0f52426ec0ea6",
      open: false,
      assigned_to: "May"
    }
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest/")
      .send(requestBody)
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, {
          result: 'successfully updated',
          '_id': requestBody._id
        })
      });
    done();
  });

  test("/api/issues/:project - PUT - 200 - Update an issue with missing _id", (done) => {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest/")
      .send({
        open: false,
      })
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, {
          error: 'missing _id'
        })
      });
    done();
  });

  test("/api/issues/:project - PUT - 200 - Update an issue with no fields to update", (done) => {
    const requestBody = {
      _id: "6519f418f1a0f52426ec0ea6",
    }
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest/")
      .send(requestBody)
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'no update field(s) sent', '_id': requestBody._id })
      });
    done();
  });

  test("/api/issues/:project - PUT - 200 - Update an issue with an invalid _id", (done) => {
    const requestBody = {
      _id: "meaninglessId",
      open: false,
    }
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest/")
      .send(requestBody)
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not update', '_id': requestBody._id })
      });
    done();
  });

  test("/api/issues/:project - DELETE  - 204 - Delete an issue", (done) => {
    const requestBody = {
      _id: "6519f418f1a0f52426ec0ea6",
    }
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest/")
      .send(requestBody)
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully deleted', '_id': requestBody._id })
      });
    done();
  });

  test("/api/issues/:project - DELETE  - 200 - Delete an issue with an invalid _id", (done) => {
    const requestBody = {
      _id: "meaninglessId",
    }
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest/")
      .send(requestBody)
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not delete', '_id': requestBody._id })
      });
    done();
  });

  test("/api/issues/:project - DELETE  - 200 - Delete an issue with missing _id", (done) => {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest/")
      .end((req, res) => {
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' })
      });
    done();
  });
})
