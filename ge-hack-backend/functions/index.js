const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const bc = require("./blockchain");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

//initialize express server
const app = express();
const main = express();

//add the path to receive request and set json as bodyParser to process the body
main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
app.use(
  fileUpload({
    debug: true,
  })
);
// app.use(decodeIDToken);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});

//initialize the database and the collection
const db = admin.firestore();
// const userCollection = "users";
const medicalRecordCollection = db.collection("medicalRecord");
const hospitalCollection = db.collection("hospital");
const providerCollection = db.collection("provider");
const dCenterCollection = db.collection("dCenter");

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
  if (
    "authorization" in req.headers &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
    } catch (err) {
      res.status(401).send(err);
    }
  } else {
    res.status(401).send("Unauthorized");
  }
}

app.get("/medicalRecord/get/:id", async (req, res) => {
  await bc.getBC(`/MedicalRecord/${req.params.id}`, req, res);
});
app.get("/insuranceRecord/:id", async (req, res) => {
  await bc.getBC(`/InsuranceRecord/${req.params.id}`, req, res);
});
app.get("/invoice/:id", async (req, res) => {
  await bc.getBC(`/Invoice/${req.params.id}`, req, res);
});

// hospital get
app.get("/hospital/get/:id", async (req, res) => {
  await bc.getBC(`/Hospital/${req.params.id}`, req, res);
});
app.get("/hospital/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam(
    "hospital",
    "HospitalAccessedMedicalRecords",
    req,
    res
  );
});
app.get("/hospital/insuranceRecord/", async (req, res) => {
  await bc.queryBCOneParam(
    "hospital",
    "HospitalAccessedInsuranceRecords",
    req,
    res
  );
});
app.get("/hospital/invoice/", async (req, res) => {
  await bc.queryBCOneParam("hospital", "HospitalInvoices", req, res);
});
// hospital add invoices and medical records
//
app.post("/hospital/invoice/", async (req, res) => {
  await bc.addEntity("Invoice", req, res);
});
app.post("/hospital/medicalRecord/", async (req, res) => {
  console.log(req.files);
  // console.log(req.files.recordFile);
  res.send("yay");
  // await bc.addMedicalRecord("hospital", req, res);
});

app.get("/provider/get/:id", async (req, res) => {
  await bc.getBC(`/InsuranceProvider/${req.params.id}`, req, res);
});
app.get("/provider/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam(
    "iProvider",
    "IProviderAccessedMedicalRecords",
    req,
    res
  );
});
app.get("/provider/insuranceRecord/", async (req, res) => {
  await bc.queryBCOneParam(
    "iProvider",
    "IProviderAccessedInsuranceRecords",
    req,
    res
  );
});
app.post("/provider/insuranceRecord/", async (req, res) => {
  await bc.addInsuranceRecord(req, res);
});
app.get("/provider/invoice/", async (req, res) => {
  await bc.queryBCOneParam("iProvider", "IProviderAccessedInvoices", req, res);
});

app.get("/dCenter/get/:id", async (req, res) => {
  await bc.getBC(`/DiagCenter/${req.params.id}`, req, res);
});
app.get("/dCenter/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam(
    "dCenter",
    "DCenterAccessedMedicalRecords",
    req,
    res
  );
});
app.post("/dCenter/medicalRecord/", async (req, res) => {
  await bc.addMedicalRecord("dCenter", req, res);
});

//USER VIEWS
app.get("/user/get/:id", async (req, res) => {
  const doc = await db.collection("users").doc(req.params.id).get();
  if (!doc.exists) {
    console.log("User does not exist!");
  } else {
    res.send(doc.data());
  }
  // await bc.getBC(`/User/${req.params.id}`, req, res);
});

// app.get("/user/get/:id", async (req, res) => {
//   await bc.getBC(`/User/${req.params.id}`, req, res);
// });
app.get("/user/views/medicalRecord/:userId", async (req, res) => {
  const userRef = db.collection("medicalRecord");
  const snapshot = await userRef.where("uid", "==", req.params.userId).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }
  snapshot.forEach((doc) => {
    res.send({ id: doc.id, data: doc.data() });
  });
  // await bc.queryBCOneParam("user", "UserMedicalRecords", req, res);
});
// app.get("/user/medicalRecord/", async (req, res) => {
//   await bc.queryBCOneParam("user", "UserMedicalRecords", req, res);
// });
app.get("/user/insuranceRecord/", async (req, res) => {
  await bc.queryBCOneParam("user", "UserInsuranceRecords", req, res);
});
app.get("/user/invoice/", async (req, res) => {
  await bc.queryBCOneParam("user", "UserInvoices", req, res);
});
app.get("/user/getUid/", async (req, res) => {
  if ("phoneNumber" in req.query) {
    admin
      .auth()
      .getUserByPhoneNumber("+" + req.query.phoneNumber)
      .then((userRecord) => {
        console.log(`Successfully fetched user data:  ${userRecord.toJSON()}`);
        res.status(200).send(userRecord);
        return true;
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
        res.status(500).send(error);
      });
  } else {
    res.status(400).send("Not enough parameters");
  }
});

// admin
app.get("/admin/hospital", async (req, res) => {
  await bc.getBC("/Hospital", req, res);
});

app.get("/admin/getCustomToken", async (req, res) => {
  if (!("uid" in req.query)) {
    res.status(400).send("Need uid");
    return;
  }
  admin
    .auth()
    .createCustomToken(req.query.uid)
    .then((customToken) => {
      // Send token back to client
      res.status(200).send(customToken);
      return;
    })
    .catch((error) => {
      console.log("Error creating custom token:", error);
      res.status(500).send(error);
    });
});

app.post("/admin/hospital", async (req, res) => {
  await bc.createUser("Hospital", hospitalCollection, "h", req, res);
});

app.get("/admin/diagCenter", async (req, res) => {
  await bc.getBC("/DiagCenter", req, res);
});

app.post("/admin/diagCenter", async (req, res) => {
  await bc.createUser("DiagCenter", dCenterCollection, "dCentre", req, res);
});

app.get("/admin/iProvider", async (req, res) => {
  await bc.getBC("/InsuranceProvider", req, res);
});

app.post("/admin/iProvider", async (req, res) => {
  await bc.createUser("InsuranceProvider", providerCollection, "i", req, res);
});

// medical record access
async function grantAccess(req, res) {
  let body = Object.assign({}, req.body);
  body["$class"] = "orange.medicalblocks.GrantAccess";

  await bc.postJSON("/GrantAccess", body, res);
}
app.post("/medicalRecord/grantAccess", async (req, res) => {
  await grantAccess(req, res);
});
app.post("/insuranceRecord/grantAccess", async (req, res) => {
  await grantAccess(req, res);
});
