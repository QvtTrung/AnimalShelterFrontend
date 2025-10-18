
# Custom Hooks

This directory contains custom React hooks that provide convenient ways to interact with the API and data provider.

## Files

- `useApi.ts`: Custom hooks for interacting with the data provider and API.

## useApi Hook

The `useApi` hook provides a set of custom hooks that wrap around Refine's core hooks to provide a more convenient and consistent API for making requests.

### Functions

- `useApiList(resource: string, config?: any)`: Hook for fetching a list of items from a resource.
- `useApiOne(resource: string, id: string, config?: any)`: Hook for fetching a single item from a resource.
- `useApiCreate(resource: string, config?: any)`: Hook for creating a new item in a resource.
- `useApiUpdate(resource: string, id: string, config?: any)`: Hook for updating an item in a resource.
- `useApiDelete(resource: string, id: string, config?: any)`: Hook for deleting an item from a resource.
- `useApiCustom(url: string, method: string, config?: any)`: Hook for making custom API requests.
- `useFileUpload(resource: string, folder?: string)`: Hook for uploading files to a resource.

### Usage

First, import and initialize the hook:

```typescript
import { useApi } from "../hooks/useApi";

const MyComponent = () => {
  const { useApiList, useApiCreate, useApiUpdate, useApiDelete } = useApi();

  // Use the hooks as needed
  const { data, isLoading } = useApiList("items");

  // ... rest of component
};
```

Example with all operations:

```typescript
import { useApi } from "../hooks/useApi";
import { showSuccessMessage } from "../utils/errorHandler";

export const ItemManager = () => {
  const { useApiList, useApiCreate, useApiUpdate, useApiDelete } = useApi();

  // Fetch items
  const { data: items, isLoading, refetch } = useApiList("items");

  // Create mutation
  const { mutate: createItem } = useApiCreate("items", {
    onSuccess: () => {
      showSuccessMessage("Item created successfully");
      refetch();
    },
  });

  // Update mutation
  const { mutate: updateItem } = useApiUpdate("items", "", {
    onSuccess: () => {
      showSuccessMessage("Item updated successfully");
      refetch();
    },
  });

  // Delete mutation
  const { mutate: deleteItem } = useApiDelete("items", "", {
    onSuccess: () => {
      showSuccessMessage("Item deleted successfully");
      refetch();
    },
  });

  // ... component rendering
};
```

File upload example:

```typescript
import { useApi } from "../hooks/useApi";

export const FileUploader = () => {
  const { useFileUpload } = useApi();
  const { uploadFile, isLoading } = useFileUpload("images", "profile");

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadFile(file);
      console.log("File uploaded:", result);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // ... component rendering
};
```
