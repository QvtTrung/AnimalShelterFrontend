
# Utility Functions

This directory contains utility functions used throughout the application.

## Files

- `errorHandler.ts`: Functions for handling API errors consistently
- `upload.ts`: Functions for handling file uploads

## Error Handling

The error handling utilities provide a consistent way to handle and display API errors throughout the application.

### Functions

- `handleApiError(error: any): ApiError`: Processes different types of errors and returns a standardized error object.
- `showErrorMessage(error: any)`: Displays an error message to the user using Ant Design's message component.
- `showSuccessMessage(messageText: string)`: Displays a success message.
- `showWarningMessage(messageText: string)`: Displays a warning message.
- `showInfoMessage(messageText: string)`: Displays an info message.

### Usage

```typescript
import { showErrorMessage, showSuccessMessage } from "../utils/errorHandler";

try {
  // API call
  await apiRequest();
  showSuccessMessage("Operation completed successfully");
} catch (error) {
  showErrorMessage(error);
}
```

## File Upload

The file upload utilities provide functions for uploading files to the server.

### Functions

- `uploadFile(file: File, resource: string, folder?: string)`: Uploads a file to the specified resource and optional folder.
- `deleteFile(id: string, resource: string)`: Deletes a file with the specified ID from the specified resource.
- `getFileUrl(fileId: string)`: Returns the URL for accessing a file with the specified ID.
- `createUploadRequest(resource: string, file: File, folder?: string)`: Creates a request object for uploading a file using the data provider.

### Usage

```typescript
import { uploadFile } from "../utils/upload";

const handleUpload = async (file: File) => {
  try {
    const result = await uploadFile(file, "images", "profile");
    console.log("File uploaded successfully:", result);
  } catch (error) {
    console.error("File upload failed:", error);
  }
};
```
