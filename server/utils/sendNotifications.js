const admin = require("firebase-admin");
const Notification = require('../model/notificationModel');
const serviceAccount = require("../config/serviceAccountKey.json");
const userModel = require("../model/user/authModel");
const mongoose = require("mongoose");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const fcm = admin.messaging();

exports.sendNotification = async (receiver,title,body,sender,type) => {

    console.log(receiver,title,body,sender,type);
    try{
    // step 1 : Validate reciever ID
    if(!mongoose.Types.ObjectId.isValid(receiver)){
        console.log("invalid user Id");
        return;
    }

    // step 2: get recipient device tokens
    const recipientUser = await userModel.findById(receiver).select("device_token");
    console.log(recipientUser, "recipientUser")
    if (!recipientUser || !recipientUser.device_token?.length) {
      console.error("No valid device tokens found for recipient user");
      return;
    }

    // step 3 : Remove duplicate and validate token
    const uniqueTokens = [...new Set(recipientUser?.device_token?.filter(Boolean))];
    if (!uniqueTokens.length) {
        console.error("No valid unique tokens found");
        return;
    }

    //step 4:  Get sender details and sender name (if exists)
    const senderData = sender && mongoose.Types.ObjectId.isValid(sender)
      ? await userModel.findById(sender).select("username")
      : null;
    const senderName = senderData ? senderData.username : "System";

    //step 5: Build Notification Payload
    const message = {
        notification: { title, body },
        data: {
          senderName,
          notification_type: type ? type : "",
        },
        apns: { payload: { aps: { alert: { title, body } } } }
      };
    console.log(message, "message")

    // step 6: Send notifications efficiently using FCM
    let response;
    if (uniqueTokens.length > 1) {
      response = await fcm.sendEachForMulticast({ tokens: uniqueTokens, ...message });
    } else {
      response = await fcm.send({ token: uniqueTokens[0], ...message });
    }
    console.log("Notification sent successfully:", response);

    // step 7: Handle failed tokens
    if (response.failureCount > 0) {
        const failedTokens = response.responses
          .map((resp, index) => (resp.error ? uniqueTokens[index] : null))
          .filter(Boolean);
        console.error("Failed Tokens:", failedTokens);
      }

     // step 8:  **Save notification in MongoDB**
     const newNotification = new Notification({
        title,
        body,
        notification_type:type,
        sender,
        recipients: { userId: receiver, isSeen: false },
        sentAt: new Date(),
      });
  
      await newNotification.save();
      console.log("Notification saved in the database successfully!");

    }catch(error) {
        console.error("Error sending notification:",error.message);
    }
}