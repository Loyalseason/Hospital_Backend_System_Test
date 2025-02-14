# Hospital_Backend_System_Test
## **Documentation & Justification**
This section explains the design choices made for authentication, encryption, scheduling strategy, and data storage in the hospital backend system.

### **Authentication**
- **JWT with Middleware:** Ensures secure session management and role-based access control.
- **Bcrypt for Password Hashing:** Secures user credentials against attacks.

### **Encryption**
- **AES-256 End-to-End Encryption:** Protects patient notes, ensuring only the patient and doctor can access raw content.

### **Scheduling Strategy**
- **Prisma Recurrence Model:** Stores scheduling patterns (`startDate`, `repeatDays`, `occurrences`).
- **Cron Jobs:** Automates recurring reminders, with adjustments for missed patient check-ins.
- **Automatic Cancellation:** New notes cancel previous actionable steps.

### **Data Storage**
- **PostgreSQL with Prisma ORM:** Provides robust, relational data management.
- **Many-to-Many Relations:** Manages patient–doctor assignments effectively.
- **Transaction Management:** Ensures consistency when creating recurring tasks and notes.

This architecture delivers security, efficiency, and modularity, meeting all functional and performance requirements.

