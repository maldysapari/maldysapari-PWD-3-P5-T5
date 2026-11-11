// ==========================================
// 1. OBJECT DAN ARRAY
// ==========================================

// Membuat produk menggunakan new Object()
const produk1 = new Object();
produk1.id = 1;
produk1.nama = "Keyboard Mekanikal";
produk1.harga = 450000;
produk1.stok = 3;

const produk2 = new Object();
produk2.id = 2;
produk2.nama = "Mouse Wireless";
produk2.harga = 180000;
produk2.stok = 4;

// Menyimpan 5 produk dalam array of object (kombinasi new Object() dan literal {})
const daftarProduk = [
  produk1,
  produk2,
  { id: 3, nama: "Headset Gaming", harga: 320000, stok: 2 },
  { id: 4, nama: "Webcam HD 1080p", harga: 250000, stok: 2 },
  { id: 5, nama: "Mousepad XL", harga: 85000, stok: 5 }
];

// Array terpisah untuk menyimpan isi keranjang
let keranjang = [];

// ==========================================
// 2. DOM SELECTION
// ==========================================
const wadahProduk = document.getElementById("daftar-produk");
const wadahKeranjang = document.getElementById("daftar-keranjang");
const infoRingkasan = document.getElementById("info-ringkasan");
const hasilCheckout = document.getElementById("hasil-checkout");

const subJudul = document.querySelector(".sub-judul");
const kartuProdukClass = document.getElementsByClassName("kartu-produk");

// Mengubah style menggunakan CamelCase pada sub-judul
subJudul.style.fontSize = "15px";
subJudul.style.color = "#555555";

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// ==========================================
// 3. DOM MANIPULATION - TAMPILKAN PRODUK
// ==========================================
function renderProduk() {
  wadahProduk.innerHTML = "";

  for (let i = 0; i < daftarProduk.length; i++) {
    const item = daftarProduk[i];

    // Membuat elemen produk dengan createElement(), createTextNode(), dan appendChild()
    const card = document.createElement("div");
    card.className = "kartu-produk";

    const judul = document.createElement("h3");
    judul.appendChild(document.createTextNode(item.nama));

    const teksHarga = document.createElement("p");
    teksHarga.appendChild(document.createTextNode("Harga: " + formatRupiah(item.harga)));

    const teksStok = document.createElement("p");
    teksStok.appendChild(document.createTextNode("Stok: " + item.stok));

    const tombolTambah = document.createElement("button");
    tombolTambah.className = "btn btn-primary";
    tombolTambah.appendChild(document.createTextNode("Tambah ke Keranjang"));

    // Tandai produk jika stok habis menggunakan properti style CamelCase
    if (item.stok === 0) {
      card.style.backgroundColor = "#ffe6e6";
      card.style.opacity = "0.75";
      teksStok.style.color = "red";
      teksStok.style.fontWeight = "bold";
    }

    tombolTambah.addEventListener("click", function () {
      tambahKeKeranjang(item.id);
    });

    card.appendChild(judul);
    card.appendChild(teksHarga);
    card.appendChild(teksStok);
    card.appendChild(tombolTambah);

    wadahProduk.appendChild(card);
  }

  // Penggunaan getElementsByClassName() untuk mengatur border kartu produk
  for (let j = 0; j < kartuProdukClass.length; j++) {
    kartuProdukClass[j].style.border = "1px solid #dcdcdc";
  }
}

// ==========================================
// FUNGSI KERANJANG BELANJA
// ==========================================
function tambahKeKeranjang(idProduk) {
  let produkDipilih = null;
  for (let i = 0; i < daftarProduk.length; i++) {
    if (daftarProduk[i].id === idProduk) {
      produkDipilih = daftarProduk[i];
      break;
    }
  }

  if (!produkDipilih) return;

  // 4. Pop-up alert() jika stok habis
  if (produkDipilih.stok <= 0) {
    alert("Maaf, stok produk '" + produkDipilih.nama + "' sudah habis!");
    return;
  }

  // Kurangi stok dan masukkan item ke keranjang memakai push()
  produkDipilih.stok -= 1;
  keranjang.push({
    id: produkDipilih.id,
    nama: produkDipilih.nama,
    harga: produkDipilih.harga
  });

  renderProduk();
  renderKeranjang();
}

function renderKeranjang() {
  wadahKeranjang.innerHTML = "";

  for (let i = 0; i < keranjang.length; i++) {
    const itemKeranjang = keranjang[i];

    const li = document.createElement("li");
    li.appendChild(
      document.createTextNode(itemKeranjang.nama + " - " + formatRupiah(itemKeranjang.harga))
    );

    const btnHapus = document.createElement("button");
    btnHapus.className = "btn btn-hapus";
    btnHapus.appendChild(document.createTextNode("Hapus"));

    // Tombol Hapus memakai confirm() dan removeChild()
    btnHapus.addEventListener("click", function () {
      const yakin = confirm("Hapus '" + itemKeranjang.nama + "' dari keranjang?");
      if (yakin) {
        for (let k = 0; k < daftarProduk.length; k++) {
          if (daftarProduk[k].id === itemKeranjang.id) {
            daftarProduk[k].stok += 1;
            break;
          }
        }

        wadahKeranjang.removeChild(li);
        keranjang.splice(i, 1);

        renderProduk();
        renderKeranjang();
      }
    });

    li.appendChild(btnHapus);
    wadahKeranjang.appendChild(li);
  }

  hitungTotal();
}

// ==========================================
// 5. HITUNG TOTAL HARGA DENGAN PERULANGAN
// ==========================================
function hitungTotal() {
  let totalHarga = 0;
  let jumlahItem = keranjang.length;

  // Perulangan for...in untuk menghitung total harga
  for (let index in keranjang) {
    totalHarga += keranjang[index].harga;
  }

  // Menampilkan jumlah item dan total harga menggunakan innerHTML
  infoRingkasan.innerHTML =
    "Jumlah Item: <strong>" +
    jumlahItem +
    "</strong> | Total Harga: <strong>" +
    formatRupiah(totalHarga) +
    "</strong>";
}

// ==========================================
// TOMBOL POP, KOSONGKAN, DAN CHECKOUT
// ==========================================

// Batalkan item terakhir menggunakan pop()
document.getElementById("btn-undo").addEventListener("click", function () {
  if (keranjang.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  const itemTerakhir = keranjang.pop();

  for (let i = 0; i < daftarProduk.length; i++) {
    if (daftarProduk[i].id === itemTerakhir.id) {
      daftarProduk[i].stok += 1;
      break;
    }
  }

  renderProduk();
  renderKeranjang();
});

// Kosongkan keranjang dengan confirm()
document.getElementById("btn-kosongkan").addEventListener("click", function () {
  if (keranjang.length === 0) {
    alert("Keranjang sudah kosong.");
    return;
  }

  const yakin = confirm("Apakah Anda yakin ingin mengosongkan seluruh keranjang?");
  if (yakin) {
    for (let i = 0; i < keranjang.length; i++) {
      for (let j = 0; j < daftarProduk.length; j++) {
        if (daftarProduk[j].id === keranjang[i].id) {
          daftarProduk[j].stok += 1;
        }
      }
    }

    keranjang = [];
    renderProduk();
    renderKeranjang();
  }
});

// Checkout dengan prompt() dan penggabungan item memakai join()
document.getElementById("btn-checkout").addEventListener("click", function () {
  if (keranjang.length === 0) {
    alert("Keranjang belanja masih kosong! Silakan pilih produk terlebih dahulu.");
    return;
  }

  const namaPembeli = prompt("Masukkan nama pembeli untuk checkout:");

  if (!namaPembeli || namaPembeli.trim() === "") {
    alert("Checkout dibatalkan karena nama pembeli tidak diisi.");
    return;
  }

  let daftarNamaItem = [];
  let totalBayar = 0;

  for (let i = 0; i < keranjang.length; i++) {
    daftarNamaItem.push(keranjang[i].nama);
    totalBayar += keranjang[i].harga;
  }

  const gabunganItem = daftarNamaItem.join(", ");

  hasilCheckout.style.display = "block";
  hasilCheckout.style.backgroundColor = "#d4edda";
  hasilCheckout.style.border = "1px solid #c3e6cb";
  hasilCheckout.innerHTML =
    "<h3>Ringkasan Pesanan</h3>" +
    "<p><strong>Nama Pembeli:</strong> " + namaPembeli + "</p>" +
    "<p><strong>Daftar Item:</strong> " + gabunganItem + "</p>" +
    "<p><strong>Total Pembayaran:</strong> " + formatRupiah(totalBayar) + "</p>";

  keranjang = [];
  renderKeranjang();
});

// Render awal saat halaman dibuka
renderProduk();
renderKeranjang();