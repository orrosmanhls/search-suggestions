const getPosts = async () => {
	const postsData = await fetch('http://localhost:10024/wp-json/wp/v2/posts');
	const posts = await postsData.json();
	return posts;
};

// not be necessary (use fuse.js: option > keys)
const preparePosts = async (posts) => {
	const postsTitles = posts.map((post) => post.title.rendered);
	return postsTitles;
};

const buildElement = (title, querySelector) => {
	const noResultsDiv = document.querySelector(querySelector);
	const suggestionLink = document.createElement('a');

	suggestionLink.style.marginBottom = '1rem';

	suggestionLink.innerHTML = `Did you mean to search for a post named "${title}"?`;
	suggestionLink.href = `http://localhost:10024/?s=${title}`;
	noResultsDiv.querySelector('.search-form').prepend(suggestionLink);
};

const fuzzysearch = async (query) => {
	const posts = await getPosts();
	const options = {
		// isCaseSensitive: false,
		// includeScore: false,
		// shouldSort: true,
		// includeMatches: false,
		// findAllMatches: false,
		// minMatchCharLength: 4,
		// location: 0,
		// threshold: 0.6,
		// distance: 100,
		// useExtendedSearch: false,
		// ignoreLocation: false,
		// ignoreFieldNorm: false,
		// fieldNormWeight: 1,
		keys: ['title.rendered'],
	};

	// const postsTitles = await preparePosts(posts);
	// const fuse = new Fuse(postsTitles);

	const fuse = new Fuse(posts, options);
	const results = fuse.search(query);
	console.log(results);

	// const title = results[0].item;

	for (result of results) {
		const title = result.item.title.rendered;
		buildElement(title, '.no-results');
	}
};

const url = window.location.href;
const query = url.match(/\?s=(.*)/)[1];

fuzzysearch(query);
