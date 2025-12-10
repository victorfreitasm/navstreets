// ==========================
// Scroll Effects & Animations
// ==========================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    // Navbar scroll effect
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    // Parallax effect on hero
    const hero = document.getElementById('hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Back to top functionality
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('[data-scroll-reveal]');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

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
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'scale(1)';
                }, 10);
            } else {
                product.style.opacity = '0';
                product.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    product.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ==========================
// Sistema de Favoritos
// ==========================
let favorites = JSON.parse(localStorage.getItem('navstreets_favorites')) || [];
const favoritesIcon = document.getElementById('favoritesIcon');
const favoritesSidebar = document.querySelector('.favorites-sidebar');
const closeFavoritesBtn = document.querySelector('.close-favorites');
const favoritesItemsContainer = document.querySelector('.favorites-items');
const favoritesCount = document.querySelector('.favorites-count');
const clearFavoritesBtn = document.querySelector('.clear-favorites-btn');
const cartOverlay = document.querySelector('.cart-overlay');

// Abrir sidebar de favoritos
favoritesIcon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    favoritesSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.querySelector('.cart-sidebar').classList.remove('active');
});

// Fechar sidebar de favoritos
closeFavoritesBtn.addEventListener('click', () => {
    favoritesSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Atualizar UI dos favoritos
function updateFavoritesUI() {
    favoritesCount.textContent = favorites.length;
    
    if (favorites.length === 0) {
        favoritesItemsContainer.innerHTML = `
            <div class="empty-favorites">
                <i class="fas fa-heart"></i>
                <p>Nenhum favorito ainda</p>
                <a href="#products" class="btn btn-sm">Ver Produtos</a>
            </div>
        `;
    } else {
        favoritesItemsContainer.innerHTML = '';
        favorites.forEach((fav, index) => {
            const favItem = document.createElement('div');
            favItem.classList.add('favorite-item');
            favItem.innerHTML = `
                <img src="${fav.img}" alt="${fav.name}">
                <div class="favorite-item-info">
                    <h4>${fav.name}</h4>
                    <p>R$ ${parseFloat(fav.price).toFixed(2)}</p>
                </div>
                <div class="favorite-item-actions">
                    <button class="add-fav-to-cart" data-index="${index}" title="Adicionar ao carrinho">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="remove-favorite" data-index="${index}" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            favoritesItemsContainer.appendChild(favItem);
        });
        
        // Remover favorito
        document.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                favorites.splice(index, 1);
                localStorage.setItem('navstreets_favorites', JSON.stringify(favorites));
                updateFavoritesUI();
                updateFavoriteButtons();
                showNotification('Removido dos favoritos');
            });
        });

        // Adicionar favorito ao carrinho
        document.querySelectorAll('.add-fav-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                const fav = favorites[index];
                const product = Array.from(document.querySelectorAll('.product')).find(
                    p => p.getAttribute('data-name') === fav.name
                );
                if (product) {
                    addToCart(product);
                }
            });
        });
    }
}

// Atualizar botões de favoritos nos produtos
function updateFavoriteButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const product = btn.closest('.product');
        const productName = product.getAttribute('data-name');
        const isFavorited = favorites.some(fav => fav.name === productName);
        
        if (isFavorited) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Toggle favorito
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const product = btn.closest('.product');
        const productName = product.getAttribute('data-name');
        const productPrice = product.getAttribute('data-price');
        const productImg = product.querySelector('img').src;
        
        const existingIndex = favorites.findIndex(fav => fav.name === productName);
        
        if (existingIndex > -1) {
            favorites.splice(existingIndex, 1);
            btn.classList.remove('active');
            showNotification('Removido dos favoritos');
        } else {
            favorites.push({
                name: productName,
                price: productPrice,
                img: productImg
            });
            btn.classList.add('active');
            showNotification('Adicionado aos favoritos!');
        }
        
        localStorage.setItem('navstreets_favorites', JSON.stringify(favorites));
        updateFavoritesUI();
    });
});

// Limpar favoritos
clearFavoritesBtn.addEventListener('click', () => {
    if (favorites.length > 0 && confirm('Deseja limpar todos os favoritos?')) {
        favorites = [];
        localStorage.setItem('navstreets_favorites', JSON.stringify(favorites));
        updateFavoritesUI();
        updateFavoriteButtons();
        showNotification('Favoritos limpos!');
    }
});

// ==========================
// Modal de Visualização de Produto
// ==========================
const productViewModal = document.getElementById('productViewModal');
const closeProductView = document.getElementById('closeProductView');
let currentViewProduct = null;

// Abrir modal de visualização
document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const product = btn.closest('.product');
        currentViewProduct = product;
        
        const productName = product.getAttribute('data-name');
        const productPrice = product.getAttribute('data-price');
        const productTag = product.getAttribute('data-tag');
        const productImg = product.querySelector('img').src;
        
        document.getElementById('viewProductImg').src = productImg;
        document.getElementById('viewProductName').textContent = productName;
        document.getElementById('viewProductPrice').textContent = `R$ ${parseFloat(productPrice).toFixed(2)}`;
        document.getElementById('viewProductTag').textContent = productTag;
        
        // Atualizar botão de favorito no modal
        const isFavorited = favorites.some(fav => fav.name === productName);
        const favBtn = document.getElementById('toggleFavoriteFromView');
        if (isFavorited) {
            favBtn.innerHTML = '<i class="fas fa-heart"></i> Remover dos Favoritos';
            favBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8787)';
        } else {
            favBtn.innerHTML = '<i class="far fa-heart"></i> Adicionar aos Favoritos';
            favBtn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        }
        
        productViewModal.style.display = 'flex';
    });
});

// Fechar modal de visualização
closeProductView.addEventListener('click', () => {
    productViewModal.style.display = 'none';
});

// Adicionar ao carrinho do modal
document.getElementById('addToCartFromView').addEventListener('click', () => {
    if (currentViewProduct) {
        addToCart(currentViewProduct);
        productViewModal.style.display = 'none';
    }
});

// Toggle favorito do modal
document.getElementById('toggleFavoriteFromView').addEventListener('click', () => {
    if (currentViewProduct) {
        const favoriteBtn = currentViewProduct.querySelector('.wishlist-btn');
        favoriteBtn.click();
        
        // Atualizar botão no modal
        const productName = currentViewProduct.getAttribute('data-name');
        const isFavorited = favorites.some(fav => fav.name === productName);
        const favBtn = document.getElementById('toggleFavoriteFromView');
        
        if (isFavorited) {
            favBtn.innerHTML = '<i class="fas fa-heart"></i> Remover dos Favoritos';
            favBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8787)';
        } else {
            favBtn.innerHTML = '<i class="far fa-heart"></i> Adicionar aos Favoritos';
            favBtn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        }
    }
});

// ==========================
// Shopping Cart
// ==========================
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceEl = document.querySelector('.total-price');
const cartCount = document.querySelector('.cart-count');
const clearCartBtn = document.querySelector('.clear-cart-btn');
const cartPreview = document.getElementById('cartPreview');
const viewCartBtn = document.querySelector('.view-cart-btn');

let cart = [];

// Open cart sidebar
cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    favoritesSidebar.classList.remove('active');
});

if (viewCartBtn) {
    viewCartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        favoritesSidebar.classList.remove('active');
    });
}

// Close cart sidebar
closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    favoritesSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Parse price function
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const clean = priceStr.toString().replace(/[^\d,.-]/g, '').replace(',', '.');
    const value = parseFloat(clean);
    return isNaN(value) ? 0 : value;
}

// Add to cart with animation
function addToCart(product) {
    const productName = product.getAttribute('data-name');
    const productPrice = parsePrice(product.getAttribute('data-price'));
    const productImg = product.querySelector('img').src;

    const existing = cart.find(item => item.name === productName);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, img: productImg, quantity: 1 });
    }
    
    // Show add to cart animation
    showNotification('Produto adicionado ao carrinho!');
    updateCart();
    updateCartPreview();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #51cf66, #69db7c);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(81, 207, 102, 0.4);
        z-index: 9999;
        font-weight: 600;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// Update cart
function updateCart() {
    const emptyCart = cartItemsContainer.querySelector('.empty-cart');
    
    if (cart.length === 0) {
        if (!emptyCart) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Seu carrinho está vazio</p>
                    <a href="#products" class="btn btn-sm">Continuar Comprando</a>
                </div>
            `;
        }
    } else {
        if (emptyCart) {
            emptyCart.remove();
        }
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            count += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img class="cart-item-img" src="${item.img}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-qty" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}" readonly>
                        <button class="quantity-btn increase-qty" data-index="${index}">+</button>
                        <button class="remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="item-total">Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        totalPriceEl.textContent = `R$ ${total.toFixed(2)}`;
        cartCount.textContent = count;

        // Attach event listeners for quantity controls
        attachQuantityListeners();
    }
}

// Update cart preview
function updateCartPreview() {
    const previewItems = cartPreview.querySelector('.cart-preview-items');
    const previewTotal = cartPreview.querySelector('.preview-total-price');
    
    if (cart.length === 0) {
        previewItems.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Carrinho vazio</p>';
        previewTotal.textContent = 'R$ 0,00';
    } else {
        previewItems.innerHTML = '';
        let total = 0;
        
        cart.slice(0, 3).forEach(item => {
            total += item.price * item.quantity;
            const previewItem = document.createElement('div');
            previewItem.classList.add('cart-preview-item');
            previewItem.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-preview-item-info">
                    <h5>${item.name}</h5>
                    <p>${item.quantity}x R$ ${item.price.toFixed(2)}</p>
                </div>
            `;
            previewItems.appendChild(previewItem);
        });
        
        if (cart.length > 3) {
            const moreItems = document.createElement('p');
            moreItems.style.cssText = 'text-align: center; color: var(--primary-color); font-weight: 600; margin-top: 10px;';
            moreItems.textContent = `+${cart.length - 3} mais itens`;
            previewItems.appendChild(moreItems);
        }
        
        previewTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
}

// Attach quantity control listeners
function attachQuantityListeners() {
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            cart[index].quantity++;
            updateCart();
            updateCartPreview();
        });
    });

    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                updateCart();
                updateCartPreview();
            }
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCart();
            updateCartPreview();
            showNotification('Produto removido do carrinho');
        });
    });
}

// Clear cart
clearCartBtn.addEventListener('click', () => {
    if (cart.length > 0 && confirm('Deseja limpar todo o carrinho?')) {
        cart = [];
        updateCart();
        updateCartPreview();
        showNotification('Carrinho limpo!');
    }
});

// Add to cart button functionality
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
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

const pixQrCode = "imagens/pix.JPG";
const whatsappNumber = "5584996058933";

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!');
        return;
    }
    
    pixQr.src = pixQrCode;
    let mensagem = "Olá, segue o comprovante do meu pagamento da NAV STREETS.\n\nItens comprados:\n";
    cart.forEach(item => {
        mensagem += `- ${item.name} (${item.quantity}x): R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    mensagem += `\nTotal: R$ ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`;

    const encodedMessage = encodeURIComponent(mensagem);
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    whatsappLink.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar comprovante pelo WhatsApp';
    checkoutModal.style.display = "flex";
});

closeModal.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    if (e.target == productViewModal) {
        productViewModal.style.display = 'none';
    }
});

// ==========================
// Login Modal
// ==========================
const userIcon = document.getElementById('userIcon');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginBtn = document.getElementById('loginBtn');

userIcon.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

closeLoginModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

loginBtn.addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (username && password) {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userName', username);
        loginModal.style.display = 'none';
        showNotification(`Bem-vindo, ${username}!`);
    } else {
        showNotification('Preencha usuário e senha');
    }
});

window.addEventListener('click', (e) => {
    if (e.target == loginModal) {
        loginModal.style.display = 'none';
    }
});

// ==========================
// Add CSS animations dynamically
// ==========================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Initialize
updateFavoritesUI();
updateFavoriteButtons();
updateCart();
updateCartPreview();

// MINIATURAS
document.querySelectorAll(".thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
        const gallery = thumb.closest(".gallery");
        gallery.querySelector(".main-image").src = thumb.dataset.full;

        gallery.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
    });
});

// LUPA / ZOOM
document.querySelectorAll(".main-image-container").forEach(container => {
    const img = container.querySelector(".main-image");
    const lens = container.querySelector(".zoom-lens");

    container.addEventListener("mousemove", e => {
        lens.style.visibility = "visible";

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - lens.offsetWidth / 2;
        const y = e.clientY - rect.top - lens.offsetHeight / 2;

        lens.style.left = `${x}px`;
        lens.style.top = `${y}px`;

        img.style.transform = "scale(1.4)";
    });

    container.addEventListener("mouseleave", () => {
        lens.style.visibility = "hidden";
        img.style.transform = "scale(1)";
    });
});

// ---------------------------
// ABRIR MODAL AO CLICAR NO PRODUTO
// ---------------------------
document.querySelectorAll(".product").forEach(prod => {
    prod.addEventListener("click", () => {

        const name = prod.querySelector("h3").innerText;
        const price = prod.querySelector(".price").innerText;
        const tag = prod.querySelector(".product-tag")?.innerText || "";
        
const images = [
    prod.dataset.front,  // imagem da frente
    prod.dataset.back    // imagem das costas
];

        // coloca dados no modal
        document.getElementById("modalProductName").innerText = name;
        document.getElementById("modalProductPrice").innerText = price;
        document.getElementById("modalProductTag").innerText = tag;

        // imagem principal
        const mainImg = document.getElementById("modalMainImg");
        mainImg.src = images[0];

        // miniaturas
        const thumbsContainer = document.getElementById("modalThumbs");
        thumbsContainer.innerHTML = "";

        images.forEach((img, index) => {
            const thumb = document.createElement("img");
            thumb.src = img;
            thumb.classList.add("thumb");
            if (index === 0) thumb.classList.add("active");
            thumb.addEventListener("click", () => {
                mainImg.src = img;
                document.querySelectorAll(".modal-thumbs img").forEach(t => t.classList.remove("active"));
                thumb.classList.add("active");
            });
            thumbsContainer.appendChild(thumb);
        });

        document.getElementById("productModal").style.display = "flex";
    });
});

// ---------------------------
// FECHAR MODAL
// ---------------------------
document.querySelector(".close-modal").addEventListener("click", () => {
    document.getElementById("productModal").style.display = "none";
});

// ---------------------------
// ZOOM NO MODAL
// ---------------------------
const modalContainer = document.querySelector(".modal-main-img-container");
const modalImg = document.getElementById("modalMainImg");
const modalLens = document.querySelector(".modal-zoom-lens");

modalContainer.addEventListener("mousemove", e => {
    modalLens.style.visibility = "visible";

    const rect = modalContainer.getBoundingClientRect();
    let x = e.clientX - rect.left - modalLens.offsetWidth / 2;
    let y = e.clientY - rect.top - modalLens.offsetHeight / 2;

    modalLens.style.left = `${x}px`;
    modalLens.style.top = `${y}px`;

    modalImg.style.transform = "scale(1.5)";
});

modalContainer.addEventListener("mouseleave", () => {
    modalLens.style.visibility = "hidden";
    modalImg.style.transform = "scale(1)";
});

document.addEventListener("click", (e) => {
    if (e.target.closest(".modal-back-btn")) {
        document.getElementById("productViewModal").style.display = "none";
    }
});

document.getElementById("backToProducts").addEventListener("click", () => {
    document.getElementById("productViewModal").style.display = "none";
});

modalContainer.addEventListener("mousemove", e => {
    modalLens.style.visibility = "visible";

    const rect = modalContainer.getBoundingClientRect();
    let x = e.clientX - rect.left - modalLens.offsetWidth / 2;
    let y = e.clientY - rect.top - modalLens.offsetHeight / 2;

    modalLens.style.left = `${x}px`;
    modalLens.style.top = `${y}px`;

    const xPercent = (x + modalLens.offsetWidth/2) / rect.width * 100;
    const yPercent = (y + modalLens.offsetHeight/2) / rect.height * 100;
    modalImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;

    modalImg.style.transform = "scale(1.5)";
});
