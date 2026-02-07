require('dotenv').config();
const sequelize = require('./config/database');
const Product = require('./models/product');

const products = [
  // Mens Fashion
  { name: 'Classic Blue Jeans', description: 'Comfortable and stylish regular-fit jeans.', imageURL: '/frontend/pics/blue-jeans.jpg', price: 1500, category: 'mens-fashion' },
  { name: 'White Linen Shirt', description: 'A breathable shirt perfect for summer.', imageURL: '/frontend/pics/white-shirt.jpg', price: 899, category: 'mens-fashion' },
  { name: 'Leather Biker Jacket', description: 'A timeless and rugged biker jacket.', imageURL: '/frontend/pics/leather-jacket.jpg', price:1299, category: 'mens-fashion' },
 


  // Womens Fashion
  { name: 'Floral Sundress', description: 'A light and airy dress for sunny days.', imageURL: '/frontend/pics/floral-sundress.jpeg', price: 799, category: 'womens-fashion' },
  { name: 'High-Waisted Trousers', description: 'Elegant and professional high-waisted trousers.', imageURL: '/frontend/pics/high-waisted.jpg', price: 2299, category: 'womens-fashion' },
  { name: 'Silk Blouse', description: 'A luxurious silk blouse for any occasion.', imageURL: '/frontend/pics/silk-blouse.webp', price: 3499, category: 'womens-fashion' },
  
  // Kids wear
  { name: 'Dinosaur Graphic T-shirt', description: 'Fun and comfy cotton t-shirt for kids.', imageURL: '/frontend/pics/dino-tshirt.webp', price: 899, category: 'kids-wear' },
  { name: 'Blue Denim Shorts', description: 'Durable and playful shorts for everyday wear.', imageURL: '/frontend/pics/blue-denim-shorts.jpg', price: 1199, category: 'kids-wear' },

  { name: 'Red Velvet Lipstick', description: 'A bold, long-lasting matte lipstick.', imageURL: '/frontend/pics/ref-velvet-lipstick.png', price: 850, category: 'cosmetics' },
  { name: 'Flawless Finish Foundation', description: 'A lightweight foundation for a natural, everyday look.', imageURL: '/frontend/pics/flawless-finish.webp', price: 1999, category: 'cosmetics' },
  { name: 'Sunset Glow Eyeshadow Palette', description: 'A palette of 6 warm, pigmented shades.', imageURL: '/frontend/pics/sunset-glow.webp', price: 2999, category: 'cosmetics' },

  // Accessories
  { name: 'Classic Aviator Sunglasses', description: 'Protect your eyes with these timeless aviator sunglasses.', imageURL: '/frontend/pics/classic-avi-sunglass.webp', price: 999, category: 'accessories' },
  { name: 'Tan Leather Tote Bag', description: 'A stylish and spacious bag perfect for any occasion.', imageURL: '/frontend/pics/tan-leather-bag.jpg', price: 3999, category: 'accessories' },
  { name: 'Omega Watch', description: 'An elegant and simple watch with a silver mesh strap.', imageURL: '/frontend/pics/silver-watch.webp', price: 4599, category: 'accessories' },

  // Footwear

{ name: 'Classic Leather Loafers', description: 'Elegant and versatile loafers for any formal occasion.', imageURL: '/frontend/pics/leather-loafer.webp', price: 3499, category: 'footwear' },
{ name: 'Minimalist White Sneakers', description: 'A must-have staple for your casual wardrobe.', imageURL: '/frontend/pics/white-sneakers.jpg', price: 2899, category: 'footwear' },
{ name: 'Suede Chelsea Boots', description: 'Stylish and comfortable suede boots for a sharp look.', imageURL: '/frontend/pics/chelsea-boots.webp', price: 4999, category: 'footwear' }
];

const importData = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Table synchronized!');

    await Product.bulkCreate(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

importData();