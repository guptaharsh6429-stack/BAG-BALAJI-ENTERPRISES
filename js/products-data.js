/**
 * ====================================================================
 * Bag Balaji Enterprises - Products & Pricing Data
 * ====================================================================
 *
 * HOW YOU CAN MANAGE PRODUCTS & PRICES:
 *
 * METHOD 1 (Directly on the website via Owner Panel):
 *   1. Open the website in your browser.
 *   2. Click "⚙️ Manage Products & Prices" (top bar, product section, or footer).
 *   3. Enter your Owner PIN (Default: 1234).
 *   4. From this panel you can:
 *      • ➕ Add new products (with custom photo/emoji, price, botanical name, specs)
 *      • ✏️ Edit any product's details and price
 *      • 🗑️ Delete products you no longer supply
 *      • 💾 Save price changes with 1 click
 *      • ⬇️ Download the updated products-data.js to update your GitHub Pages site!
 *
 * METHOD 2 (Edit this file directly):
 *   You can add, edit, or delete products directly in the `DEFAULT_PRODUCTS` array below.
 * ====================================================================
 */

const DEFAULT_PRODUCTS = [
  {
    id: "butterfly-pea",
    name: "Dried Butterfly Pea Flowers",
    botanical: "Clitoria ternatea",
    emoji: "🦋",
    gradient: "linear-gradient(135deg, #3f51b5, #1a237e)",
    image: "",
    badge: "Top Seller",
    price: 850,
    unit: "kg",
    moq: "10 kg",
    shelfLife: "24 Months",
    packaging: "5kg / 10kg / 25kg HDPE Bags",
    description: "Hand-harvested, whole blue butterfly pea flowers dried at optimal temperatures. Rich in anthocyanins and natural antioxidants. Widely sought for blue herbal teas, natural cocktails, and organic food coloring."
  },
  {
    id: "chamomile",
    name: "Dried Chamomile Flowers",
    botanical: "Matricaria chamomilla",
    emoji: "🌼",
    gradient: "linear-gradient(135deg, #fbc02d, #f57f17)",
    image: "",
    badge: "Popular",
    price: 1250,
    unit: "kg",
    moq: "5 kg",
    shelfLife: "18 Months",
    packaging: "1kg / 5kg / 10kg Bags",
    description: "Naturally soothing whole chamomile flower heads with intact yellow cones and white petals. Exceptionally fragrant and clean, perfect for calming bedtime herbal tea blends, essential oil extraction, and cosmetic skincare."
  },
  {
    id: "blue-cornflower",
    name: "Dried Blue Cornflowers",
    botanical: "Centaurea cyanus",
    emoji: "💐",
    gradient: "linear-gradient(135deg, #0288d1, #01579b)",
    image: "",
    badge: "Premium",
    price: 1450,
    unit: "kg",
    moq: "5 kg",
    shelfLife: "24 Months",
    packaging: "1kg / 5kg Moisture-Proof Bags",
    description: "Stunning, vibrant cobalt-blue cornflower petals and whole buds. High visual appeal for luxury herbal tea blends like Lady Grey, artisanal infusions, potpourri, and herbal cosmetics."
  },
  {
    id: "hibiscus-roselle",
    name: "Dry Roselle / Hibiscus Flowers",
    botanical: "Hibiscus sabdariffa",
    emoji: "🌺",
    gradient: "linear-gradient(135deg, #d81b60, #880e4f)",
    image: "",
    badge: "High Demand",
    price: 650,
    unit: "kg",
    moq: "10 kg",
    shelfLife: "24 Months",
    packaging: "5kg / 10kg / 25kg PP Bags",
    description: "Whole dried deep-ruby roselle calyces bursting with tangy flavor and vitamin C. Ideal for sour herbal tea infusions, wellness beverages, natural juices, jellies, and dietary supplements."
  },
  {
    id: "milk-thistle",
    name: "Milk Thistle Seeds",
    botanical: "Silybum marianum",
    emoji: "🌾",
    gradient: "linear-gradient(135deg, #558b2f, #33691e)",
    image: "",
    badge: "Nutraceutical",
    price: 380,
    unit: "kg",
    moq: "25 kg",
    shelfLife: "36 Months",
    packaging: "25kg / 50kg Heavy-Duty Bags",
    description: "Top-grade whole milk thistle seeds with verified high silymarin complex content. Extensively supplied to pharmaceutical and nutraceutical manufacturers for liver-support supplements and tinctures."
  },
  {
    id: "lavender",
    name: "Dried Lavender Flowers",
    botanical: "Lavandula angustifolia",
    emoji: "💜",
    gradient: "linear-gradient(135deg, #7e57c2, #4527a0)",
    image: "",
    badge: "Aromatherapy",
    price: 1850,
    unit: "kg",
    moq: "5 kg",
    shelfLife: "24 Months",
    packaging: "1kg / 5kg / 10kg Bags",
    description: "Highly fragrant dried lavender buds with persistent soothing scent and beautiful violet hue. Ideal for luxury wellness infusions, aromatherapy sachets, artisanal soaps, and cosmetic products."
  },
  {
    id: "rose-petals",
    name: "Dried Rose Petals",
    botanical: "Rosa damascena",
    emoji: "🌹",
    gradient: "linear-gradient(135deg, #e91e63, #c2185b)",
    image: "",
    badge: "Pure Fragrance",
    price: 950,
    unit: "kg",
    moq: "5 kg",
    shelfLife: "18 Months",
    packaging: "1kg / 5kg / 10kg Bags",
    description: "Selected pink and crimson damask rose petals dried with delicate care to preserve natural aroma and cooling properties. Widely used in ayurvedic gulkand, herbal teas, cosmetics, and face packs."
  },
  {
    id: "moringa-leaves",
    name: "Moringa Leaves (Dried)",
    botanical: "Moringa oleifera",
    emoji: "🍃",
    gradient: "linear-gradient(135deg, #43a047, #1b5e20)",
    image: "",
    badge: "Superfood",
    price: 280,
    unit: "kg",
    moq: "10 kg",
    shelfLife: "24 Months",
    packaging: "10kg / 25kg Sealed Bags",
    description: "Nutrient-dense, organically harvested drumstick tree leaves, hygienically shade-dried to retain high protein, chlorophyll, and mineral density. Supplied for dietary supplements, health teas, and leaf powder."
  }
];

// Complete Product & Price Store with Add/Edit/Delete capabilities
const ProductStore = {
  STORAGE_PRODUCTS_KEY: 'bag_balaji_custom_products',
  STORAGE_PRICES_KEY: 'bag_balaji_product_prices',
  PIN_KEY: 'bag_balaji_admin_pin',
  DEFAULT_PIN: '1234',

  getProducts() {
    try {
      const custom = localStorage.getItem(this.STORAGE_PRODUCTS_KEY);
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => ({
            ...p,
            image: p.image || ''
          }));
        }
      }

      // Check legacy price map
      const legacyPrices = localStorage.getItem(this.STORAGE_PRICES_KEY);
      if (legacyPrices) {
        const pMap = JSON.parse(legacyPrices);
        return DEFAULT_PRODUCTS.map(p => ({
          ...p,
          image: p.image || '',
          price: typeof pMap[p.id] !== 'undefined' ? Number(pMap[p.id]) : p.price
        }));
      }
    } catch (e) {
      console.warn('Error reading products from localStorage:', e);
    }
    return DEFAULT_PRODUCTS.map(p => ({ ...p, image: p.image || '' }));
  },

  saveAllProducts(productsArray) {
    try {
      localStorage.setItem(this.STORAGE_PRODUCTS_KEY, JSON.stringify(productsArray));
      return true;
    } catch (e) {
      console.error('Error saving products:', e);
      return false;
    }
  },

  addProduct(newProduct) {
    const list = this.getProducts();
    if (!newProduct.id) {
      newProduct.id = 'product-' + Date.now();
    }
    list.push(newProduct);
    return this.saveAllProducts(list);
  },

  updateProduct(updatedProduct) {
    let list = this.getProducts();
    list = list.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p);
    return this.saveAllProducts(list);
  },

  deleteProduct(productId) {
    let list = this.getProducts();
    list = list.filter(p => p.id !== productId);
    return this.saveAllProducts(list);
  },

  updatePrices(priceMap) {
    let list = this.getProducts();
    list = list.map(p => {
      if (typeof priceMap[p.id] !== 'undefined') {
        return { ...p, price: Number(priceMap[p.id]) };
      }
      return p;
    });
    return this.saveAllProducts(list);
  },

  resetToDefaults() {
    try {
      localStorage.removeItem(this.STORAGE_PRODUCTS_KEY);
      localStorage.removeItem(this.STORAGE_PRICES_KEY);
      return true;
    } catch (e) {
      return false;
    }
  },

  getPin() {
    return localStorage.getItem(this.PIN_KEY) || this.DEFAULT_PIN;
  },

  setPin(newPin) {
    if (!newPin || newPin.trim().length < 4) return false;
    localStorage.setItem(this.PIN_KEY, newPin.trim());
    return true;
  }
};

// Backward compatibility alias
const ProductPriceStore = ProductStore;
