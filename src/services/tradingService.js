class TradingService {
  constructor() {
    this.trades = [];
    this.positions = {}; // { BTC: { quantity, avgEntryPrice } }
    this.realizedPnL = 0;
    this.unrealizedPnL = 0;
    this.latestPrice = {
      BTC: 44000,
      ETH: 2000,
    };
  }

  addTrade(trade) {
    if (trade.side !== "buy" && trade.side !== "sell") {
      throw new Error("Invalid side");
    }

    this.trades.push(trade);

    if (!this.positions[trade.symbol]) {
      this.positions[trade.symbol] = { quantity: 0, avgEntryPrice: 0 };
    }

    const pos = this.positions[trade.symbol];

    if (trade.side === "buy") {
      const totalCost =
        pos.avgEntryPrice * pos.quantity + trade.price * trade.quantity;
      pos.quantity += trade.quantity;
      pos.avgEntryPrice = totalCost / pos.quantity;
    } else {
      // Sell
      if (pos.quantity < trade.quantity) throw new Error("Not enough quantity");

      const costBasis = pos.avgEntryPrice * trade.quantity;
      const proceeds = trade.price * trade.quantity;
      this.realizedPnL += proceeds - costBasis;

      pos.quantity -= trade.quantity;
      if (pos.quantity === 0) pos.avgEntryPrice = 0;
    }

    // Updating unrealized PnL
    let unrealized = 0;
    for (const sym in this.positions) {
      const pos = this.positions[sym];
      if (pos.quantity > 0 && this.latestPrice[sym]) {
        unrealized +=
          (this.latestPrice[sym] - pos.avgEntryPrice) * pos.quantity;
      }
    }
    this.unrealizedPnL = unrealized;
  }

  getPortfolio() {
    return Object.keys(this.positions).map((symbol) => ({
      symbol,
      quantity: this.positions[symbol].quantity,
      avgEntryPrice: this.positions[symbol].avgEntryPrice,
    }));
  }

  getPnL() {
    return {
      realizedPnL: this.realizedPnL,
      unrealizedPnL: this.unrealizedPnL,
    };
  }
}

module.exports = TradingService;
