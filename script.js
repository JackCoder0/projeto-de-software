// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== TEMA CLARO/ESCURO =====
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');
    
    // Verifica se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    // Event listener para o botão de tema
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    // ===== MENU MOBILE =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fecha o menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // ===== ANIMAÇÃO DOS NÚMEROS (STATS) =====
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateNumbers() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (target >= 1000) {
                    stat.textContent = Math.floor(current).toLocaleString('pt-BR');
                } else {
                    stat.textContent = Math.floor(current);
                }
                
                // Adiciona % para satisfação
                if (stat.getAttribute('data-target') === '98') {
                    stat.textContent += '%';
                }
                // Adiciona + para outros números grandes
                else if (target >= 100) {
                    stat.textContent += '+';
                }
            }, 20);
        });
    }
    
    // Intersection Observer para animar quando entrar na viewport
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // ===== TABS (FUNCIONALIDADES) =====
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adiciona active ao botão clicado e conteúdo correspondente
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros itens
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Abre o item clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // ===== FORMULÁRIO DE CONTATO =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const tipo = document.getElementById('tipo').value;
            const mensagem = document.getElementById('mensagem').value.trim();
            const termos = document.getElementById('termos').checked;
            
            // Verifica campos obrigatórios
            if (!nome || !email || !tipo || !mensagem || !termos) {
                showAlert('Por favor, preencha todos os campos obrigatórios e aceite os termos.', 'error');
                return;
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // Simula envio do formulário
            showAlert('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
        });
    }
    
    // ===== FUNÇÃO PARA MOSTRAR ALERTAS =====
    function showAlert(message, type) {
        // Remove alertas existentes
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Cria novo alerta
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${message}</span>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Adiciona estilos do alerta
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Adiciona ao body
        document.body.appendChild(alert);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
    
    // ===== SMOOTH SCROLL PARA LINKS INTERNOS =====
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'var(--bg-primary)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ===== ANIMAÇÕES DE ENTRADA =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    const animatedElements = document.querySelectorAll('.feature-card, .mvv-card, .team-member, .info-card');
    animatedElements.forEach(el => observer.observe(el));
    
    // ===== PLACEHOLDER INTERATIVO (DEMO E MAPA) =====
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const mapPlaceholder = document.querySelector('.map-placeholder');
    
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            showAlert('Demonstração em vídeo será disponibilizada em breve!', 'success');
        });
    }
    
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            // Simula abertura do Google Maps
            const address = 'Av. Paulista, 1234, São Paulo - SP';
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        });
    }
    
    // ===== VALIDAÇÃO EM TEMPO REAL DO FORMULÁRIO =====
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove mensagens de erro ao digitar
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
            this.style.borderColor = 'var(--border-color)';
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';
        
        // Remove mensagens de erro anteriores
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validações específicas
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório.';
        } else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um email válido.';
            }
        } else if (fieldName === 'telefone' && value) {
            const phoneRegex = /^[\d\s\(\)\-\+]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um telefone válido.';
            }
        }
        
        // Aplica estilos de validação
        if (!isValid) {
            field.style.borderColor = '#ef4444';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
            errorDiv.textContent = errorMessage;
            field.parentElement.appendChild(errorDiv);
        } else {
            field.style.borderColor = '#10b981';
        }
        
        return isValid;
    }
    
    // ===== MÁSCARA PARA TELEFONE =====
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 6) {
                    value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
                } else if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
    
    // ===== LOADING STATES =====
    function showLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        button.disabled = true;
        
        return function hideLoading() {
            button.innerHTML = originalText;
            button.disabled = false;
        };
    }
    
    // ===== EASTER EGG =====
    let clickCount = 0;
    const logo = document.querySelector('.nav-logo');
    
    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;
            if (clickCount === 5) {
                showAlert('🎉 Você descobriu um easter egg! A VidraLink agradece sua curiosidade!', 'success');
                clickCount = 0;
            }
        });
    }
    
    // ===== PERFORMANCE MONITORING =====
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                if (loadTime > 3000) {
                    console.warn('Página carregou lentamente:', loadTime + 'ms');
                }
            }, 0);
        });
    }
    
    // ===== ACESSIBILIDADE =====
    // Navegação por teclado melhorada
    document.addEventListener('keydown', function(e) {
        // ESC fecha modais/menus
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            const activeMenu = document.querySelector('.nav-menu.active');
            
            if (activeModal) {
                activeModal.classList.remove('active');
            }
            if (activeMenu) {
                activeMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
    
    // ===== LAZY LOADING PARA IMAGENS =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    console.log('🚀 VidraLink website carregado com sucesso!');
});

// ===== FUNÇÕES GLOBAIS =====

// Função para copiar texto para clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showAlert('Texto copiado para a área de transferência!', 'success');
    }).catch(function() {
        showAlert('Erro ao copiar texto.', 'error');
    });
}

// Função para compartilhar (Web Share API)
function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(console.error);
    } else {
        // Fallback para navegadores sem suporte
        copyToClipboard(url);
    }
}

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para scroll suave para elemento
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// ===== CSS DINÂMICO =====
const dynamicStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .alert-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
    }
    
    .error-message {
        animation: fadeInUp 0.3s ease-out;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-primary);
            border-top: 1px solid var(--border-color);
            padding: 1rem;
            box-shadow: var(--shadow-lg);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Adiciona estilos dinâmicos
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);
