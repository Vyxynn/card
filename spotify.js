const apiKey = "ac9f54f6cbde626326a1f8f6b6aab7b8";
const username = "vyxynn";

let refreshInterval = 60; // seconds
let countdown = refreshInterval;
let refreshTimer;

async function fetchTopArtists() {
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${apiKey}&format=json&period=1month&limit=3`);
    const data = await res.json();
    return data.topartists.artist.map(a => ({
        name: a.name,
        url: a.url
    }));
}

async function fetchTopTracks() {
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${apiKey}&format=json&period=1month&limit=3`);
    const data = await res.json();
    return data.toptracks.track.map(t => ({
        title: t.name,
        artist: t.artist.name,
        url: t.url
    }));
}

async function fetchDeezerArtistImage(artistName) {
    try {
        const deezerUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}`;
        const res = await fetch(`https://deezer-proxy-psi.vercel.app/api/deezer?url=${encodeURIComponent(deezerUrl)}`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            return data.data[0].picture_medium;
        }
    } catch (e) {
        console.warn("Deezer artist image fetch failed for", artistName, e);
    }
    return null;
}

async function fetchDeezerTrackInfo(trackTitle, artistName) {
    try {
        const query = encodeURIComponent(`${trackTitle} ${artistName}`);
        const deezerUrl = `https://api.deezer.com/search?q=${query}`;
        const res = await fetch(`https://deezer-proxy-psi.vercel.app/api/deezer?url=${encodeURIComponent(deezerUrl)}`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            const track = data.data[0];
            return {
                albumCover: track.album.cover_medium,
                albumName: track.album.title
            };
        }
    } catch (e) {
        console.warn("Deezer track info fetch failed for", trackTitle, artistName, e);
    }
    return { albumCover: null, albumName: "Unknown Album" };
}

async function displayData() {
    const artists = await fetchTopArtists();
    const tracks = await fetchTopTracks();

    const artistList = document.getElementById("spotifyArtists");
    const trackList = document.getElementById("spotifySongs");

    //build artist cards
    artistList.innerHTML = ""; // Clear existing content
    for (const artist of artists) {
        const imgUrl = await fetchDeezerArtistImage(artist.name);
        const link = document.createElement("a");
        link.href = artist.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const card = document.createElement("div");
        card.className = "spotifyArtist";

        const img = document.createElement("img");
        img.src = imgUrl || "./assets/artistPlaceholder.jpg";
        img.alt = artist.name;

        const p = document.createElement("p");
        p.textContent = artist.name;

        card.appendChild(img);
        card.appendChild(p);
        link.appendChild(card);
        artistList.appendChild(link);
    }

    // Build track cards
    trackList.innerHTML = ""; // Clear existing content
    for (const track of tracks) {
        const info = await fetchDeezerTrackInfo(track.title, track.artist);
        const link = document.createElement("a");
        link.href = track.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const card = document.createElement("div");
        card.className = "spotifySong";

        const img = document.createElement("img");
        img.src = info.albumCover || "./assets/albumPlaceholder.png";
        img.alt = info.albumName;

        const infoDiv = document.createElement("div");
        infoDiv.className = "trackInfo";

        const title = document.createElement("p");
        title.textContent = track.title;

        const artist = document.createElement("p");
        artist.textContent = track.artist;

        const album = document.createElement("p");
        album.textContent = info.albumName;

        infoDiv.appendChild(title);
        infoDiv.appendChild(artist);
        infoDiv.appendChild(album);
        card.appendChild(img);
        card.appendChild(infoDiv);
        link.appendChild(card);
        trackList.appendChild(link);
    }
}

function startAutoRefresh() {
    refreshTimer = setInterval(() => {
    countdown--;
    document.getElementById("countdown").textContent = `Next refresh in ${countdown}s`;

    if (countdown <= 0) {
        countdown = refreshInterval;
        displayData();
    }
    }, 1000);
}

displayData();
startAutoRefresh();
