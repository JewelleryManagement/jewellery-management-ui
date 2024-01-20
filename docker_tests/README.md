# E2E tests setup

## Context

With the files in this folder we can start all the services within JMS environment - Frontend, Backend and DB. Startup happens with:
```
docker compose -f docker_tests/docker-compose.yml up -d
```
The services start up like we'd normally expect: 
Frontend on: localhost:3000
Backend on: localhost:8080
PostgreSQL on: localhost:5432

Tests files are located in `test` folder within the root folder
To start them up, you'd need to have started the services with the command mentioned above and then run:
```
npx playwright test
```
