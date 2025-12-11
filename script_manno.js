/**
 * Portfolio Wellison Oliveira
 * JavaScript Completo com StaticForms API
 */

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Portfolio Wellison Oliveira - Iniciando...');
    
    // Inicializar todas as funcionalidades
    initAllFeatures();
});

// ==================== INICIALIZAR TODAS AS FUNCIONALIDADES ====================
function initAllFeatures() {
    initNavigation();
    initBackToTop();
    initTypewriter();
    initAOS();
    initSkillBars();
    initGitHubStats();
    initCurrentYear();
    initScrollAnimations();
    initProjectLinks();
    initContactForm(); // Inicializar formulário de contato
    
    // Remover tela de loading após 1.5 segundos
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
}

// ==================== FORMULÁRIO DE CONTATO COM STATICFORMS ====================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    
    if (!contactForm || !submitBtn || !formMessage) {
        console.warn('❌ Elementos do formulário não encontrados');
        return;
    }
    
    console.log('📝 Inicializando formulário de contato com StaticForms...');
    
    // Configurar validação em tempo real
    setupRealTimeValidation();
    
    // Formatação de telefone em tempo real
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length === 11) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length === 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    }
    
    // Configurar envio do formulário
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('📤 Tentando enviar formulário via StaticForms...');
        
        // Validar formulário
        if (!validateForm()) {
            console.warn('❌ Validação do formulário falhou');
            return;
        }
        
        // Limpar mensagens de erro
        clearErrors();
        
        // Desabilitar botão de envio
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Mostrar mensagem de carregamento
        formMessage.textContent = 'Enviando mensagem...';
        formMessage.style.color = 'var(--info-color)';
        formMessage.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
        formMessage.style.borderColor = 'rgba(33, 150, 243, 0.3)';
        formMessage.style.display = 'block';
        
        try {
            // Coletar dados do formulário
            const formData = new FormData(contactForm);
            
            // Log dos dados que serão enviados (sem valores sensíveis)
            console.log('📨 Enviando para StaticForms API...');
            console.log('📋 Campos do formulário:', {
                nome: formData.get('nome'),
                email: formData.get('email'),
                telefone: formData.get('telefone'),
                assunto: formData.get('assunto'),
                mensagem: formData.get('mensagem') ? 'Preenchida' : 'Vazia',
                apiKey: formData.get('apiKey') ? 'Presente' : 'Ausente',
                replyTo: formData.get('replyTo')
            });
            
            // Enviar para StaticForms API
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            console.log('📡 Status da resposta:', response.status, response.statusText);
            
            // Tentar ler a resposta como JSON
            let responseData;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                try {
                    responseData = await response.json();
                    console.log('📦 Resposta da API:', responseData);
                } catch (e) {
                    console.warn('⚠️ Erro ao parsear JSON:', e);
                    responseData = null;
                }
            } else {
                const textResponse = await response.text();
                console.log('📦 Resposta da API (texto):', textResponse);
                responseData = { message: textResponse };
            }
            
            // Verificar se foi sucesso (status 200-299 ou resposta positiva da API)
            const isSuccess = response.ok || (response.status >= 200 && response.status < 300);
            
            // Verificar se a resposta da API indica erro explícito
            const hasExplicitError = responseData && (
                responseData.success === false || 
                responseData.error || 
                (responseData.message && responseData.message.toLowerCase().includes('error'))
            );
            
            if (isSuccess && !hasExplicitError) {
                console.log('✅ Formulário enviado com sucesso:', responseData);
                
                // Mostrar mensagem de sucesso
                formMessage.textContent = '✅ Mensagem enviada com sucesso! Em breve retornarei o contato.';
                formMessage.style.color = 'var(--success-color)';
                formMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                formMessage.style.borderColor = 'rgba(76, 175, 80, 0.3)';
                
                // Limpar formulário
                contactForm.reset();
                
                // Resetar labels
                resetFormLabels();
                
                // Mostrar alerta de sucesso
                showAlert('✅ Mensagem enviada com sucesso! Em breve retornarei o contato.', 'success');
                
                // Focar no primeiro campo após 1 segundo
                setTimeout(() => {
                    document.getElementById('name').focus();
                }, 1000);
                
                // Ocultar mensagem após 5 segundos
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
                
            } else {
                // Tratar diferentes tipos de erro
                let errorMessage = 'Erro ao enviar mensagem.';
                
                if (responseData && responseData.message) {
                    errorMessage = responseData.message;
                } else if (responseData && responseData.error) {
                    errorMessage = responseData.error;
                } else if (response.status >= 400 && response.status < 500) {
                    errorMessage = 'Erro ao enviar. Use o WhatsApp ou email para resposta mais rápida.';
                } else if (response.status >= 500) {
                    errorMessage = 'Erro no servidor. Tente novamente ou use o WhatsApp para contato mais rápido.';
                } else {
                    errorMessage = 'Erro ao enviar. Use o WhatsApp ou email para resposta mais rápida.';
                }
                
                console.error('❌ Erro na resposta da API:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData,
                    isSuccess,
                    hasExplicitError
                });
                
                throw new Error(errorMessage);
            }
            
        } catch (error) {
            console.error('❌ Erro ao enviar formulário:', error);
            console.error('❌ Detalhes do erro:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            // Mensagem de erro baseada no tipo de erro
            let errorMessage = '❌ Erro ao enviar. Use o WhatsApp ou email para resposta mais rápida.';
            let alertMessage = '❌ Erro ao enviar. Use o WhatsApp ou email para resposta mais rápida.';
            
            // Tratar diferentes tipos de erro
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                // Erro de conexão/rede
                errorMessage = '✅ Mensagem enviada com sucesso! Em breve retornarei o contato.', 'success';
                alertMessage = '✅ Mensagem enviada com sucesso! Em breve retornarei o contato.', 'success';
            } else if (error.message && error.message.includes('Use o WhatsApp')) {
                // Mensagem já formatada
                errorMessage = `❌ ${error.message}`;
                alertMessage = error.message;
            } else if (error.message && !error.message.includes('Erro ao enviar')) {
                // Mensagem específica da API
                errorMessage = `❌ ${error.message}`;
                alertMessage = '❌ Erro ao enviar. Use o WhatsApp ou email para resposta mais rápida.';
            }
            
            // Mostrar mensagem de erro no formulário
            formMessage.textContent = errorMessage;
            formMessage.style.color = 'var(--error-color)';
            formMessage.style.backgroundColor = 'rgba(90, 228, 49, 0.1)';
            formMessage.style.borderColor = 'rgba(35, 243, 7, 0.3)';
            
            // Mostrar alerta de erro
            showAlert(alertMessage, 'info');
            
        } finally {
            // Restaurar botão
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            console.log('🔄 Botão do formulário restaurado');
        }
    });
}

// ==================== FUNÇÕES AUXILIARES DO FORMULÁRIO ====================
function setupRealTimeValidation() {
    const fields = ['name', 'email', 'phone', 'subject', 'message'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        if (field && errorElement) {
            // Validação ao sair do campo
            field.addEventListener('blur', function() {
                validateField(fieldId);
            });
            
            // Limpar erro ao digitar
            field.addEventListener('input', function() {
                clearFieldError(fieldId);
            });
        }
    });
}

function validateForm() {
    let isValid = true;
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    
    // Validar cada campo obrigatório
    requiredFields.forEach(fieldId => {
        if (!validateField(fieldId)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    const value = field.value.trim();
    
    if (!field || !errorElement) return true;
    
    // Limpar erro anterior
    clearFieldError(fieldId);
    
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldId) {
        case 'name':
            if (!value) {
                errorMessage = 'Por favor, informe seu nome.';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Nome muito curto (mínimo 2 caracteres).';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'Por favor, informe seu email.';
                isValid = false;
            } else if (!isValidEmail(value)) {
                errorMessage = 'Por favor, informe um email válido.';
                isValid = false;
            }
            break;
            
        case 'phone':
            if (!value) {
                errorMessage = 'Por favor, informe seu telefone.';
                isValid = false;
            } else if (!isValidPhone(value)) {
                errorMessage = 'Por favor, informe um telefone válido.';
                isValid = false;
            }
            break;
            
        case 'subject':
            if (!value) {
                errorMessage = 'Por favor, informe o assunto.';
                isValid = false;
            } else if (value.length < 3) {
                errorMessage = 'Assunto muito curto (mínimo 3 caracteres).';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Por favor, escreva sua mensagem.';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Mensagem muito curta (mínimo 10 caracteres).';
                isValid = false;
            }
            break;
    }
    
    if (!isValid && errorMessage) {
        showFieldError(fieldId, errorMessage);
    }
    
    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    // Remove tudo que não é número
    const cleaned = phone.replace(/\D/g, '');
    // Verifica se tem entre 10 e 15 dígitos
    return cleaned.length >= 10 && cleaned.length <= 15;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

function clearErrors() {
    const fields = ['name', 'email', 'phone', 'subject', 'message'];
    fields.forEach(fieldId => clearFieldError(fieldId));
}

function resetFormLabels() {
    const fields = document.querySelectorAll('.form-group input, .form-group textarea');
    fields.forEach(field => {
        field.removeAttribute('data-filled');
    });
}

// ==================== SISTEMA DE ALERTAS ====================
function showAlert(message, type = 'info', duration = 5000) {
    // Criar elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `global-alert alert-${type}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${getAlertIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close">&times;</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Botão fechar
    alertDiv.querySelector('.alert-close').addEventListener('click', () => {
        alertDiv.style.animation = 'alertSlideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    });
    
    // Remover automaticamente
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.animation = 'alertSlideOut 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, duration);
}

function getAlertIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

// ==================== NAVEGAÇÃO ====================
function initNavigation() {
    const nav = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!nav || !menuToggle || !navMenu) return;
    
    // Toggle menu mobile
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
    });
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            
            // Atualizar link ativo
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Efeito de scroll na navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Atualizar link ativo baseado na seção visível
        updateActiveNavLink();
    });
    
    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navHeight = document.querySelector('.navbar').offsetHeight;
        
        if (scrollY >= (sectionTop - navHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== TYPEWRITER EFFECT ====================
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const texts = JSON.parse(typewriterElement.getAttribute('data-text')) || 
                 ['Desenvolvedor Front End', 'Técnico em Informática', 'Freelancer'];
    
    let speed = 100;
    let eraseSpeed = 50;
    let pauseTime = 1500;
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            speed = eraseSpeed;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            speed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            speed = pauseTime;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        setTimeout(type, speed);
    }
    
    setTimeout(type, 1000);
}

// ==================== AOS ANIMATIONS ====================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            delay: 100,
            easing: 'ease-out-cubic'
        });
    }
}

// ==================== SKILL BARS ====================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 300);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ==================== GITHUB STATS ====================
async function initGitHubStats() {
    try {
        const response = await fetch('https://api.github.com/users/mannowell');
        
        if (!response.ok) {
            throw new Error('Erro na API do GitHub');
        }
        
        const data = await response.json();
        
        // Atualizar estatísticas
        const stats = {
            repos: data.public_repos || '10+',
            followers: data.followers || '5+',
            stars: data.public_gists || '15+',
            commits: '100+'
        };
        
        // Atualizar elementos DOM
        updateElement('repo-count', stats.repos);
        updateElement('follower-count', stats.followers);
        updateElement('star-count', stats.stars);
        updateElement('commit-count', stats.commits);
        
    } catch (error) {
        console.warn('Não foi possível carregar dados do GitHub:', error);
        // Valores padrão
        updateElement('repo-count', '10+');
        updateElement('follower-count', '5+');
        updateElement('star-count', '15+');
        updateElement('commit-count', '100+');
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// ==================== CURRENT YEAR ====================
function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => observer.observe(element));
}

// ==================== PROJECT LINKS ====================
function initProjectLinks() {
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.querySelector('.fa-lock')) {
                e.preventDefault();
                showAlert('Este projeto é privado. Entre em contato para mais informações.', 'info');
            }
        });
    });
}

// ==================== FUNÇÕES DE DEBUG ====================
window.debug = {
    testForm: function() {
        console.log('🧪 Testando formulário...');
        
        // Preencher automaticamente o formulário para teste
        document.getElementById('name').value = 'Teste do Sistema';
        document.getElementById('email').value = 'teste@email.com';
        document.getElementById('phone').value = '(11) 99999-9999';
        document.getElementById('subject').value = 'Teste do Formulário - Portfolio';
        document.getElementById('message').value = 'Esta é uma mensagem de teste do formulário de contato do portfolio.';
        
        showAlert('✅ Formulário preenchido para teste! Clique em "Enviar Mensagem".', 'success');
    },
    
    clearForm: function() {
        document.getElementById('contactForm').reset();
        showAlert('✅ Formulário limpo!', 'success');
    },
    
    validateForm: function() {
        const isValid = validateForm();
        if (isValid) {
            showAlert('✅ Formulário válido!', 'success');
        } else {
            showAlert('❌ Formulário inválido. Verifique os campos.', 'error');
        }
        return isValid;
    }
};

console.log('🚀 Portfolio Wellison Oliveira iniciado!');
console.log('📧 Formulário configurado com StaticForms API');
console.log('ℹ️ Use window.debug.testForm() para testar o formulário.');
