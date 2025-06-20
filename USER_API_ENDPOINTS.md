# User API Endpoints

## List Users

- **Endpoint**: `GET /users`
- **Returns**: `id`, `name`, `jobTitle`, `role`, `avatarUrl`

The endpoint responds with a JSON array of users with the fields listed above.

## List Quotes

- **Endpoint**: `GET /quotes`
- **Returns**: quote objects including related company, sales owner, contact and quote items.

## Get Quote

- **Endpoint**: `GET /quotes/:id`
- **Returns**: a single quote object with its related entities. Returns `404` if not found.

## Create Quote

- **Endpoint**: `POST /quotes`
- **Body**: `title`, `description`, `status`, `subTotal`, `total`, `tax`, `companyId`, `salesOwnerId`, `contactId`
- **Returns**: the created quote object.

## Update Quote

- **Endpoint**: `PUT /quotes/:id`
- **Body**: fields to update from the create payload
- **Returns**: the updated quote object.

## Delete Quote

- **Endpoint**: `DELETE /quotes/:id`
- **Returns**: `{ "success": true }` on success.
