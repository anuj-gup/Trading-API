const TradingService = require("../services/tradingService");
const Trade = require("../models/trade");

describe("TradingService", () => {
  let service;

  beforeEach(() => {
    service = new TradingService();
  });

  test("should calculate portfolio and PnL correctly", () => {
    // Buy 1 BTC @ 40k
    service.addTrade(new Trade({ id: 1, symbol: "BTC", side: "buy", price: 40000, quantity: 1 }));
    // Buy 1 BTC @ 42k
    service.addTrade(new Trade({ id: 2, symbol: "BTC", side: "buy", price: 42000, quantity: 1 }));

    let portfolio = service.getPortfolio();
    expect(portfolio[0].quantity).toBe(2);
    expect(portfolio[0].avgEntryPrice).toBe(41000);

    // Sell 1 BTC @ 43k
    service.addTrade(new Trade({ id: 3, symbol: "BTC", side: "sell", price: 43000, quantity: 1 }));

    let pnl = service.getPnL();
    expect(pnl.realizedPnL).toBe(2000);   // (43k - 41k)
    expect(pnl.unrealizedPnL).toBe(3000); // (44k - 41k) * 1
  });
});
