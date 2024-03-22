import {config} from "dotenv";
config();

export const PORT = 1337
export const HOST = "https://c8ad-181-29-199-140.ngrok-free.app"
// export const HOST = "https://prod-testing-development.up.railway.app"
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;
export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
export const PAYPAL_API = 'https://api-m.sandbox.paypal.com';


