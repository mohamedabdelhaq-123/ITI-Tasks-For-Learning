export interface Iproducts{
  id:number;
  name:string; 
  price:number; 
  stock:number; 
  image:string;
  category:string;
  brand:string; 
  rating:number; 
  description:string;
  trailer?:string
} 
 
 
export const products: Iproducts[] = [
  {
    id: 1,
    name: "The Godfather",
    price: 25,
    stock: 0,
    image: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg",
    category: "Crime",
    brand: "Francis Ford Coppola",
    rating: 4.9,
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    trailer: "https://www.youtube.com/watch?v=5pJ7W4MksY0"
  },
  {
    id: 2,
    name: "The Shawshank Redemption",
    price: 20,
    stock: 15,
    image: "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
    category: "Drama",
    brand: "Frank Darabont",
    rating: 4.9,
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    trailer: "https://www.youtube.com/watch?v=rNKKgsuIZC8"
  },
  {
    id: 3,
    name: "The Dark Knight",
    price: 30,
    stock: 20,
    image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg",
    category: "Action",
    brand: "Christopher Nolan",
    rating: 4.9,
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.",
    trailer: "https://www.youtube.com/watch?v=gaZ-S1aFB24"
  },
  {
    id: 4,
    name: "Schindler's List",
    price: 22,
    stock: 8,
    image: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg",
    category: "Biography",
    brand: "Steven Spielberg",
    rating: 4.8,
    description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    trailer: "https://www.youtube.com/watch?v=x4mxQV_NH1g"
  },
  {
    id: 5,
    name: "12 Angry Men",
    price: 18,
    stock: 10,
    image: "https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_FMjpg_UX1000_.jpg",
    category: "Crime",
    brand: "Sidney Lumet",
    rating: 4.9,
    description: "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.",
    trailer: "https://www.youtube.com/watch?v=TEN-2uTi2c0"
  },
  {
    id: 6,
    name: "Pulp Fiction",
    price: 24,
    stock: 14,
    image: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg",
    category: "Crime",
    brand: "Quentin Tarantino",
    rating: 4.8,
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    trailer: "https://www.youtube.com/watch?v=5ZAhzsi1ybM"
  },
  {
    id: 7,
    name: "The Lord of the Rings: The Return of the King",
    price: 35,
    stock: 5,
    image: "https://m.media-amazon.com/images/M/MV5BMTZkMjBjNWMtZGI5OC00MGU0LTk4ZTItODg2NWM3NTVmNWQ4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    category: "Fantasy",
    brand: "Peter Jackson",
    rating: 4.9,
    description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    trailer: "https://www.youtube.com/watch?v=Xqpd-_z2HnA"
  },
  {
    id: 8,
    name: "The Good, the Bad and the Ugly",
    price: 20,
    stock: 7,
    image: "https://m.media-amazon.com/images/M/MV5BMWM5ZjQxM2YtNDlmYi00ZDNhLWI4MWUtN2VkYjBlMTY1ZTkwXkEyXkFqcGc@._V1_.jpg",
    category: "Western",
    brand: "Sergio Leone",
    rating: 4.8,
    description: "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.",
    trailer: "https://www.youtube.com/watch?v=3VQjSSB78es"
  },
  {
    id: 9,
    name: "Fight Club",
    price: 22,
    stock: 11,
    image: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    category: "Drama",
    brand: "David Fincher",
    rating: 4.8,
    description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    trailer: "https://www.youtube.com/watch?v=dfeUzm6KF4g"
  },
  {
    id: 10,
    name: "Forrest Gump",
    price: 20,
    stock: 18,
    image: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg",
    category: "Romance",
    brand: "Robert Zemeckis",
    rating: 4.8,
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    trailer: "https://www.youtube.com/watch?v=NYL2136vPT8"
  },
  {
    id: 11,
    name: "Inception",
    price: 28,
    stock: 9,
    image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
    category: "Sci-Fi",
    brand: "Christopher Nolan",
    rating: 4.8,
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    trailer: "https://www.youtube.com/watch?v=Qwe6qXFTdgc"
  },
  {
    id: 12,
    name: "The Matrix",
    price: 25,
    stock: 13,
    image: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg",
    category: "Sci-Fi",
    brand: "Lana Wachowski",
    rating: 4.7,
    description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    trailer: "https://www.youtube.com/watch?v=nUEQNVV3Gfs"
  },
  {
    id: 13,
    name: "Goodfellas",
    price: 23,
    stock: 6,
    image: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg",
    category: "Crime",
    brand: "Martin Scorsese",
    rating: 4.7,
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
    trailer: "https://www.youtube.com/watch?v=h3QpxNI-PtE"
  },
  {
    id: 14,
    name: "The Empire Strikes Back",
    price: 30,
    stock: 0,
    image: "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg",
    category: "Sci-Fi",
    brand: "Irvin Kershner",
    rating: 4.7,
    description: "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda.",
    trailer: "https://www.youtube.com/watch?v=omcxaMEGha0"
  },
  {
    id: 15,
    name: "Parasite",
    price: 26,
    stock: 12,
    image: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg",
    category: "Thriller",
    brand: "Bong Joon Ho",
    rating: 4.6,
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    trailer: "https://www.youtube.com/watch?v=vITzl413dZg"
  },
  {
    id: 16,
    name: "Interstellar",
    price: 29,
    stock: 8,
    image: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    category: "Sci-Fi",
    brand: "Christopher Nolan",
    rating: 4.7,
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    trailer: "https://www.youtube.com/watch?v=4T4wxDnTYLg"
  },
  {
    id: 17,
    name: "Spirited Away",
    price: 22,
    stock: 15,
    image: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
    category: "Animation",
    brand: "Hayao Miyazaki",
    rating: 4.6,
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    trailer: "https://youtu.be/7cv5p1XNuDw?t=1m58s"
  },
  {
    id: 18,
    name: "City of God",
    price: 21,
    stock: 5,
    image: "https://m.media-amazon.com/images/M/MV5BMzg2Mzg4YmUtNDdkNy00NWY1LWE3NmEtZWMwNGNlMzE5YzU3XkEyXkFqcGdeQXVyMjA5MTIzMjQ@._V1_FMjpg_UX1000_.jpg",
    category: "Crime",
    brand: "Fernando Meirelles",
    rating: 4.6,
    description: "In the slums of Rio, two kids' paths diverge as one struggles to become a photographer and the other a kingpin.",
    trailer: "https://www.youtube.com/watch?v=OObRT9bnH2s"
  },
  {
    id: 19,
    name: "Se7en",
    price: 19,
    stock: 9,
    image: "https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg",
    category: "Thriller",
    brand: "David Fincher",
    rating: 4.6,
    description: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    trailer: "https://www.youtube.com/watch?v=KPOuJGkpblk"
  },
  {
    id: 20,
    name: "The Silence of the Lambs",
    price: 20,
    stock: 6,
    image: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg",
    category: "Thriller",
    brand: "Jonathan Demme",
    rating: 4.6,
    description: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
    trailer: "https://www.youtube.com/watch?v=hVzWsicDMrs"
  }
];