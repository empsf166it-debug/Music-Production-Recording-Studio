/**
 * SONIQ STUDIO - Interactive Audio Engine & Website Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      duration: 800,
      offset: 40,
      easing: 'ease-out-cubic',
      disableMutationObserver: false,
      mirror: false
    });
  }

  // 1. Sticky Navigation Header Transition & Active Link Spy
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const updateHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('bg-[#0B0B10]/95', 'shadow-2xl', 'py-3', 'border-white/10');
      header.classList.remove('bg-[#0B0B10]/85', 'py-3.5', 'border-white/[0.08]');
    } else {
      header.classList.remove('bg-[#0B0B10]/95', 'shadow-2xl', 'py-3', 'border-white/10');
      header.classList.add('bg-[#0B0B10]/85', 'py-3.5', 'border-white/[0.08]');
    }
  };

  const updateActiveNavLink = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', () => {
    updateHeaderScroll();
    updateActiveNavLink();
  });
  updateHeaderScroll();
  updateActiveNavLink();

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  const openMobileMenu = () => {
    mobileMenu.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // 2. Interactive Audio Samples Engine (Section 4)
  const tracks = [
    {
      id: 0,
      title: "Midnight Acoustic Capture",
      category: "Raw Recording",
      description: "Dry, natural acoustic guitar performance recorded with matched vintage condenser pair in Studio A.",
      src: "audio/sample1_raw.wav",
      badge: "Pure Take · Zero Processing"
    },
    {
      id: 1,
      title: "Neon Horizon (Rhythm & Bass)",
      category: "Mixed Track",
      description: "Tight bottom-end glue, dynamic sidechain compression, and spatial stereo imaging for punchy club presence.",
      src: "audio/sample2_mixed.wav",
      badge: "Analog Summed · SSL 4000E"
    },
    {
      id: 2,
      title: "Vanguard Odyssey",
      category: "Mastered Track",
      description: "Full commercial release master tuned for Spotify, Apple Music, and vinyl dynamic response specifications.",
      src: "audio/sample3_mastered.wav",
      badge: "Loudness Optimized · -14 LUFS"
    },
    {
      id: 3,
      title: "Euphoria Harmonics & Formants",
      category: "Vocal Production",
      description: "Surgical vocal tuning, tube saturation warmth, lush parallel delay throws, and shimmering top end.",
      src: "audio/sample4_vocal.wav",
      badge: "Neumann U87 · Manley Voxbox"
    },
    {
      id: 4,
      title: "Subsurface Cyber Drop & Transition",
      category: "Electronic Sound Design",
      description: "Bespoke modular sub drops, filtered risers, and granular cinematic impacts for modern film and game scoring.",
      src: "audio/sample5_sounddesign.wav",
      badge: "Modular Rig · Prophet Rev2"
    }
  ];

  let currentTrackIdx = 0;
  const audioPlayer = new Audio();
  audioPlayer.preload = "metadata";

  const sampleButtons = document.querySelectorAll('.sample-select-btn');
  const mainPlayBtn = document.getElementById('player-play-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const playerTrackTitle = document.getElementById('player-track-title');
  const playerTrackCat = document.getElementById('player-track-category');
  const playerTrackDesc = document.getElementById('player-track-description');
  const playerTrackBadge = document.getElementById('player-track-badge');
  const progressBar = document.getElementById('player-progress-bar');
  const progressContainer = document.getElementById('player-progress-container');
  const timeCurrent = document.getElementById('player-time-current');
  const timeTotal = document.getElementById('player-time-total');
  const playerEqBars = document.querySelectorAll('.player-eq-bar');
  const playerStatusText = document.getElementById('player-status-text');

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === Infinity) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const loadTrack = (idx, autoPlay = false) => {
    currentTrackIdx = idx;
    const track = tracks[idx];

    // Update UI highlights
    sampleButtons.forEach((btn, i) => {
      if (i === idx) {
        btn.classList.add('border-[#8B5CF6]', 'bg-[#8B5CF6]/10');
        btn.classList.remove('border-white/10', 'bg-[#17171F]');
        const playingDot = btn.querySelector('.playing-dot');
        if (playingDot) playingDot.classList.remove('hidden');
      } else {
        btn.classList.remove('border-[#8B5CF6]', 'bg-[#8B5CF6]/10');
        btn.classList.add('border-white/10', 'bg-[#17171F]');
        const playingDot = btn.querySelector('.playing-dot');
        if (playingDot) playingDot.classList.add('hidden');
      }
    });

    playerTrackTitle.textContent = track.title;
    playerTrackCat.textContent = track.category;
    playerTrackDesc.textContent = track.description;
    playerTrackBadge.textContent = track.badge;

    // Reset progress
    progressBar.style.width = '0%';
    timeCurrent.textContent = "0:00";
    timeTotal.textContent = "0:12";
    playerStatusText.textContent = "Ready to Play";

    audioPlayer.src = track.src;

    if (autoPlay) {
      audioPlayer.play().then(() => {
        setPlayingState(true);
      }).catch(err => {
        console.warn('Playback error / interaction needed:', err);
        setPlayingState(false);
        playerStatusText.textContent = "Click play to start";
      });
    } else {
      setPlayingState(false);
    }
  };

  const setPlayingState = (isPlaying) => {
    if (isPlaying) {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      playerEqBars.forEach(bar => bar.classList.remove('paused-animation'));
      playerStatusText.textContent = "Now Playing High-Fidelity Audio";
      playerStatusText.classList.add('text-[#45E6E0]');
      playerStatusText.classList.remove('text-[#A1A1AA]');
    } else {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      playerEqBars.forEach(bar => bar.classList.add('paused-animation'));
      playerStatusText.textContent = "Playback Paused";
      playerStatusText.classList.remove('text-[#45E6E0]');
      playerStatusText.classList.add('text-[#A1A1AA]');
    }
  };

  // Play/Pause toggle
  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', () => {
      if (!audioPlayer.src) {
        loadTrack(currentTrackIdx, true);
        return;
      }
      if (audioPlayer.paused) {
        audioPlayer.play().then(() => {
          setPlayingState(true);
        }).catch(err => {
          playerStatusText.textContent = "Playback unavailable or file missing";
        });
      } else {
        audioPlayer.pause();
        setPlayingState(false);
      }
    });
  }

  // Update time and progress
  audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
      const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.style.width = `${pct}%`;
      timeCurrent.textContent = formatTime(audioPlayer.currentTime);
      timeTotal.textContent = formatTime(audioPlayer.duration);
    }
  });

  audioPlayer.addEventListener('ended', () => {
    setPlayingState(false);
    progressBar.style.width = '0%';
    timeCurrent.textContent = "0:00";
    playerStatusText.textContent = "Track finished";
  });

  audioPlayer.addEventListener('error', (e) => {
    console.warn("Audio load error:", e);
    setPlayingState(false);
    playerStatusText.textContent = "Audio sample preview currently offline (demo format)";
  });

  // Seek interaction on waveform progress bar
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      if (!audioPlayer.duration) return;
      const rect = progressContainer.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      audioPlayer.currentTime = clickPos * audioPlayer.duration;
      progressBar.style.width = `${clickPos * 100}%`;
    });
  }

  // Sample tab clicks
  sampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const trackIdx = parseInt(btn.getAttribute('data-track-index'), 10);
      loadTrack(trackIdx, true);
    });
  });

  // Initialize track 0 in pause state
  loadTrack(0, false);

  // Stop audio if user clicks play on any portfolio preview modal (ensuring only 1 sound source plays)
  window.addEventListener('stopStudioAudio', () => {
    if (!audioPlayer.paused) {
      audioPlayer.pause();
      setPlayingState(false);
    }
  });

  // 3. Section 5: Equipment Showcase Interactive Tabs
  const equipmentData = [
    {
      id: "console",
      name: "Solid State Logic 4000E Series Console",
      category: "Mixing Console & Summing",
      image: "images/equip_console.jpg",
      description: "The gold standard of rock, pop, and hip-hop mixing history. 48 channels of analog warmth, legendary Black Knob EQs, and the unmistakable punch of the master bus G-Comp.",
      specs: [
        { label: "Channels", val: "48 Analog Ch" },
        { label: "Routing", val: "Total Recall™" },
        { label: "Preamps", val: "Discrete Class A" },
        { label: "Bus Dynamics", val: "Quad Bus Comp" }
      ]
    },
    {
      id: "monitors",
      name: "Barefoot Sound MM27 & Genelec 8351B Setup",
      category: "Studio Monitoring & Acoustics",
      image: "images/equip_monitors.jpg",
      description: "Dual main and nearfield reference system tuned with GLM coaxial DSP acoustic calibration, providing ruthless clarity and sub-harmonic extension down to 20Hz.",
      specs: [
        { label: "Response", val: "20Hz - 45kHz" },
        { label: "DSP Tuning", val: "Genelec GLM 4" },
        { label: "Amplification", val: "1200W Tri-Amp" },
        { label: "Acoustics", val: "Coaxial Time-Align" }
      ]
    },
    {
      id: "mic",
      name: "Neumann U87 Ai & Telefunken ELA M 251E",
      category: "Microphone Locker",
      image: "images/equip_mic.jpg",
      description: "Our prized vocal chain microphone collection. Features dual vintage capsules capable of capturing intimate whispered nuances and soaring operatic dynamics with silky presence.",
      specs: [
        { label: "Capsule", val: "Dual-Diaphragm" },
        { label: "Patterns", val: "Omni / Cardioid" },
        { label: "Max SPL", val: "127 dB SPL" },
        { label: "Tube Circuit", val: "NOS 6072A Triode" }
      ]
    },
    {
      id: "interface",
      name: "Burl Mothership B80 & Universal Audio Apollo X16",
      category: "Conversion & Preamps",
      image: "images/equip_interface.jpg",
      description: "Audiophile AD/DA conversion driven by discrete green transformers that infuse tape-like saturation directly into your DAW with virtually zero latency.",
      specs: [
        { label: "Resolution", val: "32-bit / 192kHz" },
        { label: "Dynamic Range", val: "133 dB (A-wtd)" },
        { label: "DSP Cores", val: "HEXA Core Realtime" },
        { label: "Clocking", val: "Atomic Generator" }
      ]
    },
    {
      id: "synth",
      name: "Sequential Prophet Rev2 & Moog Subsequent 37",
      category: "Analog Synthesizers & MIDI",
      image: "images/equip_synth.jpg",
      description: "An arsenal of pure analog sound generation. From earth-shaking sub bass lines to shimmering 16-voice polyphonic pads and modern wavetable textures.",
      specs: [
        { label: "Polyphony", val: "16 Voice Analog" },
        { label: "Filters", val: "Curtis 2/4-Pole" },
        { label: "Modulation", val: "8-Bus Matrix" },
        { label: "Analog Engine", val: "Multidrive Overdrive" }
      ]
    },
    {
      id: "acoustic",
      name: "Diffusor Array & Bass Trap Isolation Booths",
      category: "Acoustic Architecture",
      image: "images/equip_acoustic_panels.jpg",
      description: "Architecturally engineered room acoustics featuring tuned RPG quadratic residue diffusors, floating concrete slabs, and a certified NC-15 noise rating.",
      specs: [
        { label: "Noise Rating", val: "NC-15 Certified" },
        { label: "Floating Floor", val: "Dual Concrete" },
        { label: "Diffusion", val: "QRD 2D Quadratic" },
        { label: "Low End", val: "Membrane Traps" }
      ]
    }
  ];

  const equipTabs = document.querySelectorAll('.equip-tab');
  const equipImage = document.getElementById('equip-featured-image');
  const equipCategory = document.getElementById('equip-category');
  const equipName = document.getElementById('equip-name');
  const equipDesc = document.getElementById('equip-desc');
  const equipSpecsGrid = document.getElementById('equip-specs-grid');

  const updateEquipView = (index) => {
    const item = equipmentData[index];
    if (!item) return;

    equipTabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('border-[#45E6E0]', 'bg-[#45E6E0]/10', 'text-[#45E6E0]');
        tab.classList.remove('border-white/10', 'bg-[#17171F]', 'text-[#A1A1AA]');
      } else {
        tab.classList.remove('border-[#45E6E0]', 'bg-[#45E6E0]/10', 'text-[#45E6E0]');
        tab.classList.add('border-white/10', 'bg-[#17171F]', 'text-[#A1A1AA]');
      }
    });

    // Crossfade effect
    equipImage.style.opacity = '0';
    setTimeout(() => {
      equipImage.src = item.image;
      equipImage.alt = item.name;
      equipCategory.textContent = item.category;
      equipName.textContent = item.name;
      equipDesc.textContent = item.description;

      if (equipSpecsGrid) {
        equipSpecsGrid.innerHTML = item.specs.map(s => `
          <div class="bg-[#0B0B10]/85 p-3 rounded-xl border border-white/5 flex flex-col justify-between min-h-[68px]">
            <span class="text-[10px] sm:text-xs text-[#A1A1AA] uppercase tracking-wider block font-mono leading-tight">${s.label}</span>
            <span class="text-xs sm:text-sm font-semibold text-white mt-1 block leading-snug">${s.val}</span>
          </div>
        `).join('');
      }

      equipImage.style.opacity = '1';
    }, 200);
  };

  equipTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.getAttribute('data-equip-idx'), 10);
      updateEquipView(idx);
    });
  });

  // 4. Section 8: Testimonials Slider
  let currentTesti = 0;
  const testiSlides = document.querySelectorAll('.testi-slide');
  const prevTestiBtn = document.getElementById('testi-prev');
  const nextTestiBtn = document.getElementById('testi-next');
  const testiDots = document.querySelectorAll('.testi-dot');

  const showTestiSlide = (n) => {
    if (n >= testiSlides.length) currentTesti = 0;
    else if (n < 0) currentTesti = testiSlides.length - 1;
    else currentTesti = n;

    testiSlides.forEach((slide, idx) => {
      if (idx === currentTesti) {
        slide.classList.remove('hidden', 'opacity-0');
        slide.classList.add('block', 'opacity-100');
      } else {
        slide.classList.add('hidden', 'opacity-0');
        slide.classList.remove('block', 'opacity-100');
      }
    });

    testiDots.forEach((dot, idx) => {
      if (idx === currentTesti) {
        dot.classList.add('bg-[#8B5CF6]', 'w-8');
        dot.classList.remove('bg-white/20', 'w-2.5');
      } else {
        dot.classList.remove('bg-[#8B5CF6]', 'w-8');
        dot.classList.add('bg-white/20', 'w-2.5');
      }
    });
  };

  if (prevTestiBtn) prevTestiBtn.addEventListener('click', () => showTestiSlide(currentTesti - 1));
  if (nextTestiBtn) nextTestiBtn.addEventListener('click', () => showTestiSlide(currentTesti + 1));
  testiDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => showTestiSlide(idx));
  });

  // 5. Section 9: Studio Session Booking Form Validation & Interactive Demo
  const bookingForm = document.getElementById('booking-form');
  const bookingDateInput = document.getElementById('booking-date');
  const bookingSummaryBox = document.getElementById('booking-summary-box');
  const bookingSuccessModal = document.getElementById('booking-success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Prevent past dates
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
  }

  // Live booking summary generator
  const updateBookingSummary = () => {
    if (!bookingSummaryBox) return;
    const sessionType = document.getElementById('booking-session-type')?.value || "Vocal Recording";
    const date = document.getElementById('booking-date')?.value || "Pending date selection";
    const time = document.getElementById('booking-time')?.value || "Pending time selection";
    const duration = document.getElementById('booking-duration')?.value || "4 Hours";
    const artist = document.getElementById('booking-artist')?.value || "Artist / Project";

    bookingSummaryBox.innerHTML = `
      <div class="text-xs uppercase tracking-wider text-[#A1A1AA] font-mono mb-3">Live Session Estimate (Demo Mode)</div>
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-white/5 gap-1">
        <span class="text-xs text-[#A1A1AA] shrink-0">Session:</span>
        <span class="text-xs font-semibold text-white sm:text-right">${sessionType}</span>
      </div>
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-white/5 gap-1">
        <span class="text-xs text-[#A1A1AA] shrink-0">Project:</span>
        <span class="text-xs font-semibold text-[#45E6E0] sm:text-right break-words">${artist}</span>
      </div>
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start py-2 border-b border-white/5 gap-1">
        <span class="text-xs text-[#A1A1AA] shrink-0 pt-0.5">Slot:</span>
        <span class="text-xs font-semibold text-white sm:text-right leading-relaxed max-w-full sm:max-w-[70%] break-words">${date} <br class="hidden sm:inline" /><span class="text-[#45E6E0]">@ ${time}</span> <span class="text-[#A1A1AA]">(${duration})</span></span>
      </div>
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2.5 gap-1">
        <span class="text-xs text-[#A1A1AA] shrink-0">Engineer:</span>
        <span class="text-xs font-semibold text-[#8B5CF6] sm:text-right">Senior Audio Engineer Included</span>
      </div>
    `;
  };

  const formInputs = ['booking-session-type', 'booking-date', 'booking-time', 'booking-duration', 'booking-artist'];
  formInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateBookingSummary);
      el.addEventListener('change', updateBookingSummary);
    }
  });
  updateBookingSummary();

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;
      const name = document.getElementById('booking-name');
      const email = document.getElementById('booking-email');
      const date = document.getElementById('booking-date');

      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validate name
      if (!name.value.trim()) {
        showFieldError(name, 'Please enter your full name');
        hasError = true;
      } else {
        clearFieldError(name);
      }

      // Validate email
      if (!emailRegex.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address');
        hasError = true;
      } else {
        clearFieldError(email);
      }

      // Validate date
      if (!date.value) {
        showFieldError(date, 'Please select a preferred studio date');
        hasError = true;
      } else {
        clearFieldError(date);
      }

      if (!hasError) {
        // Populate modal data
        document.getElementById('modal-client-name').textContent = name.value.trim();
        document.getElementById('modal-session-type').textContent = document.getElementById('booking-session-type').value;
        document.getElementById('modal-session-date').textContent = `${date.value} at ${document.getElementById('booking-time').value}`;
        
        // Show success modal
        bookingSuccessModal.classList.remove('hidden');
        bookingSuccessModal.classList.add('flex');
        bookingForm.reset();
        updateBookingSummary();
      }
    });
  }

  const showFieldError = (input, message) => {
    input.classList.add('border-red-500');
    let errEl = input.parentElement.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'field-error text-xs text-red-400 mt-1';
      input.parentElement.appendChild(errEl);
    }
    errEl.textContent = message;
  };

  const clearFieldError = (input) => {
    input.classList.remove('border-red-500');
    const errEl = input.parentElement.querySelector('.field-error');
    if (errEl) errEl.remove();
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      bookingSuccessModal.classList.add('hidden');
      bookingSuccessModal.classList.remove('flex');
    });
  }

  // 6. Section 5 & Portfolio Quick Audio Triggers
  const portfolioPlayButtons = document.querySelectorAll('.portfolio-play-btn');
  portfolioPlayButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trackId = parseInt(btn.getAttribute('data-track-ref') || '0', 10);
      // Smooth scroll to audio section
      const audioSection = document.getElementById('audio');
      if (audioSection) {
        audioSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          loadTrack(trackId, true);
        }, 600);
      }
    });
  });

  // 7. Footer Newsletter Subscription Demo
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterMsg = document.getElementById('newsletter-msg');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        newsletterMsg.textContent = "Thank you! Demo subscription recorded (No spam, template mode).";
        newsletterMsg.classList.remove('hidden', 'text-red-400');
        newsletterMsg.classList.add('text-[#45E6E0]');
        newsletterForm.reset();
      } else {
        newsletterMsg.textContent = "Please enter a valid email address.";
        newsletterMsg.classList.remove('hidden', 'text-[#45E6E0]');
        newsletterMsg.classList.add('text-red-400');
      }
    });
  }
});
