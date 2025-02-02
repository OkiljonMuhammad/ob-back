import { verifyToken } from "../utils/jwt.js";

// Middleware to authenticate the token
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
        console.error("JWT verification failed. Please check the token and try again.");
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Middleware to authorize based on role
export const authorizeRole = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "User not authenticated or invalid user data." });
        }
        const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
        const normalizedRoles = roles.map(role => role.toLowerCase());
        if (!normalizedRoles.includes(req.user.role.toLowerCase())) {
            return res.status(403).json({
                message: `Access denied. Required roles: ${roles.join(", ")}. Your role: ${req.user.role}.`,
            });
        }
        next();
    };
};