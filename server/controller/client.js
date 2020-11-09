const fs = require('fs');
const fetch = require('node-fetch');
const pug = require('pug');

require('dotenv').config();

//Helper function to transform postcodes into lat and long coordinates
async function getCoords(locations) {
  const postcodes = locations.map((location) => location.postcode);
  const data = await fetch('https://api.postcodes.io/postcodes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postcodes: postcodes }),
  }).then((res) => res.json());
  const coords = data.result.map((postcode) => {
    return {
      lat: postcode.result.latitude,
      lon: postcode.result.longitude,
      postcode: postcode.result.postcode,
    };
  });
  const processedLocations = locations.map((location) => {
    for (let i = 0; i < coords.length; i++) {
      if (coords[i].postcode === location.postcode.toUpperCase()) {
        delete location.postcode;
        location.lat = coords[i].lat;
        location.lon = coords[i].lon;
        return location;
      }
    }
  });
  return processedLocations;
}

//Helper function to find closest candidate by querying the mapbox api
async function getClosestCandidate(client) {
  const data = fs.readFileSync('../Data/candidates.json');
  const candidates = JSON.parse(data).Candidates;
  const processedCandidates = await getCoords(candidates);
  let closestCandidate;
  for (let i = 0; i < processedCandidates.length; i++) {
    let candidate = processedCandidates[i];
    let transport = 'walking';
    const modeOfTransport = candidate.modeOfTransport;
    if (modeOfTransport) {
      modeOfTransport.type === 'bike'
        ? (transport = 'cycling')
        : (transport = 'driving');
    }
    const directions = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/${transport}/${candidate.lon},${candidate.lat};${client.lon},${client.lat}?access_token=${process.env.MAPBOX_ACCESS_TKN}`
    ).then((res) => res.json());
    if (closestCandidate) {
      if (closestCandidate.duration > directions.routes[0].duration) {
        closestCandidate = {
          name: candidate.name,
          modeOfTransport: modeOfTransport.type,
          duration: directions.routes[0].duration,
          distance: directions.routes[0].distance,
        };
      }
    } else
      closestCandidate = {
        name: candidate.name,
        modeOfTransport: modeOfTransport.type,
        duration: directions.routes[0].duration,
        distance: directions.routes[0].distance,
      };
  }
  return closestCandidate;
}

async function getClientDetails(req, res) {
  try {
    console.log(req.query);
    const lat = req.query.lat;
    const lng = req.query.lng;
    const data = fs.readFileSync('../Data/locations.json');
    const clients = JSON.parse(data).Clients;
    const processedClients = await getCoords(clients);
    let client;
    for (let i = 0; i < processedClients.length; i++) {
      if (processedClients[i].lon == lng && processedClients[i].lat == lat) {
        client = processedClients[i];
        break;
      }
    }
    const closestCandidate = await getClosestCandidate(client);
    console.log(closestCandidate);
    const clientDetails = pug.renderFile('./views/clientDetails.pug', {
      clientName: client.name,
      candidateName: closestCandidate.name,
      transport: closestCandidate.modeOfTransport,
      duration: closestCandidate.duration,
      distance: closestCandidate.distance,
    });
    console.log(clientDetails);
    res.status(200);
    res.send(clientDetails);
  } catch (err) {
    console.log('---> error getting client details from db', err);
    res.status(500);
    res.send(err);
  }
}

async function getClients(req, res) {
  try {
    const data = fs.readFileSync('../Data/locations.json');
    const clients = JSON.parse(data).Clients;
    const processedClients = await getCoords(clients);
    res.status(200);
    res.send(processedClients);
  } catch (err) {
    console.log('---> error getting clients from db', err);
    res.status(500);
    res.send(err);
  }
}

module.exports = {
  getClientDetails,
  getClients,
};
