function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    $("#name").text(profile.getName());
    $("#email").text(profile.getEmail());
    $("#image").attr('src', profile.getImageUrl());
    $(".data").css("display", "block");
    $(".g-signin2").css("display", "none");

    // Store user data in localStorage
    localStorage.setItem("userName", profile.getName());
    localStorage.setItem("userEmail", profile.getEmail());
    localStorage.setItem("userImage", profile.getImageUrl());

    setTimeout(() => {
        window.location.href = "video_player.html";
    }, 2000);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        alert("You have been signed out successfully");
        $(".g-signin2").css("display", "block");
        $(".data").css("display", "none");

        // Clear local storage
        localStorage.clear();
        window.location.href = "index.html";
    });
}

function loadUserData() {
    document.getElementById("userName").innerText = localStorage.getItem("userName") || "Guest";
}

// Video Player Functions
function playVideo() {
    let url = document.getElementById('videoUrl').value;
    let videoFrame = document.getElementById('videoFrame');
    let subtitleDisplay = document.getElementById('subtitleDisplay');

    subtitleDisplay.innerText = "Loading subtitles...";

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
        fetchSubtitles(url);
    } else if (url.includes('facebook.com')) {
        videoFrame.src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
        fetchSubtitles(url);
    } else if (url.includes('instagram.com')) {
        videoFrame.src = `https://www.instagram.com/p/${url.split('/p/')[1]?.split('/')[0]}/embed/`;
        fetchSubtitles(url);
    } else {
        subtitleDisplay.innerText = "No subtitles available";
    }
}

// Fetch subtitles using an API
async function fetchSubtitles(videoUrl) {
    let subtitleDisplay = document.getElementById('subtitleDisplay');
    subtitleDisplay.innerText = "Fetching subtitles...";

    try {
        let response = await fetch("http://127.0.0.1:8000/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: videoUrl })
        });

        let data = await response.json();
        subtitleDisplay.innerText = data.subtitles || "No subtitles available.";
    } catch (error) {
        subtitleDisplay.innerText = "Error fetching subtitles.";
    }
}
