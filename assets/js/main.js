/**
 * Corecrest Landing Page JavaScript
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');
    const navItems = document.querySelectorAll('.nav-links a');
    const languageToggle = document.querySelectorAll('.language-toggle a');
    const contactForm = document.getElementById('contactForm');
    const animatedCube = document.querySelector('.animated-cube');
    const heroSection = document.querySelector('.hero-section');
    
    // Create toast container once and add to body
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // 3D Cube Interactive Effects
    if (animatedCube && heroSection) {
        let rotateX = 0;
        let rotateY = 0;
        let isManuallyRotating = false;
        
        // Store original animation state
        const originalAnimation = animatedCube.style.animation;
        
        // Add mouse move event to hero section
        heroSection.addEventListener('mousemove', (e) => {
            if (!isManuallyRotating) return;
            
            const heroRect = heroSection.getBoundingClientRect();
            const centerX = heroRect.width / 2;
            const centerY = heroRect.height / 2;
            
            // Calculate mouse position relative to center
            const mouseX = e.clientX - heroRect.left - centerX;
            const mouseY = e.clientY - heroRect.top - centerY;
            
            // Calculate rotation based on mouse position
            rotateY = (mouseX / centerX) * 20; // -20 to 20 degrees
            rotateX = (-mouseY / centerY) * 20; // -20 to 20 degrees
            
            // Apply rotation to cube
            animatedCube.style.animation = 'none';
            animatedCube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // Toggle manual rotation on mousedown/mouseup
        animatedCube.addEventListener('mousedown', () => {
            isManuallyRotating = true;
            animatedCube.style.animation = 'none';
        });
        
        document.addEventListener('mouseup', () => {
            if (isManuallyRotating) {
                isManuallyRotating = false;
                animatedCube.style.animation = originalAnimation;
                animatedCube.style.transform = '';
            }
        });
        
        // Add glow effect on faces when hovering cube
        const cubeFaces = document.querySelectorAll('.cube-face');
        
        animatedCube.addEventListener('mouseenter', () => {
            cubeFaces.forEach(face => {
                face.style.boxShadow = '0 0 30px rgba(32, 178, 170, 0.8)';
            });
        });
        
        animatedCube.addEventListener('mouseleave', () => {
            cubeFaces.forEach(face => {
                face.style.boxShadow = '0 0 20px rgba(32, 178, 170, 0.5)';
            });
        });
    }
    
    // Mobile Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
    
    // Close mobile menu when clicking on a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Language Toggle
    languageToggle.forEach(lang => {
        lang.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all language options
            languageToggle.forEach(l => l.classList.remove('active'));
            // Add active class to clicked language
            lang.classList.add('active');
            
            // Here you would implement actual language switching functionality
            // For now, just log the selected language
            console.log(`Language switched to: ${lang.textContent}`);
        });
    });
    
    // Sticky Header on Scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Skip for empty links or just "#"
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form input focus effects
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    
    if (formInputs.length > 0) {
        formInputs.forEach(input => {
            // Add focused class on focus
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            // Remove focused class on blur if the input is empty
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check on load if the input has value
            if (input.value !== '') {
                input.parentElement.classList.add('focused');
            }
        });
    }
    
    // Contact Form Validation and Submission
    if (contactForm) {
        const subjectField = document.getElementById('subject');
        const otherSubjectContainer = document.getElementById('otherSubjectContainer');
        const otherSubjectField = document.getElementById('otherSubject');
        
        // Handle showing/hiding the "Other" field based on dropdown selection
        if (subjectField && otherSubjectContainer) {
            subjectField.addEventListener('change', function() {
                if (this.value === 'Other') {
                    otherSubjectContainer.style.display = 'block';
                    otherSubjectField.setAttribute('required', 'required');
                } else {
                    otherSubjectContainer.style.display = 'none';
                    otherSubjectField.removeAttribute('required');
                }
            });
        }
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const company = document.getElementById('company').value || 'Not specified';
            const phone = document.getElementById('phone').value || 'Not specified';
            const subject = document.getElementById('subject').value;
            const otherSubject = document.getElementById('otherSubject')?.value || '';
            const message = document.getElementById('message').value;
            
            // Simple form validation
            if (!name || !email || !subject || !message) {
                showToast('Please fill out all required fields.', 'error');
                return;
            }
            
            // Update UI to show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Prepare the email body (formatted for better readability)
            const subjectText = subject === 'Other' ? otherSubject : subject;
            const emailSubject = `Website Inquiry: ${subjectText}`;
            const emailBody = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #2C3E50, #20B2AA); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">NEW CONTACT FORM SUBMISSION</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2C3E50; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #20B2AA; padding-bottom: 8px;">CLIENT INFORMATION</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #2C3E50; width: 30%;">Name:</td><td style="padding: 8px 0;">${name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #2C3E50;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #20B2AA; text-decoration: none;">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #2C3E50;">Company:</td><td style="padding: 8px 0;">${company}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #2C3E50;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #20B2AA; text-decoration: none;">${phone}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #2C3E50;">Service Interest:</td><td style="padding: 8px 0; background: #e8f4f8; padding: 8px; border-radius: 4px; color: #2C3E50;">${subjectText}</td></tr>
            </table>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2C3E50; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #20B2AA; padding-bottom: 8px;">MESSAGE DETAILS</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #20B2AA; white-space: pre-wrap;">${message}</div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2C3E50; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #20B2AA; padding-bottom: 8px;">SUBMISSION DETAILS</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #2C3E50; width: 30%;">Submission Time:</td><td style="padding: 8px 0;">${new Date().toLocaleString()}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #2C3E50;">Source:</td><td style="padding: 8px 0;">CoreCrest Website Contact Form</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #2C3E50;">Priority:</td><td style="padding: 8px 0; background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px; display: inline-block;">Normal</td></tr>
            </table>
        </div>
    </div>
    
    <div style="background: #2C3E50; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px;">
        This email was automatically generated from the CoreCrest website.
    </div>
</div>`;
            
            try {
                // Send the data to the API
                const response = await fetch('https://bff.corecrest.tech/api/submit/contact', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Origin': window.location.origin,
                        'Access-Control-Request-Method': 'POST'
                    },
                    credentials: 'omit', // Don't send cookies for cross-origin requests
                    mode: 'cors', // Enable CORS
                    body: JSON.stringify({
                        recipient: 'info@corecrest.tech', // Replace with your actual recipient email
                        subject: emailSubject,
                        body: emailBody,
                        body_type: 'html',
                        content_encoding: 'plain',
                        priority: 2,
                        notification_type: 'email',
                        source: 'corecrest'
                    })
                });
                
                if (response.ok) {
                    // Success - form submitted successfully
                    showToast('Your message has been sent successfully. We\'ll get back to you soon!', 'success');
                    contactForm.reset();
                    
                    // Hide otherSubject field if it was visible
                    if (otherSubjectContainer) {
                        otherSubjectContainer.style.display = 'none';
                    }
                    
                    // Remove focused class from all inputs
                    formInputs.forEach(input => {
                        input.parentElement.classList.remove('focused');
                    });
                } else {
                    // API error response
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || `Error: ${response.status} - Failed to send message`);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                
                // Network errors don't have response.json()
                if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                    showToast('Unable to connect to the server. Please check your internet connection and try again.', 'error');
                } else {
                    showToast(error.message || 'Failed to send message. Please try again later.', 'error');
                }
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
    
    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        // You could implement a more robust solution here or use a library
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length > 0) {
            const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(image => {
                lazyLoadObserver.observe(image);
            });
        }
    }
    
    // Simple animation for services and testimonial cards
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .testimonial-card');
        
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('fade-in');
            }
        });
    };
    
    // Initial check for visible elements
    animateOnScroll();
    
    // Check for new elements to animate during scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Stats Animation
    const animateStats = () => {
        const statsSection = document.querySelector('.stats-section');
        const statItems = document.querySelectorAll('.stat-item');
        const statValues = document.querySelectorAll('.stat-value');
        
        const animateValue = (element, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = Math.floor(progress * (end - start) + start);
                element.textContent = currentValue;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    element.classList.add('animate');
                }
            };
            window.requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate section
                    statsSection.classList.add('animate');
                    
                    // Animate items
                    statItems.forEach(item => {
                        item.classList.add('animate');
                    });
                    
                    // Animate numbers
                    statValues.forEach(value => {
                        const endValue = parseInt(value.getAttribute('data-value'));
                        animateValue(value, 0, endValue, 2000);
                    });
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        if (statsSection) {
            observer.observe(statsSection);
        }
    };

    // Initialize stats animation
    animateStats();

    // About Features Animation
    const animateAboutFeatures = () => {
        const features = document.querySelectorAll('.about-feature');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        features.forEach(feature => {
            observer.observe(feature);
        });
    };

    // Initialize about features animation
    animateAboutFeatures();

    // Services Animation
    const animateServices = () => {
        const services = document.querySelectorAll('.service-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        services.forEach(service => {
            observer.observe(service);
        });
    };

    // Initialize services animation
    animateServices();

    // Hero Text Rotation
    const heroTextSlides = document.querySelectorAll('.hero-text-slide');
    let currentSlideIndex = 0;
    const rotationInterval = 30000; // 30 seconds

    function rotateHeroText() {
        // Remove active class from current slide
        heroTextSlides[currentSlideIndex].classList.remove('active');
        
        // Update index
        currentSlideIndex = (currentSlideIndex + 1) % heroTextSlides.length;
        
        // Add active class to new slide
        heroTextSlides[currentSlideIndex].classList.add('active');
    }

    // Start rotation if there are slides
    if (heroTextSlides.length > 1) {
        // Set initial state
        heroTextSlides[0].classList.add('active');
        
        // Start rotation
        setInterval(rotateHeroText, rotationInterval);
    }

    // Remove error class on input (only if contactForm exists)
    if (contactForm) {
        contactForm.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                }
            });
        });
    }
});

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto close after 5 seconds
    const autoCloseTimeout = setTimeout(() => {
        closeToast(toast);
    }, 5000);
    
    // Close button functionality
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        clearTimeout(autoCloseTimeout);
        closeToast(toast);
    });
}

function closeToast(toast) {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
        toast.remove();
    });
}

// ===========================
// Blog Page Functionality
// ===========================

// Blog page specific functionality
if (window.location.pathname.includes('blogs.html') || window.location.pathname.endsWith('blogs.html')) {
    
    // Load More Articles Functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more articles
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                // Add more blog cards (this would typically come from an API)
                const blogGrid = document.querySelector('.blog-grid');
                const newArticles = [
                    {
                        image: 'https://via.placeholder.com/400x250/2C3E50/FFFFFF?text=Cloud+Computing',
                        category: 'Cloud Computing',
                        date: 'November 15, 2024',
                        title: 'Cloud Migration Strategies for African Enterprises',
                        excerpt: 'Essential strategies and best practices for African businesses looking to migrate their infrastructure to the cloud.'
                    },
                    {
                        image: 'https://via.placeholder.com/400x250/20B2AA/FFFFFF?text=Cybersecurity',
                        category: 'Cybersecurity',
                        date: 'November 10, 2024',
                        title: 'Cybersecurity Best Practices for Small Businesses',
                        excerpt: 'Protect your business with these essential cybersecurity practices that every small business should implement.'
                    }
                ];
                
                newArticles.forEach(article => {
                    const articleElement = createBlogCard(article);
                    blogGrid.appendChild(articleElement);
                });
                
                // Reset button
                this.textContent = 'Load More Articles';
                this.disabled = false;
                
                // Show success message
                showToast('More articles loaded successfully!', 'success');
            }, 1500);
        });
    }
    
    // Newsletter Subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate newsletter subscription
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Success
                showToast('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
    
    // Blog Card Hover Effects
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Read More Link Functionality
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the blog post title
            const blogTitle = this.closest('.blog-card').querySelector('h3').textContent;
            
            // Show a toast message (in a real app, this would navigate to the full article)
            showToast(`Reading: ${blogTitle}`, 'success');
            
            // Simulate loading the full article
            setTimeout(() => {
                showToast('This would open the full article in a real implementation.', 'info');
            }, 1000);
        });
    });
}

// Helper function to create blog cards
function createBlogCard(articleData) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    
    article.innerHTML = `
        <div class="blog-image">
            <img src="${articleData.image}" alt="${articleData.title}" onerror="this.src='https://via.placeholder.com/400x250/2C3E50/FFFFFF?text=Blog+Post'">
        </div>
        <div class="blog-content">
            <div class="blog-meta">
                <span class="blog-date">${articleData.date}</span>
                <span class="blog-category-tag">${articleData.category}</span>
            </div>
            <h3>${articleData.title}</h3>
            <p>${articleData.excerpt}</p>
            <a href="#" class="read-more">Read More →</a>
        </div>
    `;
    
    // Add event listeners to the new card
    const readMoreLink = article.querySelector('.read-more');
    readMoreLink.addEventListener('click', function(e) {
        e.preventDefault();
        const blogTitle = this.closest('.blog-card').querySelector('h3').textContent;
        showToast(`Reading: ${blogTitle}`, 'success');
    });
    
    return article;
} 