# Database Credentials
1. Setup a database on a MySQL server
2. Enter the database name into the .env file
3. Enter the database connection URL into the .env file ([example](#example-database-url))
4. Done!

## Example database URL
In this example the database connector will connect to a server on the `localhost` (`127.0.0.1`) with port `3306` with username `discord-bot` and password `discord-bot`.
```ini
DATABASE_URL=mysql://discord-bot:discord-bot@127.0.0.1:3306
```
