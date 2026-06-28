# Async Error Handling Notes

This file is used by the read-file route in my Node.js backend practice.

The purpose of this route is to show that local files can be read asynchronously with fs/promises. If the file exists, the server returns the file content as JSON. If the file is missing or cannot be read, the error should go to the global Express error middleware.

In this version, each async route is wrapped with asyncHandler. That way, I do not need to repeat try/catch inside every route.
