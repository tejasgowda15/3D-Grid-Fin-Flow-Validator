let altitudeInMeters = true; // Track if the input is in meters

function toggleUnits() {
    const altitudeInput = document.getElementById("altitude");
    const unitToggle = document.getElementById("unitToggle");

    if (altitudeInMeters) {
        // Convert meters to feet
        altitudeInput.value = (parseFloat(altitudeInput.value) * 3.28084).toFixed(2);
        unitToggle.innerText = "ft";
        altitudeInMeters = false;
    } else {
        // Convert feet to meters
        altitudeInput.value = (parseFloat(altitudeInput.value) / 3.28084).toFixed(2);
        unitToggle.innerText = "m";
        altitudeInMeters = true;
    }
}

function calculate() {
    // Constants
    const gamma = 1.4;
    const R = 287; // Gas constant for air in J/(kg·K)
    const S = 110.4; // Sutherland's constant in Kelvin
    const T0 = 273.15; // Reference Temperature in Kelvin
    const mue0 = 1.789e-5; // Dynamic Viscosity in Ns/m² at reference temperature

    // Inputs from user
    let altitude = parseFloat(document.getElementById("altitude").value);
    if (!altitudeInMeters) altitude /= 3.28084; // Convert to meters if input was in feet

    const mach = parseFloat(document.getElementById("mach").value);
    const width = parseFloat(document.getElementById("width").value) / 1000; // Convert mm to meters
    const yPlus = parseFloat(document.getElementById("yPlus").value);

    // Get temperature and pressure from database based on altitude
    const { temperature: Tinf, pressure: Pinf } = getAtmosphericConditions(altitude);

    // Speed of sound and free stream velocity
    const a = Math.sqrt(gamma * R * Tinf); // Speed of sound
    const V_inf = mach * a;

    // Dynamic viscosity using Sutherland's formula
    const mue = mue0 * Math.pow(Tinf / T0, 1.5) * ((T0 + S) / (Tinf + S));

    // Density at specified conditions
    const density = Pinf / (R * Tinf);

    // Reynolds number
    const Re = (density * V_inf * width) / mue;

    // Wall shear stress and friction velocity
    const Cf = 0.027 / Math.pow(Re, 1 / 7); // Friction coefficient for turbulent flow
    const Tow_wall = (Cf * density * Math.pow(V_inf, 2)) / 2;
    const V_fri = Math.sqrt(Tow_wall / density);

    // First cell height (delta_s)
    const delta_s = ((yPlus * mue) / (V_fri * density)) * 1000; // Convert to mm

    // Turbulent viscosity for farfield
    const nue_farfield = 3 * (mue / density);

    // Display results
    document.getElementById("temperature").innerText = `Free Stream Temperature (T∞): ${Tinf.toFixed(2)} K`;
    document.getElementById("pressure").innerText = `Free Stream Pressure (P∞): ${Pinf.toFixed(2)} Pa`;
    document.getElementById("vInf").innerText = `Free Stream Velocity (V∞): ${V_inf.toFixed(2)} m/s`;
    document.getElementById("mue").innerText = `Dynamic Viscosity (μ): ${mue.toExponential(5)} Ns/m²`;
    document.getElementById("reynolds").innerText = `Reynolds Number (Re): ${Re.toFixed(4)}`;
    document.getElementById("deltaS").innerText = `First Cell Height (Δs): ${delta_s.toFixed(15)} mm`;
    document.getElementById("nueFarfield").innerText = `Turbulent Viscosity for Farfield (νₑ): ${nue_farfield.toExponential(6)} m²/s`;
}

// Extended atmospheric data up to 60,000 m
function getAtmosphericConditions(altitude) {
    const atmosphereData = [
        { altitude: 0, temperature: 288.15, pressure: 101325 },
        { altitude: 1000, temperature: 281.65, pressure: 89875 },
        { altitude: 2000, temperature: 275.15, pressure: 79495 },
        { altitude: 3000, temperature: 268.65, pressure: 70110 },
        { altitude: 4000, temperature: 262.15, pressure: 61660 },
        { altitude: 5000, temperature: 255.65, pressure: 54048 },
        { altitude: 6000, temperature: 249.15, pressure: 47217 },
        { altitude: 7000, temperature: 242.65, pressure: 41107 },
        { altitude: 8000, temperature: 236.15, pressure: 35651 },
        { altitude: 9000, temperature: 229.65, pressure: 30800 },
        { altitude: 10000, temperature: 223.15, pressure: 26500 },
        { altitude: 15000, temperature: 216.65, pressure: 12041 },
        { altitude: 20000, temperature: 216.65, pressure: 5474 },
        { altitude: 30000, temperature: 226.5, pressure: 1187 },
        { altitude: 40000, temperature: 270.65, pressure: 287.1 },
        { altitude: 50000, temperature: 270.65, pressure: 79.77 },
        { altitude: 60000, temperature: 252.65, pressure: 20.57 },
    ];

    for (let i = 0; i < atmosphereData.length - 1; i++) {
        if (altitude >= atmosphereData[i].altitude && altitude < atmosphereData[i + 1].altitude) {
            return atmosphereData[i];
        }
    }

    return atmosphereData[atmosphereData.length - 1];
}
