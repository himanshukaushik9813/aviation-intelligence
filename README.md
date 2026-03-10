# Aviation Intelligence Platform

![Platform Status](https://img.shields.io/badge/status-active-success.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-teal.svg)

An AI-powered aviation disruption intelligence platform that predicts flight disruptions using machine learning and provides real-time analytics for aviation operations.

## Features

### Core Capabilities
- **ML-Powered Predictions**: XGBoost-based machine learning model for disruption risk assessment
- **Real-Time Analytics**: Live statistics on flight disruptions and trends
- **Interactive Dashboard**: Modern UI with real-time backend health monitoring
- **Route Analysis**: Risk assessment for specific airline routes
- **3D Globe Visualization**: Interactive map showing global aviation data
- **Airspace Monitoring**: Track airspace status across different regions

### Key Components
- **Backend Health Check**: Automatic monitoring of API connectivity
- **Risk Scoring**: Multi-factor risk analysis including geopolitical factors
- **Historical Analytics**: Trend analysis and disruption patterns
- **Affected Routes Tracking**: Real-time monitoring of impacted flight routes

## Tech Stack

### Frontend
- **Framework**: Next.js 15.1.0 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **3D Graphics**: React Three Fiber (Three.js)
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI 0.115.0
- **Language**: Python 3.11+
- **ML Library**: XGBoost 2.1.1, scikit-learn 1.5.2
- **Data Processing**: Pandas 2.2.3, NumPy 2.1.2
- **Server**: Uvicorn (ASGI)

## Project Structure

```
aviation-intelligence/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   │   ├── charts/      # Data visualization components
│   │   │   ├── dashboard/   # Dashboard UI components
│   │   │   ├── maps/        # 3D globe visualization
│   │   │   └── prediction/  # Prediction interface
│   │   └── hooks/           # Custom React hooks
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                  # FastAPI backend application
│   ├── api/                 # API endpoints
│   │   └── main.py          # Main FastAPI application
│   ├── data_processing/     # Data processing utilities
│   │   └── processor.py     # Feature engineering
│   ├── ml_model/            # Machine learning models
│   │   └── model.py         # XGBoost prediction model
│   ├── tests/               # Backend tests
│   └── requirements.txt     # Python dependencies
│
├── .gitignore               # Git ignore rules
├── BACKEND_HEALTH_CHECK.md  # Health check documentation
└── README.md                # This file
```

## Getting Started

### Prerequisites
- **Node.js** 20.x or higher
- **Python** 3.11 or higher
- **npm** or **yarn**
- **pip** (Python package manager)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/himanshukaushik9813/aviation-intelligence.git
cd aviation-intelligence
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Running the Application

#### Start Backend (Terminal 1)
```bash
cd backend
python -m uvicorn api.main:app --reload --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Dashboard**: http://localhost:3000

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and status |
| GET | `/health` | Health check endpoint |
| POST | `/predict` | Get disruption prediction |
| GET | `/analytics/stats` | Get aggregated statistics |
| GET | `/analytics/high-risk-countries` | List high-risk countries |

### Example: Prediction Request

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "airline": "Emirates",
    "origin_country": "United Arab Emirates",
    "destination_country": "United States",
    "airspace_status": "open"
  }'
```

Response:
```json
{
  "risk_score": 0.23,
  "risk_level": "low",
  "confidence": 0.89,
  "factors": ["Route stability", "Airspace open"],
  "recommendation": "Monitor situation"
}
```

## Development

### Run Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Run Frontend Linter
```bash
cd frontend
npm run lint
```

### Build for Production

#### Frontend
```bash
cd frontend
npm run build
npm start
```

#### Backend
```bash
cd backend
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

## Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**
1. Push to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_BACKEND_URL`

**Backend on Render:**
1. Create new Web Service on [Render](https://render.com)
2. Set root directory to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

### Option 2: Docker

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://backend:8000
    depends_on:
      - backend
```

Run:
```bash
docker-compose up --build
```

## Features Deep Dive

### Machine Learning Model
The platform uses an **XGBoost** classifier trained on synthetic aviation data with features including:
- Airline carrier information
- Origin/destination geopolitical risk factors
- Airspace status (open/restricted/closed)
- Historical disruption patterns
- Temporal features (time of day, day of week)

### Real-Time Health Monitoring
The frontend automatically monitors backend connectivity:
- Polls `/health` endpoint every 30 seconds
- Visual status indicator (Connected/Offline/Checking)
- Manual retry capability
- 5-second timeout protection

See [BACKEND_HEALTH_CHECK.md](BACKEND_HEALTH_CHECK.md) for detailed information.

### Data Visualization
- **Disruption Timeline**: Historical trend analysis
- **Airline Impact Chart**: Carrier-specific disruption rates
- **Cancellation Distribution**: Status breakdown (canceled, delayed, diverted)
- **Affected Routes Table**: Real-time route monitoring
- **3D Globe**: Interactive global aviation visualization

## Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Backend
No environment variables required for basic operation. Can be extended for:
- Database connections
- External API keys
- ML model configurations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

### Backend Tests
```bash
cd backend
pytest tests/test_api.py -v          # Test API endpoints
pytest tests/test_model.py -v        # Test ML model
pytest tests/test_processor.py -v    # Test data processing
```

### Test Coverage
```bash
cd backend
pip install pytest-cov
pytest --cov=. --cov-report=html
```

## Troubleshooting

### Backend shows "Offline" in UI
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check CORS settings in `backend/api/main.py`
3. Verify `NEXT_PUBLIC_BACKEND_URL` in frontend `.env.local`

### Import errors in Python
```bash
cd backend
pip install -r requirements.txt
```

### Frontend build errors
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

## Performance

- **API Response Time**: ~50-100ms for predictions
- **Frontend Load Time**: ~2-3s (initial)
- **Model Inference**: ~10-20ms per prediction
- **Dataset Processing**: ~500ms for 5000 samples

## Security

- CORS configured for localhost development
- No authentication required for basic operation
- Environment variables for sensitive configuration
- Input validation via Pydantic models

## Roadmap

- [ ] Real-time data integration with aviation APIs
- [ ] User authentication and authorization
- [ ] Historical data persistence (PostgreSQL/MongoDB)
- [ ] Email/SMS alerts for high-risk routes
- [ ] Mobile application (React Native)
- [ ] Advanced ML models (LSTM, Transformers)
- [ ] Multi-language support
- [ ] Export reports to PDF

## License

This project is open source and available under the [MIT License](LICENSE).

## Authors

**Himanshu Kaushik**
- GitHub: [@himanshukaushik9813](https://github.com/himanshukaushik9813)
- Email: himanshukaushik9813@gmail.com

## Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Frontend powered by [Next.js](https://nextjs.org/)
- ML models using [XGBoost](https://xgboost.readthedocs.io/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- 3D visualization with [Three.js](https://threejs.org/)

---

**Made with ❤️ for safer aviation operations**
