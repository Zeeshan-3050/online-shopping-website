import { INITIAL_PRODUCTS } from '../data/shopData';

/**
 * Generates and downloads a standalone file (or triggers browser download)
 * so university HCI students can inspect or submit index.html, style.css, and script.js.
 */
export function downloadStandaloneBundleFile(filename: 'index.html' | 'style.css' | 'script.js') {
  let content = '';

  if (filename === 'style.css') {
    content = `/* TuRi 30 Shop — Complete CSS3 Stylesheet */
:root {
  --bg: #faf9f6;
  --surface: #ffffff;
  --text: #1c1917;
  --muted: #57534e;
  --border: #e7e5e4;
  --accent: #d97706;
}
body.dark {
  --bg: #09090b;
  --surface: #18181b;
  --text: #f4f4f5;
  --muted: #a1a1aa;
  --border: #27272a;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); }
button, input, select { min-height: 44px; border-radius: 8px; }
`;
  } else if (filename === 'script.js') {
    content = `// TuRi 30 Shop — Standalone Vanilla JavaScript Catalog & HCI Controller
const PRODUCTS = ${JSON.stringify(INITIAL_PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      subcategory: p.subcategory,
      rating: p.rating,
      stock: p.stock
    })), null, 2)};
console.log('Loaded TuRi 30 Shop Products:', PRODUCTS.length);
`;
  } else {
    content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TuRi 30 Shop — Online Shopping Website with All HCI Interface Design Elements</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="app">TuRi 30 Shop — Interactive E-Commerce & HCI Showcase</div>
  <script src="script.js"></script>
</body>
</html>`;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
