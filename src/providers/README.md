
# Custom Data Provider

This directory contains the custom data provider implementation for the application.

## Files

- `dataProvider.tsx`: The main data provider implementation that handles all CRUD operations with the backend API.
- `authProvider.tsx`: The authentication provider that handles user authentication and authorization.

## Data Provider Features

The custom data provider provides the following functionality:

1. **Standard CRUD Operations**: 
   - `getList`: Fetch a list of resources with pagination, sorting, and filtering
   - `getOne`: Fetch a single resource by ID
   - `create`: Create a new resource
   - `update`: Update an existing resource
   - `deleteOne`: Delete a resource

2. **Batch Operations**:
   - `getMany`: Fetch multiple resources by IDs
   - `createMany`: Create multiple resources
   - `updateMany`: Update multiple resources
   - `deleteMany`: Delete multiple resources

3. **Custom Operations**:
   - `custom`: Handle custom API requests with any method, URL, and payload
   - `export`: Export data in various formats

4. **File Upload Support**:
   - Handles file uploads through the custom method
   - Supports FormData for multipart/form-data requests

## Usage

To use the custom data provider, import it in your app:

```typescript
import { dataProvider } from "./providers/dataProvider";

// In your App.tsx
<Refine
  dataProvider={dataProvider}
  // other props
/>
```

## Configuration

The data provider automatically uses the API URL from the environment variable `VITE_API_URL` or defaults to `http://localhost:3000/api`.

## Authentication

The data provider automatically includes the authentication token in the headers of all requests. The token is retrieved from local storage and added as a Bearer token in the Authorization header.

## Error Handling

The data provider has built-in error handling for the following scenarios:
- 401 Unauthorized: Automatically redirects to the login page
- Other errors: Throws error messages from the API response

## File Uploads

File uploads can be handled using the `custom` method with FormData. There's also a utility file located at `../utils/upload.ts` that provides helper functions for file uploads.
