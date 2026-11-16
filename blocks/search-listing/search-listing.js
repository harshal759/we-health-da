
export default async function decorate(block) {
  // Read authored block configuration
  const getValue = (row) =>
    block.querySelector(
      `:scope > div:nth-child(${row}) > div:nth-child(2)`,
    )?.textContent.trim() || '';

  const title = getValue(1);
  const description = getValue(2);
  const apiPath = getValue(3);
  const inputLabel = getValue(4) || 'Search by name';
  const searchFilters = getValue(5);

  const indexURL = apiPath ||
    'https://main--we-health-da--harshal759.aem.live/products-index.json';

  block.innerHTML = `
    <div class="search-listing-container">
      ${title ? `<h2 class="search-listing-title"></h2>` : ''}
      ${description ? `<p class="search-listing-description"></p>` : ''}

      <div class="search-listing-form">
        <label class="search-listing-label"></label>
        <input
          type="text"
          class="search-listing-input"
          placeholder=""
          autocomplete="off"
        />
      </div>

      <div class="search-listing-results" aria-live="polite"></div>
    </div>
  `;

  const heading = block.querySelector('.search-listing-title');
  const descriptionEl = block.querySelector('.search-listing-description');
  const label = block.querySelector('.search-listing-label');
  const input = block.querySelector('.search-listing-input');
  const results = block.querySelector('.search-listing-results');

  if (heading) heading.textContent = title;
  if (descriptionEl) descriptionEl.textContent = description;
  label.textContent = inputLabel;
  label.htmlFor = 'search-listing-input';
  input.id = 'search-listing-input';
  input.placeholder = inputLabel;

  let products = [];

  results.textContent = 'Loading ...';

  try {
    const response = await fetch(indexURL);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const json = await response.json();
    products = json.data || [];
    results.textContent = 'Enter at least 4 characters to search.';
  } catch (error) {
    console.error('Unable to load index:', error);
    results.textContent = 'Unable to load. Please try again.';
    return;
  }

  function createproductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    // Image area styled like the reference card.
    const imageArea = document.createElement('div');
    imageArea.className = 'product-image';

    const avatar = document.createElement('div');
    avatar.className = 'product-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = (product.title || 'D').charAt(0).toUpperCase();
    imageArea.appendChild(avatar);

    const info = document.createElement('div');
    info.className = 'product-info';

    const name = document.createElement('h3');
    name.className = 'product-name';
    name.textContent = product.title || 'product';

    const specialty = document.createElement('p');
    specialty.className = 'product-specialty';
    specialty.textContent = product.specialty || 'Specialty not available';

    const description = document.createElement('p');
    description.className = 'product-description';
    description.textContent = product.description || 'Description not available';

    const location = document.createElement('p');
    location.className = 'product-location';
    location.textContent = product.location || 'Location not available';

    const experience = document.createElement('p');
    experience.className = 'product-experience';
    experience.textContent = product.experience || 'Experience not available';

    const link = document.createElement('a');
    link.className = 'product-profile-link';
    link.href = product.path || '#';
    link.textContent = 'View profile';

    info.append(name, specialty, description, location, experience, link);
    card.append(imageArea, info);

    return card;
  }

  function renderResults(query) {
    results.replaceChildren();

    if (query.length <= 3) {
      results.textContent = 'Enter at least 4 characters to search.';
      return;
    }

    const matches = products.filter((product) =>
      (product.title || '').toLowerCase().includes(query),
    );

    if (!matches.length) {
      results.textContent = 'No products found.';
      return;
    }

    const count = document.createElement('p');
    count.className = 'search-listing-count';
    count.textContent = `${matches.length} product(s) found`;

    const grid = document.createElement('div');
    grid.className = 'product-results-grid';

    matches.forEach((product) => {
      grid.appendChild(createproductCard(product));
    });

    results.append(count, grid);
  }

  input.addEventListener('input', () => {
    renderResults(input.value.trim().toLowerCase());
  });

  console.log('Index URL:', indexURL);
  console.log('Search filters:', searchFilters);
}
