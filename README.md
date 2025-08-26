## Features
- Add trades (buy/sell)
- Get current portfolio (positions, average entry price)
- Get realized & unrealized PnL
- In-memory storage (single user, average cost method)

---

## Running Locally
- npm install
- npm start

## API Endpoints

### Add Trade
`POST /trade`
{
"symbol": "BTC",
"side": "buy",
"price": 40000,
"quantity": 1
}

### Get Portfolio
`GET /portfolio`


### Get PnL
`GET /pnl`

## Run Tests
npm test
