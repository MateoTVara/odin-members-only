# Members Only

An exclusive clubhouse where members can write anonymous posts. Inside the clubhouse, members can see who the author of a post is, but outside they can only see the story and wonder who wrote it.

This project is part of [The Odin Project's Node.js curriculum](https://www.theodinproject.com/lessons/node-path-nodejs-members-only).

## Features

- **User Authentication**: Secure sign-up and login with password hashing using bcrypt
- **Membership System**: Users can become members by entering a secret passcode
- **Admin Privileges**: Admins have special permissions to delete messages
- **Anonymous Posts**: Non-members see messages without author names or timestamps
- **Member Visibility**: Members can see full message details including author and date
- **Session Management**: Persistent sessions using PostgreSQL store

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js (local strategy)
- **Template Engine**: EJS with express-ejs-layouts
- **Validation**: express-validator
- **Password Hashing**: bcryptjs
- **Session Store**: connect-pg-simple
- **Date Formatting**: date-fns

## Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- pnpm (or npm/yarn)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd odin-members-only
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Secret key for session encryption (use a long, random string)
   SESSION_SECRET=your-secret-key-here
   
   # Port your app will run on
   PORT=3000
   
   # Passcodes for membership and admin access
   ADMIN_PASSCODE=your-admin-passcode
   MEMBER_PASSCODE=your-member-passcode
   
   # Database connection string
   DB_CONNECTION_STRING=postgresql://username:password@localhost:5432/members_only
   
   # Optional: Individual DB connection parameters
   DB_USERNAME=postgres
   DB_PASSWORD=your-password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=members_only
   ```

4. **Set up the database**
   
   Create the database schema and seed data:
   ```bash
   node db/populatedb.js
   ```

5. **Generate hashed passwords for seeding** (optional)
   
   Use the provided script to generate hashed passwords:
   ```bash
   node scripts/printHashedPassword.js "your-password"
   ```
   
   Update the hashed password values in your `.env` file.

6. **Start the development server**
   ```bash
   pnpm dev
   ```
   
   The app will run on `http://localhost:3000`

## Usage

### For Visitors
- View all messages on the home page (without author information)
- Sign up for a new account
- Log in to an existing account

### For Members
- Enter the secret member passcode at `/join` to become a member
- View message authors and timestamps
- Create new messages

### For Admins
- Enter the admin passcode to gain admin privileges
- Delete any message
- All member privileges

## Project Structure

```
odin-members-only/
├── controllers/           # Route handlers
│   ├── indexController.js
│   └── messagesController.js
├── db/                    # Database configuration and queries
│   ├── config.js
│   ├── pool.js
│   ├── populatedb.js
│   └── queries/
│       ├── messagesQueries.js
│       └── usersQueries.js
├── middlewares/           # Custom middleware
│   ├── auth.js
│   ├── flags.js
│   └── roles.js
├── public/                # Static assets
│   ├── css/
│   └── js/
├── routes/                # Express routes
│   ├── indexRouter.js
│   └── messagesRouter.js
├── scripts/               # Utility scripts
│   ├── mycommit.js
│   ├── printHashedPassword.js
│   └── tree.js
├── views/                 # EJS templates
│   ├── layouts/
│   ├── pages/
│   └── partials/
├── app.js                 # Main application file
├── package.json
└── .env.example           # Environment variables template
```

## Database Schema

### Users Table
- `id` (PRIMARY KEY)
- `first_name`
- `last_name`
- `username` (UNIQUE)
- `password` (hashed)
- `is_member` (BOOLEAN)
- `is_admin` (BOOLEAN)

### Messages Table
- `id` (PRIMARY KEY)
- `title`
- `text`
- `timestamp`
- `user_id` (FOREIGN KEY → users.id)

## Contributing

This is a learning project from The Odin Project. Feel free to fork and modify for your own learning purposes.

## Acknowledgments

- [The Odin Project](https://www.theodinproject.com/) for the project idea and curriculum
- The open-source community for the amazing tools and libraries

## License

This project is open source and available for educational purposes.
