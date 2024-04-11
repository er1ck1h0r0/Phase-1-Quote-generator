const quoteContainer = document.getElementById('quoteContainer');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

// Function to generate a random quote from the Quotable API
async function generateRandomQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }
    const data = await response.json();
    const quote = { text: data.content, author: data.author };
    displayQuote(quote);
  } catch (error) {
    console.error(error);
    quoteContainer.innerHTML = "<p>Please try again later.</p>";
  }
}

// Function to display a quote
function displayQuote(quote) {
  const blockquote = document.createElement('blockquote');
  blockquote.textContent = `"${quote.text}"`;

  const p = document.createElement('p');
  p.textContent = `- ${quote.author}`;
//Like Button nd copy button
  const likeButton = document.createElement('span');
  likeButton.innerHTML = '&hearts;';
  likeButton.classList.add('like-heart');

  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy';
  copyButton.classList.add('copy-btn');

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');
  buttonContainer.appendChild(likeButton);
  buttonContainer.appendChild(copyButton);

  quoteContainer.innerHTML = ''; // Clear previous content
  quoteContainer.appendChild(blockquote);
  quoteContainer.appendChild(p);
  quoteContainer.appendChild(buttonContainer);

  likeButton.addEventListener('click', function() {
    likeButton.classList.toggle('liked');
  });

  copyButton.addEventListener('click', function() {
    const textToCopy = `"${quote.text}" - ${quote.author}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Quote copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy quote: ', err);
      });
  });
}

// Function to search for quotes
async function searchQuotes(query) {
  try {
    const response = await fetch(`https://api.quotable.io/quotes?author=${query}`);
    if (!response.ok) {
      throw new Error('Failed to fetch quotes');
    }
    const data = await response.json();
    if (data.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const quote = { text: data.results[randomIndex].content, author: data.results[randomIndex].author };
      displayQuote(quote);
    } else {
      quoteContainer.innerHTML = "<p>No matching quotes found.</p>";
    }
  } catch (error) {
    console.error(error);
    quoteContainer.innerHTML = "<p>Failed to fetch quotes. Please try again later.</p>";
  }
}

// Event listener for the "Generate New Quote" button
newQuoteBtn.addEventListener('click', generateRandomQuote);

// Event listener for the search form
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query !== '') {
    searchQuotes(query);
  }
});

// Generate a random quote when the page loads
generateRandomQuote();
