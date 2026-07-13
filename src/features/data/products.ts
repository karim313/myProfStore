/**
 * Products Data
 *
 * This file defines all available products with structured specifications.
 * Each product has a specs object containing key-value pairs for filtering.
 *
 * This is static data that can later be replaced with API data without changing the architecture.
 */

export interface ProductSpecs {
  // Common specs
  usage?: string;
  budget?: string;
  brand?: string;
  
  // Electronics specific
  cpu?: string;
  gpu?: string;
  battery?: string;
  screen?: string;
  os?: string;
  
  // Fashion specific
  style?: string;
  material?: string;
  size?: string;
  color?: string;
  
  // Home & Kitchen specific
  type?: string;
  material_type?: string;
  capacity?: string;
  
  // Gaming specific
  platform?: string;
  genre?: string;
  controller?: string;
  
  // Sports specific
  activity?: string;
  level?: string;
  equipment_type?: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  specs: ProductSpecs;
}

export const products: Product[] = [
  // Electronics
  {
    id: 1,
    name: "Asus ROG Strix",
    category: "Electronics",
    price: 1499,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    specs: {
      usage: "Gaming",
      cpu: "i7",
      gpu: "RTX4060",
      battery: "Excellent",
      budget: "High",
      screen: "15.6",
      os: "Windows"
    }
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    category: "Electronics",
    price: 1999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    specs: {
      usage: "Work",
      cpu: "M3",
      gpu: "Integrated",
      battery: "Excellent",
      budget: "High",
      screen: "14",
      os: "macOS"
    }
  },
  {
    id: 3,
    name: "Dell XPS 15",
    category: "Electronics",
    price: 1299,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
    specs: {
      usage: "Work",
      cpu: "i5",
      gpu: "RTX3050",
      battery: "Good",
      budget: "Medium",
      screen: "15.6",
      os: "Windows"
    }
  },
  {
    id: 4,
    name: "HP Pavilion",
    category: "Electronics",
    price: 699,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    specs: {
      usage: "Study",
      cpu: "i3",
      gpu: "Integrated",
      battery: "Good",
      budget: "Low",
      screen: "15.6",
      os: "Windows"
    }
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    category: "Electronics",
    price: 349,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
    specs: {
      usage: "Work",
      battery: "Excellent",
      budget: "High",
      brand: "Sony"
    }
  },
  {
    id: 6,
    name: "AirPods Pro",
    category: "Electronics",
    price: 249,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
    specs: {
      usage: "Work",
      battery: "Good",
      budget: "Medium",
      brand: "Apple"
    }
  },

  // Fashion
  {
    id: 7,
    name: "Nike Air Max 270",
    category: "Fashion",
    price: 150,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    specs: {
      style: "Sporty",
      material: "Synthetic",
      size: "Various",
      color: "Black",
      budget: "Medium",
      brand: "Nike"
    }
  },
  {
    id: 8,
    name: "Levi's 501 Jeans",
    category: "Fashion",
    price: 89,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    specs: {
      style: "Casual",
      material: "Denim",
      size: "Various",
      color: "Blue",
      budget: "Medium",
      brand: "Levi's"
    }
  },
  {
    id: 9,
    name: "Ralph Lauren Polo",
    category: "Fashion",
    price: 120,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
    specs: {
      style: "Formal",
      material: "Cotton",
      size: "Various",
      color: "White",
      budget: "High",
      brand: "Ralph Lauren"
    }
  },
  {
    id: 10,
    name: "Adidas Ultraboost",
    category: "Fashion",
    price: 180,
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?w=400",
    specs: {
      style: "Sporty",
      material: "Synthetic",
      size: "Various",
      color: "White",
      budget: "High",
      brand: "Adidas"
    }
  },

  // Home & Kitchen
  {
    id: 11,
    name: "Herman Miller Aeron",
    category: "Home & Kitchen",
    price: 1295,
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400",
    specs: {
      type: "Chair",
      material_type: "Mesh",
      budget: "High",
      usage: "Work"
    }
  },
  {
    id: 12,
    name: "Philips Essential Air Fryer",
    category: "Home & Kitchen",
    price: 180,
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSoleYCyD_TfhPY-Wn9_L9EXY0ZFGh5PmtgE0bVGe0AgPw8bymXgpeA-s7PDHb16sQfp3fsPDQ6GJSJZenFHvLpv1c4IGXYs-bUq9soSuEhIVHxWUN8GiD5bALsp3ve4HjtxLdCCYIoHg&usqp=CAc",
    specs: {
      type: "Kitchen Appliance",
      material_type: "Stainless Steel",
      capacity: "6 L",
      budget: "Medium",
      usage: "Kitchen"
    }
  },
  {
    id: 13,
    name: "IKEA Office Desk",
    category: "Home & Kitchen",
    price: 220,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU5dfFBQFzusl1lG9TIHqJjENyU055s1tDJ3EM7nXNFQ&s=10",
    specs: {
      type: "Furniture",
      material_type: "Wood",
      budget: "Medium",
      usage: "Office"
    }
  },
  {
    id: 14,
    name: "Modern LED Floor Lamp",
    category: "Home & Kitchen",
    price: 90,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7NF2OgK2U3wNQ9tz0sQyVlZ9RF6yqXOCQC2bf6fQWBg&s=10",
    specs: {
      type: "Lighting",
      material_type: "Aluminum",
      budget: "Low",
      usage: "Living Room"
    }
  },

  // Gaming
  {
    id: 15,
    name: "Logitech G Pro X Superlight 2",
    category: "Gaming",
    price: 159,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxd0-yHFN3rDj8eyMpl7Wa0twHgyJMki2DoNA24J_4IA&s=10",
    specs: {
      platform: "PC",
      genre: "Mouse",
      controller: "Wireless",
      budget: "Premium"
    }
  },
  {
    id: 16,
    name: "Keychron K2",
    category: "Gaming",
    price: 99,
    image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS-Ztzez1dpwAKV4pK83ExxqZ9Yi-VIeBIbDyXIoRcPGloUD2e3V1ajg4NO3awlhfKmQfAXvcx2DuizHnvKPwPcVgJ8l7IP5MXsehztB-x7JtLHggzmxbzdE8SVCw1YLDilGD7J_Q&usqp=CAc",
    specs: {
      platform: "PC",
      genre: "Keyboard",
      controller: "Wireless",
      budget: "Medium"
    }
  },
  {
    id: 17,
    name: "Razer BlackShark V2",
    category: "Gaming",
    price: 120,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyEoYt4h9rkT7taL-2TLeYFUTXgs5v1IVlqcdU-r27nQ&s=10",
    specs: {
      platform: "Universal",
      genre: "Headset",
      controller: "Wired",
      budget: "High"
    }
  },

  // Sports
  {
    id: 18,
    name: "Nike Air Zoom Pegasus 41",
    category: "Sports",
    price: 150,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJuwtgYngkQUF5cPM1L17Fjskfwk3QUeODo4qX6XQwpw&s=10",
    specs: {
      activity: "Running",
      level: "Beginner",
      equipment_type: "Shoes",
      budget: "High"
    }
  },
  {
    id: 19,
    name: "Adidas Champions League Ball",
    category: "Sports",
    price: 55,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQev2gmM8cYWU4NBPL_BChtsly4RVPsRUJaPgx83OoLw&s=10",
    specs: {
      activity: "Football",
      level: "Intermediate",
      equipment_type: "Equipment",
      budget: "Medium"
    }
  },
  {
    id: 20,
    name: "Adjustable Dumbbell Set",
    category: "Sports",
    price: 240,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK5PwBqx6JpYXjWHWesDCJkq-FXOlFslMDEIh6QgMAPA&s=10",
    specs: {
      activity: "Gym",
      level: "Professional",
      equipment_type: "Fitness Machine",
      budget: "High"
    }
  },
  {
    id: 12,
    name: "IKEA Hemnes Desk",
    category: "Home & Kitchen",
    price: 299,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400",
    specs: {
      type: "Desk",
      material_type: "Wood",
      budget: "Low",
      usage: "Work"
    }
  },
  {
    id: 13,
    name: "Breville Barista Express",
    category: "Home & Kitchen",
    price: 599,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
    specs: {
      type: "Coffee Machine",
      capacity: "Single",
      budget: "High",
      usage: "Kitchen"
    }
  },
  {
    id: 14,
    name: "Ninja Air Fryer",
    category: "Home & Kitchen",
    price: 149,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400",
    specs: {
      type: "Air Fryer",
      capacity: "Family",
      budget: "Medium",
      usage: "Kitchen"
    }
  },

  // Gaming
  {
    id: 15,
    name: "PlayStation 5",
    category: "Gaming",
    price: 499,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    specs: {
      platform: "Console",
      genre: "All",
      controller: "DualSense",
      budget: "High"
    }
  },
  {
    id: 16,
    name: "Xbox Series X",
    category: "Gaming",
    price: 499,
    image: "https://images.unsplash.com/photo-1621259212993-6229a9d67120?w=400",
    specs: {
      platform: "Console",
      genre: "All",
      controller: "Xbox",
      budget: "High"
    }
  },
  {
    id: 17,
    name: "Logitech G Pro X",
    category: "Gaming",
    price: 129,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400",
    specs: {
      platform: "PC",
      genre: "FPS",
      controller: "Mouse",
      budget: "Medium"
    }
  },
  {
    id: 18,
    name: "Razer BlackWidow",
    category: "Gaming",
    price: 179,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=400",
    specs: {
      platform: "PC",
      genre: "All",
      controller: "Keyboard",
      budget: "High"
    }
  },

  // Sports
  {
    id: 19,
    name: "Peloton Bike+",
    category: "Sports",
    price: 2495,
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400",
    specs: {
      activity: "Cardio",
      level: "All",
      equipment_type: "Bike",
      budget: "High"
    }
  },
  {
    id: 20,
    name: "Bowflex SelectTech",
    category: "Sports",
    price: 499,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    specs: {
      activity: "Strength",
      level: "All",
      equipment_type: "Dumbbells",
      budget: "Medium"
    }
  },
  {
    id: 21,
    name: "Yoga Mat Premium",
    category: "Sports",
    price: 79,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    specs: {
      activity: "Yoga",
      level: "All",
      equipment_type: "Mat",
      budget: "Low"
    }
  },
  {
    id: 22,
    name: "TRX Suspension Trainer",
    category: "Sports",
    price: 199,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
    specs: {
      activity: "Strength",
      level: "All",
      equipment_type: "Trainer",
      budget: "Medium"
    }
  }
];
