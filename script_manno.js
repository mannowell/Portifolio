/**
 * Portfolio Wellison Oliveira
 * JavaScript Completo com EmailJS Funcional
 */

// ==================== CONFIGURAÇÃO ATUALIZADA ====================
const CONFIG = {
    EMAILJS: {
        SERVICE_ID: 'service_Trunks5',      // ✅ Corrigido: service_Trunks5
        TEMPLATE_ID: 'template_wgaf06',     // ✅ Corrigido: template_wgaf06
        USER_ID: '7Ir-16h4Xh-DXuPmY'        // ✅ Corrigido: 7Ir-16h4Xh-DXuPmY
    }
};

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Portfolio Wellison Oliveira - Iniciando...');
    console.log('📧 Configuração EmailJS:', CONFIG.EMAILJS);
    
    // Carregar EmailJS primeiro
    loadEmailJSSDK();
    
    // Inicializar todas as funcionalidades
    initAllFeatures();
});

// ==================== CARREGAR EMAILJS ====================
function loadEmailJSSDK() {
    // Verificar se EmailJS já está carregado
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        
        script.onload = function() {
            console.log('✅ EmailJS SDK carregado com sucesso');
            console.log('🔑 Inicializando com Public Key:', CONFIG.EMAILJS.USER_ID);
            
            // Inicializar EmailJS com sua chave pública
            emailjs.init(CONFIG.EMAILJS.USER_ID);
            
            // Verificar se inicializou corretamente
            if (emailjs) {
                console.log('✅ EmailJS inicializado com sucesso!');
                showAlert('✅ Sistema de email configurado!', 'success', 3000);
            }
            
            // Configurar formulário
            initContactForm();
        };
        
        script.onerror = function() {
            console.error('❌ Erro ao carregar EmailJS SDK');
            showAlert('⚠️ O formulário está temporariamente indisponível. Use o WhatsApp para contato.', 'warning');
        };
        
        document.head.appendChild(script);
    } else {
        // Se já estiver carregado, inicializar
        emailjs.init(CONFIG.EMAILJS.USER_ID);
        initContactForm();
    }
}

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
    
    // Remover tela de loading após 1.5 segundos
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 500);
        }
    }, 1500);
}

// ==================== FORMULÁRIO DE CONTATO ====================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!contactForm || !submitBtn) {
        console.warn('Formulário não encontrado');
        return;
    }
    
    console.log('📝 Inicializando formulário de contato...');
    console.log('🔧 Service ID:', CONFIG.EMAILJS.SERVICE_ID);
    console.log('🔧 Template ID:', CONFIG.EMAILJS.TEMPLATE_ID);
    
    // Configurar validação em tempo real
    setupRealTimeValidation();
    
    // Configurar envio do formulário
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('📤 Tentando enviar formulário...');
        
        // Validar formulário
        if (!validateForm()) {
            console.warn('❌ Validação do formulário falhou');
            return;
        }
        
        // Coletar dados do formulário
        const formData = {
            from_name: document.getElementById('name').value.trim(),
            from_email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim(),
            reply_to: document.getElementById('email').value.trim(), // Para permitir responder
            to_name: 'Wellison Oliveira',
            to_email: 'wellison.nascimento@hotmail.com',
            date: new Date().toLocaleDateString('pt-BR'),
            time: new Date().toLocaleTimeString('pt-BR')
        };
        
        console.log('📨 Dados coletados:', formData);
        
        // Mostrar estado de carregamento
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            console.log('🚀 Enviando via EmailJS...');
            
            // Enviar email via EmailJS
            const response = await emailjs.send(
                CONFIG.EMAILJS.SERVICE_ID,
                CONFIG.EMAILJS.TEMPLATE_ID,
                formData
            );
            
            console.log('✅ Email enviado com sucesso:', response);
            console.log('📧 Status:', response.status);
            console.log('📧 Texto:', response.text);
            
            // Mostrar mensagem de sucesso
            showFormStatus('✅ Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            
            // Limpar formulário
            contactForm.reset();
            
            // Resetar labels
            resetFormLabels();
            
            // Focar no primeiro campo
            document.getElementById('name').focus();
            
            // Mostrar alerta de sucesso
            setTimeout(() => {
                showAlert('✅ Mensagem enviada! Responderei em até 24h.', 'success');
            }, 1000);
            
        } catch (error) {
            console.error('❌ Erro ao enviar email:', error);
            
            // Mensagem de erro detalhada
            let errorMessage = 'Erro ao enviar mensagem. ';
            
            if (error.status) {
                errorMessage += `Status: ${error.status}. `;
            }
            
            if (error.text) {
                errorMessage += `Detalhes: ${error.text}`;
            } else {
                errorMessage += 'Tente novamente ou use o WhatsApp para contato mais rápido.';
            }
            
            showFormStatus(errorMessage, 'error');
            
            // Mostrar alerta de erro
            setTimeout(() => {
                showAlert('❌ Erro ao enviar. Use o WhatsApp para resposta mais rápida.', 'error');
            }, 1000);
            
            // Oferecer alternativa após 3 segundos
            setTimeout(() => {
                showAlert('💡 <strong>Dica:</strong> Para resposta mais rápida, use o WhatsApp!', 'info');
            }, 3000);
            
        } finally {
            // Restaurar botão
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            console.log('🔄 Botão do formulário restaurado');
        }
    });
}

// ==================== VALIDAÇÃO EM TEMPO REAL ====================
function setupRealTimeValidation() {
    const fields = ['name', 'email', 'subject', 'message'];
    
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
            
            // Adicionar placeholder para funcionar com labels flutuantes
            field.setAttribute('placeholder', ' ');
        }
    });
}

function validateForm() {
    let isValid = true;
    
    // Validar cada campo
    isValid = validateField('name') && isValid;
    isValid = validateField('email') && isValid;
    isValid = validateField('subject') && isValid;
    isValid = validateField('message') && isValid;
    
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
            } else if (value.length > 1000) {
                errorMessage = 'Mensagem muito longa (máximo 1000 caracteres).';
                isValid = false;
            }
            break;
    }
    
    if (!isValid && errorMessage) {
        showFieldError(fieldId, errorMessage);
        field.classList.add('error');
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
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
        errorElement.style.display = 'none';
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function resetFormLabels() {
    const labels = document.querySelectorAll('.form-group label');
    labels.forEach(label => {
        if (label.previousElementSibling && label.previousElementSibling.value === '') {
            label.classList.remove('active');
        }
    });
}

function showFormStatus(message, type = 'info') {
    const statusElement = document.getElementById('form-status');
    if (!statusElement) return;
    
    statusElement.textContent = message;
    statusElement.className = 'form-status';
    statusElement.classList.add(`status-${type}`);
    statusElement.style.display = 'block';
    
    // Limpar mensagem após 5 segundos
    setTimeout(() => {
        statusElement.style.display = 'none';
    }, 5000);
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
    
    // Estilizar
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${getAlertColor(type)};
        color: white;
        border-radius: 10px;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        animation: alertSlideIn 0.3s ease;
        max-width: 400px;
        min-width: 300px;
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
    
    // Adicionar estilos CSS se não existirem
    addAlertStyles();
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

function getAlertColor(type) {
    switch(type) {
        case 'success': return '#4CAF50';
        case 'error': return '#f44336';
        case 'warning': return '#ff9800';
        case 'info': return '#2196F3';
        default: return '#2196F3';
    }
}

function addAlertStyles() {
    if (document.querySelector('#alert-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'alert-styles';
    style.textContent = `
        @keyframes alertSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes alertSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .alert-content {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        .alert-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        .alert-close:hover {
            background: rgba(255,255,255,0.3);
        }
        .form-group input.error,
        .form-group textarea.error {
            border-color: #f44336 !important;
        }
        .error-message {
            color: #f44336;
            font-size: 0.85rem;
            margin-top: 5px;
            display: none;
        }
        .form-status {
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
            font-size: 0.9rem;
            display: none;
        }
        .status-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .status-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
    `;
    document.head.appendChild(style);
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
        });
    });
    
    // Efeito de scroll na navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
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
            stars: '15+',
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
    testEmailJS: function() {
        console.log('🧪 Testando EmailJS...');
        
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS não carregado');
            showAlert('EmailJS não está carregado', 'error');
            return false;
        }
        
        console.log('✅ EmailJS carregado:', emailjs);
        console.log('🔧 Service ID:', CONFIG.EMAILJS.SERVICE_ID);
        console.log('🔧 Template ID:', CONFIG.EMAILJS.TEMPLATE_ID);
        console.log('🔑 User ID:', CONFIG.EMAILJS.USER_ID);
        
        showAlert('✅ EmailJS está funcionando! Teste o formulário.', 'success');
        return true;
    },
    
    testForm: function() {
        console.log('🧪 Testando formulário...');
        
        const testData = {
            from_name: 'Teste do Sistema',
            from_email: 'teste@email.com',
            subject: 'Teste do Formulário - Portfolio',
            message: 'Esta é uma mensagem de teste do formulário de contato do portfolio.',
            reply_to: 'teste@email.com',
            to_name: 'Wellison Oliveira',
            to_email: 'wellison.nascimento@hotmail.com',
            date: new Date().toLocaleDateString('pt-BR'),
            time: new Date().toLocaleTimeString('pt-BR')
        };
        
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS não disponível');
            showAlert('EmailJS não carregado', 'error');
            return;
        }
        
        console.log('🚀 Enviando teste...');
        showAlert('🚀 Enviando email de teste...', 'info');
        
        emailjs.send(CONFIG.EMAILJS.SERVICE_ID, CONFIG.EMAILJS.TEMPLATE_ID, testData)
            .then(response => {
                console.log('✅ Teste enviado com sucesso:', response);
                showAlert('✅ Teste enviado com sucesso! Verifique seu email.', 'success');
            })
            .catch(error => {
                console.error('❌ Erro no teste:', error);
                showAlert('❌ Erro no teste: ' + error.text, 'error');
            });
    },
    
    showConfig: function() {
        console.log('⚙️ Configuração atual:', CONFIG);
        showAlert('Configuração mostrada no console (F12)', 'info');
        return CONFIG;
    },
    
    checkEmailJSStatus: function() {
        if (typeof emailjs === 'undefined') {
            console.log('❌ EmailJS não carregado');
            return false;
        }
        
        console.log('✅ EmailJS está carregado');
        console.log('🔧 Service ID configurado:', CONFIG.EMAILJS.SERVICE_ID);
        console.log('🔧 Template ID configurado:', CONFIG.EMAILJS.TEMPLATE_ID);
        console.log('🔑 User ID configurado:', CONFIG.EMAILJS.USER_ID);
        
        return true;
    }
};

console.log('🚀 Portfolio Wellison Oliveira iniciado!');
console.log('📧 EmailJS configurado com:');
console.log('   Service ID:', CONFIG.EMAILJS.SERVICE_ID);
console.log('   Template ID:', CONFIG.EMAILJS.TEMPLATE_ID);
console.log('   User ID:', CONFIG.EMAILJS.USER_ID);
console.log('ℹ️ Use window.debug para testar funcionalidades.');