// ==========================
// Mobile Navigation Toggle
// ==========================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ==========================
// Product Filtering
// ==========================
const filterBtns = document.querySelectorAll('.filter-btn');
const products = document.querySelectorAll('.product');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');
        const filterValue = btn.getAttribute('data-filter');
        products.forEach(product => {
            if (filterValue === 'all' || product.getAttribute('data-category') === filterValue) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
});

// ==========================
// Carrinho de Compras
// ==========================
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceEl = document.querySelector('.total-price');
const cartCount = document.querySelector('.cart-count');
const clearCartBtn = document.querySelector('.clear-cart-btn');

let cart = [];

// Abrir e fechar carrinho
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});
closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});
cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Função para adicionar produto ao carrinho
function addToCart(product) {
    const productName = product.querySelector('h3').textContent;
    const productPrice = product.querySelector('.price').textContent.replace('$','').replace('R$','').trim();
    const productImg = product.querySelector('img').src;

    const existing = cart.find(item => item.name === productName);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name: productName, price: parseFloat(productPrice), img: productImg, quantity: 1 });
    }
    updateCart();
}

// Atualizar carrinho
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                <p class="item-total">Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    totalPriceEl.textContent = `R$ ${total.toFixed(2)}`;
    cartCount.textContent = count;

    // Remover item
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// Botão limpar carrinho
clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCart();
});

// Vincular botões de "adicionar ao carrinho"
document.querySelectorAll('.product .fa-shopping-cart').forEach(btn => {
    btn.parentElement.addEventListener('click', (e) => {
        e.preventDefault();
        const product = btn.closest('.product');
        addToCart(product);
    });
});

// --- Checkout PIX + WhatsApp ---
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeModal = document.getElementById("closeModal");
const pixQr = document.getElementById("pixQr");
const whatsappLink = document.getElementById("whatsappLink");

// ⚡️ QR code do PIX e WhatsApp configurados:
const pixQrCode = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX0136f28e4e58-36cf-4641-9b15-3d3a5ca7a2ba5204000053039865802BR5925Victor%20Gabriel%20de%20Freitas%20Morais6009SAO%20PAULO62070503***6304E2CA";
const whatsappNumber = "5584996058933"; // número no formato 55 + DDD + número

// Abrir o modal quando clicar em Finalizar Compra
checkoutBtn.addEventListener("click", () => {
    pixQr.src = pixQrCode;
    
    // Criar mensagem com detalhes da compra
    let mensagem = "Olá, segue o comprovante do meu pagamento da NAV STREETS.\n\n";
    mensagem += "Itens comprados:\n";
    
    cart.forEach(item => {
        mensagem += `- ${item.name} (${item.quantity}x): R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    mensagem += `\nTotal: R$ ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`;
    
    // Mensagem automática para o WhatsApp com detalhes da compra
    const encodedMessage = encodeURIComponent(mensagem);
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    whatsappLink.textContent = "Enviar comprovante pelo WhatsApp";
    whatsappLink.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar comprovante pelo WhatsApp';
    
    checkoutModal.style.display = "flex";
});

// Fechar o modal
closeModal.addEventListener("click", () => {
    checkoutModal.style.display = "none";
});

// Fechar o modal clicando fora dele
window.addEventListener("click", (event) => {
    if (event.target == checkoutModal) {
        checkoutModal.style.display = "none";
    }
});


// ==========================
// Newsletter Form Submission
// ==========================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        if (email) {
            const formContainer = newsletterForm.parentElement;
            formContainer.innerHTML = '<h2>Obrigado!</h2><p>Você se inscreveu com sucesso.</p>';
            formContainer.style.animation = 'fadeInUp 1s ease';
        }
    });
}

// ==========================
// Contact Form Submission
// ==========================

// ==========================
// Login com Google
// ==========================
const userIcon = document.getElementById('userIcon');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const userInfo = document.getElementById('userInfo');
const userPhoto = document.getElementById('userPhoto');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

// Abrir modal de login
userIcon.addEventListener('click', (e) => {
    e.preventDefault();
    if (localStorage.getItem('userLoggedIn') === 'true') {
        // Se o usuário já estiver logado, mostra as informações dele
        displayUserInfo();
    }
    loginModal.style.display = 'flex';
});

// Fechar modal de login
closeLoginModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Fechar modal clicando fora dele
window.addEventListener('click', (event) => {
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
});

// Botão de login com Google
googleLoginBtn.addEventListener('click', () => {
    // Simulação de login para demonstração
    simulateGoogleLogin();
});

// Função para simular login com Google (para demonstração)
function simulateGoogleLogin() {
    const mockUser = {
        name: 'Victor Gabriel',
        email: 'victor@gmail.com',
        picture: 'https://via.placeholder.com/80x80'
    };
    
    // Salvar dados do usuário
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName', mockUser.name);
    localStorage.setItem('userEmail', mockUser.email);
    localStorage.setItem('userPhoto', mockUser.picture);
    
    // Mostrar informações do usuário
    displayUserInfo();
}

// Função para exibir informações do usuário
function displayUserInfo() {
    if (localStorage.getItem('userLoggedIn') === 'true') {
        googleLoginBtn.style.display = 'none';
        userInfo.style.display = 'block';
        
        userName.textContent = localStorage.getItem('userName');
        userEmail.textContent = localStorage.getItem('userEmail');
        userPhoto.src = localStorage.getItem('userPhoto');
    }
}

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhoto');
    
    googleLoginBtn.style.display = 'block';
    userInfo.style.display = 'none';
    
    loginModal.style.display = 'none';
});

// Verificar se o usuário está logado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userLoggedIn') === 'true') {
        displayUserInfo();
    }
});
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const messageInput = contactForm.querySelector('textarea');
        
        if (nameInput.value && emailInput.value && messageInput.value) {
            contactForm.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Mensagem enviada!</h3><p>Responderemos em breve.</p></div>';
            const successMessage = contactForm.querySelector('.success-message');
            successMessage.style.textAlign = 'center';
            successMessage.style.padding = '30px';
            const icon = successMessage.querySelector('i');
            icon.style.fontSize = '3rem';
            icon.style.color = 'var(--primary-color)';
            icon.style.marginBottom = '20px';
        }
    });
}

// ==========================
// Smooth Scroll
// ==========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================
// Load More Products Button
// ==========================
const loadMoreBtn = document.querySelector('.load-more .btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        loadMoreBtn.textContent = 'Sem mais produtos';
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.backgroundColor = '#999';
        loadMoreBtn.style.cursor = 'not-allowed';
    });
}

// ==========================
// Animation On Scroll
// ==========================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.category, .product, .about-img, .about-content, .contact-form, .contact-info');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

document.querySelectorAll('.category, .product, .about-img, .about-content, .contact-form, .contact-info').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.8s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
