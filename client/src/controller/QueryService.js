export default class QueryService {
  /**
   * this.placeholder list of posts data. This will be passed
   * to getPosts() when the Spring server is offline.
   */
  static placeholder = [
    {
      id: "5",
      user: {
        id: "1",
        displayName: "Loading...",
        photoURL: "https://pic.onlinewebfonts.com/svg/img_258083.png",
      },
      title: "Rembrandt Symposium Programm",
      description: "Loading...",
      date: {
        seconds: 1638807536,
        nanos: 782000000,
      },
      url: "https://www.tagg.org/pdftest.pdf",
    },
    {
      id: "6",
      user: {
        id: "2",
        displayName: "Loading...",
        photoURL: "https://pic.onlinewebfonts.com/svg/img_258083.png",
      },
      title: "What is Conceptual Art",
      description: "Loading...",
      date: {
        seconds: 1638807536,
        nanos: 782000000,
      },
      url: "https://www.tagg.org/pdftest.pdf",
    },
    {
      id: "11",
      user: {
        id: "9",
        displayName: "Loading...",
        photoURL: "https://pic.onlinewebfonts.com/svg/img_258083.png",
      },
      title: "What is Conceptual Art",
      description: "Some article by yours truly",
      date: {
        seconds: 1638807536,
        nanos: 782000000,
      },
      url: "https://www.tagg.org/pdftest.pdf",
    },
    {
      id: "7",
      user: {
        id: "3",
        displayName: "Loading...",
        photoURL: "https://pic.onlinewebfonts.com/svg/img_258083.png",
      },
      title: "Big Short Guide",
      description: "Read this, it is important",
      date: {
        seconds: 1638807536,
        nanos: 782000000,
      },
      url: "https://www.tagg.org/pdftest.pdf",
    },
    {
      id: "13",
      user: {
        id: "29",
        displayName: "Loading...",
        photoURL: "https://pic.onlinewebfonts.com/svg/img_258083.png",
      },
      title: "Big Short Guide",
      description: "Read this, it is important",
      date: {
        seconds: 1638807536,
        nanos: 782000000,
      },
      url: "https://www.tagg.org/pdftest.pdf",
    },
  ];

  /**
   * Fetch posts from Spring endpoint.
   * @returns Array. First entry is the resulting data, which is a this.placeholder
   * in case of a fetch error. Second entry is a success response.
   */
  static async getPosts() {
    const url = "http://localhost:8080/api/posts?limit=20";
    try {
      console.log("Fetching Posts...");
      const response = await fetch(url);
      let data = await response.json();
      data = data.filter((item) => {
        return item.url !== null
      });
      console.log(data);
      return data;
    } catch (error) {
      const message = `Fetch error has occured: ${error}`;
      console.error(message);
      return this.placeholder;
    }
  }

  static async getPostById(id) {
    const url = `http://localhost:8080/api/posts/${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return { data, response: response.ok };
    } catch (error) {
      console.error(error);
      return { data: this.placeholder[0], response: false };
    }
  }

  static async getPostsOfUser(user) {
    const url = `http://localhost:8080/api/posts?user=${user}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return [data, response.ok];
    } catch (error) {
      console.error(error);
      return [this.placeholder[0], null];
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
  static async createPost(user, title, description, category, url) {
    const endpoint = "http://localhost:8080/api/posts/";
    return this.HTTPMethodWrapper("POST", endpoint, {
      user,
      title,
      description,
      category,
      url,
    });
  }

  static async deletePost(id, category) {
    const endpoint = `http://localhost:8080/api/posts/${id}`;
    return this.HTTPMethodWrapper("DELETE", endpoint, {
      category
    });
  }

  static async editPost(post) {
    const endpoint = `http://localhost:8080/api/posts`;
    return this.HTTPMethodWrapper("PUT", endpoint, post)
  }

  static async getUserById(id) {
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

  static async HTTPMethodWrapper(method, endpoint, body) {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  static async likePost(postId, userId) {
    const endpoint = `http://localhost:8080/api/posts/${postId}/like`;
    return this.HTTPMethodWrapper("POST", endpoint, {
      userId,
      postId,
    });
  }

  static async unlikePost(postId, userId) {
    const endpoint = `http://localhost:8080/api/posts/${postId}/like`;
    return this.HTTPMethodWrapper("DELETE", endpoint, {
      userId,
      postId,
    });
  }

  static async savePost(postId, userId) {
    const endpoint = `http://localhost:8080/api/posts/${postId}/save`;
    return this.HTTPMethodWrapper("POST", endpoint, {
      userId,
      postId,
    });
  }

  static async unsavePost(postId, userId) {
    const endpoint = `http://localhost:8080/api/posts/${postId}/save`;
    return this.HTTPMethodWrapper("DELETE", endpoint, {
      userId,
      postId,
    });
  }

  static async checkIfPostLikedByUser(postId, userId) {
    if (userId !== undefined) {
      const [data, response] = await this.getUserById(userId);
      if (response) {
        const likedPosts = data.likedPosts || [];
        return likedPosts.includes(postId);
      }
    }
  }

  static async checkIfPostSavedByUser(postId, userId) {
    if (userId !== undefined) {
      const [data, response] = await this.getUserById(userId);
      if (response) {
        const savedPosts = data.savedPosts || [];
        return savedPosts.includes(postId);
      }
    }
  }

  static async createComment(postId, user, description) {
    const endpoint = `http://localhost:8080/api/posts/${postId}/comments`;
    return this.HTTPMethodWrapper("POST", endpoint, {
      user,
      description,
    });
  }

  static async deleteComment(postId, commentId) {
    const endpoint = `http://localhost:8080/api/posts/${postId}/comments/${commentId}`;
    return this.HTTPMethodWrapper("DELETE", endpoint);
  }

  static async fetchUnsplashedImage(searchTerm) {
    const endpoint = `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=1&page=1`;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Client-ID thEZ20OyHFDkAE24Fkg8va-yVBSZBpBaEI86BV2WZ5g",
        },
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }
}
