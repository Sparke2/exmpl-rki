/**
 * Аудио-аккордеон и кастомный плеер.
 */
(function () {
    'use strict';

    var audioEl = null;
    var currentTrack = null;
    var SPEEDS = [0.5, 1, 1.25, 1.5, 2];
    var currentSpeedIndex = 1;

    function pad(num) {
        return num < 10 ? '0' + num : String(num);
    }

    function formatTime(sec) {
        if (!isFinite(sec) || sec < 0) return '0:00';
        var m = Math.floor(sec / 60);
        var s = Math.floor(sec % 60);
        return m + ':' + pad(s);
    }

    function getOrCreateAudio() {
        if (!audioEl) {
            audioEl = document.createElement('audio');
            audioEl.preload = 'metadata';
            audioEl.volume = 1;
        }
        return audioEl;
    }

    function syncSpeedUI() {
        var label = SPEEDS[currentSpeedIndex] === 1 ? '1x' : SPEEDS[currentSpeedIndex] + 'x';
        document.querySelectorAll('.audio-track__speed').forEach(function (btn) {
            btn.textContent = label;
        });
    }

    function syncVolumeUI() {
        var a = getOrCreateAudio();
        var pct = Math.round(a.volume * 100);
        document.querySelectorAll('.audio-track__volume-input').forEach(function (input) {
            input.value = pct;
        });
    }

    function switchToTrack(trackRow) {
        if (currentTrack && currentTrack !== trackRow) {
            currentTrack.classList.remove('is-playing');
            var prevPlay = currentTrack.querySelector('.audio-track__play-icon');
            var prevPause = currentTrack.querySelector('.audio-track__pause-icon');
            if (prevPlay) prevPlay.hidden = false;
            if (prevPause) prevPause.hidden = true;
        }
        currentTrack = trackRow;
    }

    function updatePlayPauseUI(trackRow, playing) {
        var playIcon = trackRow.querySelector('.audio-track__play-icon');
        var pauseIcon = trackRow.querySelector('.audio-track__pause-icon');
        if (playIcon) playIcon.hidden = !!playing;
        if (pauseIcon) pauseIcon.hidden = !playing;
        trackRow.classList.toggle('is-playing', playing);
    }

    function updateTime(trackRow, current, duration) {
        var timeEl = trackRow.querySelector('.audio-track__time');
        if (timeEl) timeEl.textContent = formatTime(current) + ' / ' + formatTime(duration);
    }

    function updateProgress(trackRow, percent) {
        var fill = trackRow.querySelector('.audio-track__progress-fill');
        if (fill) fill.style.width = (percent || 0) + '%';
    }

    function playTrack(trackRow) {
        var src = trackRow.getAttribute('data-src');
        if (!src) return;

        var a = getOrCreateAudio();

        if (currentTrack === trackRow) {
            if (a.paused) {
                a.playbackRate = SPEEDS[currentSpeedIndex];
                a.play().catch(function () {});
                updatePlayPauseUI(trackRow, true);
            } else {
                a.pause();
                updatePlayPauseUI(trackRow, false);
            }
            return;
        }

        switchToTrack(trackRow);
        a.src = src;
        a.playbackRate = SPEEDS[currentSpeedIndex];
        a.load();
        a.play().catch(function () {});
        updatePlayPauseUI(trackRow, true);
    }

    function seekTrack(trackRow, percent) {
        var a = getOrCreateAudio();
        if (!a.duration || !isFinite(a.duration)) return;
        a.currentTime = (percent / 100) * a.duration;
    }

    function initAccordion() {
        document.querySelectorAll('.audio-lesson__header[data-accordion-toggle]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var expanded = btn.getAttribute('aria-expanded') === 'true';
                var bodyId = btn.getAttribute('aria-controls');
                var body = bodyId ? document.getElementById(bodyId) : null;

                expanded = !expanded;
                btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                if (body) body.hidden = !expanded;
            });
        });
    }

    function initPlayers() {
        document.querySelectorAll('.audio-track[data-src]').forEach(function (trackRow) {
            var playBtn = trackRow.querySelector('.audio-track__play');
            var progressBar = trackRow.querySelector('.audio-track__progress');

            if (playBtn) {
                playBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    playTrack(trackRow);
                });
            }

            if (progressBar) {
                progressBar.addEventListener('click', function (e) {
                    if (currentTrack !== trackRow) return;
                    var rect = progressBar.getBoundingClientRect();
                    var x = e.clientX - rect.left;
                    var pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    seekTrack(trackRow, pct);
                });
            }

            var speedBtn = trackRow.querySelector('.audio-track__speed');
            if (speedBtn) {
                speedBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    currentSpeedIndex = (currentSpeedIndex + 1) % SPEEDS.length;
                    var a = getOrCreateAudio();
                    a.playbackRate = SPEEDS[currentSpeedIndex];
                    syncSpeedUI();
                });
            }

            var volInput = trackRow.querySelector('.audio-track__volume-input');
            if (volInput) {
                volInput.addEventListener('input', function () {
                    var a = getOrCreateAudio();
                    a.volume = parseInt(volInput.value, 10) / 100;
                    syncVolumeUI();
                });
            }
        });

        var a = getOrCreateAudio();
        a.addEventListener('timeupdate', function () {
            if (!currentTrack) return;
            var cur = a.currentTime;
            var dur = a.duration;
            updateTime(currentTrack, cur, dur);
            updateProgress(currentTrack, dur ? (cur / dur) * 100 : 0);
        });
        a.addEventListener('loadedmetadata', function () {
            if (!currentTrack) return;
            updateTime(currentTrack, 0, a.duration);
        });
        a.addEventListener('ended', function () {
            if (currentTrack) {
                updatePlayPauseUI(currentTrack, false);
                updateTime(currentTrack, 0, a.duration);
                updateProgress(currentTrack, 0);
                currentTrack = null;
            }
        });
        a.addEventListener('pause', function () {
            if (currentTrack) updatePlayPauseUI(currentTrack, false);
        });
        a.addEventListener('play', function () {
            if (currentTrack) updatePlayPauseUI(currentTrack, true);
        });
    }

    function init() {
        initAccordion();
        initPlayers();
        syncSpeedUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
