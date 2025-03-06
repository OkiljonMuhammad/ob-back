import Token from '../../models/Token.js';
import 'dotenv/config';
import axios from 'axios';

const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID;
const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;
const SALESFORCE_INSTANCE_URL = process.env.SALESFORCE_INSTANCE_URL;

// Get the latest refresh token from the database
const getRefreshToken = async () => {
  try {
    const tokenEntry = await Token.findOne({
      attributes: ['refreshToken'],
      order: [['createdAt', 'DESC']],
    });

    if (!tokenEntry) {
      throw new Error("No refresh token found in the database.");
    }

    return tokenEntry.refreshToken;
  } catch (error) {
    console.error("Error fetching Salesforce refresh token:", error.message);
    throw new Error("Failed to fetch Salesforce refresh token");
  }
};

// Save a new refresh token
const saveRefreshToken = async (newRefreshToken) => {
  try {
    await Token.create({ refreshToken: newRefreshToken });
    console.log("New refresh token saved.");
  } catch (error) {
    console.error("Error saving Salesforce refresh token:", error.message);
    throw new Error("Failed to save Salesforce refresh token");
  }
};

// Get Salesforce access token
const getSalesforceAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();

    const response = await axios.post("https://login.salesforce.com/services/oauth2/token", new URLSearchParams({
      grant_type: "refresh_token",
      client_id: SALESFORCE_CLIENT_ID,
      client_secret: SALESFORCE_CLIENT_SECRET,
      refresh_token: refreshToken
    }));

    console.log("New Access Token:", response.data.access_token);

    if (response.data.refresh_token) {
      await saveRefreshToken(response.data.refresh_token);
    }

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Salesforce access token:", error.response?.data || error.message);
    throw new Error("Failed to obtain Salesforce access token");
  }
};

// Create a user in Salesforce
const createUserInSalesforce = async (req, res) => {
  try {
    const { accountName, contactFirstName, contactLastName, email } = req.body;

    const accessToken = await getSalesforceAccessToken();

    const accountResponse = await axios.post(
      `${SALESFORCE_INSTANCE_URL}/services/data/v59.0/sobjects/Account`,
      { Name: accountName },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const accountId = accountResponse.data.id;

    const contactResponse = await axios.post(
      `${SALESFORCE_INSTANCE_URL}/services/data/v59.0/sobjects/Contact`,
      {
        FirstName: contactFirstName,
        LastName: contactLastName,
        Email: email,
        AccountId: accountId
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log("Created Account ID:", accountId);
    console.log("Created Contact ID:", contactResponse.data.id);
    
    res.json({ success: true, accountId, contactId: contactResponse.data.id });
  } catch (error) {
    console.error("Salesforce API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Salesforce Integration Failed" });
  }
};

export default createUserInSalesforce;
