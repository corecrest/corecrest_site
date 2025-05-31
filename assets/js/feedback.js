document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');
    const serviceSelect = document.getElementById('service');
    const otherServiceContainer = document.getElementById('otherServiceContainer');
    const otherServiceInput = document.getElementById('otherService');
    const ratingInputs = document.querySelectorAll('.rating input');
    const formGroups = document.querySelectorAll('.form-group');

    // Handle service selection change
    if (serviceSelect) {
        serviceSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Other') {
                otherServiceContainer.style.display = 'block';
                otherServiceInput.setAttribute('required', 'required');
            } else {
                otherServiceContainer.style.display = 'none';
                otherServiceInput.removeAttribute('required');
            }
        });
    }

    // Add animation class to form groups when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    formGroups.forEach(group => {
        observer.observe(group);
    });

    // Handle form submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(feedbackForm);
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Update button state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                // Prepare the feedback data
                const feedbackData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    service: formData.get('service') === 'Other' ? formData.get('otherService') : formData.get('service'),
                    rating: formData.get('rating'),
                    feedback: formData.get('feedback'),
                    improvements: formData.get('improvements'),
                    wantsFollowup: formData.get('followup') === 'on'
                };

                // Send to API
                const response = await fetch('http://notification-api-dev.local:8000/api/v1/feedback/', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'x-api-key': 'fQ-3b9YpQdjuoQZGsyVwDhrR_Ob5griuKpC9cscuFd8',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(feedbackData)
                });

                if (response.ok) {
                    // Show success message
                    showToast('Thank you for your feedback! We appreciate your input.', 'success');
                    
                    // Reset form
                    feedbackForm.reset();
                    
                    // Reset other service field
                    if (otherServiceContainer) {
                        otherServiceContainer.style.display = 'none';
                    }
                    
                    // Remove focused states
                    document.querySelectorAll('.form-group.focused').forEach(group => {
                        group.classList.remove('focused');
                    });
                } else {
                    throw new Error('Failed to submit feedback');
                }
            } catch (error) {
                console.error('Error submitting feedback:', error);
                showToast('Sorry, there was a problem submitting your feedback. Please try again later.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // Handle input focus states
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.closest('.form-group').classList.remove('focused');
            }
        });

        // Check initial state
        if (input.value !== '') {
            input.closest('.form-group').classList.add('focused');
        }
    });

    // Star rating hover effect
    ratingInputs.forEach(input => {
        const label = input.nextElementSibling;
        if (label) {
            label.addEventListener('mouseover', () => {
                label.style.transform = 'scale(1.1)';
            });
            
            label.addEventListener('mouseout', () => {
                label.style.transform = 'scale(1)';
            });
        }
    });
}); 