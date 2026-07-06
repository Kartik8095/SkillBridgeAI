const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    console.log("HEADER:", authHeader);

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. No Token Provided."
        });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);
    console.log("VERIFY SECRET:", process.env.JWT_SECRET);

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};

module.exports = verifyToken;