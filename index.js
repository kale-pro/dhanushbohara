       // Theme Toggle Functionality
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        const savedTheme = localStorage.getItem('theme') || 'dark';
        body.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            themeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', newTheme);
        });

        // Photo Gallery Data
        const images = [
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/1709123191724.jpg",
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/IMG-20230429-WA0004.jpg",
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/1725349768824.jpg",
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/1724945586223.jpg",
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/1712622553138.jpg",
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/IMG_20240417_171412.jpg",
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/dhanush-1.jpg",
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/1708085922690.jpg",
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/1704016540957.jpg",
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/IMG_20240311_124808.jpg",
            "https://raw.githubusercontent.com/Kale-Pro/dhanushbohara/main/1695652800202.jpg"
        ];

        const captions = [
            "Thinking about my future.",
            "Chilling with friends!",
            "Exploring nature today!",
            "Feeling on top of the world!",
            "A moment of peace.",
            "Enjoying a sunny day!",
            "Memories that last forever.",
            "Taking a break from coding!",
            "Adventure awaits!",
            "Just another day in paradise.",
            "Living my best life!"
        ];

        let currentIndex = 0;
        const photoGallery = document.getElementById("photoGallery");
        const fullscreenModal = document.getElementById("fullscreenModal");
        const fullscreenImage = document.getElementById("fullscreenImage");

        // Calculate max frames based on viewport width
        function getMaxFrames() {
            const width = window.innerWidth;
            if (width <= 480) return 1;
            if (width <= 768) return 1;
            if (width <= 1024) return 2;
            return 3;
        }

        let maxFrames = getMaxFrames();

        // Interaction data for likes, favorites, and comments
        let interactionData = images.map(() => ({
            likes: 0,
            hasLiked: false,
            favorites: 0,
            favorited: false,
            comments: [] // Now stores { text: string, user: string }
        }));

        // Load interaction data from localStorage
        function loadInteractionData() {
            const savedData = localStorage.getItem('photoGalleryInteractions');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (parsedData.length === images.length) {
                    interactionData = parsedData;
                }
            }
        }

        // Save interaction data to localStorage
        function saveInteractionData() {
            localStorage.setItem('photoGalleryInteractions', JSON.stringify(interactionData));
        }

        loadInteractionData();

        // Check if user is logged in
        function isLoggedIn() {
            return !!localStorage.getItem('loggedInUser');
        }

        // Get current logged-in user
        function getCurrentUser() {
            return localStorage.getItem('loggedInUser') || null;
        }

        // Display photos in the gallery
        function displayPhotos() {
            maxFrames = getMaxFrames();
            photoGallery.classList.add("loading");
            setTimeout(() => {
                photoGallery.innerHTML = "";
                photoGallery.classList.remove("loading");
                for (let i = 0; i < maxFrames; i++) {
                    const index = (currentIndex + i) % images.length;
                    if (images[index]) {
                        const frame = document.createElement("div");
                        frame.className = "photo-frame";
                        frame.setAttribute("data-index", index);
                        // Check login status to determine comment section visibility
                        const isUserLoggedIn = isLoggedIn();
                        const commentSectionContent = isUserLoggedIn
                            ? `
                                <!-- Comment Section with Close Button -->
                                <div class="comment-section">
                                    <div class="comments-list"></div>
                                    <div class="comment-input-container">
                                        <input type="text" class="comment-input" placeholder="Write a comment...">
                                        <button class="comment-post-btn">Post</button>
                                        <button class="comment-close-btn">Close</button>
                                    </div>
                                </div>
                            `
                            : `
                                <!-- Login Prompt for Non-Logged-In Users -->
                                <div class="login-prompt">
                                    Please <a href="https://kale-pro.github.io/dhanushbohara/login.html">log in</a> to comment.
                                </div>
                            `;
                        frame.innerHTML = `
                            <!-- Caption Area -->
                            <div class="caption-area">
                                <img src="https://raw.githubusercontent.com/kale-pro/dhanushbohara/main/d-lofo.jpg" alt="Profile" class="profile-pic">
                                <div class="caption-content">
                                    <p>${captions[index]}</p>
                                    <div class="caption-meta">15 Feb 2024</div>
                                </div>
                            </div>
                            <div class="screen-content">
                                <img src="${images[index]}" alt="Photo ${index + 1}" loading="lazy">
                            </div>
                            <div class="iphone-notch"></div>
                            <div class="iphone-speaker"></div>
                            <div class="iphone-camera"></div>
                            <div class="iphone-power-button"></div>
                            <div class="iphone-volume-buttons">
                                <div class="iphone-volume-up"></div>
                                <div class="iphone-volume-down"></div>
                            </div>
                            <div class="iphone-silent-switch"></div>
                            <!-- Social Interaction Buttons -->
                            <div class="social-interaction">
                                <button class="interaction-btn like-btn ${interactionData[index].hasLiked ? 'active disabled' : ''}">
                                    <i class="fas fa-heart"></i>
                                    <span>${interactionData[index].likes}</span>
                                </button>
                                <button class="interaction-btn comment-btn ${!isUserLoggedIn ? 'disabled' : ''}">
                                    <i class="fas fa-comment"></i>
                                    <span>${interactionData[index].comments.length}</span>
                                </button>
                                <button class="interaction-btn favorite-btn ${interactionData[index].favorited ? 'active' : ''}">
                                    <i class="fas fa-star"></i>
                                    <span>${interactionData[index].favorites}</span>
                                </button>
                            </div>
                            ${commentSectionContent}
                        `;
                        const img = frame.querySelector(".screen-content img");
                        img.addEventListener('click', () => {
                            fullscreenImage.src = images[index];
                            fullscreenModal.style.display = 'flex';
                        });

                        const profilePic = frame.querySelector(".profile-pic");
                        profilePic.addEventListener('click', () => {
                            window.location.href = "https://kale-pro.github.io/dhanushbohara/profile.html";
                        });

                        // Like Button Functionality
                        const likeBtn = frame.querySelector(".like-btn");
                        if (!interactionData[index].hasLiked) {
                            likeBtn.addEventListener('click', () => {
                                interactionData[index].likes += 1;
                                interactionData[index].hasLiked = true;
                                likeBtn.querySelector("span").textContent = interactionData[index].likes;
                                likeBtn.classList.add("active", "disabled");
                                saveInteractionData();
                            });
                        }

                        // Comment Button Functionality (Only for logged-in users)
                        const commentBtn = frame.querySelector(".comment-btn");
                        if (isUserLoggedIn) {
                            const commentSection = frame.querySelector(".comment-section");
                            const commentInput = frame.querySelector(".comment-input");
                            const commentPostBtn = frame.querySelector(".comment-post-btn");
                            const commentCloseBtn = frame.querySelector(".comment-close-btn");
                            const commentsList = frame.querySelector(".comments-list");

                            commentBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                commentSection.classList.add("active");
                            });

                            commentCloseBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                commentSection.classList.remove("active");
                                commentInput.value = "";
                            });

                            // Add Comment with Edit/Delete Options (Restricted to Owner)
                            const addComment = () => {
                                if (commentInput.value.trim()) {
                                    const currentUser = getCurrentUser();
                                    interactionData[index].comments.push({
                                        text: commentInput.value.trim(),
                                        user: currentUser
                                    });
                                    const comment = document.createElement("div");
                                    comment.className = "comment";
                                    const commentText = commentInput.value.trim();
                                    // Only show edit/delete buttons if the comment belongs to the current user
                                    const commentActions = currentUser
                                        ? `
                                            <div class="comment-actions">
                                                <button class="comment-action-btn edit-btn">Edit</button>
                                                <button class="comment-action-btn delete-btn">Delete</button>
                                            </div>
                                        `
                                        : '';
                                    comment.innerHTML = `
                                        <span class="comment-text">${commentText} (by ${currentUser})</span>
                                        ${commentActions}
                                    `;
                                    commentsList.appendChild(comment);
                                    commentBtn.querySelector("span").textContent = interactionData[index].comments.length;
                                    commentInput.value = "";
                                    commentSection.classList.remove("active"); // Hide comment section after posting
                                    saveInteractionData();

                                    // Edit Comment Functionality (Only for Owner)
                                    if (currentUser) {
                                        const editBtn = comment.querySelector(".edit-btn");
                                        editBtn.addEventListener('click', () => {
                                            commentInput.value = commentText;
                                            commentPostBtn.textContent = "Update";
                                            commentPostBtn.onclick = () => {
                                                if (commentInput.value.trim()) {
                                                    const commentIndex = interactionData[index].comments.findIndex(
                                                        c => c.text === commentText && c.user === currentUser
                                                    );
                                                    if (commentIndex !== -1) {
                                                        interactionData[index].comments[commentIndex].text = commentInput.value.trim();
                                                        comment.querySelector(".comment-text").textContent = `${commentInput.value.trim()} (by ${currentUser})`;
                                                        saveInteractionData();
                                                    }
                                                    commentInput.value = "";
                                                    commentPostBtn.textContent = "Post";
                                                    commentPostBtn.onclick = addComment;
                                                    commentSection.classList.remove("active");
                                                }
                                            };
                                        });

                                        // Delete Comment Functionality (Only for Owner)
                                        const deleteBtn = comment.querySelector(".delete-btn");
                                        deleteBtn.addEventListener('click', () => {
                                            const commentIndex = interactionData[index].comments.findIndex(
                                                c => c.text === commentText && c.user === currentUser
                                            );
                                            if (commentIndex !== -1) {
                                                interactionData[index].comments.splice(commentIndex, 1);
                                                comment.remove();
                                                commentBtn.queryLPrompt.querySelector("span").textContent = interactionData[index].comments.length;
                                                saveInteractionData();
                                            }
                                        });
                                    }
                                }
                            };

                            commentInput.addEventListener('keypress', (e) => {
                                if (e.key === 'Enter') {
                                    addComment();
                                }
                            });

                            commentPostBtn.addEventListener('click', addComment);

                            // Load existing comments with Edit/Delete options (Restricted to Owner)
                            interactionData[index].comments.forEach((commentObj, commentIdx) => {
                                const comment = document.createElement("div");
                                comment.className = "comment";
                                const currentUser = getCurrentUser();
                                // Only show edit/delete buttons if the comment belongs to the current user
                                const commentActions = commentObj.user === currentUser
                                    ? `
                                        <div class="comment-actions">
                                            <button class="comment-action-btn edit-btn">Edit</button>
                                            <button class="comment-action-btn delete-btn">Delete</button>
                                        </div>
                                    `
                                    : '';
                                comment.innerHTML = `
                                    <span class="comment-text">${commentObj.text} (by ${commentObj.user})</span>
                                    ${commentActions}
                                `;
                                commentsList.appendChild(comment);

                                // Edit Comment Functionality (Only for Owner)
                                if (commentObj.user === currentUser) {
                                    const editBtn = comment.querySelector(".edit-btn");
                                    editBtn.addEventListener('click', () => {
                                        commentInput.value = commentObj.text;
                                        commentPostBtn.textContent = "Update";
                                        commentPostBtn.onclick = () => {
                                            if (commentInput.value.trim()) {
                                                interactionData[index].comments[commentIdx].text = commentInput.value.trim();
                                                comment.querySelector(".comment-text").textContent = `${commentInput.value.trim()} (by ${commentObj.user})`;
                                                saveInteractionData();
                                                commentInput.value = "";
                                                commentPostBtn.textContent = "Post";
                                                commentPostBtn.onclick = addComment;
                                                commentSection.classList.remove("active");
                                            }
                                        };
                                    });

                                    // Delete Comment Functionality (Only for Owner)
                                    const deleteBtn = comment.querySelector(".delete-btn");
                                    deleteBtn.addEventListener('click', () => {
                                        interactionData[index].comments.splice(commentIdx, 1);
                                        comment.remove();
                                        commentBtn.querySelector("span").textContent = interactionData[index].comments.length;
                                        saveInteractionData();
                                    });
                                }
                            });
                        }

                        // Favorite Button Functionality
                        const favoriteBtn = frame.querySelector(".favorite-btn");
                        favoriteBtn.addEventListener('click', () => {
                            interactionData[index].favorited = !interactionData[index].favorited;
                            if (interactionData[index].favorited) {
                                interactionData[index].favorites += 1;
                            } else {
                                interactionData[index].favorites = Math.max(0, interactionData[index].favorites - 1);
                            }
                            favoriteBtn.classList.toggle("active");
                            favoriteBtn.querySelector("span").textContent = interactionData[index].favorites;
                            saveInteractionData();
                        });

                        photoGallery.appendChild(frame);
                    }
                }
            }, 300);
        }

        // Navigate to next set of photos
        function nextPhotos() {
            if (images.length <= maxFrames) return;
            currentIndex = (currentIndex + 1) % images.length;
            displayPhotos();
        }

        // Navigate to previous set of photos
        function previousPhotos() {
            if (images.length <= maxFrames) return;
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            displayPhotos();
        }

        // Close fullscreen modal
        function closeFullscreenModal() {
            fullscreenModal.style.display = 'none';
            fullscreenImage.src = '';
        }

        fullscreenModal.addEventListener('click', (e) => {
            if (e.target === fullscreenModal) {
                closeFullscreenModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && fullscreenModal.style.display === 'flex') {
                closeFullscreenModal();
            }
        });

        window.addEventListener('load', () => {
            fullscreenModal.style.display = 'none';
            displayPhotos();
        });

        window.addEventListener("resize", () => {
            maxFrames = getMaxFrames();
            displayPhotos();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") nextPhotos();
            else if (event.key === "ArrowLeft") previousPhotos();
        });

        // Drag/Swipe Support
        let isDragging = false;
        let startX;

        photoGallery.addEventListener("mousedown", (e) => {
            if (e.target.closest('.comment-section')) return;
            isDragging = true;
            photoGallery.classList.add("dragging");
            startX = e.pageX;
        });

        photoGallery.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = x - startX;
            if (walk > 50) {
                previousPhotos();
                isDragging = false;
            } else if (walk < -50) {
                nextPhotos();
                isDragging = false;
            }
        });

        photoGallery.addEventListener("mouseup", () => {
            isDragging = false;
            photoGallery.classList.remove("dragging");
        });

        photoGallery.addEventListener("mouseleave", () => {
            isDragging = false;
            photoGallery.classList.remove("dragging");
        });

        photoGallery.addEventListener("touchstart", (e) => {
            if (e.target.closest('.comment-section')) return;
            isDragging = true;
            startX = e.touches[0].pageX;
        });

        photoGallery.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            if (e.target.closest('.comment-section')) return;
            e.preventDefault();
            const x = e.touches[0].pageX;
            const walk = x - startX;
            if (walk > 30) {
                previousPhotos();
                isDragging = false;
            } else if (walk < -30) {
                nextPhotos();
                isDragging = false;
            }
        });

        photoGallery.addEventListener("touchend", () => {
            isDragging = false;
        });

        // Initialize AOS for animations
        AOS.init({
            duration: 1000,
            once: true
        });

        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }); 
         // Particle Background
         particlesJS('particles-js', {
                particles: {
                    number: { value: 80 },
                    color: { value: '#ffffff' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5 },
                    size: { value: 3 },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        resize: true
                    }
                }
            });
           // Sample content to search from (replace this with your actual content source)
           const contentData = [
                "Dhanush Bohara is a motivated and self-driven tech enthusiast with a growing interest in software development and modern programming.",
                "He is passionate about building practical projects and experimenting with code.",
                "Recently, he completed a step-wise HTML-based mini project and is currently developing his own advanced personal portfolio website.",
                "Dhanush believes in learning by doing and enjoys breaking down complex problems into simple solutions.",
                "In addition to programming, he follows technology trends and takes inspiration from open-source communities."
            ];

            // Search Functionality
            document.getElementById('buttons').addEventListener('click', function() {
                const query = document.getElementById('search').value.toLowerCase().trim();
                const searchResults = document.getElementById('searchResults');
                
                // Clear previous results
                searchResults.innerHTML = '';
                
                // Check if query is empty
                if (!query) {
                    searchResults.innerHTML = '<p class="no-results">Please enter a search term.</p>';
                    searchResults.classList.add('active');
                    return;
                }

                // Search through content
                let resultsFound = false;
                contentData.forEach((item, index) => {
                    if (item.toLowerCase().includes(query)) {
                        searchResults.innerHTML += `<p>${item}</p>`;
                        resultsFound = true;
                    }
                });

                // Display results or no-results message
                if (!resultsFound) {
                    searchResults.innerHTML = '<p class="no-results">Sorry!! No results found.</p>';
                }
                
                // Show the results container
                searchResults.classList.add('active');
            });

            // Clear results when clicking outside the search bar or results
            document.addEventListener('click', function(e) {
                const searchContainer = document.querySelector('.search-container');
                const searchResults = document.getElementById('searchResults');
                if (!searchContainer.contains(e.target) && !searchResults.contains(e.target)) {
                    searchResults.classList.remove('active');
                }
            });
            // project section 
                    document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // Mouse X relative to card
                const y = e.clientY - rect.top;  // Mouse Y relative to card
                const width = rect.width;
                const height = rect.height;

                // Normalize mouse position to [-1, 1] for each axis
                const normX = (x / width) * 2 - 1; // -1 (left) to 1 (right)
                const normY = (y / height) * 2 - 1; // -1 (top) to 1 (bottom)

                // Calculate tilt angles (max 5 degrees for slightly more movement)
                const tiltX = normY * 5; // Tilt up/down based on Y position
                const tiltY = -normX * 5; // Tilt left/right based on X position

                // Apply transform
                card.classList.add('tilt');
                card.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                // Reset transform on mouse leave
                card.classList.remove('tilt');
                card.style.transform = 'translateY(0)';
            });

            // Fallback for touch devices
            card.addEventListener('touchstart', () => {
                card.style.transform = 'translateY(-4px) scale(1.02)';
            });
            card.addEventListener('touchend', () => {
                card.style.transform = 'translateY(0)';
            });
          });

            document.addEventListener('DOMContentLoaded', () => {
                const section = document.querySelector('.projects-section');
                const cards = document.querySelectorAll('.project-card');

                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            section.classList.add('visible');
                            cards.forEach(card => card.classList.add('visible'));
                            observer.unobserve(section); // Stop observing after animation
                        }
                    });
                }, {
                    threshold: 0.2 // Trigger when 20% of section is visible
                });

                observer.observe(section);
            });

            // Comment Form Submission
            document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('commentForm');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Thank you so much for your valuable comment! We have successfully received your feedback and truly appreciate the time you took to share your thoughts with us';
    successMessage.style.display = 'none'; // Hidden by default
    commentForm.parentNode.appendChild(successMessage); // Add to DOM

    commentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitButton = commentForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        // Collect form data
        const formData = new FormData(commentForm);

        try {
            // Submit to Formspree via fetch
            const response = await fetch(commentForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                successMessage.style.display = 'block';
                commentForm.style.display = 'none'; // Hide form
                commentForm.reset(); // Reset form

                // Optional: Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    commentForm.style.display = 'block'; // Show form again
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            submitButton.disabled = false; // Re-enable button
        }
    });
});
        
