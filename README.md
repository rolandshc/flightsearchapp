# flightsearchapp
restful API, node express, arangodb, docker

Hi! This is a small demo of creating a web endpoint with anargodb via anargojs.
A simple UI application has been implemented for interacting with it.
The dataset include flights and airports of the states in JAN, 2008.
The aim is to find the fastest route from a departure airport to a destination airport on a specific day.
In this implementation, the specific day is determined by the local datetime of the departure datetime of the first flight.
This means that the arrival date can be different eg. the next day.

This project runs arangodb on docker. The node app itself can be installed on local machine.
For switching the node app to run on docker or local, the database and localhost parameters have to be configured. (in ```DataService.js```)

## Install instruction

Install Docker if there is no.

1. Download the projcet folder
2. In Shell, cd project directory
3. ```docker compose up```

2. Copy csv files from the ```data\``` to docker container, in Shell (project directory):
```docker cp data\airports.csv flightsearchapp_arangodb_container_1:airports.csv```
```docker cp data\airports.csv flightsearchapp_arangodb_container_1:airports.csv```

3. Browse localhost:8529, login with user: root, password:Testing123, create collection "airports" of type "document", create collection "flights" of type "edge"

4. import flight.csv, airports.csv to the collections, in Shell (replace the id of arangodb container running):
docker exec -ti {docker-container-id} arangoimp --file airports.csv --collection airports --type csv --server.username root --server.database _system --server.authentication true --server.endpoint http+tcp://127.0.0.1:8529

docker exec -ti {docker-container-id} arangoimp --file flights.csv --collection flights --type csv --server.username root --server.database _system --server.authentication true --server.endpoint http+tcp://127.0.0.1:8529

## How to use

Open the Express App GUI: Browse localhost:3000

![image](https://user-images.githubusercontent.com/9390194/124403503-7923ce80-dd3f-11eb-9795-d5c921412aaf.png)

The app will send request to fetch data from our api (http:localhost/api:3000)

Result Display

![image](https://user-images.githubusercontent.com/9390194/124403572-cacc5900-dd3f-11eb-90c2-5efe373b55a7.png)


## Endpoint

The http:localhost/api:3000 endpoint can be interacted with curl request.

## NB! The current endpoint is not interactable when the app is running on docker container.(javascript object format issue)

For testing the curl, the app works fine if it is built on local machine.Like:
```
curl -X POST http://localhost:3000/api -H "Content-Type: application/json" -d '{"from":"JFK", "to":"LAX","date": "2008/01/01"}'
```

## FAA DELAY AIRPORT API

There is a ```getDelay()``` function implemented in the ```DataServices.js```.

It can be further integrated with the api.js by reading the delay of the airports by finding alternative routes due to serious delay, requery to find a route to nearest possible airport and so on by using anargodb graph database.

