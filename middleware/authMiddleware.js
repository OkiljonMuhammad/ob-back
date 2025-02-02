import { verifyToken } from "../utils/jwt.js";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid authorization header format." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(`JWT verification failed: ${error.name} - ${error.message}`);
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

export const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
        }

        next();
    };
};