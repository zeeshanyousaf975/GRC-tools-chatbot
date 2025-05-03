# GRC Chatbot Frontend

This is the frontend application for the GRC Chatbot, built with React, TypeScript, and Material-UI.

## Features

- Modern, responsive UI built with Material-UI
- Real-time chat interface with markdown support
- Code syntax highlighting
- Error handling and loading states
- Type-safe development with TypeScript
- API integration with axios
- State management with React Query

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Testing

To run tests:

```bash
npm test
```

## Linting and Formatting

To run the linter:

```bash
npm run lint
```

To format the code:

```bash
npm run format
```

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── api/            # API related code
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── theme/          # Material-UI theme
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Application entry point
│   └── vite.config.ts  # Vite configuration
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Dependencies

- React 18
- TypeScript
- Material-UI
- React Query
- Axios
- React Markdown
- React Syntax Highlighter
- Socket.IO Client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 