const request = require('request');
const fs = require('fs').promises;


const fetchMyIP = function (callback) {
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      callback(Error(`Code received ${response}, not 200. Response: ${body}`), null);
      return;
    } else {
      const IP = JSON.parse(body);
      callback(null, IP.ip);
      return;
    }
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      callback(Error(`Code received ${response}, not 200. Response: ${body}`), null);
      return;
    } else {
      const IPdata = JSON.parse(body);
      const coords = {
        latitude: IPdata.data.latitude,
        longitude: IPdata.data.longitude
      };
      callback(null, coords);
    }
  });
};

const fetchISSFlyOverTimes = (coordinates, callback) => {
  const latitude = coordinates.latitude;
  const longitude = coordinates.longitude;
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      callback(Error(`Code received ${response.statusCode}, not 200. Response: ${body}`), null);
      return;
    } else {
      const issData = JSON.parse(body);
      const issTimes = issData.response;
      callback(null, issTimes);
      return;
    }
  });

};

const nextISSTimesForMyLocation = (callback) => {
  const ip = fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    const coords = fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }
      // console.log("Coordinates", coords);

      const times = fetchISSFlyOverTimes(coords, (error, times) => {
        if (error) {
          return callback(error, null);
        }
        // console.log("Flyover Times: ", times);
        return callback(error, times);
      });
    });
  });
};

// const promise = (Promise(fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work! ", error);
//     return;
//   }
//   console.log("IP Address:", ip);
//   return ip;
// }))).then(
//   fetchCoordsByIP(ip, (error, coords) => {
//     if (error) {
//       console.log("It didn't work! ", error);
//       return;
//     }
//     console.log("Coordinates", coords);
//   })).then(
//   fetchISSFlyOverTimes(coords, (error, times) => {
//     if (error) {
//       console.log("It didn't work! ", error);
//       return;
//     }
//     console.log("Flyover Times: ", times);
//     return times;
//   })).catch(() => {
//   console.log(error);
// });





// const flyOverTimes = fetchISSFlyOverTimes(coords, (error, times) => {
//   if (error) {
//     console.log("It didn't work! ", error);
//     return;
//   }
//   console.log("Flyover Times: ", times);
// });

// promise();



// fetchISS({
//   latitude: '50.73620',
//   longitude: '-113.96950'});

// fetchCoordsByIP("68.188.115", () => {});


module.exports = {
  nextISSTimesForMyLocation
};