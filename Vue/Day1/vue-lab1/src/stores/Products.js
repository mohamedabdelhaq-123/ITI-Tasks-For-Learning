const SiteName ='POVue';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/' },
  { name: 'Contact', href: '/' },
];

const MainProduct = {
  "id": 1,
  "name": "Cozy Sneakers",
  "description": "High-quality sneakers that go with everything you wear.",
  "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", 
  "badge": "NEW",
  "price": 120,
  "discount": 20,
  "tags": ["Fashion", "Casual", "Sport"]
};

const RelatedProducts = [
  {
    "id": 2,
    "name": "Running Shoes",
    "price": 90,
    "discount": 10,
    "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80" 
  },
  {
    "id": 3,
    "name": "Casual Boots",
    "price": 150,
    "discount": 0,
    "image": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80" 
  },
  {
    "id": 4,
    "name": "Flip Flops",
    "price": 30,
    "discount": 50,
    "image": "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80" 
  }
];

export { MainProduct, RelatedProducts , SiteName, navLinks};