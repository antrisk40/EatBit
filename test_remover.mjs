import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import { createWatermarkEngine } from '@pilio/gemini-watermark-remover/node.js';

async function main() {
  const dir = '/home/Neelesh/Desktop/EatBit/public';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  
  const engine = await createWatermarkEngine();
  
  for (const f of files) {
    const fullPath = path.join(dir, f);
    try {
      const img = await loadImage(fullPath);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const resultCanvas = await engine.removeWatermarkFromImage(canvas);
      const meta = resultCanvas.__watermarkMeta;
      console.log(`File: ${f} -> Applied: ${meta?.applied}, Reason: ${meta?.skipReason}`);
    } catch (e) {
      console.error(`File: ${f} -> Error: ${e.message}`);
    }
  }
}
main();
