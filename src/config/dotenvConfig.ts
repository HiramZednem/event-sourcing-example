import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = parseInt(process.env.PORT || '3000', 10);
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';


if (!RABBITMQ_URL) {
    throw new Error("RABBITMQ_URL is not defined in the .env file");
  }