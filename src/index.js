const express = require("express");
const TradingService = require("./services/tradingService");
const routes = require("./routes");

const app = express();
app.use(express.json());

const service = new TradingService();
app.use("/", routes(service));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
