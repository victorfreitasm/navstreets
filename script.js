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

// Função para pegar preço real
function parsePrice(priceStr){
    if(!priceStr) return 0;
    const clean = priceStr.replace(/[^\d,.-]/g,'').replace(',','.');
    const value = parseFloat(clean);
    return isNaN(value) ? 0 : value;
}

// Adicionar produto ao carrinho
function addToCart(product){
    const productName = product.querySelector('h3').textContent.trim();
    const productPriceEl = product.querySelector('.price'); // pega preço real
    const productPrice = parsePrice(productPriceEl.textContent);
    const productImg = product.querySelector('img').src;

    const existing = cart.find(item => item.name === productName);
    if(existing){
        existing.quantity++;
    }else{
        cart.push({name: productName, price: productPrice, img: productImg, quantity:1});
    }
    updateCart();
}

// Atualizar carrinho
function updateCart(){
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach((item,index)=>{
        total += item.price * item.quantity;
        count += item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                <p class="item-total">Subtotal: R$ ${(item.price*item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    totalPriceEl.textContent = `R$ ${total.toFixed(2)}`;
    cartCount.textContent = count;

    document.querySelectorAll('.remove-item').forEach(btn=>{
        btn.addEventListener('click',()=>{
            const index = parseInt(btn.getAttribute('data-index'));
            cart.splice(index,1);
            updateCart();
        });
    });
}

clearCartBtn.addEventListener('click',()=>{
    cart = [];
    updateCart();
});

document.querySelectorAll('.product .fa-shopping-cart').forEach(btn=>{
    btn.parentElement.addEventListener('click',(e)=>{
        e.preventDefault();
        const product = btn.closest('.product');
        addToCart(product);
    });
});

// ==========================
// Checkout PIX + WhatsApp
// ==========================
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeModal = document.getElementById("closeModal");
const pixQr = document.getElementById("pixQr");
const whatsappLink = document.getElementById("whatsappLink");

const pixQrCode = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIXCODEAQUI";
const whatsappNumber = "5584996058933";

checkoutBtn.addEventListener("click",()=>{
    pixQr.src = pixQrCode;
    let mensagem = "Olá, segue o comprovante do meu pagamento da NAV STREETS.\n\nItens comprados:\n";
    cart.forEach(item=>{
        mensagem += `- ${item.name} (${item.quantity}x): R$ ${(item.price*item.quantity).toFixed(2)}\n`;
    });
    mensagem += `\nTotal: R$ ${cart.reduce((total,item)=>total+(item.price*item.quantity),0).toFixed(2)}`;

    const encodedMessage = encodeURIComponent(mensagem);
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    whatsappLink.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar comprovante pelo WhatsApp';
    checkoutModal.style.display = "flex";
});

closeModal.addEventListener('click',()=>{checkoutModal.style.display='none';});
window.addEventListener('click',(e)=>{if(e.target==checkoutModal) checkoutModal.style.display='none';});

// ==========================
// Login simples
// ==========================
const userIcon = document.getElementById('userIcon');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginBtn = document.getElementById('loginBtn');
const userInfo = document.getElementById('userInfo');
const userNameEl = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

userIcon.addEventListener('click',()=>{loginModal.style.display='flex';});
closeLoginModal.addEventListener('click',()=>{loginModal.style.display='none';});

loginBtn.addEventListener('click',()=>{
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if(username && password){
        localStorage.setItem('userLoggedIn','true');
        localStorage.setItem('userName',username);
        displayUserInfo();
        loginModal.style.display='none';
    }else{
        alert('Preencha usuário e senha');
    }
});

function displayUserInfo(){
    if(localStorage.getItem('userLoggedIn')==='true'){
        userInfo.style.display='block';
        userNameEl.textContent = localStorage.getItem('userName');
    }
}

logoutBtn.addEventListener('click',()=>{
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    userInfo.style.display='none';
});
window.addEventListener('load',displayUserInfo);
