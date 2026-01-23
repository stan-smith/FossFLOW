import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "Bu bir örnek metindir"
  },
  mainMenu: {
    undo: "Geri Al",
    redo: "Yinele", 
    open: "Aç",
    exportJson: "JSON olarak dışa aktar",
    exportCompactJson: "Kompakt JSON olarak dışa aktar",
    exportImage: "Görüntü olarak dışa aktar",
    clearCanvas: "Tuvali temizle",
    settings: "Ayarlar",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Klavye Kısayolları ve Yardım",
    close: "Kapat",
    keyboardShortcuts: "Klavye Kısayolları",
    mouseInteractions: "Fare Etkileşimleri",
    action: "Eylem",
    shortcut: "Kısayol",
    method: "Yöntem",
    description: "Açıklama",
    note: "Not:",
    noteContent: "Klavye kısayolları, çakışmaları önlemek için giriş alanlarında, metin alanlarında veya içerik düzenlenebilir öğelerde yazarken devre dışı bırakılır.",
    // Keyboard shortcuts
    undoAction: "Geri Al",
    undoDescription: "Son eylemi geri al",
    redoAction: "Yinele",
    redoDescription: "Son geri alınan eylemi yinele",
    redoAltAction: "Yinele (Alternatif)",
    redoAltDescription: "Alternatif yineleme kısayolu",
    helpAction: "Yardım",
    helpDescription: "Klavye kısayollarıyla yardım diyaloğunu aç",
    zoomInAction: "Yakınlaştır",
    zoomInShortcut: "Fare Tekerleği Yukarı",
    zoomInDescription: "Tuvalde yakınlaştır",
    zoomOutAction: "Uzaklaştır",
    zoomOutShortcut: "Fare Tekerleği Aşağı",
    zoomOutDescription: "Tuvalden uzaklaştır",
    panCanvasAction: "Tuvali Kaydır",
    panCanvasShortcut: "Sol tık + Sürükle",
    panCanvasDescription: "Kaydırma modundayken tuvali kaydır",
    contextMenuAction: "Bağlam Menüsü",
    contextMenuShortcut: "Sağ tık",
    contextMenuDescription: "Öğeler veya boş alan için bağlam menüsünü aç",
    // Mouse interactions
    selectToolAction: "Seçim Aracı",
    selectToolShortcut: "Seç butonuna tıkla",
    selectToolDescription: "Seçim moduna geç",
    panToolAction: "Kaydırma Aracı",
    panToolShortcut: "Kaydır butonuna tıkla",
    panToolDescription: "Tuvali hareket ettirmek için kaydırma moduna geç",
    addItemAction: "Öğe Ekle",
    addItemShortcut: "Öğe ekle butonuna tıkla",
    addItemDescription: "Yeni öğeler eklemek için simge seçiciyi aç",
    drawRectangleAction: "Dikdörtgen Çiz",
    drawRectangleShortcut: "Dikdörtgen butonuna tıkla",
    drawRectangleDescription: "Dikdörtgen çizim moduna geç",
    createConnectorAction: "Bağlayıcı Oluştur",
    createConnectorShortcut: "Bağlayıcı butonuna tıkla",
    createConnectorDescription: "Bağlayıcı moduna geç",
    addTextAction: "Metin Ekle",
    addTextShortcut: "Metin butonuna tıkla",
    addTextDescription: "Yeni bir metin kutusu oluştur"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "İpucu: Bağlayıcı Oluşturma",
    tipConnectorTools: "İpucu: Bağlayıcı Araçları",
    clickInstructionStart: "İlk düğüme veya noktaya",
    clickInstructionMiddle: "tıklayın, ardından",
    clickInstructionEnd: "bir bağlantı oluşturmak için ikinci düğüme veya noktaya tıklayın.",
    nowClickTarget: "Bağlantıyı tamamlamak için şimdi hedefe tıklayın.",
    dragStart: "Bir bağlantı oluşturmak için",
    dragEnd: "ilk düğümden ikinci düğüme sürükleyin.",
    rerouteStart: "Bir bağlayıcıyı yeniden yönlendirmek için,",
    rerouteMiddle: "bağlayıcı çizgisi boyunca herhangi bir noktaya",
    rerouteEnd: "sol tıklayın ve çapa noktaları oluşturmak veya taşımak için sürükleyin."
  },
  lassoHintTooltip: {
    tipLasso: "İpucu: Lasso Seçimi",
    tipFreehandLasso: "İpucu: Serbest El Lasso Seçimi",
    lassoDragStart: "Seçmek istediğiniz öğelerin etrafına",
    lassoDragEnd: "dikdörtgen bir seçim kutusu çizmek için tıklayın ve sürükleyin.",
    freehandDragStart: "Tıklayın ve sürükleyin",
    freehandDragMiddle: "bir",
    freehandDragEnd: "serbest form şekli",
    freehandComplete: "öğelerin etrafına çizin. Şeklin içindeki tüm öğeleri seçmek için bırakın.",
    moveStart: "Seçildikten sonra,",
    moveMiddle: "seçimin içine tıklayın",
    moveEnd: "ve tüm seçili öğeleri birlikte taşımak için sürükleyin."
  },
  importHintTooltip: {
    title: "Diyagramları İçe Aktar",
    instructionStart: "Diyagramları içe aktarmak için, sol üst köşedeki",
    menuButton: "menü butonuna",
    instructionMiddle: "(☰) tıklayın, ardından",
    openButton: "\"Aç\"",
    instructionEnd: "seçerek diyagram dosyalarınızı yükleyin."
  },
  connectorRerouteTooltip: {
    title: "İpucu: Bağlayıcıları Yeniden Yönlendir",
    instructionStart: "Bağlayıcılarınız yerleştirildikten sonra istediğiniz gibi yeniden yönlendirebilirsiniz.",
    instructionSelect: "Önce bağlayıcıyı seçin",
    instructionMiddle: ", ardından",
    instructionClick: "bağlayıcı yoluna tıklayın",
    instructionAnd: "ve",
    instructionDrag: "değiştirmek için sürükleyin",
    instructionEnd: "!"
  },
  connectorEmptySpaceTooltip: {
    message: "Bu bağlayıcıyı bir düğüme bağlamak için,",
    instruction: "bağlayıcının ucuna sol tıklayın ve istediğiniz düğüme sürükleyin."
  },
  settings: {
    zoom: {
      description: "Fare tekerleği kullanılırken yakınlaştırma davranışını yapılandırın.",
      zoomToCursor: "İmlece Yakınlaştır",
      zoomToCursorDesc: "Etkinleştirildiğinde, fare imleci konumunda merkezlenmiş olarak yakınlaştırır/uzaklaştırır. Devre dışı bırakıldığında, yakınlaştırma tuvalde merkezlenir."
    },
    hotkeys: {
      title: "Kısayol Tuşu Ayarları",
      profile: "Kısayol Tuşu Profili",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "Kısayol Tuşu Yok",
      tool: "Araç",
      hotkey: "Kısayol Tuşu",
      toolSelect: "Seç",
      toolPan: "Kaydır",
      toolAddItem: "Öğe Ekle",
      toolRectangle: "Dikdörtgen",
      toolConnector: "Bağlayıcı",
      toolText: "Metin",
      note: "Not: Kısayol tuşları metin alanlarında yazarken çalışmaz"
    },
    pan: {
      title: "Kaydırma Ayarları",
      mousePanOptions: "Fare Kaydırma Seçenekleri",
      emptyAreaClickPan: "Boş alanda tıkla ve sürükle",
      middleClickPan: "Orta tık ve sürükle",
      rightClickPan: "Sağ tık ve sürükle",
      ctrlClickPan: "Ctrl + tık ve sürükle",
      altClickPan: "Alt + tık ve sürükle",
      keyboardPanOptions: "Klavye Kaydırma Seçenekleri",
      arrowKeys: "Ok tuşları",
      wasdKeys: "WASD tuşları",
      ijklKeys: "IJKL tuşları",
      keyboardPanSpeed: "Klavye Kaydırma Hızı",
      note: "Not: Kaydırma seçenekleri özel Kaydırma aracına ek olarak çalışır"
    },
    connector: {
      title: "Bağlayıcı Ayarları",
      connectionMode: "Bağlantı Oluşturma Modu",
      clickMode: "Tıklama Modu (Önerilen)",
      clickModeDesc: "Bir bağlantı oluşturmak için ilk düğüme tıklayın, ardından ikinci düğüme tıklayın",
      dragMode: "Sürükleme Modu",
      dragModeDesc: "İlk düğümden ikinci düğüme tıklayın ve sürükleyin",
      note: "Not: Bu ayarı istediğiniz zaman değiştirebilirsiniz. Seçilen mod, Bağlayıcı aracı etkin olduğunda kullanılacaktır."
    },
    iconPacks: {
      title: "Simge Paketi Yönetimi",
      lazyLoading: "Tembel Yükleme Etkinleştir",
      lazyLoadingDesc: "Daha hızlı başlangıç için simge paketlerini isteğe bağlı yükle",
      availablePacks: "Mevcut Simge Paketleri",
      coreIsoflow: "Çekirdek Isoflow (Her Zaman Yüklenir)",
      alwaysEnabled: "Her zaman etkin",
      awsPack: "AWS Simgeleri",
      gcpPack: "Google Cloud Simgeleri",
      azurePack: "Azure Simgeleri",
      kubernetesPack: "Kubernetes Simgeleri",
      loading: "Yükleniyor...",
      loaded: "Yüklendi",
      notLoaded: "Yüklenmedi",
      iconCount: "{count} simge",
      lazyLoadingDisabledNote: "Tembel yükleme devre dışı. Tüm simge paketleri başlangıçta yüklenir.",
      note: "Simge paketleri ihtiyaçlarınıza göre etkinleştirilebilir veya devre dışı bırakılabilir. Devre dışı bırakılan paketler bellek kullanımını azaltır ve performansı artırır."
    }
  },
  lazyLoadingWelcome: {
    title: "Yeni Özellik: Tembel Yükleme!",
    message: "Merhaba! Popüler talep üzerine, simgelerin Tembel Yüklenmesini uyguladık, bu yüzden artık standart olmayan simge paketlerini etkinleştirmek isterseniz bunları 'Yapılandırma' bölümünde etkinleştirebilirsiniz.",
    configPath: "Yapılandırmaya erişmek için",
    configPath2: "sol üstteki Hamburger simgesine tıklayın.",
    canDisable: "İsterseniz bu davranışı devre dışı bırakabilirsiniz.",
    signature: "-Stan"
  }
};

export default locale;
