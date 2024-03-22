import {config} from "dotenv";
config();

export const PORT = 8080
// export const HOST = "http://localhost:8080"
export const HOST = "https://prod-testing-development.up.railway.app"
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;
export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
export const PAYPAL_API = 'https://api-m.sandbox.paypal.com';


