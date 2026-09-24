import type { Dictionary } from "./en";

export const id: Dictionary = {
  meta: {
    title: "AI Flight & Travel Assistant",
    description: "Asisten Pemesanan Tiket Pesawat dengan AI",
  },
  nav: {
    subtitle: "Cari tiket, pilih kursi, cetak e-tiket",
    resetTooltip: "Reset percakapan",
    reset: "Reset",
    changeLanguage: "Ganti bahasa",
  },
  empty: {
    title: "Mau terbang ke mana?",
    subtitle:
      "Cari penerbangan, pilih kursi favorit, dan terbitkan e-tiket langsung di dalam obrolan.",
    passengerName: "Nama Penumpang",
    passengerPlaceholder: "Masukkan nama penumpang...",
    tryAsking: "Coba tanyakan langsung",
  },
  prompts: [
    "Cari penerbangan Jakarta ke Bali besok pagi, budget 1.5 juta",
    "Tiket Jakarta ke Surabaya paling murah",
    "Jam penerbangan Citilink Jakarta ke Bali?",
  ],
  chat: {
    selectFlightHandshake: (
      airline: string,
      flightNumber: string,
      origin: string,
      destination: string,
    ) =>
      `Saya memilih penerbangan ${airline} (${flightNumber}) dari ${origin} ke ${destination}. Mohon tampilkan denah kursi pesawat untuk penerbangan ini.`,
    selectSeatHandshake: (seatId: string, passengerName: string) =>
      `Saya memilih kursi nomor ${seatId} untuk penumpang ${passengerName}. Tolong proses reservasi dan terbitkan bukti pembayarannya.`,
    searchingFlights: "Mencari jadwal penerbangan terbaik...",
    preparingSeatMap: "Menyiapkan denah kursi...",
    processingBooking: "Memproses pemesanan...",
    loadFlightsError: "Gagal memuat penerbangan:",
    seatMapError: "Gagal menampilkan denah kursi:",
    bookingError: "Gagal memproses tiket:",
    somethingWentWrong: "Terjadi kesalahan",
    aiResponseError: "Gagal memuat respon AI",
    aiResponseFallback:
      "Pastikan API Key GOOGLE_GENERATIVE_AI_API_KEY telah diisi di .env.local",
    aiTyping: "AI sedang merespon",
    inputPlaceholder: "Cari tiket Jakarta ke Bali besok...",
    send: "Kirim",
    helperText:
      'Klik "Pilih Penerbangan" atau nomor kursi untuk memicu respon AI',
    simulatePayment: "Simulasi Bayar GA-401 (12A)",
    serverActionConfirmed:
      "Transaksi Dikonfirmasi melalui Next.js Server Action",
    serverActionFailed: "Gagal memproses transaksi via Server Action.",
    serverActionError: (message: string) =>
      `Terjadi kesalahan saat memanggil Server Action: ${message}`,
  },
  flight: {
    perPerson: "Harga per orang",
    select: "Pilih Penerbangan",
    direct: "Direct",
    availableCount: (count: number) => `Tersedia ${count} pilihan penerbangan`,
    sortByCheapest: "Urutkan: Termurah",
    emptyTitle: "Tidak ada jadwal penerbangan yang sesuai kriteria.",
    emptyDesc:
      "Coba sesuaikan rute asal, tujuan, atau tingkatkan batas anggaran harga anda.",
    classes: {
      economy: "Economy",
      business: "Business",
      first: "First",
    },
  },
  seat: {
    titlePrefix: "Pilih Kursi - ",
    legendSelected: "Dipilih",
    legendAvailable: "Tersedia",
    legendTaken: "Habis",
    seatLabel: "Kursi",
    types: {
      window: "Jendela",
      aisle: "Lorong",
      middle: "Tengah",
    },
    continue: "Lanjut Bayar",
  },
  receipt: {
    title: "Bukti Pemesanan",
    airline: "Maskapai",
    flightNumber: "Nomor Penerbangan",
    route: "Rute",
    time: "Waktu",
    duration: "Durasi",
    passenger: "Penumpang",
    seat: "Kursi",
    seatType: "Tipe Kursi",
    paymentMethod: "Metode Pembayaran",
    bookingDate: "Tanggal Pemesanan",
    total: "Total",
    seatTypes: {
      window: "Jendela",
      aisle: "Lorong",
      middle: "Tengah",
    },
  },
  server: {
    incompleteData:
      "Data reservasi tidak lengkap: flightId, seatId, dan passengerName wajib diisi.",
    flightNotFound: (flightId: string) =>
      `Penerbangan dengan kode ${flightId} tidak ditemukan atau gagal diproses`,
    internalError: "Terjadi kesalahan internal pada Server",
  },
  api: {
    invalidPayload:
      "Payload tidak valid: messages diperlukan dan harus berupa array.",
    missingApiKey:
      "GOOGLE_GENERATIVE_AI_API_KEY belum dikonfigurasi. Silakan isi API Key Anda di file .env.local dari Google AI Studio.",
    internalError:
      "Terjadi kesalahan internal pada server saat memproses chat.",
  },
  tools: {
    searchFlightsDesc:
      "Mencari jadwal dan harga tiket penrbangan berdasarkan kota asal, kota tujuan, dan batas anggaran harga (opsional).",
    selectFlightDesc:
      "Memilih penerbangan tertentu berdasarkan flightId untuk melihat detail penerbangan dan denah kursi yang tersedia.",
    bookFlightDesc:
      "Mengonfirmasi reservasi tiket penerbangan dengan ID penerbangan, nomor kursi terpilih, dan nama lengkap penumpang",
    flightNotFound: (flightId: string) =>
      `Penerbangan dengan ID '${flightId}' tidak ditemukan.`,
    bookingFailed: (flightId: string) =>
      `Gagal memproses pemesanan untuk penerbangan '${flightId}'.`,
  },
  ai: {
    systemPrompt: `Anda adalah AI Flight & Travel Assistant profesional dan ramah berbahasa Indonesia.
Tugas Anda adalah membantu pengguna mencari tiket pesawat, memilih kursi penerbangan, dan menyelesaikan reservasi tiket perjalanan.
Gunakan tools yang tersedia saat pengguna meminta informasi atau melakukan aksi:
- Gunakan tool 'searchFlights' ketika pengguna mencari tiket atau rute penerbangan.
- Gunakan tool 'selectFlight' ketika pengguna memilih penerbangan tertentu untuk melihat denah kursi (seat map).
- Gunakan tool 'bookFlight' saat pengguna mengonfirmasi nomor kursi dan ingin memesan tiket.
Selalu berikan respon yang sopan, jelas, dan membantu dalam bahasa Indonesia.`,
  },
};
