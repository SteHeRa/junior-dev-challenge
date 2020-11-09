# junior-dev-challenge

## Table of Contents

- [Getting Started](#Getting-Started)

  - [Setup Prerequisites](#Setup-Prerequisites)

  - [Start the App](#Start-the-App)

- [Tech Stack](#Tech-Stack)

## Getting Started

These instructions will help you setup a local development instance of the app.

### Setup prerequisites

- You will require Node.js installed on your machine.
- For an example of how to fill `/server/.env` see `/server/.env.example`

#### install dependencies

`npm install`

### Start the App

- In the root directory run `npm run dev`
- Navigate to http://localhost:3000 in your browser

## Tech Stack

- [Javascript](https://www.javascript.com/)
- [Pug](https://pugjs.org/api/getting-started.html)
- [Express.js](https://expressjs.com/)
- [Materialize](https://materializecss.com/)
- [Leaftlet](https://leafletjs.com/)
- [Mapbox](https://www.mapbox.com/)
- [Postcodes.io](https://postcodes.io/)

## Design & implementation

My approach to this test was to use the Postcodes.io API to get latitude and logitude coordinates from the postcodes provided, then with the coordinates I could query the Mapbox API to get distance and travel time data for each candidate.

To start I made a server using Node.js and Express that would handle all of the logic and queries to external API's. When the page loads, the server is queried for an array of all of the clients. The server gets all of the clients from the Data provided and replaces their postcodes with their coordinates (that we get from Postcodes.io). The server then sends an array with all the clients and the Leaflet map adds a pin on the map for each client. Each pin is also given an 'on click' event listener.

When one of these pins is clicked the user is redirected to an endpoint on my server that will respond with a page containing information about the closest candidate to the client. I am using pug to generate these pages. The closest candidate is found getting all of the candidates from the Data provided, replacing all of the candidates postcodes with longitudes and latitudes as above. An array of all candidates, their modes of transport and their coordinates is then looped over. For each element in the array the Mapbox API is queried with the candidate location, the client location and the candidate mode of transport. For each loop we check to see if the current candidate is closer to the client than the currently saved closest candidate. If they are the current candidate becomes the closest candidate. At the end of the loop the closest candidate is returned.

Now that the server has found the closest candidate we generate a html file with all this information using pug and send it to the user.

If I were to spend more time on this challenge I would set up a database with all the provided data and include the client and candidates coordinates in the database as this would reduce load times when navigating to client detail/closest candidate pages. It would also mean that queries to the server could be sent using unique id keys. At the moment, closest candidate is being queried using the clients coordinates which I feel could lead to problems down the line.
