export default function decorate(block) {
  const title = block.querySelector(':scope > div:nth-child(1) > div')?.textContent.trim() || '';
  const description = block.querySelector(':scope > div:nth-child(2) > div')?.textContent.trim() || '';
  const apiPath = block.querySelector(':scope > div:nth-child(3) > div')?.textContent.trim() || '';
  const inputLabel = block.querySelector(':scope > div:nth-child(4) > div')?.textContent.trim() || '';
  const searchFilters = block.querySelector(':scope > div:nth-child(5) > div')?.textContent.trim() || '';

  block.innerHTML = `
    <div class="search-listing-container">
      ${title ? `<h2>${title}</h2>` : ''}
      ${description ? `<p>${description}</p>` : ''}

      <div class="search-listing-form">
        <label for="search-listing-input">${inputLabel}</label>
        <input
          type="text"
          id="search-listing-input"
          placeholder="${inputLabel}"
        />
        <button type="button" class="search-listing-button">
          Search
        </button>
      </div>

      <div class="search-listing-results"></div>
    </div>
  `;

  console.log('API Path:', apiPath);
  console.log('Search Filters:', searchFilters);
}