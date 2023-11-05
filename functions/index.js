const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.newUserOnSignup = functions
  .runWith({ enforceAppCheck: false })
  .auth.user()
  .onCreate((user) => {
    admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        uid: user.uid,
        email: user.email,
        avatar: user.photoURL,
        displayName: user.displayName,
        created_at: admin.firestore.Timestamp.now(),
        updated_at: admin.firestore.Timestamp.now(),
        lastlogin: admin.firestore.Timestamp.now(),
      })
      return user;
  });

exports.addAdmin = functions.runWith({ enforceAppCheck: false }).https.onCall((data, context) => {
  // if (context.app == undefined) {
  //   throw new functions.https.HttpsError(
  //     "failed-precondition",
  //     "The function must be called from an App Check verified app."
  //   );
  // }

  // if (context.auth.token.admin !== true) {
  //   return { error: "Request not Authorized" };
  // }
  const email = data.email;
  return grantAdminRole(email);
});

async function grantAdminRole(email) {
  const user = await admin.auth().getUserByEmail(email);
  if (user.customClaims && user.customClaims.admin === false) {
    return;
  }
  admin.auth().setCustomUserClaims(user.uid, {
    admin: true,
  });
  admin.firestore().collection("users").doc(user.uid).update({ isAdmin: true });

  return "success";
}
