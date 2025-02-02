function getMovieID() {
	const match = window.location.href.match(/tt\d+/);
	return match ? match[0] : "Unknown";
}

async function blurReviews() {
	const blurList = await extractReviews();
	console.log("Blur List:", blurList);
	const reviews = document.querySelectorAll(
		'div.ipc-html-content-inner-div[role="presentation"]'
	);
	reviews.forEach((review, index) => {
		if (blurList[index] === 1) {
			review.style.filter = "blur(5px)";
		}
	});
}

async function extractReviews() {
	const extractedData = [];
	const reviewCards = document.querySelectorAll(".ipc-list-card__content");
	const movieID = getMovieID();
	for (const card of reviewCards) {
		const ratingElement = card.querySelector(
			".ipc-rating-star--otherUserAlt"
		);
		let rating = -1;
		if (ratingElement) {
			const ariaLabel = ratingElement.getAttribute("aria-label");
			const labelLength = ariaLabel.length;
			let ratingStr =
				ariaLabel.charAt(labelLength - 2) !== " "
					? ariaLabel.slice(labelLength - 2)
					: ariaLabel.charAt(labelLength - 1);
			rating = Number(ratingStr);
		}
		const reviewTextElement = card.querySelector(
			".ipc-html-content-inner-div"
		);
		const reviewText = reviewTextElement
			? reviewTextElement.innerText.trim()
			: "No review text found";
		const dateElement = document.querySelector(".review-date");
		let date = "";
		if (dateElement) {
			date = dateElement.textContent.trim();
		} else {
			console.log("Date element not found.");
		}
		try {
			const response = await fetch("http://127.0.0.1:5000/predict", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					movieID: movieID,
					date: date,
					rating: rating,
					reviewText: reviewText,
				}),
			});
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			console.log("Response data:", data);
			extractedData.push(data.prediction);
		} catch (error) {
			console.error("Error:", error);
			extractedData.push(0);
		}
	}
	return extractedData;
}

(async function init() {
	await blurReviews();
})();
