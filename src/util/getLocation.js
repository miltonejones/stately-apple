export const getLocation = () => new Promise(resolve => { 

      // Check if the browser supports geolocation
  if (navigator.geolocation) {
    // Get the current position of the user's device
    navigator.geolocation.getCurrentPosition(function(position) {
      // Extract the latitude and longitude from the position object
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      // Do something with the latitude and longitude values
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      resolve({
        latitude, longitude
      })
    }, function(error) {
      // Handle any errors that occur while getting the position
      console.error(error);
      resolve(false);
    });
  } else {
    // Geolocation is not supported by the browser
    console.error('Geolocation is not supported by this browser.');
    resolve(false);
  } 
  
});