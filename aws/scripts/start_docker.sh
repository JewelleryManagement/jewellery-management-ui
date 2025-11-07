#!/bin/bash

# Set the environment variables for your application

service docker start
docker compose -f /tmp/fe/docker-compose.yml up -d --build
