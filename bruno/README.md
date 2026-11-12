# Bruno Collection for Generador de Hoja de Vida API

This is a Bruno collection for testing the API endpoints.

## Setup

1. Install Bruno: https://www.usebruno.com/
2. Open this folder in Bruno
3. Configure the environment variables

## Environment Variables

Create a file `bruno/environments/local.bru` with:

```
vars {
  baseUrl: http://localhost:3000/api
  idToken: your-firebase-id-token-here
  sessionId: your-session-cookie-here
}
```

## Collection Structure

```
bruno/
├── environments/
│   └── local.bru
├── auth/
│   ├── login.bru
│   ├── logout.bru
│   └── yo.bru
├── cv/
│   ├── list.bru
│   ├── create.bru
│   ├── get.bru
│   ├── update.bru
│   └── delete.bru
└── public/
    └── get-public.bru
```
