
/**
Gopal kataria, © 2020

VERSION x.0 WILL NEVER BE PUSHED TO USERS WITHOUT TESTING AND UPDATING TO VER x.1

I have a very diffrent updating technique
updateis released in parts with a final change in the service worker
versioning system is as {year}{month}.{date}.{hour}.{min}
replace year, month , date , hour and min with actual values
** NOTE : NO SPACE IN YEAR AND MONTH , ONLY LAST TWO NUMBERS OF YEAR


*/


// This is the "Offline copy of pages" service worker

const CACHE = "physiczard.2002.23.16.32";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "index.html";
const offlineFallbackPage = "index.html";

// Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", function (event) {
    console.log("[PWA Builder] Install Event processing");

    event.waitUntil(
        caches.open(CACHE).then(function (cache) {
            console.log("[PWA Builder] Cached offline page during install");

            if (offlineFallbackPage === "ToDo-replace-this-name.html") {
                return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
            }

            return cache.add(offlineFallbackPage);
        })
    );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then(function (response) {
                console.log("[PWA Builder] add page to offline cache: " + response.url);

                // If request was success, add or update it in the cache
                event.waitUntil(updateCache(event.request, response.clone()));

                return response;
            })
            .catch(function (error) {
                console.log("[PWA Builder] Network request Failed. Serving content from cache: " + error);
                return fromCache(event.request);
            })
    );
});

function fromCache(request) {
    // Check to see if you have it in the cache
    // Return response
    // If not in the cache, then return error page
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status === 404) {
                return Promise.reject("no-match");
            }

            return matching;
        });
    });
}

function updateCache(request, response) {
    return caches.open(CACHE).then(function (cache) {
        return cache.put(request, response);
    });
}
