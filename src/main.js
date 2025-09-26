import { getImagesByQuery, PER_PAGE } from "./js/pixabay-api";
import { 
  createGallery, 
  clearGallery, 
  showLoader, 
  hideLoader, 
  showLoadMoreButton, 
  hideLoadMoreButton,
  getFirstCardHeight 
} from "./js/render-functions";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const input = form.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector(".load-more");

let currentQuery = "";
let currentPage = 1;
let totalHits = 0;
let loadedImagesCount = 0;

hideLoadMoreButton();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) {
    iziToast.error({ 
      message: "Please enter a search term!", 
      position: "topRight",
      class: "custom-toast custom-error"  
    });
    return;
  }

  if (query !== currentQuery) {
    currentQuery = query;
    currentPage = 1;
    totalHits = 0;
    loadedImagesCount = 0;
    clearGallery();
    hideLoadMoreButton();
  }

  await fetchAndRender({ initial: true });
});

loadMoreBtn.addEventListener("click", async () => {
  currentPage += 1;
  await fetchAndRender({ smoothScroll: true });
});

async function fetchAndRender({ initial = false, smoothScroll = false } = {}) {
  try {
    showLoader();
    const data = await getImagesByQuery(currentQuery, currentPage);
    const { hits, totalHits: serverTotalHits } = data;

    if (currentPage === 1 && hits.length === 0) {
      hideLoader();
      iziToast.warning({
        message: "Sorry, no images found!",
        position: "topRight",
        class: "custom-toast custom-warning"
      });
      return;
    }

    createGallery(hits);
    totalHits = serverTotalHits;
    loadedImagesCount += hits.length;

    if (loadedImagesCount >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    } else {
      showLoadMoreButton();
    }

    if (smoothScroll) {
      const cardHeight = getFirstCardHeight();
      if (cardHeight > 0) {
        window.scrollBy({ top: cardHeight * 2, behavior: "smooth" });
      }
    }

    if (initial) {
      iziToast.success({
        message: `Found ${totalHits} images for "${currentQuery}"`,
        position: "topRight"
      });
    }

  } catch (error) {
    iziToast.error({
      message: "Something went wrong. Try again later.",
      position: "topRight",
      class: "custom-toast custom-error"
    });
  } finally {
    hideLoader(); 
  }
}
