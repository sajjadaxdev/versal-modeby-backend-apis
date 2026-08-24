import dotenv from "dotenv";
dotenv.config();

export const verifyApiKey = (req, res, next) => {
  const clientKey = req.headers["x-api-key"];

  if (!clientKey) {
    return res.status(401).json({ 
      success: false,
      message: "API key missing" 
    });
  }

  if (clientKey !== process.env.API_SECRET_KEY) {
    return res.status(403).json({ 
      success: false,
      message: "Invalid API key" 
    });
  }

  next();
};

