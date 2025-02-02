console.log("PlotArmor content script running...");

// Function to blur review text
function blurReviews() {
  const reviews = document.querySelectorAll(".text.show-more__control"); // IMDb review text class
  reviews.forEach((review) => {
    review.style.filter = "blur(5px)"; // Apply blur effect
    review.style.transition = "filter 0.3s ease-in-out";

    // Add a "Show Review" button
    if (!review.parentElement.querySelector(".show-review-btn")) {
      const button = document.createElement("button");
      button.innerText = "Show Review";
      button.classList.add("show-review-btn");
      button.style.marginTop = "5px";
      button.style.cursor = "pointer";
      button.style.background = "#50CBDE";
      button.style.border = "none";
      button.style.padding = "5px 10px";
      button.style.color = "white";
      button.style.borderRadius = "5px";
      button.style.fontSize = "14px";
      
      // Toggle blur when button is clicked
      button.addEventListener("click", () => {
        if (review.style.filter === "blur(5px)") {
          review.style.filter = "none"; // Remove blur
          button.innerText = "Hide Review";
        } else {
          review.style.filter = "blur(5px)";
          button.innerText = "Show Review";
        }
      });

      review.parentElement.appendChild(button);
    }
  });
}

// Run function when page loads
blurReviews();

// Run again if new reviews load dynamically
const observer = new MutationObserver(blurReviews);
observer.observe(document.body, { childList: true, subtree: true });
