# Implementation Plan - Otomatisasi Kelulusan Ujian Surah & Sistem Catatan Harian Terpadu

Fitur ini mengotomatiskan alur kerja guru tahfidz setelah siswa menyelesaikan ujian surah dengan nilai L (Lancar) atau CL (Cukup Lancar), serta menambahkan kolom catatan harian per kategori (hafalan, ummi, tilawah) tepat di bawah input nilainya, yang otomatis dikirim ke pesan WhatsApp orang tua dan terkonversi ke rekap catatan bulanan.

## User Review Required
> [!IMPORTANT]
> 1. **Auto-advance Surah**: Saat status ujian surah (`Ujian Surah`) dinilai **L** atau **CL**, sistem akan otomatis menentukan surah berikutnya (berdasarkan urutan Al-Qur'an), menampilkan nama surah tujuan baru, dan menyusun pesan WhatsApp kelulusan beserta instruksi materi surah berikutnya.
> 2. **Posisi & Sifat Catatan**: Input catatan harian diletakkan tepat di bawah masing-masing tombol/pilihan nilai (Hafalan, Ummi, Tilawah). Kolom ini bersifat opsional (bisa dikosongkan jika tidak ada catatan khusus).
> 3. **Format WhatsApp**: Jika ada catatan harian, pesan WA akan menampilkan baris catatan khusus (misal: `💬 Catatan: Belum lancar di ayat 15-20, mohon dibantu muroja'ah di rumah`) agar wali santri mengetahui kendala ananda secara transparan.
> 4. **Konversi ke Catatan Bulanan**: Di menu Rekap Bulanan, jika guru belum mengisi catatan manual, sistem akan otomatis merangkum catatan harian siswa selama bulan tersebut menjadi catatan bulanan siap cetak/kirim.

---

## Proposed Changes

### 1. Komponen `src/components/DailyInput.tsx`
- **Auto Next Surah on Exam L/CL**:
  - Saat guru memilih status setoran `Ujian` / `Ujian Surah` dan memilih nilai `L` atau `CL`:
    - Mengambil nama surah berikutnya secara otomatis melalui urutan surah Qur'an (`getNextSurah()`).
    - Menampilkan notifikasi visual badge informatif: *"Lulus Ujian! Lanjut otomatis ke Surah [Nama Surat Berikutnya]"*.
    - Menyiapkan data setoran hari berikutnya / field tujuan ke surah baru ayat 1.
- **Input Catatan Harian di Bawah Nilai**:
  - Di bawah pilihan nilai **Hafalan** (`L`, `CL`, `BL`): Tambahkan input *"Catatan Harian Hafalan (Opsional)"* dengan placeholder: *"Contoh: Lancar, namun di ayat 10-15 waqaf & ibtida' perlu diperhatikan..."*.
  - Di bawah pilihan nilai **Ummi** (`A`, `B`, `C`): Tambahkan input *"Catatan Harian Ummi (Opsional)"* dengan placeholder: *"Contoh: Belum lancar pada pengucapan makhroj huruf..."*.
  - Di bawah pilihan nilai **Tilawah** (`A`, `B`, `C`): Tambahkan input *"Catatan Harian Tilawah (Opsional)"* dengan placeholder: *"Contoh: Perhatikan hukum tajwid mad thobi'i..."*.
  - Catatan disimpan di dalam objek `details` setoran (`details.note`).
- **Pembaruan Pesan WhatsApp (Personal & Halaqoh)**:
  - Jika `details.note` terisi, baris `💬 Catatan: [Isi Catatan]` otomatis disisipkan di bawah nilai/PR pada pesan WA individu maupun rekap halaqoh.
  - Untuk status ujian L/CL, pesan WhatsApp otomatis memuat ucapan selamat lulus dan nama surah lanjutan berikutnya.

### 2. Komponen `src/components/ExamHafalan.tsx`
- Memastikan pada form ujian hafalan mandiri, jika siswa memperoleh nilai L atau CL (atau dinyatakan lulus):
  - Nama surah berikutnya otomatis terisi sebagai rekomendasi target surah berikutnya.
  - Pesan share WA ujian menyertakan nama surah baru yang harus dihafal selanjutnya.

### 3. Komponen `src/components/MonthlyRecap.tsx`
- **Konversi Otomatis Catatan Harian ke Catatan Bulanan**:
  - Saat membaca data bulanan siswa, sistem mengumpulkan seluruh catatan harian (`hafalan`, `ummi`, `tilawah`) pada bulan terpilih.
  - Jika guru belum mengisi `notes` kustom di rekap bulanan, sistem otomatis mengagregasi catatan-catatan harian tersebut (misal: `- Hafalan: ... \n- Ummi: ...`) sebagai nilai default catatan bulanan.
  - Menambahkan tombol *"Ambil dari Catatan Harian"* di modal edit rekap bulanan agar guru bisa memperbarui atau mengombinasikan catatan harian kapan saja dengan sekali klik.

---

## Verification Plan

### Automated / Build Verification
- Jalankan `compile_applet` untuk memastikan tidak ada kesalahan tipe TypeScript atau impor.
- Jalankan `lint_applet` untuk memverifikasi kebersihan kode.

### Manual Feature Walkthrough
1. **Ujian Surah L/CL**:
   - Buka menu **Input Harian**, pilih siswa, pilih jenis **Hafalan**, ubah status ke **Ujian Surah**.
   - Klik nilai **L** atau **CL**. Verifikasi bahwa nama surah berikutnya terisi otomatis dan pesan WA menampilkan kelulusan beserta nama surah baru.
2. **Catatan Harian di Bawah Nilai**:
   - Verifikasi tata letak input catatan harian berada tepat di bawah masing-masing tombol nilai Hafalan, Ummi, dan Tilawah.
   - Kosongkan catatan -> simpan -> pastikan tidak error dan tidak merusak layout.
   - Isi catatan -> simpan -> klik "Kirim WA" -> pastikan catatan muncul di format pesan WA.
3. **Konversi ke Rekap Bulanan**:
   - Buka menu **Rekap Bulanan** pada bulan yang sama.
   - Pastikan catatan siswa di tabel/modal rekap bulanan sudah terisi otomatis dari catatan harian yang telah diinput sebelumnya.
