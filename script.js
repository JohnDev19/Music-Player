        const playPauseBtn = document.getElementById('playPauseBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const shuffleRepeatBtn = document.getElementById('shuffleRepeatBtn');
        const favoriteBtn = document.querySelector('.favorite');
        const playlistToggle = document.querySelector('.playlist-toggle');
        const vinyl = document.querySelector('.vinyl');
        const title = document.querySelector('.title');
        const artist = document.querySelector('.artist');
        const progressBar = document.querySelector('.progress-bar');
        const progress = document.querySelector('.progress');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        const playlist = document.querySelector('.playlist');

        const songs = [
            { title: 'Need 2', artist: 'Pine Grove', src: 'songs/Pinegrove - Need_2.mp3' },
            { title: 'Lucky Love', artist: 'Michael Seyer', src: 'songs/Michael_Seyer - Lucky_Love.mp3' },
            { title: 'Mirai E', artist: 'Kiroro', src: 'songs/Mirai_E - Kiroro.mp3' },
            { title: 'Beige', artist: 'Yoke Lore', src: 'songs/Beige - Yoke_Lore.mp3' },
            { title: 'Someone to Spend Time With', artist: 'Los Retros', src: 'songs/Someone_To_Spend_Time_With - Los_Retros.mp3' },
            { title: 'Symphonia IX', artist: 'Nick Rattigan', src: 'songs/Symphonia_IX.mp3' },
            { title: 'Red Love', artist: 'Dream Ivory', src: 'songs/Read_love - Dream_ivory.mp3' }
        ];

        let currentSongIndex = 0;
        let audio = new Audio(songs[currentSongIndex].src);
        let isShuffled = false;
        let isRepeating = false;

        function updateSong() {
            audio.src = songs[currentSongIndex].src;
            title.textContent = songs[currentSongIndex].title;
            artist.textContent = songs[currentSongIndex].artist;
            updatePlaylist();
        }

        function togglePlayPause() {
            if (audio.paused) {
                audio.play();
                vinyl.classList.add('playing');
                playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
            } else {
                audio.pause();
                vinyl.classList.remove('playing');
                playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
            }
        }

        function toggleShuffleRepeat() {
            if (!isShuffled && !isRepeating) {
                isShuffled = true;
                shuffleRepeatBtn.innerHTML = '<i class="bi bi-shuffle"></i>';
            } else if (isShuffled && !isRepeating) {
                isShuffled = false;
                isRepeating = true;
                shuffleRepeatBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i>';
            } else {
                isShuffled = false;
                isRepeating = false;
                shuffleRepeatBtn.innerHTML = '<i class="bi bi-music-note-list"></i>';
            }
        }

        function toggleFavorite() {
            favoriteBtn.classList.toggle('active');
            favoriteBtn.innerHTML = favoriteBtn.classList.contains('active') ? 
                '<i class="bi bi-heart-fill"></i>' : '<i class="bi bi-heart"></i>';
        }

        function togglePlaylist() {
            playlist.classList.toggle('show');
        }

        function updatePlaylist() {
            playlist.innerHTML = '';
            songs.forEach((song, index) => {
                const item = document.createElement('div');
                item.classList.add('playlist-item');
                if (index === currentSongIndex) {
                    item.classList.add('active');
                }
                item.textContent = `${song.title} - ${song.artist}`;
                item.addEventListener('click', () => {
                    currentSongIndex = index;
                    updateSong();
                    togglePlayPause();
                    togglePlaylist();
                });
                playlist.appendChild(item);
            });
        }

        playPauseBtn.addEventListener('click', togglePlayPause);
        shuffleRepeatBtn.addEventListener('click', toggleShuffleRepeat);
        favoriteBtn.addEventListener('click', toggleFavorite);
        playlistToggle.addEventListener('click', togglePlaylist);

        prevBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            updateSong();
            togglePlayPause();
        });

        nextBtn.addEventListener('click', () => {
            if (isShuffled) {
                currentSongIndex = Math.floor(Math.random() * songs.length);
            } else {
                currentSongIndex = (currentSongIndex + 1) % songs.length;
            }
            updateSong();
            togglePlayPause();
        });

        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        audio.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('ended', () => {
            if (isRepeating) {
                audio.currentTime = 0;
                audio.play();
            } else if (isShuffled) {
                currentSongIndex = Math.floor(Math.random() * songs.length);
                updateSong();
                audio.play();
            } else {
                currentSongIndex = (currentSongIndex + 1) % songs.length;
                updateSong();
                audio.play();
            }
        });

        progress.addEventListener('click', (e) => {
            const progressWidth = progress.clientWidth;
            const clickPosition = e.offsetX;
            const clickPercentage = clickPosition / progressWidth;
            audio.currentTime = clickPercentage * audio.duration;
        });

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }

        updateSong();
        updatePlaylist();