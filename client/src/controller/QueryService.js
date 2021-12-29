import { async } from '@firebase/util';

/**
 * Placeholder list of posts data. This will be passed
 * to getPosts() when the Spring server is offline.
 */
export const placeholder = [
  {
    id: '5',
    user: {
      id: '1',
      displayName: 'Preload',
      photoURL: 'https://pic.onlinewebfonts.com/svg/img_258083.png',
    },
    title: 'Rembrandt Symposium Programm',
    description: 'This is a placeholder',
    date: {
      seconds: 1638807536,
      nanos: 782000000,
    },
    url: 'https://www.nga.gov/content/dam/ngaweb/Education/learning-resources/an-eye-for-art/AnEyeforArt-RembrandtVanRijn.pdf',
  },
  {
    id: '6',
    user: {
      id: '2',
      displayName: 'Erykah',
      photoURL: 'https://pic.onlinewebfonts.com/svg/img_258083.png',
    },
    title: 'What is Conceptual Art',
    description: 'Some article by yours truly',
    date: {
      seconds: 1638807536,
      nanos: 782000000,
    },
    url: 'https://imma.ie/wp-content/uploads/2018/10/whatisconceptualart.pdf',
  },
  {
    id: '11',
    user: {
      id: '9',
      displayName: 'Sulli',
      photoURL: 'https://pic.onlinewebfonts.com/svg/img_258083.png',
    },
    title: 'What is Conceptual Art',
    description: 'Some article by yours truly',
    date: {
      seconds: 1638807536,
      nanos: 782000000,
    },
    url: 'https://imma.ie/wp-content/uploads/2018/10/whatisconceptualart.pdf',
  },
  {
    id: '7',
    user: {
      id: '3',
      displayName: 'Aysha',
      photoURL: 'https://pic.onlinewebfonts.com/svg/img_258083.png',
    },
    title: 'Big Short Guide',
    description: 'Read this, it is important',
    date: {
      seconds: 1638807536,
      nanos: 782000000,
    },
    url: 'https://www.sprengel-museum.de/images/PDF/BIG-short-guide-en.pdf',
  },
  {
    id: '13',
    user: {
      id: '29',
      displayName: 'Aysha',
      photoURL: 'https://pic.onlinewebfonts.com/svg/img_258083.png',
    },
    title: 'Big Short Guide',
    description: 'Read this, it is important',
    date: {
      seconds: 1638807536,
      nanos: 782000000,
    },
    url: 'https://www.sprengel-museum.de/images/PDF/BIG-short-guide-en.pdf',
  },
];

const images = [
  'https://i.imgur.com/NDFE7BQ.jpg',
  'https://i.imgur.com/Ks2oou4.jpg',
  'https://i.imgur.com/kLcZbQT.jpeg',
  'https://i.imgur.com/ncnHn9I.jpg',
  'https://pic.onlinewebfonts.com/svg/img_258083.png',
];

/**
 * Fetch posts from Spring endpoint.
 * @returns Array. First entry is the resulting data, which is a placeholder
 * in case of a fetch error. Second entry is a success response.
 */
export async function getPosts() {
  const url = 'http://localhost:8080/api/posts?limit=20';
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

export async function getPostById(id) {
  const url = `http://localhost:8080/api/posts/${id}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return { data, response: response.ok };
  } catch (error) {
    console.error(error);
    return { data: placeholder[0], response: false };
  }
}

export async function getPostByUser(user) {
  const url = `http://localhost:8080/api/posts?user=${user}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return [data, response.ok];
  } catch (error) {
    console.error(error);
    return [placeholder[0], null];
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
export async function createPost(user, title, description, url) {
  const endpoint = 'http://localhost:8080/api/posts/';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        title,
        description,
        url,
      }),
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function getUserById(id) {
  const url = `http://localhost:8080/api/users/${id}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return [data, response.ok];
  } catch (error) {
    console.error(error);
    return [{}, false];
  }
}

export async function likePost(postId, userId) {
  const endpoint = `http://localhost:8080/api/posts/${postId}/like`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        postId,
      }),
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function unlikePost(postId, userId) {
  const endpoint = `http://localhost:8080/api/posts/${postId}/like`;
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        postId,
      }),
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function checkIfPostLikedByUser(postId, userId) {
  if (userId !== undefined) {
    const [data, response] = await getUserById(userId);
    if (response) {
      const likedPosts = data.likedPosts || [];
      return likedPosts.includes(postId);
    }
  }
}

export async function fetchUnsplashedImage(searchTerm) {
  const endpoint = `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page?=1`;
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Client-ID thEZ20OyHFDkAE24Fkg8va-yVBSZBpBaEI86BV2WZ5g',
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
