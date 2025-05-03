# GRC Chatbot

A commercial-grade GRC (Governance, Risk, and Compliance) chatbot built with FastAPI, React, and AutoGen ChatAgent.

## Features

- Intelligent conversation using AutoGen ChatAgent
- Groq LLM integration (llama-3.3-70b-versatile)
- Modern React frontend with Material-UI
- FastAPI backend with comprehensive logging
- Docker containerization
- Real-time chat interface
- Chat history management
- Error handling and logging
- Type safety with TypeScript and Pydantic

## Project Structure

```
grc-chatbot/
├── backend/              # FastAPI backend
│   ├── src/             # Source code
│   │   ├── api/         # API routes
│   │   ├── core/        # Core functionality
│   │   └── services/    # Business logic
│   ├── Dockerfile       # Backend container
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/            # Source code
│   │   ├── components/ # React components
│   │   ├── services/   # API services
│   │   └── types/      # TypeScript types
│   └── Dockerfile      # Frontend container
├── docker-compose.yml   # Container orchestration
└── README.md           # Project documentation
```

## Prerequisites

- Docker and Docker Compose
- Groq API key
- Node.js 18+ (for local development)
- Python 3.8+ (for local development)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/grc-chatbot.git
   cd grc-chatbot
   ```

2. Create a `.env` file in the backend directory:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Edit the `.env` file and add your Groq API key.

3. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Local Development

### Backend

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the development server:
   ```bash
   uvicorn src.main:app --reload
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## Deployment

The application can be deployed using:
- Docker containers
- Cloud platforms (AWS, GCP, Azure)
- Traditional servers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT License](LICENSE)

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [AutoGen](https://microsoft.github.io/autogen/)
- [Groq](https://groq.com/)
- [Material-UI](https://mui.com/) 