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
    if (trade.price <= 0 || trade.quantity <= 0) {
      throw new Error("Price and Quantity must be positive");
    }

    this.trades.push(trade);

    if (!this.positions[trade.symbol]) {
      this.positions[trade.symbol] = { quantity: 0, avgEntryPrice: 0 };
    }

    const pos = this.positions[trade.symbol];

    if (trade.side === "buy") {
      // Update average entry price on buy
      const totalCost = pos.avgEntryPrice * pos.quantity + trade.price * trade.quantity;
      pos.quantity += trade.quantity;
      pos.avgEntryPrice = totalCost / pos.quantity;
    } else {
      // Sell trade logic
      if (pos.quantity < trade.quantity) throw new Error("Not enough quantity to sell");

      const costBasis = pos.avgEntryPrice * trade.quantity;
      const proceeds = trade.price * trade.quantity;
      this.realizedPnL += proceeds - costBasis;

      pos.quantity -= trade.quantity;
      if (pos.quantity === 0) pos.avgEntryPrice = 0;
    }

    // Update unrealized PnL after this trade insert only
    this.unrealizedPnL = 0;
    for (const sym in this.positions) {
      const position = this.positions[sym];
      if (position.quantity > 0 && this.latestPrice[sym]) {
        this.unrealizedPnL += (this.latestPrice[sym] - position.avgEntryPrice) * position.quantity;
      }
    }
  }

  getPortfolio() {
    // Return a copy to avoid mutation from outside
    return Object.entries(this.positions).map(([symbol, pos]) => ({
      symbol,
      quantity: pos.quantity,
      avgEntryPrice: pos.avgEntryPrice,
    }));
  }

  getPnL() {
    return {
      realizedPnL: this.realizedPnL,
      unrealizedPnL: this.unrealizedPnL,
    };
  }

  // Optional convenience method to update latest prices externally and keep unrealized PnL fresh
  updateLatestPrice(latestPriceMap) {
    this.latestPrice = { ...this.latestPrice, ...latestPriceMap };
    this.unrealizedPnL = 0;
    for (const sym in this.positions) {
      const pos = this.positions[sym];
      if (pos.quantity > 0 && this.latestPrice[sym]) {
        this.unrealizedPnL += (this.latestPrice[sym] - pos.avgEntryPrice) * pos.quantity;
      }
    }
  }
}

module.exports = TradingService;
