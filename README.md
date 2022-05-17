# Botivate Bot (API server)
The Botivate Bot is used to control the Discord bot and present an API to the frontend. It runs purely on Node.js using Discord.js for Discord communication and MikroORM for database persistence.

## Table of contents
- [Botivate Bot (API server)](#botivate-bot-api-server)
  - [Table of contents](#table-of-contents)
  - [Getting started](#getting-started)
  - [Database changes](#database-changes)
  - [Sponsors](#sponsors)

## Getting started
To get started with the Botivate Bot, you should setup a couple of things.
- Clone this repository
- Run `yarn` to install all the dependencies
- Enter values into .env ([.env.example](.env.example) is an empty example file, copy it to .env)
- [Auth0 Credentials](docs/AUTH0_CREDENTIALS.md)
- [Database Credentials](docs/DATABASE_CREDENTIALS.md)
- [Discord Bot Credentials](docs/DISCORD_BOT_CREDENTIALS.md)

If you're running this for the first time, don't forget to run `yarn migration:up`, this command will migrate your database to the correct structure.

When you've set everything up correctly, you can run `yarn dev` to start the development server.

## Database changes
Everytime you change an entity in the [src/database/entities](src/database/entities) folder, you must run `yarn migration:create` to create a new migration and `yarn migration:up` to update the database to that migration.

## Sponsors
| Sponsor name | Sponsor logo |
| ------------ | ------------ |
| [Lymevereniging](https://lymevereniging.nl/) | ![Logo Lymevereniging](contrib/logos/lymevereniging.nl.svg) |