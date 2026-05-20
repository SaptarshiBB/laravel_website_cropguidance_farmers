# Crop Guidance & Farmers Friend

AI-powered agriculture platform for Indian farmers with crop recommendations, weather intelligence, pest alerts, government schemes, chatbot guidance, and admin management.

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS, React Router DOM v6, Axios, Framer Motion, Recharts, Lucide React, React Hot Toast
- Backend: Laravel 11, PHP 8.2+, Laravel Sanctum, MySQL, REST APIs, CORS configured for Vite

## Prerequisites

- PHP 8.2+
- Composer
- Node 18+
- MySQL 8 or compatible MariaDB

## Setup

```bash
cd crop-guidance-app/backend
composer install
cp .env.example .env
php artisan key:generate
```

Create a MySQL database named `crop_guidance_db`, then update `.env` if your MySQL username or password differs.

```bash
php artisan migrate:fresh --seed
php artisan serve
```

In a second terminal:

```bash
cd crop-guidance-app/frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`. Backend API runs at `http://localhost:8000/api`.

## Environment Variables

Backend `.env`:

- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: MySQL connection
- `SANCTUM_STATEFUL_DOMAINS`: local frontend host
- `FRONTEND_URL`: React app origin for CORS
- `OPENWEATHER_API_KEY`: optional OpenWeather key; mock weather is returned if omitted
- `OPENWEATHER_BASE_URL`: defaults to OpenWeather API v2.5

Frontend `.env`:

- `VITE_API_URL`: Laravel API URL
- `VITE_OPENWEATHER_API_KEY`: optional client-side reference
- `VITE_APP_NAME`: app display name

## Default Login

- Admin: `admin@cropguidance.com` / `password`
- Farmer: `farmer@cropguidance.com` / `password`

## API Summary

Public:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/schemes`
- `GET /api/crops`
- `GET /api/pest-alerts`

Authenticated:

- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/weather`
- `GET /api/weather/forecast`
- `POST /api/weather/log`
- `GET /api/recommendations`
- `POST /api/recommendations`
- `GET /api/dashboard/summary`
- `POST /api/chatbot/message`

Admin:

- `GET /api/admin/users`
- `PUT /api/admin/users/{id}`
- `DELETE /api/admin/users/{id}`
- `POST /api/crops`
- `PUT /api/crops/{id}`
- `DELETE /api/crops/{id}`
- `POST /api/pest-alerts`
- `PUT /api/pest-alerts/{id}`
- `POST /api/schemes`
- `GET /api/admin/analytics`

## Screenshots

Add screenshots after running the local app:

- Landing page
- Farmer dashboard
- Crop recommendations
- Pest alerts
- Admin analytics

## Deployment Notes

- Set `APP_ENV=production`, `APP_DEBUG=false`, and a secure `APP_KEY`.
- Configure MySQL credentials and run `php artisan migrate --seed`.
- Set `FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS` to production domains.
- Build frontend with `npm run build` and serve `frontend/dist` via a static host.
- Serve Laravel with a production web server pointed at `backend/public`.
