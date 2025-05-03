# GRC Chatbot Backend

This is the backend service for the GRC Chatbot, built with FastAPI and AutoGen ChatAgent.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Groq API key

## Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file and add your Groq API key.

## Project Structure

```
backend/
├── src/
│   ├── api/           # API routes
│   │   └── routes.py
│   ├── core/          # Core functionality
│   │   ├── config.py
│   │   └── logging.py
│   ├── services/      # Business logic
│   │   └── chat_agent.py
│   └── main.py        # Application entry point
├── requirements.txt
└── README.md
```

## Running the Application

1. Start the development server:
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. Access the API documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

- `POST /api/chat`: Send a message to the chatbot
- `GET /api/chat/history`: Get the chat history

## Features

- FastAPI for high-performance API
- AutoGen ChatAgent for intelligent conversations
- Groq LLM integration
- Comprehensive logging
- Environment-based configuration
- CORS support
- Error handling
- Type safety with Pydantic

## Development

- Use `black` for code formatting
- Use `isort` for import sorting
- Use `flake8` for linting
- Use `mypy` for type checking
- Use `pytest` for testing

## Testing

Run tests with:
```bash
pytest
```

## Deployment

The application can be deployed using:
- Docker
- Cloud platforms (AWS, GCP, Azure)
- Traditional servers

## License

[MIT License](LICENSE) 