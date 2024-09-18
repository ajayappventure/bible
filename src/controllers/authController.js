const AmazonCognitoId = require("amazon-cognito-identity-js");
const { env } = require("../constant/environment");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const {
  CognitoIdentityProviderClient,
  AdminConfirmSignUpCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { verifyAuthToken } = require("../middleware/auth");

// Set up Cognito user pool information
const poolData = {
  UserPoolId: env.USERPOOL_ID,
  ClientId: env.CLIENT_ID,
};
const userPool = new AmazonCognitoId.CognitoUserPool(poolData);

// Signup function
const signup = async (req, res) => {
  try {
    // Initialize Cognito client with AWS credentials
    const cognitoClient = new CognitoIdentityProviderClient({
      region: env.REGION,
      credentials: {
        accessKeyId: env.ACCESS_KEY_ID,
        secretAccessKey: env.SECRET_KEY_ID,
      },
    });

    // Extract username and password from the request body
    const { user_name, password } = req.body;

    // Validate that both username and password are provided
    if (!user_name || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Sign up the user using Cognito
    userPool.signUp(user_name, password, null, null, async (err, result) => {
      if (err) {
        // Handle signup error
        console.error("Error during signup:", err.message || err);
        return res
          .status(500)
          .json({ error: err.message || "An error occurred during signup." });
      }

      try {
        // Confirm the user's signup in Cognito
        const confirmSignUpCommand = new AdminConfirmSignUpCommand({
          UserPoolId: poolData.UserPoolId,
          Username: user_name,
        });
        await cognitoClient.send(confirmSignUpCommand);

        // Hash the user's password before saving to the database
        const hashedPassword = await bcrypt.hash(
          password,
          parseInt(env.SALT_ROUND),
        );

        // Store the new user in the Prisma database
        await prisma.user.create({
          data: { user_name, password: hashedPassword },
        });

        // Respond with success message
        res.status(200).json({
          message: "User signed up successfully.",
          user: result.user.getUsername(),
        });
      } catch (confirmErr) {
        // Handle error during user confirmation
        console.error(
          "Error confirming user:",
          confirmErr.message || confirmErr,
        );
        res
          .status(500)
          .json({ error: confirmErr.message || "Failed to confirm user." });
      }
    });
  } catch (error) {
    // Handle any other errors that occur during signup
    res.status(500).json({ error: "Failed to signup" });
  }
};

// Login function
const login = (req, res) => {
  try {
    // Extract username and password from the request body
    const { user_name, password } = req.body;

    // Validate that both username and password are provided
    if (!user_name || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Set up authentication details for Cognito
    const authenticationDetails = new AmazonCognitoId.AuthenticationDetails({
      Username: user_name,
      Password: password,
    });

    // Prepare Cognito user data
    const userData = {
      Username: user_name,
      Pool: userPool,
    };

    // Create Cognito user object
    const cognitoUser = new AmazonCognitoId.CognitoUser(userData);

    // Authenticate the user in Cognito
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        // On successful login, return tokens to the user
        res.status(200).json({
          message: "Login successful",
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
        });
      },
      onFailure: function (err) {
        // Handle login failure (invalid credentials)
        console.error("Error during login:", err.message || err);
        res.status(401).json({
          message: "Authentication failed",
          error: err.message || "Invalid credentials",
        });
      },
    });
  } catch (error) {
    // Handle any other errors that occur during login
    res.status(500).json({ error: "Failed to login" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const result = await verifyAuthToken(req);
    if (!result) return res.status(401).json({ error: "Invalid token" });
    delete result.password;
    res.status(200).json(result);
  } catch (error) {
    console.log("🚀 ~ getUserInfo ~ error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

module.exports = {
  signup,
  login,
  getUserInfo,
};
