document.addEventListener("DOMContentLoaded", () => {
  // Custom cursor
  const cursor = document.querySelector(".cursor-follower");
  const links = document.querySelectorAll("a, button");

  document.addEventListener("mousemove", (e) => {
    requestAnimationFrame(() => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
  });

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      cursor.style.width = "50px";
      cursor.style.height = "50px";
      cursor.style.backgroundColor = "rgba(255, 107, 107, 0.5)";
    });

    link.addEventListener("mouseleave", () => {
      cursor.style.width = "30px";
      cursor.style.height = "30px";
      cursor.style.backgroundColor = "rgba(108, 99, 255, 0.5)";
    });
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector("nav ul");

  menuToggle.addEventListener("click", () => {
    navLinks.style.display =
      navLinks.style.display === "flex" ? "none" : "flex";

    if (navLinks.style.display === "flex") {
      navLinks.style.position = "absolute";
      navLinks.style.top = "100%";
      navLinks.style.left = "0";
      navLinks.style.width = "100%";
      navLinks.style.flexDirection = "column";
      navLinks.style.backgroundColor = "rgba(18, 18, 18, 0.95)";
      navLinks.style.padding = "1rem 0";

      const navItems = document.querySelectorAll("nav ul li");
      navItems.forEach((item) => {
        item.style.margin = "1rem 0";
        item.style.textAlign = "center";
      });
    }
  });

  // Particle animation
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  setCanvasSize();
  window.addEventListener("resize", setCanvasSize);

  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 5 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.color = this.getRandomColor();
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    getRandomColor() {
      const colors = ["#6c63ff", "#ff6b6b", "#ffa400"];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (
        this.x < 0 ||
        this.x > canvas.width ||
        this.y < 0 ||
        this.y > canvas.height
      ) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Create particles
  const particles = [];
  const particleCount = 100;

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Connect particles with lines
  function connectParticles() {
    const maxDistance = 150;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
      particle.update();
      particle.draw();
    }

    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();

  // Parallax effect
  const parallaxItems = document.querySelectorAll(".parallax-item");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    parallaxItems.forEach((item) => {
      const speed = item.getAttribute("data-speed");
      item.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });

  // Scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(
      ".section-header, .about-text, .work-item, .contact-form, .contact-info"
    )
    .forEach((el) => {
      observer.observe(el);
      el.classList.add("fade-in");
    });

  // Add CSS for fade-in animation
  const style = document.createElement("style");
  style.textContent = `
      .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      
      .fade-in.animate {
        opacity: 1;
        transform: translateY(0);
      }
      
      .work-item {
        transition-delay: calc(0.1s * var(--i));
      }
    `;
  document.head.appendChild(style);

  // Set transition delays for work items
  document.querySelectorAll(".work-item").forEach((item, index) => {
    item.style.setProperty("--i", index);
  });

  // Counter animation for stats
  const statItems = document.querySelectorAll(".stat-item");

  function animateCounter(el) {
    const target = Number.parseInt(el.getAttribute("data-count"));
    const counter = el.querySelector(".stat-number");
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps

    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statItems.forEach((item) => {
    statsObserver.observe(item);
  });

  // Form submission
  const contactForm = document.querySelector(".contact-form");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Simulate form submission
    const submitButton = contactForm.querySelector(".submit-button");
    const originalText = submitButton.textContent;

    submitButton.textContent = "发送中...";
    submitButton.disabled = true;

    setTimeout(() => {
      submitButton.textContent = "已发送 ✓";

      // Reset form
      setTimeout(() => {
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 2000);
    }, 1500);
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        // Close mobile menu if open
        if (window.innerWidth < 768) {
          navLinks.style.display = "none";
        }
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector("header");
  let lastScrollY = 0;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.style.padding = "1rem 5%";
      header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.padding = "1.5rem 5%";
      header.style.boxShadow = "none";
    }

    if (currentScrollY > lastScrollY) {
      // Scrolling down
      header.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      header.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
  });

  // Preload images for better performance
  function preloadImages() {
    const imageUrls = [
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ];

    imageUrls.forEach((url) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Avoid CORS issues
      img.src = url;
    });
  }

  preloadImages();
});
