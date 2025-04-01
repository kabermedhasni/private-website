// server/index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const SibApiV3Sdk = require("@getbrevo/brevo");
const admin = require("firebase-admin");

// Initialize Firebase Admin
const serviceAccount = require("./firebase-admin-key.json"); // You'll need to place your key file here
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Debug environment variables
console.log("Environment check:", {
  BREVO_API_KEY: process.env.BREVO_API_KEY
    ? `${process.env.BREVO_API_KEY.substring(0, 10)}...`
    : "Missing",
  BREVO_API_KEY_LENGTH: process.env.BREVO_API_KEY
    ? process.env.BREVO_API_KEY.length
    : 0,
  SENDER_EMAIL: process.env.SENDER_EMAIL || "Missing",
  SENDER_NAME: process.env.SENDER_NAME || "Missing",
});

// Validate environment variables before starting server
function validateEnvironmentVariables() {
  const required = {
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    SENDER_EMAIL: process.env.SENDER_EMAIL,
    SENDER_NAME: process.env.SENDER_NAME,
  };

  const missing = Object.entries(required)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }

  // Validate API key format
  if (!process.env.BREVO_API_KEY.startsWith("xkeysib-")) {
    console.error('Invalid API key format. Must start with "xkeysib-"');
    process.exit(1);
  }
}

validateEnvironmentVariables();

// Debug what we get from Brevo
// console.log("Brevo object:", Object.keys(SibApiV3Sdk));

const app = express();

// Store verification codes with expiration
const verificationCodes = new Map();

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://your-production-domain.com"] // Replace with your production domain
      : ["http://localhost:5173", "http://localhost:3000"],
  methods: ["POST", "GET"],
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

// Test endpoint to verify server is running
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.post("/api/send-email", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    // Store the verification code with 10-minute expiration
    verificationCodes.set(email, {
      code,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Clean up expired codes periodically
    setTimeout(() => {
      const codeData = verificationCodes.get(email);
      if (codeData && Date.now() > codeData.expiry) {
        verificationCodes.delete(email);
      }
    }, 10 * 60 * 1000);

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let apiKey = apiInstance.authentications["apiKey"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Improved email template
    sendSmtpEmail.subject = "Password Reset Verification Code";
    sendSmtpEmail.htmlContent = `
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h1 style="color: #2c3e50; text-align: center;">Password Reset Verification</h1>
                        <div style="background-color: #f8f9fa; border-radius: 5px; padding: 20px; margin: 20px 0;">
                            <p style="font-size: 16px;">Your verification code is:</p>
                            <h2 style="text-align: center; color: #00b5de; letter-spacing: 5px; font-size: 32px;">${code}</h2>
                            <p style="color: #6c757d; font-size: 14px;">This code will expire in 10 minutes.</p>
                        </div>
                        <p style="color: #6c757d; font-size: 12px; text-align: center;">
                            If you didn't request this code, please ignore this email.
                        </p>
                    </div>
                </body>
            </html>`;

    sendSmtpEmail.sender = {
      name: process.env.SENDER_NAME || "WhileTrueDev",
      email: process.env.SENDER_EMAIL,
    };

    sendSmtpEmail.to = [
      {
        email: email,
        name: email.split("@")[0],
      },
    ];

    sendSmtpEmail.replyTo = {
      email: process.env.SENDER_EMAIL,
      name: process.env.SENDER_NAME || "WhileTrueDev Support",
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Verification code sent successfully");

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully!",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send verification code",
      error: error.message,
    });
  }
});

// Add verification endpoint
app.post("/api/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    const storedData = verificationCodes.get(email);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "No verification code found for this email",
      });
    }

    if (Date.now() > storedData.expiry) {
      verificationCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // Code is valid - clean up
    verificationCodes.delete(email);

    return res.status(200).json({
      success: true,
      message: "Code verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify code",
      error: error.message,
    });
  }
});

// Add password update endpoint
app.post("/api/update-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    // Get the user by email
    const userRecord = await admin.auth().getUserByEmail(email);

    // Update the password
    await admin.auth().updateUser(userRecord.uid, {
      password: newPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
});

// Add new endpoint to list all users
// app.get("/api/list-users", async(req, res) => {
//     try {
//         const listUsersResult = await admin.auth().listUsers();
//         const users = listUsersResult.users.map(userRecord => ({
//             email: userRecord.email,
//             emailVerified: userRecord.emailVerified,
//             disabled: userRecord.disabled,
//             creationTime: userRecord.metadata.creationTime
//         }));

//         console.log('👥 All registered users in Firebase Auth:');
//         users.forEach(user => {
//             console.log(`- Email: ${user.email}`);
//             console.log(`  Created: ${user.creationTime}`);
//             console.log(`  Verified: ${user.emailVerified ? '✅' : '❌'}`);
//             console.log('  ---');
//         });

//         return res.status(200).json({
//             success: true,
//             users: users
//         });
//     } catch (error) {
//         console.error('Error listing users:', error);
//         return res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
