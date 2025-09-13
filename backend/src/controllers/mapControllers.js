// import fetch from "node-fetch";

export const getCriticalRegionsCount = async (req, res) => {
  try {
    const { latitude, longitude, radius = 2000 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required in request body"
      });
    }

    // Overpass API query
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        way["amenity"="hospital"](around:${radius},${latitude},${longitude});

        node["amenity"="school"](around:${radius},${latitude},${longitude});
        way["amenity"="school"](around:${radius},${latitude},${longitude});

        node["amenity"="college"](around:${radius},${latitude},${longitude});
        way["amenity"="college"](around:${radius},${latitude},${longitude});

        node["amenity"="university"](around:${radius},${latitude},${longitude});
        way["amenity"="university"](around:${radius},${latitude},${longitude});
      );
      out center;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    const critical_reg_data = data.elements.map(el => ({
      lat: el.center?.lat || el.lat,
      lon: el.center?.lon || el.lon,
      name: el.tags?.name || "Unnamed",
      amenity: el.tags?.amenity || "unknown"
    }));


    return res.status(200).json({
      success: true,
      count: data.elements.length,
    //   critical_regions: data.elements,
      critical_reg_data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};
