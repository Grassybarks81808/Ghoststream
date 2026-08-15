// Simple dominant color extraction from image
export function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve("#e50914");
          return;
        }
        
        canvas.width = 50;
        canvas.height = 75;
        ctx.drawImage(img, 0, 0, 50, 75);
        
        const imageData = ctx.getImageData(0, 0, 50, 75);
        const data = imageData.data;
        
        let r = 0, g = 0, b = 0, count = 0;
        
        // Sample every 4th pixel for speed
        for (let i = 0; i < data.length; i += 16) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          
          // Skip very dark or very light pixels
          const brightness = (red + green + blue) / 3;
          if (brightness > 30 && brightness < 220) {
            r += red;
            g += green;
            b += blue;
            count++;
          }
        }
        
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          
          // Boost saturation for more vibrant glow
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max > 0 ? (max - min) / max : 0;
          
          if (sat < 0.3) {
            // If color is too gray, use default red
            resolve("#e50914");
          } else {
            resolve(`rgb(${r}, ${g}, ${b})`);
          }
        } else {
          resolve("#e50914");
        }
      } catch {
        resolve("#e50914");
      }
    };
    img.onerror = () => resolve("#e50914");
    img.src = imageUrl;
  });
}
