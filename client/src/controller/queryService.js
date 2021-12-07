const placeholder = [
  {
    id: 5,
    authorId: 'Offline',
    content: 'A document for you, G',
    date: '2021-11-07 10:57:24.083539',
    url: 'https://www.geschkult.fu-berlin.de/e/khi/_ressourcen/ndl_forum_pdf/rembrandt_symposium_programm.pdf',
    icon: 'https://i.imgur.com/NDFE7BQ.jpg',
  },
  {
    id: 6,
    authorId: 'Erykah',
    content: 'Some article by yours truly',
    date: '2021-11-08 10:57:24.083539',
    url: 'https://imma.ie/wp-content/uploads/2018/10/whatisconceptualart.pdf',
    icon: 'https://i.imgur.com/Ks2oou4.jpg',
  },
  {
    id: 7,
    authorId: 'Chitra',
    content: 'Some article by yours truly',
    date: '2021-11-08 10:57:24.083539',
    url: 'https://www.sprengel-museum.de/images/PDF/BIG-short-guide-en.pdf',
    icon: 'https://i.imgur.com/ncnHn9I.jpg',
  },
];

export async function getPosts() {
  const url = 'http://localhost:8080/api/posts/';
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    const message = `Fetch error has occured: ${error}`;
    console.error(message);
    return placeholder;
  }
}

export async function createPost(post = {}) {
  const url = 'http://localhost:8080/api/posts/';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    })
    return response.json();
  } catch (error) {
    console.error(error);
  }
}
