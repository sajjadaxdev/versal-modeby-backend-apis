import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import userRoleRoutes from "./routes/userRoleRoutes.js";
import permissionRoutes from "./routes/permissionRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import vehicleTypeRoutes from "./routes/vehicleTypeRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import filterRoutes from "./routes/filterRoutes.js";
import franchiseRoutes from "./routes/franchiseRoutes.js";
import defaultFareConfigRoutes from "./routes/defaultFareConfigRoutes.js";
import fareConfigRoutes from "./routes/fareConfigRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import currencyConfigRoutes from "./routes/currencyConfigRoutes.js";
import defaultSurgePricingRoutes from "./routes/defaultSurgePricingRoutes.js";
import surgePricingRoutes from "./routes/surgePricingRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import rideDriverRequestRoutes from "./routes/rideDriverRequestRoutes.js";

import { verifyApiKey } from "./app/middlewares/verifyApiKey.js";
import { errorHandler } from "./app/middlewares/errorHandler.js";
import { verifyToken } from "./app/middlewares/authMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", verifyApiKey);

app.use("/api/v1/users", verifyToken, userRoutes);
app.use("/api/v1/auth/validate-token", verifyToken);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/roles", verifyToken, roleRoutes);
app.use("/api/v1/user-roles", verifyToken, userRoleRoutes);
app.use("/api/v1/permissions", verifyToken, permissionRoutes);
app.use("/api/v1/business", verifyToken, businessRoutes);
app.use("/api/v1/franchises", verifyToken, franchiseRoutes);
app.use("/api/v1/vehicle-types", verifyToken, vehicleTypeRoutes);
app.use("/api/v1/vehicles", verifyToken, vehicleRoutes);
app.use("/api/v1/filter/", verifyToken, filterRoutes);

app.use("/api/v1/default-fare-configs", verifyToken, defaultFareConfigRoutes);
app.use("/api/v1/fare-configs", verifyToken, fareConfigRoutes);
app.use("/api/v1/default-surge-pricings", verifyToken, defaultSurgePricingRoutes);
app.use("/api/v1/surge-pricings", verifyToken, surgePricingRoutes);
app.use("/api/v1/ride", verifyToken, rideRoutes);
app.use("/api/v1/riders", verifyToken, riderRoutes);
app.use("/api/v1/drivers", verifyToken, driverRoutes);
app.use("/api/v1/notifications", verifyToken, notificationRoutes);
app.use("/api/v1/drivers/ride-requests", verifyToken, rideDriverRequestRoutes);

app.use("/api/v1/languages", languageRoutes);
app.use("/api/v1/currency-configs", verifyToken, currencyConfigRoutes);
// Test route (for demo)
app.get("/error-demo", (req, res) => {
  throw new Error("Something went wrong!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`
  😎 Sab set hai bhai!
  🚀 Server successfully chal raha hai.
  📍 Port: ${PORT}
  🌐 Yahan visit karo: http://127.0.0.1:${PORT}/`)
  );
}

export default app;
