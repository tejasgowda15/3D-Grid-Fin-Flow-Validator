function calculate() {
    // Constants
    const Tinf = 288.15;  // Kelvin
    const gamma = 1.4;
    const R = 287;
    const Pinf = 101325;  // Pascals
    const S = 110.4;      // Sutherland's constant in Kelvin
    const T0 = 273.15;    // Reference Temperature in Kelvin
    const mue0 = 1.729e-5; // Reference Dynamic Viscosity in Ns/m²

    // Inputs from user
    const M = parseFloat(document.getElementById("mach").value);
    const width = parseFloat(document.getElementById("width").value) / 1000;  // Convert mm to meters
    const Y_plus = parseFloat(document.getElementById("yPlus").value);

    // Speed of sound and free stream velocity
    const a = Math.sqrt(gamma * R * Tinf);
    const V_inf = M * a;

    // Dynamic viscosity using Sutherland's formula
    const mue = mue0 * Math.pow(Tinf / T0, 3 / 2) * ((T0 + S) / (Tinf + S));

    // Density at sea level
    const density = Pinf / (R * Tinf);

    // Reynolds number
    const Re = (density * V_inf * width) / mue;

    // Wall shear stress and friction velocity
    const Cf = 0.027 / Math.pow(Re, 1 / 7);
    const Tow_wall = (Cf * density * V_inf ** 2) / 2;
    const V_fri = Math.sqrt(Tow_wall / density);

    // First cell height (delta_s)
    const delta_s = ((Y_plus * mue) / (V_fri * density)) * 1000;  // Convert to mm

    // Display results
    document.getElementById("vInf").innerText = `Free Stream Velocity (V∞): ${V_inf.toFixed(4)} m/s`;
    document.getElementById("mue").innerText = `Dynamic Viscosity (μ): ${mue.toExponential(5)} Ns/m²`;
    document.getElementById("reynolds").innerText = `Reynolds Number (Re): ${Re.toFixed(5)}`;
    document.getElementById("deltaS").innerText = `First Cell Height (Δs): ${delta_s.toFixed(15)} mm`;
}
