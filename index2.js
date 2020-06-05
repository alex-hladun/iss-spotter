const { nextISSTimesForMyLocation } = require('./iss_promised');
const request = require('request-promise-native');


nextISSTimesForMyLocation()
  .then((data) => {
    const flightTimes = JSON.parse(data).response;
    for (const time of flightTimes) {
      const date = new Date(0);
      date.setUTCSeconds(time.risetime);
      console.log(`Next pass at ${date} for ${time.duration} seconds!`);
    }
  })
  .catch((error) => {
    console.log("Error occured: ", error);
  });

