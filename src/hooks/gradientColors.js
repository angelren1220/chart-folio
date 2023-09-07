const gradientColors = () => {
  
  const steps = 9;
  const colors = [];
  const firstHalfSteps = Math.floor(steps / 2);
  const secondHalfSteps = steps - firstHalfSteps;
  
  // Define start, midpoint, and end RGB values
  const startRGB = { r: 0, g: 0, b: 128 }; // blue
  const midRGB = { r: 255, g: 255, b: 255 }; // white
  const endRGB = { r: 128, g: 0, b: 0 }; // red
  
  // Interpolate from start (blue) to midpoint (white)
  for (let i = 0; i < firstHalfSteps; i++) {
      const t = i / firstHalfSteps;
      const r = Math.round(startRGB.r + t * (midRGB.r - startRGB.r));
      const g = Math.round(startRGB.g + t * (midRGB.g - startRGB.g));
      const b = Math.round(startRGB.b + t * (midRGB.b - startRGB.b));
      colors.push(`rgb(${r},${g},${b})`);
  }
  
  // Interpolate from midpoint (yellow) to end (red)
  for (let i = 0; i <= secondHalfSteps; i++) {
      const t = i / secondHalfSteps;
      const r = Math.round(midRGB.r + t * (endRGB.r - midRGB.r));
      const g = Math.round(midRGB.g + t * (endRGB.g - midRGB.g));
      const b = Math.round(midRGB.b + t * (endRGB.b - midRGB.b));
      colors.push(`rgb(${r},${g},${b})`);
  }

  return colors;
}
export default gradientColors;