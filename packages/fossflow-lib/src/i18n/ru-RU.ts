import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "Это пример текста"
  },
  mainMenu: {
    undo: "Отменить",
    redo: "Повторить",
    open: "Открыть",
    exportJson: "Экспортировать как JSON",
    exportCompactJson: "Экспортировать как компактный JSON",
    exportImage: "Экспортировать как изображение",
    clearCanvas: "Очистить холст",
    settings: "Настройки",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Горячие клавиши и справка",
    close: "Закрыть",
    keyboardShortcuts: "Горячие клавиши",
    mouseInteractions: "Взаимодействие с мышью",
    action: "Действие",
    shortcut: "Горячая клавиша",
    method: "Метод",
    description: "Описание",
    note: "Примечание:",
    noteContent: "Горячие клавиши отключены при вводе в полях ввода, текстовых областях или редактируемых элементах во избежание конфликтов.",
    // Keyboard shortcuts
    undoAction: "Отменить",
    undoDescription: "Отменить последнее действие",
    redoAction: "Повторить",
    redoDescription: "Повторить последнее отмененное действие",
    redoAltAction: "Повторить (альтернатива)",
    redoAltDescription: "Альтернативная горячая клавиша для повтора",
    helpAction: "Справка",
    helpDescription: "Открыть диалог справки с горячими клавишами",
    zoomInAction: "Увеличить",
    zoomInShortcut: "Колесико мыши вверх",
    zoomInDescription: "Увеличить масштаб холста",
    zoomOutAction: "Уменьшить",
    zoomOutShortcut: "Колесико мыши вниз",
    zoomOutDescription: "Уменьшить масштаб холста",
    panCanvasAction: "Переместить холст",
    panCanvasShortcut: "Левая кнопка + перетаскивание",
    panCanvasDescription: "Переместить холст в режиме перемещения",
    contextMenuAction: "Контекстное меню",
    contextMenuShortcut: "Правая кнопка мыши",
    contextMenuDescription: "Открыть контекстное меню для элементов или пустого пространства",
    // Mouse interactions
    selectToolAction: "Инструмент выделения",
    selectToolShortcut: "Нажать кнопку Выделить",
    selectToolDescription: "Переключиться в режим выделения",
    panToolAction: "Инструмент перемещения",
    panToolShortcut: "Нажать кнопку Переместить",
    panToolDescription: "Переключиться в режим перемещения холста",
    addItemAction: "Добавить элемент",
    addItemShortcut: "Нажать кнопку Добавить элемент",
    addItemDescription: "Открыть выбор иконок для добавления новых элементов",
    drawRectangleAction: "Нарисовать прямоугольник",
    drawRectangleShortcut: "Нажать кнопку Прямоугольник",
    drawRectangleDescription: "Переключиться в режим рисования прямоугольников",
    createConnectorAction: "Создать соединитель",
    createConnectorShortcut: "Нажать кнопку Соединитель",
    createConnectorDescription: "Переключиться в режим соединителя",
    addTextAction: "Добавить текст",
    addTextShortcut: "Нажать кнопку Текст",
    addTextDescription: "Создать новое текстовое поле"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "Совет: Создание соединителей",
    tipConnectorTools: "Совет: Инструменты соединителей",
    clickInstructionStart: "Нажмите",
    clickInstructionMiddle: "на первый узел или точку, затем",
    clickInstructionEnd: "на второй узел или точку, чтобы создать соединение.",
    nowClickTarget: "Теперь нажмите на цель, чтобы завершить соединение.",
    dragStart: "Перетащите",
    dragEnd: "от первого узла ко второму узлу, чтобы создать соединение.",
    rerouteStart: "Чтобы изменить маршрут соединителя,",
    rerouteMiddle: "нажмите левой кнопкой",
    rerouteEnd: "на любую точку вдоль линии соединителя и перетащите, чтобы создать или переместить опорные точки."
  },
  lassoHintTooltip: {
    tipLasso: "Совет: Выделение лассо",
    tipFreehandLasso: "Совет: Свободное выделение лассо",
    lassoDragStart: "Нажмите и перетащите",
    lassoDragEnd: "чтобы нарисовать прямоугольную область выделения вокруг элементов, которые вы хотите выбрать.",
    freehandDragStart: "Нажмите и перетащите",
    freehandDragMiddle: "чтобы нарисовать",
    freehandDragEnd: "произвольную форму",
    freehandComplete: "вокруг элементов. Отпустите, чтобы выбрать все элементы внутри формы.",
    moveStart: "После выделения",
    moveMiddle: "нажмите внутри выделения",
    moveEnd: "и перетащите, чтобы переместить все выделенные элементы вместе."
  },
  importHintTooltip: {
    title: "Импорт диаграмм",
    instructionStart: "Чтобы импортировать диаграммы, нажмите",
    menuButton: "кнопку меню",
    instructionMiddle: "(☰) в верхнем левом углу, затем выберите",
    openButton: "\"Открыть\"",
    instructionEnd: "чтобы загрузить файлы диаграмм."
  },
  connectorRerouteTooltip: {
    title: "Совет: Изменение маршрута соединителей",
    instructionStart: "После размещения соединителей вы можете изменить их маршрут по своему усмотрению.",
    instructionSelect: "Выберите соединитель",
    instructionMiddle: "сначала, затем",
    instructionClick: "нажмите на путь соединителя",
    instructionAnd: "и",
    instructionDrag: "перетащите",
    instructionEnd: "чтобы изменить его!"
  },
  settings: {
    zoom: {
      description: "Настройте поведение масштабирования при использовании колесика мыши.",
      zoomToCursor: "Масштабировать к курсору",
      zoomToCursorDesc: "При включении масштабирование центрируется на позиции курсора мыши. При выключении масштабирование центрируется на холсте."
    },
    hotkeys: {
      title: "Настройки горячих клавиш",
      profile: "Профиль горячих клавиш",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "Без горячих клавиш",
      tool: "Инструмент",
      hotkey: "Горячая клавиша",
      toolSelect: "Выделить",
      toolPan: "Переместить",
      toolAddItem: "Добавить элемент",
      toolRectangle: "Прямоугольник",
      toolConnector: "Соединитель",
      toolText: "Текст",
      note: "Примечание: Горячие клавиши работают, когда вы не вводите текст в текстовых полях"
    },
    pan: {
      title: "Настройки перемещения",
      mousePanOptions: "Параметры перемещения мышью",
      emptyAreaClickPan: "Нажать и перетащить на пустой области",
      middleClickPan: "Средняя кнопка и перетаскивание",
      rightClickPan: "Правая кнопка и перетаскивание",
      ctrlClickPan: "Ctrl + нажатие и перетаскивание",
      altClickPan: "Alt + нажатие и перетаскивание",
      keyboardPanOptions: "Параметры перемещения клавиатурой",
      arrowKeys: "Клавиши стрелок",
      wasdKeys: "Клавиши WASD",
      ijklKeys: "Клавиши IJKL",
      keyboardPanSpeed: "Скорость перемещения клавиатурой",
      note: "Примечание: Параметры перемещения работают в дополнение к специальному инструменту перемещения"
    },
    connector: {
      title: "Настройки соединителя",
      connectionMode: "Режим создания соединения",
      clickMode: "Режим нажатия (рекомендуется)",
      clickModeDesc: "Нажмите на первый узел, затем нажмите на второй узел, чтобы создать соединение",
      dragMode: "Режим перетаскивания",
      dragModeDesc: "Нажмите и перетащите от первого узла ко второму узлу",
      note: "Примечание: Вы можете изменить эту настройку в любое время. Выбранный режим будет использоваться, когда инструмент соединителя активен."
    },
    iconPacks: {
      title: "Управление Пакетами Иконок",
      lazyLoading: "Включить Ленивую Загрузку",
      lazyLoadingDesc: "Загружать пакеты иконок по требованию для более быстрого запуска",
      availablePacks: "Доступные Пакеты Иконок",
      coreIsoflow: "Core Isoflow (Всегда Загружен)",
      alwaysEnabled: "Всегда включено",
      awsPack: "Иконки AWS",
      gcpPack: "Иконки Google Cloud",
      azurePack: "Иконки Azure",
      kubernetesPack: "Иконки Kubernetes",
      loading: "Загрузка...",
      loaded: "Загружено",
      notLoaded: "Не загружено",
      iconCount: "{count} иконок",
      lazyLoadingDisabledNote: "Ленивая загрузка отключена. Все пакеты иконок загружаются при запуске.",
      note: "Пакеты иконок могут быть включены или отключены в зависимости от ваших потребностей. Отключенные пакеты уменьшат использование памяти и улучшат производительность."
    }
  },
  lazyLoadingWelcome: {
    title: "Новая Функция: Ленивая Загрузка!",
    message: "Привет! По многочисленным просьбам мы реализовали Ленивую Загрузку иконок, поэтому теперь, если вы хотите включить нестандартные пакеты иконок, вы можете включить их в разделе 'Конфигурация'.",
    configPath: "Нажмите на иконку Гамбургер",
    configPath2: "в верхнем левом углу, чтобы получить доступ к Конфигурации.",
    canDisable: "Вы можете отключить это поведение, если хотите.",
    signature: "-Stan"
  }
};

export default locale;
