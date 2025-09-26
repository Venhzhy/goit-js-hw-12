import axios from "axios";

const API_KEY = "52370866-f56fe6e7c04694f1b916d2ffa"; // твій ключ
const BASE_URL = "https://pixabay.com/api/";
export const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: PER_PAGE,
    page,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data; // => { hits, totalHits }
  } catch (error) {
    throw new Error("Error fetching images: " + error.message);
  }
}
