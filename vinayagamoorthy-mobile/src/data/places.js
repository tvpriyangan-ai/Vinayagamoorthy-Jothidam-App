// A small set of common places with known coordinates/timezone, so a first
// version of signup works without wiring up a paid geocoding API. Extend
// this list freely, or later swap it for a real Places autocomplete.
//
// Note: Sri Lanka uses the same UTC+5:30 offset as India (Sri Lanka
// Standard Time), so tz: 5.5 is correct for both countries.
export const COMMON_PLACES = [
  // India
  { label: 'Chennai, India', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { label: 'Madurai, India', lat: 9.9252, lon: 78.1198, tz: 5.5 },
  { label: 'Coimbatore, India', lat: 11.0168, lon: 76.9558, tz: 5.5 },
  { label: 'Tiruchirappalli, India', lat: 10.7905, lon: 78.7047, tz: 5.5 },
  { label: 'Salem, India', lat: 11.6643, lon: 78.1460, tz: 5.5 },
  { label: 'Thanjavur, India', lat: 10.7870, lon: 79.1378, tz: 5.5 },
  { label: 'Bengaluru, India', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { label: 'Mumbai, India', lat: 19.0760, lon: 72.8777, tz: 5.5 },
  { label: 'New Delhi, India', lat: 28.6139, lon: 77.2090, tz: 5.5 },
  { label: 'Agra, India', lat: 27.1767, lon: 78.0081, tz: 5.5 },
  // Sri Lanka
  { label: 'Colombo, Sri Lanka', lat: 6.9271, lon: 79.8612, tz: 5.5 },
  { label: 'Jaffna, Sri Lanka', lat: 9.6615, lon: 80.0255, tz: 5.5 },
  { label: 'Kandy, Sri Lanka', lat: 7.2906, lon: 80.6337, tz: 5.5 },
  { label: 'Galle, Sri Lanka', lat: 6.0535, lon: 80.2210, tz: 5.5 },
  { label: 'Trincomalee, Sri Lanka', lat: 8.5874, lon: 81.2152, tz: 5.5 },
  { label: 'Batticaloa, Sri Lanka', lat: 7.7102, lon: 81.6924, tz: 5.5 },
  { label: 'Anuradhapura, Sri Lanka', lat: 8.3114, lon: 80.4037, tz: 5.5 },
  { label: 'Negombo, Sri Lanka', lat: 7.2083, lon: 79.8358, tz: 5.5 },
];
