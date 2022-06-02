const getPosts = async () => {
	const postsData = await fetch('http://localhost:10024/wp-json/wp/v2/posts');
	const posts = await postsData.json();
	return posts;
};

const buildElement = (title, querySelector) => {
	const noResultsDiv = document.querySelector(querySelector);
	const suggestionLink = document.createElement('a');

	suggestionLink.style.marginBottom = '1rem';

	suggestionLink.innerHTML = `Did you mean to search for a post named "${title}"?`;
	suggestionLink.href = `http://localhost:10024/?s=${title}`;
	noResultsDiv.querySelector('.search-form').prepend(suggestionLink);
};

// import MiniSearch from 'minisearch';

const minisearch = async (query) => {
	const posts = await getPosts();

	// const minisearch = new MiniSearch({
	// 	fields: ['slug'],
	// 	// storeFields: ['slug'],
	// });

	let minisearch = new MiniSearch({
		fields: ['title.rendered'],
		extractField: (document, fieldName) => {
			return fieldName
				.split('.')
				.reduce((doc, key) => doc && doc[key], document);
		},
	});

	minisearch.addAll(posts);

	console.log(minisearch);
	const results = minisearch.autoSuggest(query, { fuzzy: 2 });
	console.log('results', results);

	for (result of results) {
		const title = result.suggestion;
		buildElement(title, '.no-results');
	}
};

const url = window.location.href;
const query = url.match(/\?s=(.*)/)[1];

minisearch(query);
