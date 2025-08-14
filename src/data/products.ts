import type { Product } from "@/types/product";
import sneakers from "@/assets/products/sneakers.jpg";
import headphones from "@/assets/products/headphones.jpg";
import watch from "@/assets/products/watch.jpg";
import backpack from "@/assets/products/backpack.jpg";
import sunglasses from "@/assets/products/sunglasses.jpg";
import hoodie from "@/assets/products/hoodie.jpg";

export const products: Product[] = [
  { 
    id: "sneakers-001", 
    title: "Velocity Run Sneakers", 
    price: 129, 
    image: sneakers, 
    rating: 4.6, 
    category: "Footwear",
    description: "Experience ultimate comfort and style with our Velocity Run Sneakers. Featuring advanced cushioning technology, breathable mesh upper, and a durable rubber outsole for superior traction. Perfect for running, gym workouts, or casual everyday wear."
  },
  { 
    id: "headphones-002", 
    title: "Pulse Wireless Headphones", 
    price: 179, 
    image: headphones, 
    rating: 4.8, 
    category: "Audio",
    description: "Immerse yourself in crystal-clear sound with our Pulse Wireless Headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort padding. Perfect for music lovers, gamers, and professionals who demand exceptional audio quality."
  },
  { 
    id: "watch-003", 
    title: "Apex Smart Watch", 
    price: 249, 
    image: watch, 
    rating: 4.5, 
    category: "Wearables",
    description: "Stay connected and track your fitness goals with the Apex Smart Watch. Features include heart rate monitoring, GPS tracking, 7-day battery life, water resistance, and seamless smartphone integration. Your perfect companion for an active lifestyle."
  },
  { 
    id: "backpack-004", 
    title: "Urban Commuter Backpack", 
    price: 99, 
    image: backpack, 
    rating: 4.4, 
    category: "Bags",
    description: "Organize your daily essentials with style using our Urban Commuter Backpack. Features multiple compartments, laptop sleeve, water-resistant fabric, and ergonomic design. Ideal for students, professionals, and travelers seeking functionality and durability."
  },
  { 
    id: "sunglasses-005", 
    title: "Spectrum Sunglasses", 
    price: 89, 
    image: sunglasses, 
    rating: 4.2, 
    category: "Accessories",
    description: "Protect your eyes in style with our Spectrum Sunglasses. Featuring UV400 protection, polarized lenses, lightweight titanium frame, and anti-reflective coating. Perfect for driving, outdoor activities, and making a fashion statement."
  },
  { 
    id: "hoodie-006", 
    title: "Nimbus Fleece Hoodie", 
    price: 79, 
    image: hoodie, 
    rating: 4.7, 
    category: "Apparel",
    description: "Stay warm and comfortable with our Nimbus Fleece Hoodie. Made from premium cotton-polyester blend, featuring a soft fleece interior, adjustable hood, and kangaroo pocket. Perfect for casual wear, outdoor activities, and cozy evenings."
  },
];
