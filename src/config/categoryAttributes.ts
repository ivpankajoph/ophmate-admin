// categoryAttributes.js
export const categoryAttributes = {
  "T-Shirt": [
    { key: "size", label: "Size", type: "select", options: ["S", "M", "L", "XL"] },
    { key: "color", label: "Color", type: "text" },
    { key: "material", label: "Material", type: "text" },
    { key: "gender", label: "Gender", type: "select", options: ["Men", "Women", "Unisex"] },
  ],
  "Laptops": [
    { key: "ram", label: "RAM", type: "number" },
    { key: "storage", label: "Storage (GB)", type: "number" },
    { key: "processor", label: "Processor", type: "text" },
    { key: "display_size", label: "Display Size (inches)", type: "number" },
  ],
  "Furniture": [
    { key: "material", label: "Material", type: "text" },
    { key: "dimensions", label: "Dimensions (L×W×H)", type: "text" },
    { key: "weight", label: "Weight (kg)", type: "number" },
    { key: "color", label: "Color", type: "text" },
  ],
};
