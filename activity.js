const userId = "694320507645984769";
const endpoint = `https://api.lanyard.rest/v1/users/${userId}`;

function fetchActivities() {
    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            const activities = data.data.activities;

            if (!activities.length) {
                document.getElementById("discordActivity").style.display = "none";
                return;
            }

            document.getElementById("discordActivity").style.display = "block";
            document.getElementById("discordActivity").style.display = "flex";
            document.getElementById("discordActivity").justifyContent = "center";
            document.getElementById("discordActivity").alignItems = "center";

            const list = activities.slice(0, 3).map(act => {
                const name = act.name;
                const details = act.details || '';
                const state = act.state || '';
                const startTime = act.timestamps?.start
                    ? new Date(act.timestamps.start).toLocaleTimeString()
                    : null;

                const largeImage = act.assets?.large_image;
                let imageUrl = "";

                if (largeImage) {
                    if (largeImage.startsWith("spotify:")) {
                        const spotifyHash = largeImage.split(":")[1];
                        imageUrl = `https://i.scdn.co/image/${spotifyHash}`;
                    } else if (largeImage.startsWith("mp:external")) {
                        imageUrl = `https://media.discordapp.net/${largeImage.replace("mp:", "")}`;
                    } else {
                        const appId = act.application_id;
                        imageUrl = `https://cdn.discordapp.com/app-assets/${appId}/${largeImage}.png`;
                    }
                }

                return `
                    <li style="margin-bottom: 1em; display: flex; align-items: center;">
                        ${imageUrl ? `<img src="${imageUrl}" alt="${name} image" style="height: 64px; width: auto; border-radius: 8px; margin-right: 10px;">` : ''}
                        <div>
                            <strong>${name}</strong><br>
                            ${details ? `<em>${details}</em><br>` : ''}
                            ${state ? `<span>${state}</span><br>` : ''}
                            ${startTime ? `<small>Started at: ${startTime}</small>` : ''}
                        </div>
                    </li>
                `;
            }).join("");

            document.getElementById("activity").innerHTML = `<ul style="list-style-type: none; padding: 0;">${list}</ul>`;
        })
        .catch(err => {
            document.getElementById("activity").innerHTML = "<p>Error fetching activity</p>";
            console.error(err);
        });
}

// Initial fetch
fetchActivities();

// Re-fetch every 60 seconds (60000 ms)
setInterval(fetchActivities, 60000);

