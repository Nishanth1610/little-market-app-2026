# Little Market — Mini E-Commerce Capstone

A responsive front-end demo shop built with HTML, CSS, and vanilla JavaScript.

## Features
- Product cards rendered dynamically from a JavaScript array of objects.
- Category filters.
- Add-to-cart controls, quantity adjustments, remove buttons, and item count.
- Subtotal and total calculations using numeric prices and stable product IDs.
- Empty-cart state, including removing the last item.
- Checkout preview modal. No payment or personal details are collected.
- Responsive layout for desktop and mobile.

## Run locally
Open `index.html` in a browser. No build step or server is required.

## Calculation note for submission
“I chose the mini e-commerce shop. Product data is stored in a JavaScript array of objects, with numeric prices and unique product IDs. The cart uses a Map keyed by product ID to track quantities. The item count is the sum of quantities, and each line total is price × quantity. The subtotal and total are the sum of line totals; delivery is free in this demo. A modal displays an order preview without collecting payment details.”

## Suggested submission
- Live app: deploy this folder to GitHub Pages or Netlify.
- Code: share the GitHub repository or a public ZIP/Drive folder.
- Ensure the link permissions allow anyone with the link to view.
