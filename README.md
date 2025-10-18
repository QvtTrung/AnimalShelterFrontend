<div align="center" style="margin: 30px;">
<a href="https://refine.dev/">
  <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
</a>

</br>
</br>

<div align="center">
    <a href="https://refine.dev">Home Page</a> |
    <a href="https://discord.gg/refine">Discord</a> |
    <a href="https://refine.dev/examples/">Examples</a> |
    <a href="https://refine.dev/blog/">Blog</a> |
    <a href="https://refine.dev/docs/">Documentation</a>
</div>
</div>

</br>
</br>

<div align="center"><strong>Build your <a href="https://reactjs.org/">React</a>-based CRUD applications, without constraints.</strong><br>An open source, headless web application framework developed with flexibility in mind.

<br />
<br />

[![Discord](https://img.shields.io/discord/837692625737613362.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/refine)
[![Twitter Follow](https://img.shields.io/twitter/follow/refine_dev?style=social)](https://twitter.com/refine_dev)

<a href="https://www.producthunt.com/posts/refine-3?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-refine&#0045;3" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=362220&theme=light&period=daily" alt="refine - 100&#0037;&#0032;open&#0032;source&#0032;React&#0032;framework&#0032;to&#0032;build&#0032;web&#0032;apps&#0032;3x&#0032;faster | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

</div>

## Animal Rescue Frontend

This is the frontend application for the Animal Rescue project, built with React, TypeScript, and Refine.

## Features

- User authentication and authorization
- CRUD operations for managing animals, rescues, reports, and adoptions
- File upload support for images and documents
- Responsive design with Ant Design components
- Error handling and user feedback

## Technology Stack

- **React 19**: UI library
- **TypeScript**: Type safety
- **Refine**: Headless framework for building CRUD applications
- **Ant Design**: UI component library
- **Axios**: HTTP client for API requests
- **Vite**: Build tool

## Project Structure

```
src/
├── components/       # Reusable React components
├── hooks/           # Custom React hooks
├── interfaces/      # TypeScript type definitions
├── pages/           # Page components
├── providers/       # Data and authentication providers
├── utils/           # Utility functions
└── App.tsx          # Main application component
```

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add the following:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Build for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

## Key Components

### Data Provider

The custom data provider handles all API requests to the backend. It's implemented in `src/providers/dataProvider.tsx` and provides methods for:

- CRUD operations (create, read, update, delete)
- Batch operations
- File uploads
- Custom API requests

### Authentication Provider

The authentication provider handles user authentication and authorization. It's implemented in `src/providers/authProvider.tsx` and provides methods for:

- Login and logout
- Registration
- Token management
- Permission checking

### Custom Hooks

The custom hooks in `src/hooks/useApi.ts` provide convenient ways to interact with the data provider:

- `useApiList`: Fetch a list of items
- `useApiOne`: Fetch a single item
- `useApiCreate`: Create a new item
- `useApiUpdate`: Update an existing item
- `useApiDelete`: Delete an item
- `useApiCustom`: Make custom API requests
- `useFileUpload`: Upload files

### Error Handling

Error handling is centralized in `src/utils/errorHandler.ts` and provides:

- Consistent error processing
- User-friendly error messages
- Success, warning, and info message utilities

## Try this example on your local

```bash
npm create refine-app@latest -- --example auth-antd
```

## Try this example on CodeSandbox

<br/>

[![Open auth-antd example from refine](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/github/refinedev/refine/tree/main/examples/auth-antd?view=preview&theme=dark&codemirror=1)
