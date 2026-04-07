"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: process.env.NODE_ENV !== "production",
    entities: [__dirname + "/entities/**/*.entity.{ts,js}"],
    migrations: [__dirname + "/migrations/**/*.ts"],
    subscribers: [],
});
const initializeDatabase = async () => {
    if (!exports.AppDataSource.isInitialized) {
        await exports.AppDataSource.initialize();
    }
    return exports.AppDataSource;
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=data-source.js.map