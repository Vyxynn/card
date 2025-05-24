const userId = "694320507645984769";
const endpoint = `https://api.lanyard.rest/v1/users/${userId}`;

fetch(endpoint)
    .then(res => res.json())
    .then(data => {
        const activities = data.data.activities;

        if (!activities.length) {
            document.getElementById("activity").innerHTML = "<p>No current activity 😴</p>";
            return;
        }

        const list = activities.slice(0, 3).map(act => {
            const name = act.name;
            const details = act.details || '';
            const state = act.state || '';
            const startTime = act.timestamps?.start
                ? new Date(act.timestamps.start).toLocaleTimeString()
                : null;

            return `
                <li style="margin-bottom: 1em;">
                    <strong>${name}</strong><br>
                    ${details ? `<em>${details}</em><br>` : ''}
                    ${state ? `<span>${state}</span><br>` : ''}
                    ${startTime ? `<small>Started at: ${startTime}</small>` : ''}
                </li>
            `;
        }).join("");

        document.getElementById("activity").innerHTML = `<ul style="list-style-type: none; padding: 0;">${list}</ul>`;
    })
    .catch(err => {
        document.getElementById("activity").innerHTML = "<p>Error fetching activity</p>";
        console.error(err);
    });
