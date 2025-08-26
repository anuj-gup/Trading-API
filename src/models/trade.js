class Trade {
  constructor({ id, symbol, side, price, quantity, timestamp }) {
    this.id = id;
    this.symbol = symbol;
    this.side = side; // "buy" or "sell"
    this.price = price;
    this.quantity = quantity;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = Trade;
