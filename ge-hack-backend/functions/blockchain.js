const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);
exports.admin = admin;
exports.functions = functions;

// blockchain API details
const bApiUrl = 'http://35.247.157.19:3000/api';
exports.bApiUrl = bApiUrl;

exports.queryBCOneParam = async (param, route, req, res) => {

  if (!(param in req.query)) {
    res.status(400).send("Need parameter ", param);
    return;
  }
  params = {}
  params[param] = req.query[param];

  fetch(bApiUrl + `/queries/${route}?` + new URLSearchParams(params), {
    method: "GET"
  })
    .then(response => response.json())
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

exports.addMedicalRecord = async (userType, req, res) => {
  let body = Object.assign({}, req.body);
  delete body[userType];
  body[`${userType}sWithAccess`] = [req.body[userType]];
  body["$class"] = "orange.medicalblocks.MedicalRecord";

  await postJSON("/MedicalRecord", body, res);
}

exports.addInsuranceRecord = async (req, res) => {
  let body = Object.assign({}, req.body);
  body["$class"] = "orange.medicalblocks.InsuranceRecord";

  await postJSON("/InsuranceRecord", body, res);
}

exports.getBC = async (route, req, res) => {
  fetch(bApiUrl + route, {
    method: "GET",
  })
    .then(response => response.json())
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

exports.postJSON = async (route, body, res) => {
  const headers = {
    "Content-Type": "application/json"
  }

  fetch(bApiUrl + route, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

exports.addEntity = async (entity, req, res) => {
  let body = req.body;
  body["$class"] = `orange.medicalblocks.${entity}`;

  await postJSON(`/${entity}`, body, res);
}

exports.createUser = async (userType, req, res) => {
  admin
    .auth()
    .createUser({
      email: req.body.email,
      emailVerified: false,
      displayName: req.body.name
    })
    .then(async (userRecord) => {
      req.body = {
        hId: userRecord.uid,
        hName: userRecord.displayName
      }
      console.log(req.body);
      await addEntity(userType, req, res);
      return true;
    })
    .catch((error) => {
      res.status(500).send(error);
    })
}
