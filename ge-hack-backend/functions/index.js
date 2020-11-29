const express = require('express');
const bodyParser = require('body-parser');
const bc = require('./blockchain');

//initialize express server
const app = express();
const main = express();

//add the path to receive request and set json as bodyParser to process the body
main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// app.use(decodeIDToken);

//initialize the database and the collection
// const db = admin.firestore();
// const userCollection = "users";

//define google cloud function name
functions = bc.functions;
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


app.get("/hospital/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam("hospital", "HospitalAccessedMedicalRecords", req, res);
});
app.get("/hospital/insuranceRecord/", async (req, res) => {
  await bc.queryBCOneParam("hospital", "HospitalAccessedInsuranceRecords", req, res);
});
app.get("/hospital/invoice/", async (req, res) => {
  await bc.queryBCOneParam("hospital", "HospitalInvoices", req, res);
});
app.post("/hospital/invoice/", async (req, res) => {
  await bc.addEntity("Invoice", req, res);
});
app.post("/hospital/medicalRecord/", async (req, res) => {
  await bc.addMedicalRecord("hospital", req, res);
});

app.get("/provider/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam("iProvider", "IProviderAccessedMedicalRecords", req, res);
});
app.get("/provider/insuranceRecord/", async (req, res) => {
  await bc.queryBCOneParam("iProvider", "IProviderAccessedInsuranceRecords", req, res);
});
app.post("/provider/insuranceRecord/", async (req, res) => {
  await bc.addInsuranceRecord(req, res);
});
app.get("/provider/invoice/", async (req, res) => {
  await bc.queryBCOneParam("iProvider", "IProviderAccessedInvoices", req, res);
});

app.get("/dCenter/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam("dCenter", "DCenterAccessedMedicalRecords", req, res);
});
app.post("/dCenter/medicalRecord/", async (req, res) => {
  await bc.addMedicalRecord("dCenter", req, res);
});

app.get("/user/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam("user", "UserMedicalRecords", req, res);
});
app.get("/user/insuranceRecord/", async (req, res) => {
  await bc.queryBCOneParam("user", "UserInsuranceRecords", req, res);
});
app.get("/user/invoice/", async (req, res) => {
  await bc.queryBCOneParam("user", "UserInvoices", req, res);
});



app.get("/admin/hospital", async (req, res) => {
  await bc.getBC("/Hospital", req, res);
});

app.post("/admin/hospital", async (req, res) => {
  await bc.createUser("Hospital", req, res);
});

app.get("/admin/diagCenter", async (req, res) => {
  await bc.getBC("/DiagCenter", req, res);
});

app.post("/admin/diagCenter", async (req, res) => {
  await bc.createUser("DiagCenter", req, res);
});

app.get("/admin/iProvider", async (req, res) => {
  await bc.getBC("/InsuranceProvider", req, res);
});

app.post("/admin/iProvider", async (req, res) => {
  await bc.createUser("InsuranceProvider", req, res);
});
