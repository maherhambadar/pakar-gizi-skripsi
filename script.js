function prosesDiagnosa() {
    // 1. Ambil data dari Form
    const nama = document.getElementById("nama").value;
    const usia = parseInt(document.getElementById("usia").value);
    const gender = document.getElementById("gender").value;
    const berat = parseFloat(document.getElementById("berat").value);
    const tinggi = parseFloat(document.getElementById("tinggi").value);
    const aktivitas = parseFloat(document.getElementById("aktivitas").value);

    // Validasi input
    if (!nama || !usia || !berat || !tinggi) {
        alert("Mohon lengkapi data Nama, Usia, Berat, dan Tinggi Anda!");
        return;
    }

    // ==========================================
    // ALGORITMA 1: HARRIS-BENEDICT (Menghitung Kalori)
    // ==========================================
    let bmr = 0;
    if (gender === "pria") {
        bmr = 66.5 + (13.75 * berat) + (5.003 * tinggi) - (6.775 * usia);
    } else {
        bmr = 655.1 + (9.563 * berat) + (1.850 * tinggi) - (4.676 * usia);
    }
    const kebutuhanKaloriNormal = Math.round(bmr * aktivitas);

    // ==========================================
    // ALGORITMA 2: CERTAINTY FACTOR (CF)
    // ==========================================
    const checkboxes = document.querySelectorAll('.gejala:checked');
    let cfCombine = 0;

    if (checkboxes.length > 0) {
        cfCombine = parseFloat(checkboxes[0].value); 
        for (let i = 1; i < checkboxes.length; i++) {
            let cfNext = parseFloat(checkboxes[i].value);
            cfCombine = cfCombine + cfNext * (1 - cfCombine); // Rumus CF Gabungan
        }
    }
    const persentaseCF = (cfCombine * 100).toFixed(1);

    // ==========================================
    // MENGHITUNG IMT
    // ==========================================
    const tinggiMeter = tinggi / 100;
    const imt = (berat / (tinggiMeter * tinggiMeter)).toFixed(1);

    let kategori = "";
    let rekomendasiPangan = "";
    let targetKalori = 0;
    let gradientHeader = "";
    let badgeColor = "";

    // Teks penjelasan dinamis jika user tidak memilih gejala (CF 0%)
    let teksCF = "";
    if (persentaseCF > 0) {
        teksCF = `Tingkat keyakinan penyebab obesitas dari pola hidup Anda: <strong>${persentaseCF}%</strong><br><br>`;
    } else {
        teksCF = `<em>*Anda tidak memilih kebiasaan buruk apa pun (CF = 0%). Obesitas Anda kemungkinan disebabkan oleh faktor genetik, medis, atau stres di luar pola makan dasar.</em><br><br>`;
    }

    // ==========================================
    // PENENTUAN GIZI & REKOMENDASI LENGKAP
    // ==========================================
    if (imt >= 25.0) { 
        // 1. KATEGORI OBESITAS
        kategori = "Obesitas";
        gradientHeader = "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)";
        badgeColor = "#e74c3c";
        targetKalori = kebutuhanKaloriNormal - 500; // Defisit 500 kalori
        
        rekomendasiPangan = `
            <strong>🎯 Diagnosa: OBESITAS</strong><br>
            ${teksCF}
            <strong>📉 Target: Defisit Kalori (${targetKalori} Kcal/hari)</strong><br><br>
            
            <strong>✅ Bahan Pangan Direkomendasikan:</strong><br>
            • <em>Protein Rendah Lemak:</em> Dada ayam (rebus/panggang tanpa kulit), putih telur, ikan pepes/kukus, tempe/tahu rebus.<br>
            • <em>Karbohidrat Berserat:</em> Nasi merah, beras shirataki/porang, oatmeal, ubi rebus.<br>
            • <em>Sayur & Buah:</em> Brokoli, bayam, mentimun, tomat, apel, pir, dan pepaya.<br><br>
            
            <strong>❌ Wajib Dihindari (Pantangan):</strong><br>
            • Segala jenis gorengan dan makanan bersantan kental.<br>
            • Minuman tinggi gula (boba, teh kemasan, kopi susu gula aren, sirup).<br>
            • Makanan olahan pabrik (sosis, nugget) dan tepung-tepungan (roti manis, kue kering).<br><br>
            
            <strong>💡 Saran Pola Hidup:</strong><br>
            Minum 1-2 gelas air putih sebelum makan. Kunyah makanan perlahan. Lakukan olahraga *Low-Impact* (jalan kaki santai, bersepeda, berenang) agar sendi lutut tidak cedera.
        `;
    } else if (imt < 18.5) {
        // 2. KATEGORI KURUS
        kategori = "Kurus (Underweight)";
        gradientHeader = "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
        badgeColor = "#e67e22";
        targetKalori = kebutuhanKaloriNormal + 500; // Surplus 500 kalori

        rekomendasiPangan = `
            <strong>🎯 Diagnosa: KURUS (Underweight)</strong><br><br>
            <strong>📈 Target: Surplus Kalori (${targetKalori} Kcal/hari)</strong><br><br>
            
            <strong>✅ Bahan Pangan Direkomendasikan:</strong><br>
            • <em>Karbohidrat Padat:</em> Nasi putih/merah, kentang, pasta, roti gandum, ubi jalar.<br>
            • <em>Protein & Lemak Sehat:</em> Daging sapi, daging ayam, telur utuh, susu full-cream, keju, yoghurt.<br>
            • <em>Cemilan Tinggi Kalori:</em> Alpukat, kacang almond/tanah, selai kacang, kurma, pisang.<br><br>
            
            <strong>❌ Wajib Dihindari (Pantangan):</strong><br>
            • Minum air putih terlalu banyak tepat SEBELUM makan.<br>
            • Mengonsumsi <em>Junk Food</em>. Ini salah karena hanya menimbun lemak, bukan massa otot.<br>
            • Makanan ringan rendah kalori (seperti snack kerupuk) yang bikin kenyang tapi gizinya nol.<br><br>
            
            <strong>💡 Saran Pola Hidup:</strong><br>
            Makan lebih sering (5-6 kali porsi sedang). Fokus olahraga angkat beban (Latihan Kekuatan) agar ekstra kalori berubah menjadi otot.
        `;
    } else {
        // 3. KATEGORI NORMAL
        kategori = "Normal";
        gradientHeader = "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)";
        badgeColor = "#27ae60";
        targetKalori = kebutuhanKaloriNormal; 

        rekomendasiPangan = `
            <strong>🎯 Diagnosa: NORMAL (Gizi Ideal)</strong><br><br>
            <strong>⚖️ Target: Jaga Kalori (${targetKalori} Kcal/hari)</strong><br><br>
            
            <strong>✅ Bahan Pangan Direkomendasikan:</strong><br>
            • <em>50% Sayur & Buah:</em> Kombinasikan sayuran hijau dan buah segar.<br>
            • <em>25% Lauk Pauk:</em> Kombinasi protein hewani dan nabati.<br>
            • <em>25% Karbohidrat:</em> Nasi secukupnya, jagung, atau singkong.<br><br>
            
            <strong>❌ Yang Harus Dibatasi:</strong><br>
            • Konsumsi gula harian berlebihan.<br>
            • Kebiasaan ngemil makanan asin (tinggi natrium) atau manis larut malam.<br><br>
            
            <strong>💡 Saran Pola Hidup:</strong><br>
            Pertahankan pola makan ini! Pastikan tetap berolahraga minimal 3 kali seminggu selama 30 menit untuk menjaga metabolisme.
        `;
    }

    // ==========================================
    // MENAMPILKAN HASIL KE UI
    // ==========================================
    document.getElementById("hasil-nama").innerText = nama;
    document.getElementById("hasil-imt").innerText = imt;
    document.getElementById("hasil-kalori").innerText = targetKalori + " Kcal";
    
    // Logika UI untuk CF
    if (persentaseCF > 0) {
        document.getElementById("hasil-cf").innerText = persentaseCF + "%";
    } else {
        document.getElementById("hasil-cf").innerText = "0% (Tidak ada gejala)";
    }
    
    const elemenKategori = document.getElementById("hasil-kategori");
    elemenKategori.innerText = kategori;
    elemenKategori.style.backgroundColor = badgeColor;

    document.getElementById("hasil-rekomendasi").innerHTML = rekomendasiPangan;
    document.getElementById("card-header").style.background = gradientHeader;

    // Tampilkan Kartu dan Tombol Simpan
    document.getElementById("health-card").classList.remove("hidden");
    document.getElementById("btn-simpan").classList.remove("hidden");
}

// Fungsi Simpan ke Galeri menggunakan html2canvas
function simpanKeGaleri() {
    const kartu = document.getElementById("health-card");
    html2canvas(kartu, { scale: 2, backgroundColor: "#ffffff" }).then(function(canvas) { 
        const imageURL = canvas.toDataURL("image/png");
        const linkDownload = document.createElement("a");
        linkDownload.href = imageURL;
        linkDownload.download = `Diagnosa_Gizi_${document.getElementById("nama").value}.png`;
        linkDownload.click();
    });
}