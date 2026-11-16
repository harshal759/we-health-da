
export default function decorate(block) {
  const title = block.querySelector(':scope > div:nth-child(1) > div:nth-child(2)')?.textContent.trim() || '';
  const description = block.querySelector(':scope > div:nth-child(2) > div:nth-child(2)')?.textContent.trim() || '';
  const apiPath = block.querySelector(':scope > div:nth-child(3) > div:nth-child(2)')?.textContent.trim() || '';
  const inputLabel = block.querySelector(':scope > div:nth-child(4) > div:nth-child(2)')?.textContent.trim() || 'Search by title';
  const searchFilters = block.querySelector(':scope > div:nth-child(5) > div:nth-child(2)')?.textContent.trim() || '';

  const INDEX_URL = apiPath || 'https://main--we-health-da--harshal759.aem.live/products-index.json';

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

      <div class="search-listing-results" aria-live="polite"></div>
    </div>
  `;

  const input = block.querySelector('#search-listing-input');
  const button = block.querySelector('.search-listing-button');
  const results = block.querySelector('.search-listing-results');

  let doctors = [];

  results.textContent = 'Loading doctors...';

  fetch(INDEX_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      doctors = json.data || [];
      results.textContent = 'Enter more than 3 characters to search.';
    })
    .catch((error) => {
      console.error('Error fetching index:', error);
      results.textContent = 'Unable to load doctors.';
    });

  function searchDoctors() {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();

    if (query.length <= 3) {
      results.textContent = 'Please enter at least 4 characters.';
      return;
    }

    const matches = doctors.filter((doctor) =>
      (doctor.title || '').toLowerCase().includes(query)
    );

    if (!matches.length) {
      results.textContent = 'No doctors found.';
      return;
    }

    matches.forEach((doctor) => {
      const card = document.createElement('article');
      card.className = 'doctor-card';

      const doctorTitle = document.createElement('h3');
      doctorTitle.textContent = doctor.title || 'Unnamed doctor';

      const specialty = document.createElement('p');
      specialty.textContent = `Specialty: ${doctor.specialty || 'Not specified'}`;

      const link = document.createElement('a');
      link.href = doctor.path || '#';
      link.textContent = 'View details';

      card.append(doctorTitle, specialty, link);
      results.append(card);
    });
  }

  button.addEventListener('click', searchDoctors);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      searchDoctors();
    }
  });

  console.log('API Path:', apiPath);
  console.log('Search Filters:', searchFilters);
}
