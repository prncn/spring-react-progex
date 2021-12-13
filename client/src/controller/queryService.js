/**
 * Placeholder list of posts data. This will be passed
 * to getPosts() when the Spring server is offline.
 */
export const placeholder = [
  {
    id: '5',
    user: {
      'id': '1',
      'name': 'Preload',
      'icon': 'https://i.imgur.com/NDFE7BQ.jpg'
    },
    title: 'Rembrandt Symposium Programm',
    description: 'This is a placeholder',
    date: {
      "seconds": 1638807536,
      "nanos": 782000000
    },
    url: 'https://www.nga.gov/content/dam/ngaweb/Education/learning-resources/an-eye-for-art/AnEyeforArt-RembrandtVanRijn.pdf',
  },
  {
    id: '6',
    user: {
      'id': '2',
      'name': 'Erykah',
      'icon': 'https://i.imgur.com/Ks2oou4.jpg'
    },
    title: 'What is Conceptual Art',
    description: 'Some article by yours truly',
    date: {
      "seconds": 1638807536,
      "nanos": 782000000
    },
    url: 'https://imma.ie/wp-content/uploads/2018/10/whatisconceptualart.pdf',
  },
  {
    id: '7',
    user: {
      'id': '3',
      'name': 'Aysha',
      'icon': 'https://i.imgur.com/ncnHn9I.jpg'
    },
    title: 'Big Short Guide',
    description: 'Read this, it is important',
    date: {
      "seconds": 1638807536,
      "nanos": 782000000
    },
    url: 'https://www.sprengel-museum.de/images/PDF/BIG-short-guide-en.pdf',
  },
];

/**
 * Fetch posts from Spring endpoint.
 * @returns Array. First entry is the resulting data, which is a placeholder
 * in case of a fetch error. Second entry is a success response.
 */
export async function getPosts() {
  const url = 'http://localhost:8080/api/posts/';
  try {
    const response = await fetch(url);
    const data = await response.json();
    return [data, response.ok];
  } catch (error) {
    const message = `Fetch error has occured: ${error}`;
    console.error(message);
    return [placeholder, null];
  }
}

/**
 * Call spring endpoint to create a post document in
 * firestore and use params of client.
 * @param {string} authorId - Firestore ID of document
 * @param {string} content - Title of post
 * @param {string} icon - Icon of user
 * @param {string} url - URL of PDF file
 * @returns 
 */
export async function createPost(authorId, content, icon, url) {
  const endpoint = 'http://localhost:8080/api/posts/';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authorId,
        content,
        icon,
        url
      })
    })
    return response.json();
  } catch (error) {
    console.error(error);
  }
}
