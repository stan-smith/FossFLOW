import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "Ini adalah contoh teks"
  },
  mainMenu: {
    undo: "Batalkan",
    redo: "Ulangi", 
    open: "Buka",
    exportJson: "Ekspor sebagai JSON",
    exportCompactJson: "Ekspor sebagai JSON Ringkas",
    exportImage: "Ekspor sebagai gambar",
    clearCanvas: "Bersihkan kanvas",
    settings: "Pengaturan",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Pintasan Keyboard & Bantuan",
    close: "Tutup",
    keyboardShortcuts: "Pintasan Keyboard",
    mouseInteractions: "Interaksi Mouse",
    action: "Aksi",
    shortcut: "Pintasan",
    method: "Metode",
    description: "Deskripsi",
    note: "Catatan:",
    noteContent: "Pintasan keyboard dinonaktifkan saat mengetik di bidang input, area teks, atau elemen yang dapat diedit untuk mencegah konflik.",
    // Keyboard shortcuts
    undoAction: "Batalkan",
    undoDescription: "Batalkan aksi terakhir",
    redoAction: "Ulangi",
    redoDescription: "Ulangi aksi terakhir yang dibatalkan",
    redoAltAction: "Ulangi (Alternatif)",
    redoAltDescription: "Pintasan alternatif untuk mengulangi",
    helpAction: "Bantuan",
    helpDescription: "Buka dialog bantuan dengan pintasan keyboard",
    zoomInAction: "Perbesar",
    zoomInShortcut: "Roda Mouse Naik",
    zoomInDescription: "Perbesar kanvas",
    zoomOutAction: "Perkecil",
    zoomOutShortcut: "Roda Mouse Turun",
    zoomOutDescription: "Perkecil kanvas",
    panCanvasAction: "Geser Kanvas",
    panCanvasShortcut: "Klik Kiri + Seret",
    panCanvasDescription: "Geser kanvas saat dalam mode Geser",
    contextMenuAction: "Menu Konteks",
    contextMenuShortcut: "Klik Kanan",
    contextMenuDescription: "Buka menu konteks untuk item atau ruang kosong",
    // Mouse interactions
    selectToolAction: "Alat Pilih",
    selectToolShortcut: "Klik tombol Pilih",
    selectToolDescription: "Beralih ke mode pemilihan",
    panToolAction: "Alat Geser",
    panToolShortcut: "Klik tombol Geser",
    panToolDescription: "Beralih ke mode geser untuk memindahkan kanvas",
    addItemAction: "Tambah Item",
    addItemShortcut: "Klik tombol Tambah item",
    addItemDescription: "Buka pemilih ikon untuk menambahkan item baru",
    drawRectangleAction: "Gambar Persegi Panjang",
    drawRectangleShortcut: "Klik tombol Persegi Panjang",
    drawRectangleDescription: "Beralih ke mode menggambar persegi panjang",
    createConnectorAction: "Buat Konektor",
    createConnectorShortcut: "Klik tombol Konektor",
    createConnectorDescription: "Beralih ke mode konektor",
    addTextAction: "Tambah Teks",
    addTextShortcut: "Klik tombol Teks",
    addTextDescription: "Buat kotak teks baru"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "Tip: Membuat Konektor",
    tipConnectorTools: "Tip: Alat Konektor",
    clickInstructionStart: "Klik",
    clickInstructionMiddle: "pada node atau titik pertama, lalu",
    clickInstructionEnd: "pada node atau titik kedua untuk membuat koneksi.",
    nowClickTarget: "Sekarang klik pada target untuk menyelesaikan koneksi.",
    dragStart: "Seret",
    dragEnd: "dari node pertama ke node kedua untuk membuat koneksi.",
    rerouteStart: "Untuk mengubah rute konektor,",
    rerouteMiddle: "klik kiri",
    rerouteEnd: "pada titik mana pun di sepanjang garis konektor dan seret untuk membuat atau memindahkan titik jangkar."
  },
  lassoHintTooltip: {
    tipLasso: "Tip: Seleksi Lasso",
    tipFreehandLasso: "Tip: Seleksi Lasso Bebas",
    lassoDragStart: "Klik dan seret",
    lassoDragEnd: "untuk menggambar kotak seleksi persegi panjang di sekitar item yang ingin Anda pilih.",
    freehandDragStart: "Klik dan seret",
    freehandDragMiddle: "untuk menggambar",
    freehandDragEnd: "bentuk bebas",
    freehandComplete: "di sekitar item. Lepas untuk memilih semua item di dalam bentuk.",
    moveStart: "Setelah dipilih,",
    moveMiddle: "klik di dalam seleksi",
    moveEnd: "dan seret untuk memindahkan semua item yang dipilih bersama."
  },
  importHintTooltip: {
    title: "Impor Diagram",
    instructionStart: "Untuk mengimpor diagram, klik",
    menuButton: "tombol menu",
    instructionMiddle: "(☰) di pojok kiri atas, lalu pilih",
    openButton: "\"Buka\"",
    instructionEnd: "untuk memuat file diagram Anda."
  },
  connectorRerouteTooltip: {
    title: "Tip: Ubah Rute Konektor",
    instructionStart: "Setelah konektor Anda ditempatkan, Anda dapat mengubah rutenya sesuai keinginan.",
    instructionSelect: "Pilih konektor",
    instructionMiddle: "terlebih dahulu, lalu",
    instructionClick: "klik pada jalur konektor",
    instructionAnd: "dan",
    instructionDrag: "seret",
    instructionEnd: "untuk mengubahnya!"
  },
  connectorEmptySpaceTooltip: {
    message: "Untuk menghubungkan konektor ini ke node,",
    instruction: "klik kiri pada ujung konektor dan seret ke node yang diinginkan."
  },
  settings: {
    zoom: {
      description: "Konfigurasi perilaku zoom saat menggunakan roda mouse.",
      zoomToCursor: "Zoom ke Kursor",
      zoomToCursorDesc: "Saat diaktifkan, zoom masuk/keluar terpusat pada posisi kursor mouse. Saat dinonaktifkan, zoom terpusat pada kanvas."
    },
    hotkeys: {
      title: "Pengaturan Pintasan",
      profile: "Profil Pintasan",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "Tidak Ada Pintasan",
      tool: "Alat",
      hotkey: "Pintasan",
      toolSelect: "Pilih",
      toolPan: "Geser",
      toolAddItem: "Tambah Item",
      toolRectangle: "Persegi Panjang",
      toolConnector: "Konektor",
      toolText: "Teks",
      note: "Catatan: Pintasan berfungsi saat tidak mengetik di bidang teks"
    },
    pan: {
      title: "Pengaturan Geser",
      mousePanOptions: "Opsi Geser Mouse",
      emptyAreaClickPan: "Klik dan seret pada area kosong",
      middleClickPan: "Klik tengah dan seret",
      rightClickPan: "Klik kanan dan seret",
      ctrlClickPan: "Ctrl + klik dan seret",
      altClickPan: "Alt + klik dan seret",
      keyboardPanOptions: "Opsi Geser Keyboard",
      arrowKeys: "Tombol panah",
      wasdKeys: "Tombol WASD",
      ijklKeys: "Tombol IJKL",
      keyboardPanSpeed: "Kecepatan Geser Keyboard",
      note: "Catatan: Opsi geser berfungsi selain alat Geser khusus"
    },
    connector: {
      title: "Pengaturan Konektor",
      connectionMode: "Mode Pembuatan Koneksi",
      clickMode: "Mode Klik (Direkomendasikan)",
      clickModeDesc: "Klik node pertama, lalu klik node kedua untuk membuat koneksi",
      dragMode: "Mode Seret",
      dragModeDesc: "Klik dan seret dari node pertama ke node kedua",
      note: "Catatan: Anda dapat mengubah pengaturan ini kapan saja. Mode yang dipilih akan digunakan saat alat Konektor aktif."
    },
    iconPacks: {
      title: "Manajemen Paket Ikon",
      lazyLoading: "Aktifkan Lazy Loading",
      lazyLoadingDesc: "Muat paket ikon sesuai permintaan untuk startup yang lebih cepat",
      availablePacks: "Paket Ikon Tersedia",
      coreIsoflow: "Core Isoflow (Selalu Dimuat)",
      alwaysEnabled: "Selalu diaktifkan",
      awsPack: "Ikon AWS",
      gcpPack: "Ikon Google Cloud",
      azurePack: "Ikon Azure",
      kubernetesPack: "Ikon Kubernetes",
      loading: "Memuat...",
      loaded: "Dimuat",
      notLoaded: "Tidak dimuat",
      iconCount: "{count} ikon",
      lazyLoadingDisabledNote: "Lazy loading dinonaktifkan. Semua paket ikon dimuat saat startup.",
      note: "Paket ikon dapat diaktifkan atau dinonaktifkan sesuai kebutuhan Anda. Paket yang dinonaktifkan akan mengurangi penggunaan memori dan meningkatkan performa."
    }
  },
  lazyLoadingWelcome: {
    title: "Fitur Baru: Lazy Loading!",
    message: "Hai! Setelah banyak permintaan, kami telah mengimplementasikan Lazy Loading ikon, jadi sekarang jika Anda ingin mengaktifkan paket ikon non-standar, Anda dapat mengaktifkannya di bagian 'Konfigurasi'.",
    configPath: "Klik pada ikon Hamburger",
    configPath2: "di kiri atas untuk mengakses Konfigurasi.",
    canDisable: "Anda dapat menonaktifkan perilaku ini jika diinginkan.",
    signature: "-Stan"
  }
};

export default locale;

