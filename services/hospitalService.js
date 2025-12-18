const axios = require('axios');

async function findNearestHospital(pincode) {
   try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=hospital+in+${pincode}&addressdetails=1&limit=3`;

      const response = await axios.get(url, {
         headers: {
            'User-Agent': 'AIHealthChatbot/1.0'
         }
      });

      const hospitals = response.data;

      if (!hospitals || hospitals.length === 0) {
         return `No hospitals found directly in Pincode ${pincode}.\nTry searching on Maps: https://www.google.com/maps/search/hospitals+in+${pincode}`;
      }

      let result = `🏥 Real Hospitals near ${pincode}:\n`;

      hospitals.forEach((h, index) => {
         const name = h.display_name.split(',')[0]; // Keep it short
         // Nominatim doesn't always have phone numbers, so we omit if missing
         result += `\n${index + 1}. ${name}\n   📍 ${h.display_name.split(',').slice(1, 3).join(',').trim()}`;
      });

      result += `\n\n🔗 View on Map: https://www.google.com/maps/search/hospitals+in+${pincode}`;
      return result;

   } catch (error) {
      console.error("Error fetching hospitals:", error.message);
      return `Unable to fetch live data.\nView on Maps: https://www.google.com/maps/search/hospitals+in+${pincode}`;
   }
}

module.exports = { findNearestHospital };
