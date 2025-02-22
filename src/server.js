import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import fileUpload from 'express-fileupload';
import errorHandler from "./middleware/error-handler.js";
import Database from "./config/db.js";
import user_auth_router from "./features/auth/presentation/routes/userAuthRoutes.js";
import user_router from "./features/users/presentation/routes/userRoutes.js";
import prisma from "./config/prisma.js";

dotenv.config({ path: ".env" });

class App {
    constructor() {
        this.app = express();
        this.db = new Database(process.env.MONGO_URI);
        this.port = process.env.PORT || 5000;

        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandler();
    }

    async initializeDatabase() {
        await this.db.connect();
        
        try {
            await prisma.$connect();
            console.log('✅ PostgreSQL connected via Prisma');
        } catch (error) {
            console.error('❌ PostgreSQL connection error:', error);
            process.exit(1);
        }
    }

    initializeMiddlewares() {
        this.app.use(morgan("dev"));
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
        this.app.use(fileUpload());
    }

    initializeRoutes() {
        this.app.use("/api/v1/userauth", user_auth_router);
        this.app.use("/api/v1/user", user_router);
    }

    initializeErrorHandler() {
        this.app.use(errorHandler.handleError);
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${this.port}`);
        });
    }
}

const appInstance = new App();
appInstance.start();