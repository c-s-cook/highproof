# High Proof Voucher & Stripe Payment System

A custom-built, full-stack tour booking and payment processing system integrating Stripe payments with a sophisticated voucher code management system. This project demonstrates enterprise-level payment processing, serverless architecture, and real-time order fulfillment.

## Overview

This system handles the complete lifecycle of tour purchases: from Stripe payment processing through voucher code delivery and confirmation. Built for a tour company, it manages thousands of unique voucher codes across multiple tour products, automatically allocates them upon purchase, and provides a white-label confirmation API for external platforms.

---

## Project Components

### 1. **Backend - Voucher Management System**
**Directory:** `stripe/backend/`

A full-featured Express.js web application serving as the control center for the entire system.

**Key Responsibilities:**
- **Voucher Code Management** - Upload, store, categorize, and lifecycle management of thousands of voucher codes organized by tour
- **Database Admin Interface** - Web UI for viewing and updating tour information, customer records, and transaction history
- **API Endpoints** - RESTful APIs for voucher operations (create, retrieve, update, delete)
- **Multi-page Dashboard** - Separate views for vouchers, customers, tours, and transactions with real-time data

**Tech Stack:**
- **Framework:** Express.js with EJS templating engine
- **Database:** AWS DynamoDB with TypeScript type definitions
- **Language:** Node.js (JavaScript/TypeScript)
- **AWS SDK:** DynamoDB client for database operations
- **Development:** Nodemon for hot-reloading

**Key Features:**
- RESTful API architecture for voucher CRUD operations
- Tour-based voucher organization and querying
- Customer relationship management
- Transaction logging and audit trail
- Server-side rendering with responsive EJS templates

**Development Highlights:**
- Implements clean separation of concerns with modular routing
- AWS credential provider support for secure cloud integration
- Environment-based configuration (development/production)

---

### 2. **Stripe Webhook - Payment Processing & Fulfillment**
**Directory:** `stripe/lambdas/stripe-webhook/`

A stateless, event-driven AWS Lambda function that executes immediately upon Stripe payment completion.

**Key Responsibilities:**
- **Webhook Processing** - Captures Stripe checkout completion events
- **Automatic Voucher Allocation** - Extracts transaction details and assigns the next available voucher codes from inventory
- **Customer Management** - Creates new customer records or updates existing ones in DynamoDB
- **Email Delivery** - Sends automated confirmation emails with voucher codes and redemption instructions using Nodemailer
- **Transaction Recording** - Logs all transactions for audit and reporting

**Tech Stack:**
- **Runtime:** Node.js ES Modules (`.mjs`)
- **Stripe Integration:** Official Stripe SDK v17.6.0
- **Database:** AWS DynamoDB
- **Email Service:** Nodemailer with EJS email template rendering
- **Environment:** AWS Lambda with dev/production configuration support
- **Language:** JavaScript (TypeScript definitions available)

**Key Features:**
- Real-time event handling on Stripe webhook events
- Multi-tour purchase support (handles customers buying multiple tours in one transaction)
- Intelligent voucher allocation with availability checking
- Customer deduplication and update logic
- HTML email templates with EJS rendering for personalized confirmations
- Comprehensive error handling and logging for troubleshooting

**Development Highlights:**
- Handles complex transaction scenarios (multiple tour IDs, location routing)
- Implements both admin and customer notifications
- Dev/production mode switching for testing with Stripe test vs. live keys
- Email templates with dynamic content injection

---

### 3. **Order Confirmation API - Public Query Interface**
**Directory:** `stripe/lambdas/order-confirmation-api/`

A lightweight AWS Lambda API providing secure, public access to order details for use in external systems like WordPress confirmation pages.

**Key Responsibilities:**
- **Query Interface** - REST endpoint for retrieving transaction details by transaction ID
- **Data Retrieval** - Fetches order information, voucher codes, and purchase details from DynamoDB
- **External Integration** - Allows WordPress and other platforms to display order confirmations without exposing sensitive data

**Tech Stack:**
- **Runtime:** Node.js ES Modules
- **Database:** AWS DynamoDB (read-only queries)
- **Language:** TypeScript with ESM support
- **Deployment:** AWS Lambda function
- **AWS SDK:** DynamoDB document client for querying

**Key Features:**
- Query-string parameter validation (`TRANSACTION_ID`)
- DynamoDB GetCommand for efficient single-record retrieval
- Appropriate HTTP status codes (400 for missing params, 404 for not found, 500 for errors)
- Environment-based table naming (dev/prod)
- JSON response format for easy integration

**Development Highlights:**
- Minimal, focused scope for serverless best practices
- Proper error handling with descriptive responses
- Stateless design enabling automatic scaling
- TypeScript support for type safety

---

## Architecture Overview

```
┌─────────────────┐
│  Stripe Portal  │
└────────┬────────┘
         │ Payment Complete
         ▼
┌──────────────────────────┐
│  Stripe Webhook Lambda   │
│  (Webhook Handler)       │
└────────┬─────────────────┘
         │
         ├─► DynamoDB Write
         │   - Record Transaction
         │   - Update Voucher (mark used)
         │   - Upsert Customer
         │
         └─► Nodemailer
             - Send Confirmation Email
             - Include Voucher Code

┌────────────────────────────┐
│  Backend Express App       │
│  (Admin Dashboard)         │
└────────┬───────────────────┘
         │
         └─► DynamoDB Read/Write
             - Manage Voucher Inventory
             - View Customers & Tours
             - Monitor Transactions

┌────────────────────────────┐
│  Confirmation API Lambda   │
│  (Public Query Interface)  │
└────────┬───────────────────┘
         │
         └─► DynamoDB Read
             - Return Order Details
             (for WordPress/External Sites)
```

---

## Technical Achievements

### Payment Processing
- ✅ Integrates with Stripe Checkout Sessions API for secure payments
- ✅ Handles Stripe webhook events with signature verification capability
- ✅ Supports multi-product purchases in a single transaction
- ✅ Manages both test and production Stripe environments

### Database Design
- ✅ Normalized DynamoDB schemas with multiple tables (Vouchers, Customers, Transactions, Tours)
- ✅ Efficient querying by tour ID, transaction ID, and customer records
- ✅ Type-safe database operations with TypeScript interfaces

### Serverless Architecture
- ✅ AWS Lambda functions for event-driven microservices (Stripe webhook and order confirmation API)
- ✅ Event-driven architecture eliminating manual intervention in payment fulfillment
- ✅ Automatic scaling for variable payment volumes
- ✅ Cost-efficient pay-per-execution pricing model

### Email Automation
- ✅ Dynamic HTML email templates rendered with EJS
- ✅ Personalized confirmation emails with voucher codes
- ✅ Admin notification system for transaction monitoring
- ✅ Nodemailer integration for reliable email delivery

### Security Considerations
- ✅ Environment-based configuration for test/production keys
- ✅ DynamoDB access restricted by AWS IAM roles
- ✅ Transaction lookup limited to specific query parameters
- ✅ Stripe secret keys stored in environment variables

### Full-Stack Development
- ✅ Server-side rendering with Express and EJS for traditional web interface
- ✅ RESTful API design for programmatic access
- ✅ Serverless functions for scalable event processing
- ✅ JavaScript/TypeScript across all layers for code consistency

---

## File Structure

```
stripe/
├── backend/                      # Express.js Admin Dashboard
│   ├── app.js                   # Express app configuration & API routes
│   ├── dynamo.js                # Database abstraction layer
│   ├── package.json             # Dependencies (Express, EJS, AWS SDK)
│   ├── public/
│   │   ├── javascripts/         # Frontend JavaScript for form handling
│   │   └── stylesheets/         # CSS for admin interface
│   ├── routes/                  # Express route handlers
│   ├── views/                   # EJS templates for dashboard pages
│   └── bin/www                  # Server entry point
│
├── lambdas/                      # AWS Lambda Functions
│   │
│   ├── stripe-webhook/          # Payment Processing Lambda
│   │   ├── index.mjs            # Lambda handler function
│   │   ├── dynamo.mjs           # DynamoDB operations
│   │   ├── sendEmail.mjs        # Email sending logic
│   │   ├── types.mjs            # Type definitions (JSDoc)
│   │   ├── email-templates/     # EJS email templates
│   │   ├── package.json         # Dependencies (Stripe, AWS SDK, Nodemailer)
│   │   ├── tsconfig.json        # TypeScript configuration
│   │   └── ReadMe.md            # Stripe webhook documentation
│   │
│   └── order-confirmation-api/  # Public Query API Lambda
│       ├── index.mjs            # Lambda handler for transaction queries
│       ├── index.mjs.map        # Webpack source map
│       ├── package.json         # Dependencies (AWS SDK)
│       └── tsconfig.json        # TypeScript configuration
│
├── notes.md                      # Development notes & implementation details
└── notes-DynamoDB.md            # DynamoDB schema documentation
```

---

## Key Technologies Used

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime environment | ES Modules |
| **Express.js** | Backend web framework | ^4.21.2 |
| **EJS** | Server-side templating | ^3.1.10 |
| **Stripe SDK** | Payment processing | ^17.6.0 |
| **AWS DynamoDB** | NoSQL database | AWS SDK v3 |
| **AWS Lambda** | Serverless compute | - |
| **Nodemailer** | Email delivery | ^6.10.1 |
| **TypeScript** | Type safety & development | ^22.15.3 |
| **Nodemon** | Development auto-reload | ^3.1.9 |

---

## Development Outcomes

This project demonstrates expertise in:

1. **Full-Stack Architecture** - Seamless integration of traditional web apps with serverless microservices
2. **Payment Processing** - Complex Stripe integration including webhooks, multi-product handling, and error scenarios
3. **Database Design** - DynamoDB schema design for complex queries and transaction management
4. **Automation** - Event-driven architecture for real-time fulfillment without manual intervention
5. **AWS Services** - Practical implementation of Lambda, DynamoDB, and cloud-based microservices
6. **Email Automation** - HTML email templating and bulk customer communication
7. **Type Safety** - TypeScript and JSDoc annotations for code reliability
8. **DevOps Considerations** - Environment management, configuration switching, and credential handling

---

## Future Enhancements

- Implement comprehensive test suites for payment flows
- Add refund handling for failed tours
- Build analytics dashboard for tour performance and revenue tracking
- Implement inventory management alerts when voucher codes run low
- Add multi-currency support for international tours
- Implement retry logic for failed email deliveries

---

## License

ISC

## Author

c-s-cook
