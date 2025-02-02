console.log("PlotArmor content script running...");

// Function to extract movie ID from the URL
function getMovieID() {
  const match = window.location.href.match(/tt\d+/);
  return match ? match[0] : "Unknown";
}

// Function to extract review ratings from span class="ipc-rating-star--rating"
function getReviewerRating(reviewContainer) {
  console.log("Reviewer Rating");
  console.log(reviewContainer);
  const ratingElement = reviewContainer.querySelector("span.ipc-rating-star--rating");
  return ratingElement ? ratingElement.innerText.trim() : "N/A";
}

// Function to extract review details
function extractReviews() {
  const reviews = document.querySelectorAll('div.ipc-html-content-inner-div[role="presentation"]');
  const extractedData = [];

  reviews.forEach((review) => {
    const reviewContainer = review.closest('div.sc-8c7aa573-4'); // Get the closest parent container
    console.log("Review: ", review.children);
    // Get review text
    const reviewText = review.innerText.trim();

    // Get review rating using the updated selector
    const reviewerRating = reviewContainer ? getReviewerRating(reviewContainer) : "N/A";

    // Get review date
    const dateElement = reviewContainer?.querySelector('.review-date');
    const reviewDate = dateElement ? dateElement.innerText.trim() : "N/A";

    // Get movie ID and rating
    const movieID = getMovieID();

    // Store extracted review data
    extractedData.push({
      movieID,
      reviewerRating,
      reviewDate,
      reviewText
    });
  });

    console.log("Reviews: ", reviews);
  console.log("Extracted Review Data:", extractedData);
  return extractedData;
}

// Run function when page loads
extractReviews();

// Observer to check for new reviews that load dynamically
const observer = new MutationObserver(extractReviews);
observer.observe(document.body, { childList: true, subtree: true });