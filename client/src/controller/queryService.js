const placeholder = [
  {
    id: 5,
    authorId: 'Offline',
    content: 'A document for you, G',
    date: {
      "seconds": 1638807536,
      "nanos": 782000000
    },
    url: 'https://www.geschkult.fu-berlin.de/e/khi/_ressourcen/ndl_forum_pdf/rembrandt_symposium_programm.pdf',
    icon: 'https://i.imgur.com/NDFE7BQ.jpg',
  },
  {
    id: 6,
    authorId: 'Erykah',
    content: 'Some article by yours truly',
    date: {
      "seconds": 1638807536,
      "nanos": 782000000
    },
    url: 'https://imma.ie/wp-content/uploads/2018/10/whatisconceptualart.pdf',
    icon: 'https://i.imgur.com/Ks2oou4.jpg',
  },
  {
    id: 7,
    authorId: 'Chitra',
    content: 'Some article by yours truly',
    date: {
      "seconds": 1638807536,
      "nanos": 782000000
    },
    url: 'https://www.sprengel-museum.de/images/PDF/BIG-short-guide-en.pdf',
    icon: 'https://i.imgur.com/ncnHn9I.jpg',
  },
];

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
