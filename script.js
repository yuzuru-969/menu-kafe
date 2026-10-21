// script.js
let cart = JSON.parse(localStorage.getItem('kafeKlikCart')) || [];

// 1. Fungsi untuk menampilkan menu
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

// 2. Fungsi menambah ke keranjang
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

// 3. Animasi feedback tombol keranjang
function showFeedback(name) {
    const btn = document.getElementById('cart-btn');
    btn.innerText = `✅ ${name} ditambahkan!`;
    setTimeout(() => { updateCartButton(); }, 1500);
}

// 4. Menyimpan keranjang ke LocalStorage (Agar tidak hilang saat refresh)
function saveCart() {
    localStorage.setItem('kafeKlikCart', JSON.stringify(cart));
}

// 5. Update tampilan keranjang dan total harga
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
            list.innerHTML += `<li><span>${item.nama} (x${item.qty})</span><span>Rp ${subtotal.toLocaleString('id-ID')}</span></li>`;
        });
    }
    totalEl.innerText = total.toLocaleString('id-ID');
}

function updateCartButton() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-btn').innerHTML = `🛒 Keranjang (<span id="cart-count">${count}</span>)`;
}

// 6. Buka/Tutup Pop-up Keranjang
function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('show');
}

// 7. Fitur Checkout via WhatsApp (Bonus untuk Cafe!)
function checkout() {
    if(cart.length === 0) return alert('Keranjang kosong!');
    
    let message = "Halo, saya ingin memesan:%0A%0A";
    cart.forEach(item => {
        message += `- ${item.nama} (x${item.qty})%0A`;
    });
    const total = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    message += `%0ATotal: Rp ${total.toLocaleString('id-ID')}`;
    
    // GANTI nomor di bawah ini dengan nomor WhatsApp Cafe asli!
    window.open(`https://wa.me/62881026749566?text=${message}`, '_blank');
}

// 8. Event Listener untuk tombol filter kategori
document.getElementById('filter-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu(e.target.dataset.kategori);
    }
});

// Inisialisasi awal
renderMenu();
updateCartUI();
