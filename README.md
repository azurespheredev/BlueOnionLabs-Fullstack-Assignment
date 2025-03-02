# ✅ Blue Onion Labs Take Home Assignment

## Features

- Extract data from a CSV file stored locally (not a Cloud Storage ATM)
- Look up journal entries by specifying the month and year
- Refresh functionality to re-fetch data in case of errors
- Export results as CSV or Excel files

## Technologies

### Backend

- **[Ruby v3.3.7](https://www.ruby-lang.org/en/)** – Core programming language ([Documentation](https://www.ruby-lang.org/en/documentation/))
- **[Rails v8.0.1](https://rubyonrails.org/)** – Web application framework ([Documentation](https://guides.rubyonrails.org/))
- **[PostgreSQL](https://www.postgresql.org/)** – Relational database management system ([Documentation](https://www.postgresql.org/docs/))
- **[Docker](https://www.docker.com/)** – Containerization for consistent development and deployment ([Documentation](https://docs.docker.com/))
- **[RSpec](https://rspec.info/)** – Testing framework ([Documentation](https://rspec.info/documentation/))

### Frontend

- **[TypeScript v4.9.5](https://www.typescriptlang.org/)** – Type-safe JavaScript alternative ([Documentation](https://www.typescriptlang.org/docs/))
- **[React v19](https://react.dev/)** – JavaScript library for building user interfaces ([Documentation](https://react.dev/learn))
- **[Material UI](https://mui.com/)** – UI components for a modern design system ([Documentation](https://mui.com/material-ui/getting-started/overview/))
- **[ESLint](https://eslint.org/)** – Linting tool for maintaining code quality ([Documentation](https://eslint.org/docs/latest/))
- **[Prettier](https://prettier.io/)** – Code formatter for consistent style ([Documentation](https://prettier.io/docs/en/))

## Setup and Installation

### Environment Variables

Before running the application, set up the following environment variables for both the backend and frontend:

#### Backend Environment

Create a `.env` file and add the following variables:

```ini
RAILS_MAX_THREADS=5
CORS_ORIGIN=http://localhost:4000

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_DB_DEV=blue_onion_labs
POSTGRES_DB_TEST=blue_onion_labs
POSTGRES_DB_PROD=blue_onion_labs
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=12345678
```

> ⚠️ **Note:** Update these variables based on your environment settings.

#### Frontend Environment

Create a `.env` file and add the following variable:

```ini
PORT=4000
```

### Running the Application

#### 1. Start the Backend (Rails API)

Run the following command to build and start the Rails server:

```sh
sh backend-buildRun.sh
```

If the backend has already been built, use:

```sh
sh backend-run.sh
```

#### 2. Start the Frontend (React App)

Run the following command to build and start the frontend:

```sh
sh frontend-buildRun.sh
```

If the frontend has already been built, use:

```sh
sh frontend-run.sh
```

#### 3. Access the Web App

You will see the web page running on [localhost:4000](http://localhost:4000) and there we go! 🥳
