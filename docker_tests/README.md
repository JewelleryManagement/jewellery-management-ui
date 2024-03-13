# E2E tests setup

## Context

### Folder content explanation
1. `app` folder
    - has the content of the `dist` folder (`dist` is generated when we run `npm run build`)
    - is automatically generated from the `build-and-test.yml` github workflow when github action is executed
    - when we want to test new changes on the frontend locally be sure to do:
        - `npm run build`
        - `cp -r dist docker_tests/app`
2. `docker-compose.yml` file
    - holds the manifest of the services we want to run in docker containers: jewellery-management-service, postgreSQL db, jewellery-management-ui

### Local Tests run

1. Be sure to have a recent enough version of jms-be image. In docker-compose file we are specifying an image called `vladokat/jms-be:<commit-hash>` where commit hash is the commit on the backend from which the image has been created. It will usually be the top of the main branch
2. Make sure you've run `npm run build` and `cp -r dist docker_tests/app`. This ensures the current version of the frontend app will run in the docker container
3. After 1 and 2 you should be able to run `docker compose -f docker_tests/docker-compose.yml up -d` with success. This ensures all services needed for the tests are started up. The services start up like we'd normally expect: Frontend - `localhost:3000`, Backend - `localhost:8080`, PostgreSQL - `localhost:5432`
4. `npx playwright test` - runs the tests that reside in root folder -> test

### Github actions run

On a push to any branch the github workflow `build-and-deploy.yml` will do the steps described above and run the tests in github actions automatically. The only thing you need to ensure is that `jewellery-inventory-0.0.1-SNAPSHOT.jar` is recent enough and works with the current version of the frontend. 