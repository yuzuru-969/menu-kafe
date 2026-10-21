// script.js
let cart = JSON.parse(localStorage.getItem('kafeKlikCart')) || [];

// Tampilkan menu
function renderMenu(filter = 'Semua') {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';
    const filtered = filter === 'Semua' ? dataMenu : dataMenu.filter(item => item.kategori === filter);

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <img src="${item.gambar}" alt="${item.nama}">
            <div class="menu-info">
                <h3>${item.nama}</h3>
                <p>${item.deskripsi}</p>
                <div class="menu-bottom">
                    <span class="price">Rp ${item.harga.toLocaleString('id-ID')}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})">+ Tambah</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Tambah ke keranjang
function addToCart(id) {
    const item = dataMenu.find(m => m.id === id);
    const existing = cart.find(c => c.id === id);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    saveCart();
    updateCartUI();
    showFeedback(item.nama);
}

// Hapus dari keranjang
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    updateCartButton();
    showFeedback('Item dihapus dari keranjang');
}

// Feedback animasi
function showFeedback(name) {
    const btn = document.getElementById('cart-btn');
    btn.innerText = `✅ ${name} ditambahkan!`;
    setTimeout(() => { updateCartButton(); }, 1500);
}

// Simpan ke LocalStorage
function saveCart() {
    localStorage.setItem('kafeKlikCart', JSON.stringify(cart));
}

// Update tampilan keranjang
function updateCartUI() {
    updateCartButton();
    const list = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    list.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        list.innerHTML = '<li style="text-align:center; color:#999;">Keranjang masih kosong</li>';
    } else {
        cart.forEach(item => {
            const subtotal = item.harga * item.qty;
            total += subtotal;
            list.innerHTML += `
                <li>
                    <div>
                        <strong>${item.nama}</strong><br>
                        <small>x${item.qty} @ Rp ${item.harga.toLocaleString('id-ID')}</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
                        <button class="delete-btn" onclick="removeFromCart(${item.id})" title="Hapus">🗑️</button>
                    </div>
                </li>
            `;
        });
    }
    totalEl.innerText = total.toLocaleString('id-ID');
}

// Update angka di tombol keranjang
function updateCartButton() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-btn').innerHTML = `🛒 Keranjang (<span id="cart-count">${count}</span>)`;
}

// Buka/tutup pop-up keranjang
function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('show');
}

// Checkout via WhatsApp + Reset otomatis
function checkout() {
    if(cart.length === 0) return alert('Keranjang kosong!');
    
    const konfirmasi = confirm('Kirim pesanan ke WhatsApp dan kosongkan keranjang?');
    if (!konfirmasi) return;
    
    let message = "Halo, saya ingin memesan:%0A%0A";
    cart.forEach(item => {
        message += `- ${item.nama} (x${item.qty})%0A`;
    });
    const total = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    message += `%0ATotal: Rp ${total.toLocaleString('id-ID')}`;
    
    window.open(`https://wa.me/6285196289709?text=${message}`, '_blank');
    
    // Reset otomatis
    cart = [];
    saveCart();
    updateCartUI();
    updateCartButton();
    toggleCart();
    alert('✅ Pesanan terkirim! Keranjang sudah dikosongkan.');
}

// Event listener filter kategori
document.getElementById('filter-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu(e.target.dataset.kategori);
    }
});

// Inisialisasi
renderMenu();
updateCartUI();
