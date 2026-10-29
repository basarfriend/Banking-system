# Banking System API

A Node.js and Express backend for a basic banking system. It provides user authentication, bank account management, balance checks, and account-to-account transfers recorded in a ledger.

## Features

- Sign up and sign in with password hashing
- JWT-based authentication stored in an HTTP cookie
- Create and list a user's bank account
- Check an account balance from its ledger entries
- Create system-initiated transactions and user-initiated transfers
- Record debit and credit ledger entries in MongoDB transactions
- Use an idempotency key to identify a transaction request

## Technology

- Node.js and Express 5
- MongoDB and Mongoose
- JSON Web Tokens and bcrypt

## Requirements

- Node.js and npm
- MongoDB configured as a replica set, or a MongoDB Atlas deployment that supports transactions

MongoDB transactions require replica set support. A standalone local MongoDB server will not support the transaction endpoints.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   MONGO_URL=mongodb://127.0.0.1:27017/banking-system?replicaSet=rs0
   secret=replace-with-a-long-random-secret
   PORT=3000
   ```

   Use your own MongoDB connection string and a strong, private JWT secret. Do not commit `.env` or share its values.

3. Start the server:

   ```bash
   npm start
   ```

   For development with automatic restarts:

   ```bash
   npm run dev
   ```

The API listens on port `3000` by default, or on the port specified by `PORT`.

## API

All endpoints are mounted under `/api`. JSON request bodies are expected where applicable. After signing in, send the `userToken` cookie with requests that require authentication.

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `POST` | `/api/accounts/create` | Register a user | No |
| `POST` | `/api/accounts/login` | Sign in and receive the `userToken` cookie | No |
| `POST` | `/api/accounts/createBankAccount` | Create a bank account; provide the user's password | User |
| `GET` | `/api/accounts/get-accounts` | Get the signed-in user's account | User |
| `GET` | `/api/accounts/:accountId/bal` | Check an account balance | User |
| `GET` | `/api/accounts/logout` | Clear the authentication cookie | User |
| `POST` | `/api/transactions/initialFunds` | Create a system-initiated transaction | System |
| `POST` | `/api/transactions/:accountId/create-transactions` | Transfer funds from the specified account | User |

### Example requests

Register:

```json
{
  "username": "sampleuser",
  "email": "user@example.com",
  "password": "choose-a-password"
}
```

Sign in:

```json
{
  "email": "user@example.com",
  "password": "choose-a-password"
}
```

Create an account (authenticated):

```json
{
  "password": "choose-a-password"
}
```

Create a transaction:

```json
{
  "toAccount": "RECIPIENT_ACCOUNT_ID",
  "amount": 100,
  "idempotencyKey": "unique-request-key"
}
```

For a user transfer, use the sender's account ID in the URL. The initial-funds endpoint uses the same transaction body and requires an authenticated system user.

## Notes

- Transaction requests create debit and credit ledger entries and update the transaction status within a MongoDB session.
- The project does not define an `npm test` suite yet.
- This project is for learning and demonstration. It has not been presented as production-ready financial software.
