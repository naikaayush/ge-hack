const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);

//initialize express server
const app = express();
const main = express();

// blockchain API details
const bApiUrl = 'http://35.247.157.19:3000/api';

//add the path to receive request and set json as bodyParser to process the body
main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// app.use(decodeIDToken);

//initialize the database and the collection
// const db = admin.firestore();
// const userCollection = "users";

//define google cloud function name
exports.webApi = functions.https.onRequest(main);

 // Create and Deploy Your First Cloud Functions
 // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
async function decodeIDToken(req, res) {
  if ("authorization" in req.headers && req.headers.authorization.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      res.status(401).send(err);
    }
  } else {
    res.status(401).send("Unauthorized");
  }
}

async function queryBCOneParam(param, route, req, res) {

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


app.get("/hospital/medicalRecord/", async (req, res) => {
  await queryBCOneParam("hospital", "HospitalAccessedMedicalRecords", req, res);
});
app.get("/hospital/insuranceRecord/", async (req, res) => {
  await queryBCOneParam("hospital", "HospitalAccessedInsuranceRecords", req, res);
});
app.get("/hospital/invoice/", async (req, res) => {
  await queryBCOneParam("hospital", "HospitalInvoices", req, res);
});

app.get("/provider/medicalRecord/", async (req, res) => {
  await queryBCOneParam("iProvider", "IProviderAccessedMedicalRecords", req, res);
});
app.get("/provider/insuranceRecord/", async (req, res) => {
  await queryBCOneParam("iProvider", "IProviderAccessedInsuranceRecords", req, res);
});
app.get("/provider/invoice/", async (req, res) => {
  await queryBCOneParam("iProvider", "IProviderAccessedInvoices", req, res);
});

app.get("/dCenter/medicalRecord/", async (req, res) => {
  await queryBCOneParam("dCenter", "DCenterAccessedMedicalRecords", req, res);
});

app.get("/user/medicalRecord/", async (req, res) => {
  await queryBCOneParam("user", "UserMedicalRecords", req, res);
});
app.get("/user/insuranceRecord/", async (req, res) => {
  await queryBCOneParam("user", "UserInsuranceRecords", req, res);
});
app.get("/user/invoice/", async (req, res) => {
  await queryBCOneParam("user", "UserInvoices", req, res);
});


async function getBC(route, req, res) {
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

async function postBC(entity, req, res) {
  let body = req.body;
  body["$class"] = `orange.medicalblocks.${entity}`;
  const headers = {
    "Content-Type": "application/json"
  }

  fetch(bApiUrl + `/${entity}`, {
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

app.get("/admin/hospital", async (req, res) => {
  await getBC("/Hospital", req, res);
});

app.post("/admin/hospital", async (req, res) => {
  await postBC("Hospital", req, res);
});

app.get("/admin/diagCenter", async (req, res) => {
  await getBC("/DiagCenter", req, res);
});

app.post("/admin/diagCenter", async (req, res) => {
  await postBC("DiagCenter", req, res);
});

app.get("/admin/iProvider", async (req, res) => {
  await getBC("/InsuranceProvider", req, res);
});

app.post("/admin/iProvider", async (req, res) => {
  await postBC("InsuranceProvider", req, res);
});
