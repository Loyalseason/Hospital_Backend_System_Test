# Hospital_Backend_System_Test
**Documentation & Justification**
This section outlines the design decisions for authentication, encryption, scheduling, and data storage in the hospital backend system.

Authentication

JWT with Middleware: Provides secure session management and enforces role-based access control.

Bcrypt Password Hashing: Protects user credentials from unauthorized access.

Encryption

AES-256 End-to-End Encryption: Ensures patient notes are only accessible by the doctor and patient.

Scheduling Strategy

Background Jobs with Cron: Manages recurring actionable steps without slowing down the main API flow.

Helper Services for Recurrence: Generates multiple actionable steps efficiently using helper functions before storing them.

Prisma Transactions: Maintains data integrity during batch operations.

Data Storage

PostgreSQL with Prisma ORM: Facilitates secure and relational data management.

Efficient Indexing: Optimizes query performance for large datasets.

Many-to-Many Relations: Manages patient–doctor assignments effectively.

This design balances performance, security, and maintainability, ensuring an efficient backend system.

