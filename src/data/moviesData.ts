import { Movie, Rating, User } from "../types";

export const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Drama",
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Mystery"
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Toy Story",
    genres: ["Animation", "Adventure", "Comedy", "Fantasy"],
    releaseYear: 1995,
    overview: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    coverUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.2,
    voteCount: 45
  },
  {
    id: 2,
    title: "The Matrix",
    genres: ["Action", "Sci-Fi", "Thriller"],
    releaseYear: 1999,
    overview: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.5,
    voteCount: 65
  },
  {
    id: 3,
    title: "Titanic",
    genres: ["Drama", "Romance"],
    releaseYear: 1997,
    overview: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    coverUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.0,
    voteCount: 38
  },
  {
    id: 4,
    title: "Inception",
    genres: ["Action", "Sci-Fi", "Adventure", "Mystery"],
    releaseYear: 2010,
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.6,
    voteCount: 72
  },
  {
    id: 5,
    title: "Pulp Fiction",
    genres: ["Comedy", "Drama", "Thriller"],
    releaseYear: 1994,
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    coverUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.4,
    voteCount: 50
  },
  {
    id: 6,
    title: "The Dark Knight",
    genres: ["Action", "Drama", "Thriller"],
    releaseYear: 2008,
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    coverUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.7,
    voteCount: 80
  },
  {
    id: 7,
    title: "The Notebook",
    genres: ["Drama", "Romance"],
    releaseYear: 2004,
    overview: "A poor and passionate young man falls in love with a rich young woman and gives her a sense of freedom. They are soon separated by their social differences.",
    coverUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=1200",
    averageRating: 3.9,
    voteCount: 30
  },
  {
    id: 8,
    title: "Interstellar",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    releaseYear: 2014,
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival on a dying Earth.",
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.6,
    voteCount: 68
  },
  {
    id: 9,
    title: "Spirited Away",
    genres: ["Animation", "Adventure", "Fantasy", "Drama"],
    releaseYear: 2001,
    overview: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    coverUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.5,
    voteCount: 42
  },
  {
    id: 10,
    title: "Gladiator",
    genres: ["Action", "Adventure", "Drama"],
    releaseYear: 2000,
    overview: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    coverUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.3,
    voteCount: 47
  },
  {
    id: 11,
    title: "The Lion King",
    genres: ["Animation", "Adventure", "Drama"],
    releaseYear: 1994,
    overview: "A youthful lion cub named Simba is tricked into thinking he caused his father Mufasa's death, fleeing into exile before returning to reclaim his throne.",
    coverUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.4,
    voteCount: 40
  },
  {
    id: 12,
    title: "The Hangover",
    genres: ["Comedy"],
    releaseYear: 2009,
    overview: "Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night and the bachelor missing.",
    coverUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200",
    averageRating: 3.8,
    voteCount: 35
  },
  {
    id: 13,
    title: "Superbad",
    genres: ["Comedy"],
    releaseYear: 2007,
    overview: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-fueled party goes awry.",
    coverUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
    averageRating: 3.9,
    voteCount: 32
  },
  {
    id: 14,
    title: "La La Land",
    genres: ["Drama", "Romance", "Comedy"],
    releaseYear: 2016,
    overview: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.2,
    voteCount: 48
  },
  {
    id: 15,
    title: "Blade Runner 2049",
    genres: ["Sci-Fi", "Action", "Mystery", "Thriller"],
    releaseYear: 2017,
    overview: "A new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    coverUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.3,
    voteCount: 52
  },
  {
    id: 16,
    title: "Se7en",
    genres: ["Thriller", "Mystery", "Drama"],
    releaseYear: 1995,
    overview: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    coverUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1453728280371-0f9b2128d709?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.4,
    voteCount: 44
  },
  {
    id: 17,
    title: "The Silence of the Lambs",
    genres: ["Thriller", "Mystery", "Drama"],
    releaseYear: 1991,
    overview: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
    coverUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.5,
    voteCount: 51
  },
  {
    id: 18,
    title: "Eternal Sunshine of the Spotless Mind",
    genres: ["Drama", "Romance", "Sci-Fi"],
    releaseYear: 2004,
    overview: "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.",
    coverUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.2,
    voteCount: 36
  },
  {
    id: 19,
    title: "Avatar",
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    releaseYear: 2009,
    overview: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
    coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.1,
    voteCount: 55
  },
  {
    id: 20,
    title: "Shaun of the Dead",
    genres: ["Comedy", "Action", "Thriller"],
    releaseYear: 2004,
    overview: "A man's uneventful life is disrupted by the zombie apocalypse, forcing him to rise to the occasion and save his friends and family.",
    coverUrl: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.0,
    voteCount: 29
  },
  {
    id: 21,
    title: "Inside Out",
    genres: ["Animation", "Comedy", "Drama", "Fantasy"],
    releaseYear: 2015,
    overview: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house and school.",
    coverUrl: "https://images.unsplash.com/photo-1608889174639-414d9bde4418?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.3,
    voteCount: 44
  },
  {
    id: 22,
    title: "Good Will Hunting",
    genres: ["Drama", "Romance"],
    releaseYear: 1997,
    overview: "Will Hunting, a janitor at M.I.T., has a gift for mathematics, but needs help from a psychologist in order to find direction in his life.",
    coverUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.4,
    voteCount: 46
  },
  {
    id: 23,
    title: "Parasite",
    genres: ["Drama", "Thriller", "Comedy"],
    releaseYear: 2019,
    overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    coverUrl: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.6,
    voteCount: 54
  },
  {
    id: 24,
    title: "Dunkirk",
    genres: ["Action", "Drama", "Thriller"],
    releaseYear: 2017,
    overview: "Allied soldiers from Belgium, the British Commonwealth and Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II.",
    coverUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.1,
    voteCount: 38
  },
  {
    id: 25,
    title: "The Prestige",
    genres: ["Drama", "Mystery", "Sci-Fi", "Thriller"],
    releaseYear: 2006,
    overview: "After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
    coverUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=300",
    backdropUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    averageRating: 4.4,
    voteCount: 49
  }
];

export const PRESEEDED_USERS: User[] = [
  { id: 1, name: "Marcus (Action Fan)", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" },
  { id: 2, name: "Chloe (Drama & Romance)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
  { id: 3, name: "Devon (Sci-Fi Nerd)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" },
  { id: 4, name: "Sarah (Comedy Buff)", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" },
  { id: 5, name: "Kenji (Cinemaphile/Critic)", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" }
];

export const PRESEEDED_RATINGS: Rating[] = [
  // Marcus (Action, Sci-Fi, Thrillers: high; Romance, Drama: low)
  { userId: 1, movieId: 2, rating: 5 }, // Matrix
  { userId: 1, movieId: 4, rating: 5 }, // Inception
  { userId: 1, movieId: 6, rating: 5 }, // Dark Knight
  { userId: 1, movieId: 8, rating: 4 }, // Interstellar
  { userId: 1, movieId: 10, rating: 5 }, // Gladiator
  { userId: 1, movieId: 15, rating: 4 }, // Blade Runner 2049
  { userId: 1, movieId: 19, rating: 4 }, // Avatar
  { userId: 1, movieId: 3, rating: 1 }, // Titanic (romance)
  { userId: 1, movieId: 7, rating: 1 }, // Notebook (romance)
  { userId: 1, movieId: 14, rating: 2 }, // La La Land
  { userId: 1, movieId: 22, rating: 2 }, // Good Will Hunting
  { userId: 1, movieId: 12, rating: 3 }, // Hangover

  // Chloe (Drama, Romance, Music, Animation: high; Action, Sci-Fi: low)
  { userId: 2, movieId: 3, rating: 5 }, // Titanic
  { userId: 2, movieId: 7, rating: 5 }, // Notebook
  { userId: 2, movieId: 14, rating: 5 }, // La La Land
  { userId: 2, movieId: 22, rating: 5 }, // Good Will Hunting
  { userId: 2, movieId: 1, rating: 4 }, // Toy Story
  { userId: 2, movieId: 11, rating: 4 }, // Lion King
  { userId: 2, movieId: 9, rating: 4 }, // Spirited Away
  { userId: 2, movieId: 2, rating: 1 }, // Matrix
  { userId: 2, movieId: 15, rating: 2 }, // Blade Runner 2049
  { userId: 2, movieId: 6, rating: 2 }, // Dark Knight
  { userId: 2, movieId: 19, rating: 2 }, // Avatar

  // Devon (Sci-Fi, Fantasy, Thriller: high; Comedy: low)
  { userId: 3, movieId: 2, rating: 5 }, // Matrix
  { userId: 3, movieId: 4, rating: 5 }, // Inception
  { userId: 3, movieId: 8, rating: 5 }, // Interstellar
  { userId: 3, movieId: 15, rating: 5 }, // Blade Runner 2049
  { userId: 3, movieId: 25, rating: 5 }, // Prestige
  { userId: 3, movieId: 9, rating: 4 }, // Spirited Away
  { userId: 3, movieId: 19, rating: 4 }, // Avatar
  { userId: 3, movieId: 12, rating: 1 }, // Hangover
  { userId: 3, movieId: 13, rating: 2 }, // Superbad
  { userId: 3, movieId: 3, rating: 2 }, // Titanic

  // Sarah (Comedy, Animation, Light Drama: high; Thrillers, Dark stuff: low)
  { userId: 4, movieId: 1, rating: 5 }, // Toy Story
  { userId: 4, movieId: 11, rating: 5 }, // Lion King
  { userId: 4, movieId: 12, rating: 5 }, // Hangover
  { userId: 4, movieId: 13, rating: 5 }, // Superbad
  { userId: 4, movieId: 20, rating: 4 }, // Shaun of the Dead
  { userId: 4, movieId: 21, rating: 5 }, // Inside Out
  { userId: 4, movieId: 14, rating: 4 }, // La La Land
  { userId: 4, movieId: 16, rating: 1 }, // Se7en
  { userId: 4, movieId: 17, rating: 1 }, // Silence of the Lambs
  { userId: 4, movieId: 15, rating: 2 }, // Blade Runner 2049

  // Kenji (High-brow Drama, Mystery, Thriller, Complex Sci-Fi: high; Blockbusters: low)
  { userId: 5, movieId: 5, rating: 5 }, // Pulp Fiction
  { userId: 5, movieId: 9, rating: 5 }, // Spirited Away
  { userId: 5, movieId: 16, rating: 4 }, // Se7en
  { userId: 5, movieId: 17, rating: 5 }, // Silence of the Lambs
  { userId: 5, movieId: 23, rating: 5 }, // Parasite
  { userId: 5, movieId: 25, rating: 4 }, // Prestige
  { userId: 5, movieId: 18, rating: 5 }, // Eternal Sunshine
  { userId: 5, movieId: 19, rating: 2 }, // Avatar (low art)
  { userId: 5, movieId: 12, rating: 2 }, // Hangover (too silly)
  { userId: 5, movieId: 10, rating: 3 }  // Gladiator (okay)
];
