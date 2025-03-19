const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization").split(" ")[1];

    if(!token) return res.status(401).json({status: false, code: 401, message: "Access Denied! No token provided."});

    // console.log(token);

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log(req.user);
        next();

    } catch (error) {
        return res.status(403).json({
            status: false,
            code: 403,
            message: "Invalid or Expired Token"
        })
    }
}

module.exports = verifyToken;