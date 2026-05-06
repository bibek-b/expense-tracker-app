## Expense Tracker Backend

Node.js + Express + MongoDB backend for the Expense Tracker mobile app with real-time sync support.

### Features

- **REST API** for expense CRUD operations
- **MongoDB** for persistent storage
- **Upsert by ID** strategy for reliable sync
- **CORS enabled** for mobile app access
- **TypeScript** for type safety
- **Indexed queries** for performance (date, updatedAt)

### Project Structure

```
backend/src/
├── server.ts              # Express app + MongoDB connection
├── config/
│   └── database.ts       # MongoDB client setup
├── models/
│   └── Expense.ts        # Mongoose schema
├── controllers/
│   └── expenseController.ts
└── routes/
    └── expenseRoutes.ts
```

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `.env` file (optional):

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```

**Defaults:**
- `PORT`: 3001
- `MONGODB_URI`: mongodb://localhost:27017/expense-tracker

### Development

```bash
npm run dev
```

Runs on `http://localhost:3001` with auto-reload via `ts-node`.

### Production Build

```bash
npm run build    # Compile to dist/
npm start        # Run compiled code
```

### API Endpoints

#### Health Check
```
GET /health
```
Response:
```json
{ "ok": true }
```

#### Get All Expenses
```
GET /expenses
```
Response:
```json
{
  "expenses": [
    {
      "id": "1234567-abc",
      "amount": 15.50,
      "category": "Food",
      "date": "2024-05-06",
      "note": "Lunch",
      "createdAt": "2024-05-06T12:00:00Z",
      "updatedAt": "2024-05-06T12:00:00Z"
    }
  ]
}
```

#### Upload Expenses (Upsert)
```
POST /expenses
Content-Type: application/json

{
  "expenses": [
    {
      "id": "1234567-abc",
      "amount": 15.50,
      "category": "Food",
      "date": "2024-05-06",
      "note": "Lunch",
      "createdAt": "2024-05-06T12:00:00Z",
      "updatedAt": "2024-05-06T12:00:00Z"
    }
  ],
  "updatedAt": "2024-05-06T12:30:00Z"
}
```
Response:
```json
{
  "ok": true,
  "count": 1
}
```

### Sync Strategy

The mobile app uses **upsert by ID**:
1. Client sends expenses array with `id` field
2. Server upserts each expense (insert if new, update if exists)
3. Latest `updatedAt` timestamp is preserved
4. Conflicts resolved by "latest wins" strategy

### MongoDB Schema

```javascript
{
  _id: ObjectId,
  id: String (unique index),
  amount: Number,
  category: String,
  date: String (YYYY-MM-DD format),
  note: String | null,
  createdAt: String (ISO timestamp),
  updatedAt: String (ISO timestamp)
}
```

Indexes:
```javascript
db.expenses.createIndex({ "id": 1 }, { unique: true })
db.expenses.createIndex({ "date": 1 })
db.expenses.createIndex({ "updatedAt": 1 })
```

### Database Setup

**Option 1: Local MongoDB**
```bash
# Windows: Start MongoDB service
net start MongoDB

# macOS: via Homebrew
brew services start mongodb-community

# Verify: mongosh
mongosh "mongodb://localhost:27017/expense-tracker"
```

**Option 2: MongoDB Atlas (Cloud)**
```
1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Set MONGODB_URI environment variable
```

### Testing the API

```bash
# Health check
curl http://localhost:3001/health

# Get expenses
curl http://localhost:3001/expenses

# Upload expense
curl -X POST http://localhost:3001/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "expenses": [{
      "id": "test-1",
      "amount": 15.50,
      "category": "Food",
      "date": "2024-05-06",
      "note": "Test",
      "createdAt": "2024-05-06T12:00:00Z",
      "updatedAt": "2024-05-06T12:00:00Z"
    }],
    "updatedAt": "2024-05-06T12:30:00Z"
  }'
```

### Deployment

**Heroku:**
```bash
heroku login
heroku create your-app-name
heroku config:set MONGODB_URI="your-atlas-uri"
git push heroku main
```

**Railway / Render:**
1. Connect GitHub repo
2. Set `MONGODB_URI` env var
3. Deploy
4. Update frontend `src/config/backend.ts` with deployment URL

### Error Handling

- `500` - Internal server error (check logs)
- Missing body fields will fail validation (Mongoose)
- Duplicate `id` will update existing expense
- CORS errors - frontend is blocked (update CORS origin)

### Performance

- Sorted by `date` descending, `updatedAt` descending
- Indexed queries on `date` and `updatedAt`
- Typical response time: <50ms for 1000 expenses

### Development Tips

- Check logs: `npm run dev` shows all requests
- MongoDB queries: Use `mongosh` to inspect data
- Test multiple syncs: add same `id` with different `updatedAt`

### Common Issues

**"Cannot connect to MongoDB"**
- Check MongoDB is running: `mongosh`
- Verify `MONGODB_URI` environment variable
- Check firewall if using remote MongoDB

**"Port 3001 already in use"**
```bash
# Find process: netstat -ano | findstr :3001
# Kill it or use different PORT env var
PORT=3002 npm run dev
```

**CORS error from frontend**
- Check frontend URL in CORS config (should be * for development)
- For production, specify frontend domain

---

See the main [SETUP_GUIDE.md](../SETUP_GUIDE.md) for full integration instructions.


