class ErrorHandler {
    handleError(err, req, res, next) {
        switch (true) {
            case typeof err === "string":
                // Custom application error
                const is404 = err.toLowerCase().endsWith("not found");
                const statusCode = is404 ? 404 : 400;
                return res.status(statusCode).json({ message: err });

            case err.name === "ValidationError":
                // Mongoose validation error
                return res.status(400).json({ message: err.message });

            case err.name === "Unauthorized":
                // JWT authentication error
                return res.status(401).json({ message: "Unauthorized" });

            case err.message.includes("getaddrinfo ENOTFOUND api.cloudinary.com"):
                // Specific Cloudinary API host resolution error
                return res
                    .status(500)
                    .json({ message: "Error connecting to Cloudinary API" });

            default:
                // Default to 500 server error
                return res.status(500).json({ message: err.message });
        }
    }
}

const errorHandler = new ErrorHandler();

export default errorHandler;  