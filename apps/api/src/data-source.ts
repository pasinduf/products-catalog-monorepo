import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: process.env.NODE_ENV !== "production",
  entities: [__dirname + "/entities/**/*.entity.{ts,js}"],
  migrations: [__dirname + "/migrations/**/*.ts"],
  subscribers: [],
});

export const initializeDatabase = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    return AppDataSource;
};
