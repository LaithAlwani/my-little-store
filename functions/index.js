const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const firestore = admin.firestore();

//auth trigger (user created)
exports.newUserOnSignup = functions
  .runWith({ enforceAppCheck: false })
  .auth.user()
  .onCreate((user) => {
    admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        uid:user.uid,
        email: user.email,
        avatar: user.photoURL,
        displayName: user.displayName,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        lastlogin: admin.firestore.Timestamp.now(),
      })
      .then(() => {
        updateUsersStats(1);
      });
    return user.displayName;
  });

//auth trigger (userDeleted)
exports.userDeleted = functions
  .runWith({ enforceAppCheck: false })
  .auth.user()
  .onDelete((user) => {
    const doc = firestore.collection("users").doc(user.uid);
    doc.delete();
    let userDoc;
    admin
      .firestore()
      .collection("usernames")
      .where("uid", "==", user.uid)
      .get()
      .then((results) => {
        results.forEach((docRef) => {
          userDoc = firestore.collection("usernames").doc(docRef.id);
          userDoc.delete();
        });
      })
      .catch((err) => err.message);

    return updateUsersStats(-1);
  });

const updateUsersStats = async (value) => {
  const doc = await firestore.collection("amdb-stats").doc("main");
  return doc.set({ users: admin.firestore.FieldValue.increment(value) }, { merge: true });
};