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
            const emailBody = `
                New Contact Form Submission
                ---------------------------

                Name: ${name}
                Email: ${email}
                Company: ${company}
                Phone: ${phone}
                Service Interest: ${subjectText}

                Message:
                ${message}

                ---------------------------
                Sent from CoreCrest website
                `
            ;
            
            try {
                // Send the data to the API
                const response = await fetch('http://notification-api-dev.local:8000/api/v1/notifications/', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'x-api-key': 'fQ-3b9YpQdjuoQZGsyVwDhrR_Ob5griuKpC9cscuFd8',
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
                        priority: 2,
                        notification_type: 'email'
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

// Remove error class on input
contactForm.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            this.classList.remove('error');
        }
    });
}); 