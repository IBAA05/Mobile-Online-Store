import CONFIG from "../config.js";

export async function createProduct(productData) {
  console.log("Creating product with data:", productData);
  const response = await fetch(`${CONFIG.API_URL}/products.php`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create product");
  }
  return response.json();
}

// {
//   "title": "test",
//   "brand": "apple",
//   "category": "smartphones",
//   "discount": 0,
//   "description": "def",
//   "images": [
//     "https://test.com"
//   ],
//   "variants": [
//     {
//       "storage": "124",
//       "price": 12122,
//       "stock": 12
//     }
//   ]
// }

// {
//     "title": "New Product",
//     "brand": "BrandX",
//     "price": 10000,
//     "variants": [
//         {
//             "storage": "128GB",
//             "price": 10000,
//             "stock": 50
//         }
//     ]
// }
