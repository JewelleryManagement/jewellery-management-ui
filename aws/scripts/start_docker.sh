#!/bin/bash

# Set the environment variables for your application

service docker start
docker-compose --file /tmp/fe/docker-compose.yml up -d --build #> /logs/startup.log
