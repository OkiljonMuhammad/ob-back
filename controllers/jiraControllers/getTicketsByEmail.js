import db from '../../models/index.js';
import axios from 'axios';
import 'dotenv/config';

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const getTicketsByEmail = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

        if (!req.user) {
            return res.status(400).json({ error: "User not found" });
        }
        const user = await db.User.findByPk(req.user.id);
        const email = user.email;
        const startAt = (page - 1) * limit;

        const jql = `"Reported Email" ~ "${email}" ORDER BY created DESC`;

        const response = await axios.get(
            `${JIRA_BASE_URL}/rest/api/3/search`,
            {
                params: { jql, maxResults: limit, startAt },
                auth: { username: JIRA_EMAIL, password: JIRA_API_TOKEN },
                headers: { "Content-Type": "application/json" }
            }
        );

        const { issues = [], total } = response.data;

        const tickets = issues.map(issue => ({
            key: issue.key,
            summary: issue.fields.summary,
            status: issue.fields.status.name,
            created: issue.fields.created,
            priority: issue.fields.priority,
            templateTitle: issue.fields.customfield_10037,
            ticketUrl: `${JIRA_BASE_URL}/browse/${issue.key}`
        }));
        res.json({
            tickets,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalTickets: total,
            message: tickets.length === 0 ? "No tickets found for this email." : undefined
        });
    } catch (error) {
        console.error("Jira API Error:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(500).json({ error: "Failed to fetch tickets", details: error.response?.data || error.message });
    }
};

export default getTicketsByEmail;
