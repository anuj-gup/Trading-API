const express = require("express");
const Trade = require("./models/trade");

module.exports = (service) => {
  const router = express.Router();

  router.post("/trade", (req, res) => {
    const { symbol, side, price, quantity } = req.body;
    const allowedSymbols = ["BTC", "ETH"];
    const allowedSides = ["buy", "sell"];
    if (!allowedSymbols.includes(symbol)) {
        return res.status(400).json({ error: "Invalid symbol" });
    }
    if (!allowedSides.includes(side)) {
        return res.status(400).json({ error: "Invalid side" });
    }
    if (typeof price !== "number" || price <= 0) {
        return res.status(400).json({ error: "Price must be positive" });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be positive" });
    }
    try {
      const trade = new Trade({
        id: service.trades.length + 1,
        ...req.body,
      });
      service.addTrade(trade);
      res.json(trade);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  router.get("/portfolio", (req, res) => {
    res.json(service.getPortfolio());
  });

  router.get("/pnl", (req, res) => {
    res.json(service.getPnL());
  });

  return router;
};
