import db from '../../models/index.js';
import axios from 'axios';
import 'dotenv/config';

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_ID = process.env.JIRA_PROJECT_ID;

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_ID) {
    throw new Error("Missing required Jira environment variables.");
}

const createTicket = async (req, res) => {
    try {
        const { summary, priority, templateTitle, link } = req.body;
        const processedTemplateTitle = templateTitle.trim() === "" ? "No template title" : templateTitle;

        if (!summary || !priority || !link) {
            return res.status(400).json({ error: "Missing required fields: summary, templateTitle, link" });
        }

        if (!req.user) {
                  return res.status(400).json({ error: "User not found" });
        }
        const user = await db.User.findByPk(req.user.id);
        const email = user.email;

        const response = await axios.post(
            `${JIRA_BASE_URL}/rest/api/3/issue`,
            {
                fields: {
                    project: { id: JIRA_PROJECT_ID },
                    summary,
                    issuetype: { name: "Task" },
                    customfield_10039: email,
                    customfield_10037: processedTemplateTitle,
                    customfield_10038: link,
                    priority: { id: priority },
                    description: {
                        type: "doc",
                        version: 1,
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                  { type: "text", text: summary }
                                ]
                              },
                        ]
                    }
                }
            },
            {
                auth: {
                    username: JIRA_EMAIL,
                    password: JIRA_API_TOKEN
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            message: "Ticket created successfully",
            ticketUrl: `${JIRA_BASE_URL}/browse/${response.data.key}`
        });

    } catch (error) {
        console.error("Jira API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to create ticket", details: error.response?.data || error.message });
    }
};

export default createTicket;
