#!/usr/bin/env node
/**
 * Generates _locales/<lang>/smartteam-*-strings.json and *-jsdoc-strings.json
 * for bundled SmartTeam packages. Run from repo root: node scripts/generate-smartteam-locales.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const LANGS = [
  "es-ES",
  "pt-BR",
  "pt-PT",
  "fr",
  "de",
  "it",
  "ja",
  "zh-CN",
  "nl",
  "pl",
  "ru",
  "ko",
  "tr",
  "ca",
  "sv-SE"
];

const CORE_STR = {
  "es-ES": {
    "smartteamCore.SmartTeamButton.A|block": "A",
    "smartteamCore.SmartTeamButton.B|block": "B",
    "smartteamCore.SmartTeamGesture.Shake|block": "Agitar",
    "smartteamCore.onButtonPressed|block": "Al pulsar el botón $button",
    "smartteamCore.onGesture|block": "Al $gesture",
    "smartteamCore.waitMs|block": "Esperar (ms) $ms",
    "smartteamCore|block": "Control",
    "{id:category}Loops": "Bucles",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  "pt-BR": {
    "smartteamCore.SmartTeamGesture.Shake|block": "Sacudir",
    "smartteamCore.onButtonPressed|block": "Ao pressionar o botão $button",
    "smartteamCore.onGesture|block": "Ao $gesture",
    "smartteamCore.waitMs|block": "Aguardar (ms) $ms",
    "smartteamCore|block": "Controlo",
    "{id:category}Loops": "Loops",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  "pt-PT": {
    "smartteamCore.SmartTeamGesture.Shake|block": "Agitar",
    "smartteamCore.onButtonPressed|block": "Ao premir o botão $button",
    "smartteamCore.onGesture|block": "Ao $gesture",
    "smartteamCore.waitMs|block": "Esperar (ms) $ms",
    "smartteamCore|block": "Controlo",
    "{id:category}Loops": "Ciclos",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  fr: {
    "smartteamCore.SmartTeamGesture.Shake|block": "Secouer",
    "smartteamCore.onButtonPressed|block": "Quand le bouton $button est pressé",
    "smartteamCore.onGesture|block": "Sur $gesture",
    "smartteamCore.waitMs|block": "Attendre (ms) $ms",
    "smartteamCore|block": "Contrôle",
    "{id:category}Loops": "Boucles",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  de: {
    "smartteamCore.SmartTeamGesture.Shake|block": "Schütteln",
    "smartteamCore.onButtonPressed|block": "Wenn Taste $button gedrückt",
    "smartteamCore.onGesture|block": "Bei $gesture",
    "smartteamCore.waitMs|block": "Warten (ms) $ms",
    "smartteamCore|block": "Steuerung",
    "{id:category}Loops": "Schleifen",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  it: {
    "smartteamCore.SmartTeamGesture.Shake|block": "Scuoti",
    "smartteamCore.onButtonPressed|block": "Quando si preme il pulsante $button",
    "smartteamCore.onGesture|block": "Su $gesture",
    "smartteamCore.waitMs|block": "Attendi (ms) $ms",
    "smartteamCore|block": "Controllo",
    "{id:category}Loops": "Cicli",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  ja: {
    "smartteamCore.SmartTeamGesture.Shake|block": "振る",
    "smartteamCore.onButtonPressed|block": "ボタン $button が押されたとき",
    "smartteamCore.onGesture|block": "$gesture のとき",
    "smartteamCore.waitMs|block": "待つ (ミリ秒) $ms",
    "smartteamCore|block": "制御",
    "{id:category}Loops": "ループ",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  "zh-CN": {
    "smartteamCore.SmartTeamGesture.Shake|block": "摇晃",
    "smartteamCore.onButtonPressed|block": "当按下按钮 $button",
    "smartteamCore.onGesture|block": "当 $gesture",
    "smartteamCore.waitMs|block": "等待（毫秒）$ms",
    "smartteamCore|block": "控制",
    "{id:category}Loops": "循环",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  nl: {
    "smartteamCore.SmartTeamGesture.Shake|block": "Schudden",
    "smartteamCore.onButtonPressed|block": "Als knop $button wordt ingedrukt",
    "smartteamCore.onGesture|block": "Bij $gesture",
    "smartteamCore.waitMs|block": "Wacht (ms) $ms",
    "smartteamCore|block": "Bediening",
    "{id:category}Loops": "Lussen",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  pl: {
    "smartteamCore.SmartTeamGesture.Shake|block": "Potrząśnij",
    "smartteamCore.onButtonPressed|block": "Gdy przycisk $button jest wciśnięty",
    "smartteamCore.onGesture|block": "Przy $gesture",
    "smartteamCore.waitMs|block": "Czekaj (ms) $ms",
    "smartteamCore|block": "Sterowanie",
    "{id:category}Loops": "Pętle",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  ru: {
    "smartteamCore.SmartTeamGesture.Shake|block": "Встряхнуть",
    "smartteamCore.onButtonPressed|block": "При нажатии кнопки $button",
    "smartteamCore.onGesture|block": "При $gesture",
    "smartteamCore.waitMs|block": "Ждать (мс) $ms",
    "smartteamCore|block": "Управление",
    "{id:category}Loops": "Циклы",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  ko: {
    "smartteamCore.SmartTeamGesture.Shake|block": "흔들기",
    "smartteamCore.onButtonPressed|block": "$button 버튼을 눌렀을 때",
    "smartteamCore.onGesture|block": "$gesture 일 때",
    "smartteamCore.waitMs|block": "기다리기(밀리초) $ms",
    "smartteamCore|block": "제어",
    "{id:category}Loops": "반복",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  tr: {
    "smartteamCore.SmartTeamGesture.Shake|block": "Salla",
    "smartteamCore.onButtonPressed|block": "$button düğmesine basıldığında",
    "smartteamCore.onGesture|block": "$gesture olduğunda",
    "smartteamCore.waitMs|block": "Bekle (ms) $ms",
    "smartteamCore|block": "Kontrol",
    "{id:category}Loops": "Döngüler",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  ca: {
    "smartteamCore.SmartTeamGesture.Shake|block": "Sacsejar",
    "smartteamCore.onButtonPressed|block": "En prémer el botó $button",
    "smartteamCore.onGesture|block": "En $gesture",
    "smartteamCore.waitMs|block": "Esperar (ms) $ms",
    "smartteamCore|block": "Control",
    "{id:category}Loops": "Bucles",
    "{id:category}SmartteamCore": "SmartTeam Core"
  },
  "sv-SE": {
    "smartteamCore.SmartTeamGesture.Shake|block": "Skaka",
    "smartteamCore.onButtonPressed|block": "När knapp $button trycks",
    "smartteamCore.onGesture|block": "Vid $gesture",
    "smartteamCore.waitMs|block": "Vänta (ms) $ms",
    "smartteamCore|block": "Styrning",
    "{id:category}Loops": "Loopar",
    "{id:category}SmartteamCore": "SmartTeam Core"
  }
};

const CORE_JSDOC = {
  "es-ES": {
    smartteamCore: "Controles y utilidades SmartTeam.",
    "smartteamCore.onButtonPressed": "Ejecuta código cuando se pulsa un botón del micro:bit.",
    "smartteamCore.onButtonPressed|param|button": "botón a usar",
    "smartteamCore.onGesture": "Ejecuta código cuando se detecta un gesto del micro:bit.",
    "smartteamCore.onGesture|param|gesture": "gesto a usar",
    "smartteamCore.waitMs": "Espera un número de milisegundos.",
    "smartteamCore.waitMs|param|ms": "tiempo de espera en milisegundos"
  },
  "pt-BR": {
    smartteamCore: "Controles e utilitários SmartTeam.",
    "smartteamCore.onButtonPressed": "Executa o código quando um botão do micro:bit é pressionado.",
    "smartteamCore.onButtonPressed|param|button": "botão a tratar",
    "smartteamCore.onGesture": "Executa o código quando um gesto do micro:bit é detectado.",
    "smartteamCore.onGesture|param|gesture": "gesto a tratar",
    "smartteamCore.waitMs": "Aguarda por alguns milissegundos.",
    "smartteamCore.waitMs|param|ms": "tempo de espera em milissegundos"
  },
  "pt-PT": {
    smartteamCore: "Controlos e auxiliares SmartTeam.",
    "smartteamCore.onButtonPressed": "Executa código quando um botão do micro:bit é premido.",
    "smartteamCore.onGesture": "Executa código quando um gesto do micro:bit é detetado.",
    "smartteamCore.waitMs": "Espera um número de milissegundos."
  },
  fr: {
    smartteamCore: "Assistants de contrôle SmartTeam.",
    "smartteamCore.onButtonPressed": "Exécute le code lorsqu’un bouton du micro:bit est pressé.",
    "smartteamCore.onGesture": "Exécute le code lorsqu’un geste du micro:bit est détecté.",
    "smartteamCore.waitMs": "Attendre un nombre de millisecondes."
  },
  de: {
    smartteamCore: "SmartTeam-Steuerung und Hilfen.",
    "smartteamCore.onButtonPressed": "Führt Code aus, wenn eine micro:bit-Taste gedrückt wird.",
    "smartteamCore.onGesture": "Führt Code aus, wenn eine micro:bit-Geste erkannt wird.",
    "smartteamCore.waitMs": "Wartet eine Anzahl von Millisekunden."
  },
  it: {
    smartteamCore: "Controlli e utilità SmartTeam.",
    "smartteamCore.onButtonPressed": "Esegue il codice quando viene premuto un pulsante del micro:bit.",
    "smartteamCore.onGesture": "Esegue il codice quando viene rilevato un gesto del micro:bit.",
    "smartteamCore.waitMs": "Attende per un numero di millisecondi."
  },
  ja: {
    smartteamCore: "SmartTeam 制御とヘルパー。",
    "smartteamCore.onButtonPressed": "micro-bit のボタンが押されたときにコードを実行。",
    "smartteamCore.onGesture": "micro-bit のジェスチャーを検出したときにコードを実行。",
    "smartteamCore.waitMs": "指定したミリ秒だけ待つ。"
  },
  "zh-CN": {
    smartteamCore: "SmartTeam 控制与辅助。",
    "smartteamCore.onButtonPressed": "当 micro:bit 按钮被按下时运行代码。",
    "smartteamCore.onGesture": "当检测到 micro:bit 手势时运行代码。",
    "smartteamCore.waitMs": "等待指定的毫秒数。"
  },
  nl: {
    smartteamCore: "SmartTeam-besturing en hulpen.",
    "smartteamCore.onButtonPressed": "Voert code uit wanneer een micro:bit-knop wordt ingedrukt.",
    "smartteamCore.onGesture": "Voert code uit wanneer een micro:bit-gebaar wordt gedetecteerd.",
    "smartteamCore.waitMs": "Wacht een aantal milliseconden."
  },
  pl: {
    smartteamCore: "Sterowanie i pomocniki SmartTeam.",
    "smartteamCore.onButtonPressed": "Uruchamia kod po naciśnięciu przycisku micro:bit.",
    "smartteamCore.onGesture": "Uruchamia kod po wykryciu gestu micro:bit.",
    "smartteamCore.waitMs": "Czeka określoną liczbę milisekund."
  },
  ru: {
    smartteamCore: "Обёртки управления SmartTeam.",
    "smartteamCore.onButtonPressed": "Запускает код при нажатии кнопки micro:bit.",
    "smartteamCore.onGesture": "Запускает код при обнаружении жеста micro:bit.",
    "smartteamCore.waitMs": "Ждёт указанное число миллисекунд."
  },
  ko: {
    smartteamCore: "SmartTeam 제어 및 도우미.",
    "smartteamCore.onButtonPressed": "micro:bit 버튼을 누르면 코드를 실행합니다.",
    "smartteamCore.onGesture": "micro:bit 제스처가 감지되면 코드를 실행합니다.",
    "smartteamCore.waitMs": "밀리초 단위로 지정한 시간만큼 기다립니다."
  },
  tr: {
    smartteamCore: "SmartTeam kontrol ve yardımcıları.",
    "smartteamCore.onButtonPressed": "micro:bit düğmesine basıldığında kodu çalıştırır.",
    "smartteamCore.onGesture": "micro:bit hareketi algılandığında kodu çalıştırır.",
    "smartteamCore.waitMs": "Belirtilen milisaniye kadar bekler."
  },
  ca: {
    smartteamCore: "Controls i ajudes SmartTeam.",
    "smartteamCore.onButtonPressed": "Executa el codi quan es prem un botó del micro:bit.",
    "smartteamCore.onGesture": "Executa el codi quan es detecta un gest del micro:bit.",
    "smartteamCore.waitMs": "Espera un nombre de mil·lisegons."
  },
  "sv-SE": {
    smartteamCore: "SmartTeam-styrning och hjälpfunktioner.",
    "smartteamCore.onButtonPressed": "Kör kod när en micro:bit-knapp trycks.",
    "smartteamCore.onGesture": "Kör kod när en micro:bit-gest identifieras.",
    "smartteamCore.waitMs": "Väntar ett antal millisekunder."
  }
};

const OUTPUT_STR = {
  "es-ES": {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Apagar",
    "smartteamOutputs.SmartTeamLedState.On|block": "Encender",
    "smartteamOutputs.playNote|block": "Tocar nota $note con duración (ms) $duration en zumbador integrado",
    "smartteamOutputs.playTone|block": "Tocar tono $frequency con duración (ms) $duration en zumbador integrado",
    "smartteamOutputs.setLedBrightness|block": "Ajustar brillo del LED a $brightness en el pin $pin",
    "smartteamOutputs.setLed|block": "$state LED en el pin $pin",
    "smartteamOutputs.startMelody|block": "Iniciar melodía $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Apagar zumbador integrado",
    "smartteamOutputs|block": "Salidas",
    "{id:category}SmartteamOutputs": "SmartTeam Salidas",
    "{id:group}Buzzer": "Zumbador",
    "{id:group}External": "Externo",
    "{id:group}RGB": "RGB"
  },
  "pt-BR": {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Desligar",
    "smartteamOutputs.SmartTeamLedState.On|block": "Ligar",
    "smartteamOutputs.playNote|block": "Tocar nota $note com duração (ms) $duration no buzzer integrado",
    "smartteamOutputs.playTone|block": "Tocar tom $frequency com duração (ms) $duration no buzzer integrado",
    "smartteamOutputs.setLedBrightness|block": "Definir brilho do LED $brightness no pino $pin",
    "smartteamOutputs.setLed|block": "$state LED no pino $pin",
    "smartteamOutputs.startMelody|block": "Iniciar melodia $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Parar buzzer integrado",
    "smartteamOutputs|block": "Saídas",
    "{id:category}SmartteamOutputs": "SmartTeam Saídas",
    "{id:group}Buzzer": "Buzzer",
    "{id:group}External": "Externo",
    "{id:group}RGB": "RGB"
  },
  "pt-PT": {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Desligar",
    "smartteamOutputs.SmartTeamLedState.On|block": "Ligar",
    "smartteamOutputs.playNote|block": "Tocar nota $note com duração (ms) $duration na campainha integrada",
    "smartteamOutputs.playTone|block": "Tocar tom $frequency com duração (ms) $duration na campainha integrada",
    "smartteamOutputs.setLedBrightness|block": "Definir brilho do LED $brightness no pin $pin",
    "smartteamOutputs.setLed|block": "$state LED no pin $pin",
    "smartteamOutputs.startMelody|block": "Iniciar melodia $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Parar campainha integrada",
    "smartteamOutputs|block": "Saídas",
    "{id:group}Buzzer": "Campainha",
    "{id:group}External": "Externo",
    "{id:group}RGB": "RGB"
  },
  fr: {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Éteindre",
    "smartteamOutputs.SmartTeamLedState.On|block": "Allumer",
    "smartteamOutputs.playNote|block": "Jouer la note $note durée (ms) $duration sur le buzzer intégré",
    "smartteamOutputs.playTone|block": "Jouer le ton $frequency durée (ms) $duration sur le buzzer intégré",
    "smartteamOutputs.setLedBrightness|block": "Régler la luminosité du LED à $brightness sur la broche $pin",
    "smartteamOutputs.setLed|block": "$state LED sur la broche $pin",
    "smartteamOutputs.startMelody|block": "Démarrer mélodie $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Arrêter le buzzer intégré",
    "smartteamOutputs|block": "Sorties",
    "{id:group}Buzzer": "Buzzer",
    "{id:group}External": "Externe",
    "{id:group}RGB": "RVB"
  },
  de: {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Aus",
    "smartteamOutputs.SmartTeamLedState.On|block": "Ein",
    "smartteamOutputs.playNote|block": "Note $note mit Dauer (ms) $duration auf integriertem Summer abspielen",
    "smartteamOutputs.playTone|block": "Ton $frequency mit Dauer (ms) $duration auf integriertem Summer abspielen",
    "smartteamOutputs.setLedBrightness|block": "LED-Helligkeit auf $brightness an Pin $pin setzen",
    "smartteamOutputs.setLed|block": "$state LED an Pin $pin",
    "smartteamOutputs.startMelody|block": "Melodie $melody $mode starten",
    "smartteamOutputs.stopBuzzer|block": "Integrierten Summer stoppen",
    "smartteamOutputs|block": "Ausgänge",
    "{id:group}Buzzer": "Summer",
    "{id:group}External": "Extern",
    "{id:group}RGB": "RGB"
  },
  it: {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Spegni",
    "smartteamOutputs.SmartTeamLedState.On|block": "Accendi",
    "smartteamOutputs.playNote|block": "Suona nota $note con durata (ms) $duration sul buzzer integrato",
    "smartteamOutputs.playTone|block": "Suona tono $frequency con durata (ms) $duration sul buzzer integrato",
    "smartteamOutputs.setLedBrightness|block": "Imposta luminosità LED a $brightness sul pin $pin",
    "smartteamOutputs.setLed|block": "$state LED sul pin $pin",
    "smartteamOutputs.startMelody|block": "Avvia melodia $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Ferma buzzer integrato",
    "smartteamOutputs|block": "Uscite",
    "{id:group}Buzzer": "Cicalino",
    "{id:group}External": "Esterno",
    "{id:group}RGB": "RGB"
  },
  ja: {
    "smartteamOutputs.SmartTeamLedState.Off|block": "オフ",
    "smartteamOutputs.SmartTeamLedState.On|block": "オン",
    "smartteamOutputs.playNote|block": "内蔵ブザーで音符 $note を (ミリ秒) $duration 鳴らす",
    "smartteamOutputs.playTone|block": "内蔵ブザーで $frequency Hz を (ミリ秒) $duration 鳴らす",
    "smartteamOutputs.setLedBrightness|block": "ピン $pin のLEDの明るさを $brightness にする",
    "smartteamOutputs.setLed|block": "ピン $pin のLEDを $state",
    "smartteamOutputs.startMelody|block": "メロディ $melody を $mode で開始",
    "smartteamOutputs.stopBuzzer|block": "内蔵ブザーを止める",
    "smartteamOutputs|block": "出力",
    "{id:group}Buzzer": "ブザー",
    "{id:group}External": "外部",
    "{id:group}RGB": "RGB"
  },
  "zh-CN": {
    "smartteamOutputs.SmartTeamLedState.Off|block": "关",
    "smartteamOutputs.SmartTeamLedState.On|block": "开",
    "smartteamOutputs.playNote|block": "在内置蜂鸣器播放音符 $note，持续(毫秒) $duration",
    "smartteamOutputs.playTone|block": "在内置蜂鸣器播放频率 $frequency，持续(毫秒) $duration",
    "smartteamOutputs.setLedBrightness|block": "将引脚 $pin 的LED亮度设为 $brightness",
    "smartteamOutputs.setLed|block": "$state 引脚 $pin 上的LED",
    "smartteamOutputs.startMelody|block": "开始旋律 $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "停止内置蜂鸣器",
    "smartteamOutputs|block": "输出",
    "{id:group}Buzzer": "蜂鸣器",
    "{id:group}External": "外部",
    "{id:group}RGB": "RGB"
  },
  nl: {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Uit",
    "smartteamOutputs.SmartTeamLedState.On|block": "Aan",
    "smartteamOutputs.playNote|block": "Speel noot $note met duur (ms) $duration op ingebouwde zoemer",
    "smartteamOutputs.playTone|block": "Speel toon $frequency met duur (ms) $duration op ingebouwde zoemer",
    "smartteamOutputs.setLedBrightness|block": "Stel LED-helderheid in op $brightness op pin $pin",
    "smartteamOutputs.setLed|block": "$state LED op pin $pin",
    "smartteamOutputs.startMelody|block": "Start melodie $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Stop ingebouwde zoemer",
    "smartteamOutputs|block": "Uitgangen",
    "{id:group}Buzzer": "Zoemer",
    "{id:group}External": "Extern",
    "{id:group}RGB": "RGB"
  },
  pl: {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Wyłącz",
    "smartteamOutputs.SmartTeamLedState.On|block": "Włącz",
    "smartteamOutputs.playNote|block": "Zagraj nutę $note przez (ms) $duration na wbudowanym brzęczyku",
    "smartteamOutputs.playTone|block": "Zagraj ton $frequency przez (ms) $duration na wbudowanym brzęczyku",
    "smartteamOutputs.setLedBrightness|block": "Ustaw jasność LED na $brightness na pinie $pin",
    "smartteamOutputs.setLed|block": "$state LED na pinie $pin",
    "smartteamOutputs.startMelody|block": "Rozpocznij melodię $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Zatrzymaj wbudowany brzęczyk",
    "smartteamOutputs|block": "Wyjścia",
    "{id:group}Buzzer": "Brzęczyk",
    "{id:group}External": "Zewnętrzny",
    "{id:group}RGB": "RGB"
  },
  ru: {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Выкл.",
    "smartteamOutputs.SmartTeamLedState.On|block": "Вкл.",
    "smartteamOutputs.playNote|block": "Играть ноту $note длительность (мс) $duration на встроенном пищалке",
    "smartteamOutputs.playTone|block": "Играть тон $frequency длительность (мс) $duration на встроенном пищалке",
    "smartteamOutputs.setLedBrightness|block": "Яркость LED $brightness на контакте $pin",
    "smartteamOutputs.setLed|block": "$state LED на контакте $pin",
    "smartteamOutputs.startMelody|block": "Начать мелодию $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Остановить встроенный зуммер",
    "smartteamOutputs|block": "Выходы",
    "{id:group}Buzzer": "Зуммер",
    "{id:group}External": "Внешний",
    "{id:group}RGB": "RGB"
  },
  ko: {
    "smartteamOutputs.SmartTeamLedState.Off|block": "끄기",
    "smartteamOutputs.SmartTeamLedState.On|block": "켜기",
    "smartteamOutputs.playNote|block": "내장 부저로 음표 $note 재생 (ms) $duration",
    "smartteamOutputs.playTone|block": "내장 부저로 $frequency Hz 재생 (ms) $duration",
    "smartteamOutputs.setLedBrightness|block": "핀 $pin LED 밝기를 $brightness 로 설정",
    "smartteamOutputs.setLed|block": "핀 $pin LED $state",
    "smartteamOutputs.startMelody|block": "멜로디 $melody $mode 시작",
    "smartteamOutputs.stopBuzzer|block": "내장 부저 끄기",
    "smartteamOutputs|block": "출력",
    "{id:group}Buzzer": "부저",
    "{id:group}External": "외부",
    "{id:group}RGB": "RGB"
  },
  tr: {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Kapat",
    "smartteamOutputs.SmartTeamLedState.On|block": "Aç",
    "smartteamOutputs.playNote|block": "Entegre zilden not $note süre (ms) $duration çal",
    "smartteamOutputs.playTone|block": "Entegre zilden ton $frequency süre (ms) $duration çal",
    "smartteamOutputs.setLedBrightness|block": "$pin pininde LED parlaklığını $brightness yap",
    "smartteamOutputs.setLed|block": "$pin pininde LED $state",
    "smartteamOutputs.startMelody|block": "Melodi başlat $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Entegre zili durdur",
    "smartteamOutputs|block": "Çıkışlar",
    "{id:group}Buzzer": "Zil",
    "{id:group}External": "Harici",
    "{id:group}RGB": "RGB"
  },
  ca: {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Apagar",
    "smartteamOutputs.SmartTeamLedState.On|block": "Encendre",
    "smartteamOutputs.playNote|block": "Tocar nota $note amb durada (ms) $duration al brunzidor integrat",
    "smartteamOutputs.playTone|block": "Tocar to $frequency amb durada (ms) $duration al brunzidor integrat",
    "smartteamOutputs.setLedBrightness|block": "Ajustar brillantor del LED a $brightness al pin $pin",
    "smartteamOutputs.setLed|block": "$state LED al pin $pin",
    "smartteamOutputs.startMelody|block": "Iniciar melodia $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Aturar brunzidor integrat",
    "smartteamOutputs|block": "Sortides",
    "{id:group}Buzzer": "Brunzidor",
    "{id:group}External": "Extern",
    "{id:group}RGB": "RGB"
  },
  "sv-SE": {
    "smartteamOutputs.SmartTeamLedState.Off|block": "Av",
    "smartteamOutputs.SmartTeamLedState.On|block": "På",
    "smartteamOutputs.playNote|block": "Spela ton $note med längd (ms) $duration på inbyggd summer",
    "smartteamOutputs.playTone|block": "Spela ton $frequency med längd (ms) $duration på inbyggd summer",
    "smartteamOutputs.setLedBrightness|block": "Sätt LED-ljusstyrka till $brightness på pinne $pin",
    "smartteamOutputs.setLed|block": "$state LED på pinne $pin",
    "smartteamOutputs.startMelody|block": "Starta melodi $melody $mode",
    "smartteamOutputs.stopBuzzer|block": "Stoppa inbyggd summer",
    "smartteamOutputs|block": "Utgångar",
    "{id:group}Buzzer": "Summer",
    "{id:group}External": "Extern",
    "{id:group}RGB": "RGB"
  }
};

const OUTPUT_JSDOC = {
  "es-ES": {
    smartteamOutputs: "Bloques de salida SmartTeam.",
    "smartteamOutputs.playNote": "Toca una nota musical en el zumbador integrado.",
    "smartteamOutputs.playNote|param|duration": "duración en milisegundos",
    "smartteamOutputs.playNote|param|note": "nota a tocar",
    "smartteamOutputs.playTone": "Toca un tono en el zumbador integrado.",
    "smartteamOutputs.playTone|param|duration": "duración en milisegundos",
    "smartteamOutputs.playTone|param|frequency": "frecuencia en Hz",
    "smartteamOutputs.setLed": "Enciende o apaga un LED externo.",
    "smartteamOutputs.setLedBrightness": "Ajusta el brillo del LED externo con PWM de 0 a 1023.",
    "smartteamOutputs.setLedBrightness|param|brightness": "valor de brillo de 0 a 1023",
    "smartteamOutputs.setLedBrightness|param|pin": "pin de salida",
    "smartteamOutputs.setLed|param|pin": "pin de salida",
    "smartteamOutputs.setLed|param|state": "estado del LED",
    "smartteamOutputs.startMelody": "Inicia una melodía integrada en el zumbador.",
    "smartteamOutputs.startMelody|param|melody": "melodía a iniciar",
    "smartteamOutputs.startMelody|param|mode": "modo de reproducción",
    "smartteamOutputs.stopBuzzer": "Detiene todos los sonidos del zumbador integrado."
  }
};

const MOTORS_STR = {
  "es-ES": {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "izquierda",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "derecha",
    "smartteamMotors.turnDcMotor|block": "Girar motor DC hacia la $direction en el pin $pin",
    "smartteamMotors|block": "Motores",
    "{id:category}SmartteamMotors": "SmartTeam Motores",
    "{id:group}DC Motor": "Motor DC",
    "{id:group}Servo": "Servo",
    "{id:group}Robot movement": "Movimiento robot"
  },
  "pt-BR": {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "esquerda",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "direita",
    "smartteamMotors.turnDcMotor|block": "Girar motor DC para $direction no pino $pin",
    "smartteamMotors|block": "Motores",
    "{id:group}DC Motor": "Motor DC",
    "{id:group}Servo": "Servo",
    "{id:group}Robot movement": "Movimento do robô"
  },
  "pt-PT": {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "esquerda",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "direita",
    "smartteamMotors.turnDcMotor|block": "Rodar motor DC para $direction no pin $pin",
    "smartteamMotors|block": "Motores",
    "{id:group}DC Motor": "Motor DC",
    "{id:group}Servo": "Servo",
    "{id:group}Robot movement": "Movimento do robô"
  },
  fr: {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "gauche",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "droite",
    "smartteamMotors.turnDcMotor|block": "Tourner moteur DC vers $direction sur la broche $pin",
    "smartteamMotors|block": "Moteurs",
    "{id:group}DC Motor": "Moteur DC",
    "{id:group}Servo": "Servo",
    "{id:group}Robot movement": "Mouvement du robot"
  },
  de: {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "links",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "rechts",
    "smartteamMotors.turnDcMotor|block": "DC-Motor dreht $direction an Pin $pin",
    "smartteamMotors|block": "Motoren",
    "{id:group}DC Motor": "DC-Motor",
    "{id:group}Servo": "Servo",
    "{id:group}Robot movement": "Roboterbewegung"
  },
  it: {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "sinistra",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "destra",
    "smartteamMotors.turnDcMotor|block": "Ruota motore DC verso $direction sul pin $pin",
    "smartteamMotors|block": "Motori",
    "{id:group}DC Motor": "Motore DC",
    "{id:group}Servo": "Servo",
    "{id:group}Robot movement": "Movimento robot"
  },
  ja: {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "左",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "右",
    "smartteamMotors.turnDcMotor|block": "ピン $pin で DCモーターを $direction に回す",
    "smartteamMotors|block": "モーター",
    "{id:group}DC Motor": "DCモーター",
    "{id:group}Servo": "サーボ",
    "{id:group}Robot movement": "ロボットの動き"
  },
  "zh-CN": {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "左",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "右",
    "smartteamMotors.turnDcMotor|block": "引脚 $pin 上直流电机转向 $direction",
    "smartteamMotors|block": "电机",
    "{id:group}DC Motor": "直流电机",
    "{id:group}Servo": "舵机",
    "{id:group}Robot movement": "机器人运动"
  },
  nl: {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "links",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "rechts",
    "smartteamMotors.turnDcMotor|block": "DC-motor draait $direction op pin $pin",
    "smartteamMotors|block": "Motoren",
    "{id:group}DC Motor": "DC-motor",
    "{id:group}Servo": "Servo",
    "{id:group}Robot movement": "Robotbeweging"
  },
  pl: {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "lewo",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "prawo",
    "smartteamMotors.turnDcMotor|block": "Obróć silnik DC w stronę $direction na pinie $pin",
    "smartteamMotors|block": "Silniki",
    "{id:group}DC Motor": "Silnik DC",
    "{id:group}Servo": "Serwo",
    "{id:group}Robot movement": "Ruch robota"
  },
  ru: {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "влево",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "вправо",
    "smartteamMotors.turnDcMotor|block": "Повернуть DC-мотор $direction на контакте $pin",
    "smartteamMotors|block": "Моторы",
    "{id:group}DC Motor": "DC-мотор",
    "{id:group}Servo": "Серво",
    "{id:group}Robot movement": "Движение робота"
  },
  ko: {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "왼쪽",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "오른쪽",
    "smartteamMotors.turnDcMotor|block": "핀 $pin 에서 DC 모터를 $direction 으로 돌리기",
    "smartteamMotors|block": "모터",
    "{id:group}DC Motor": "DC 모터",
    "{id:group}Servo": "서보",
    "{id:group}Robot movement": "로봇 움직임"
  },
  tr: {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "sol",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "sağ",
    "smartteamMotors.turnDcMotor|block": "$pin pininde DC motoru $direction döndür",
    "smartteamMotors|block": "Motorlar",
    "{id:group}DC Motor": "DC motor",
    "{id:group}Servo": "Servo",
    "{id:group}Robot movement": "Robot hareketi"
  },
  ca: {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "esquerra",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "dreta",
    "smartteamMotors.turnDcMotor|block": "Girar motor CC cap a $direction al pin $pin",
    "smartteamMotors|block": "Motors",
    "{id:group}DC Motor": "Motor CC",
    "{id:group}Servo": "Servo",
    "{id:group}Robot movement": "Moviment del robot"
  },
  "sv-SE": {
    "smartteamMotors.SmartTeamMotorDirection.Left|block": "vänster",
    "smartteamMotors.SmartTeamMotorDirection.Right|block": "höger",
    "smartteamMotors.turnDcMotor|block": "Vrid DC-motor $direction på pinne $pin",
    "smartteamMotors|block": "Motorer",
    "{id:group}DC Motor": "DC-motor",
    "{id:group}Servo": "Servo",
    "{id:group}Robot movement": "Rörelse"
  }
};

const MOTORS_JSDOC = {
  "es-ES": {
    smartteamMotors: "Bloques de motor SmartTeam.",
    "smartteamMotors.turnDcMotor": "Gira un motor DC con un único pin digital de control.",
    "smartteamMotors.turnDcMotor|param|direction": "dirección del motor",
    "smartteamMotors.turnDcMotor|param|pin": "pin de control del motor"
  }
};

const INPUTS_STR = {
  "es-ES": {
    "smartteamAnalogInputs.microbitLightLevel|block": "Nivel de luz del sensor del micro:bit",
    "smartteamAnalogInputs|block": "Entradas (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Botón en el pin $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "El logo está pulsado",
    "smartteamDigitalInputs.microbitButtonPressed|block": "El botón $button está pulsado",
    "smartteamDigitalInputs.obstaclePin|block": "Obstáculo en el pin $pin",
    "smartteamDigitalInputs|block": "Entradas (D)",
    "{id:category}SmartteamAnalogInputs": "SmartTeam Entradas A",
    "{id:category}SmartteamDigitalInputs": "SmartTeam Entradas D",
    "{id:group}External": "Externo",
    "{id:group}micro:bit": "micro:bit"
  },
  "pt-BR": {
    "smartteamAnalogInputs.microbitLightLevel|block": "Nível de luz do sensor do micro:bit",
    "smartteamAnalogInputs|block": "Entradas (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Botão no pino $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "Logo está pressionado",
    "smartteamDigitalInputs.microbitButtonPressed|block": "Botão $button está pressionado",
    "smartteamDigitalInputs.obstaclePin|block": "Obstáculo no pino $pin",
    "smartteamDigitalInputs|block": "Entradas (D)",
    "{id:group}External": "Externo",
    "{id:group}micro:bit": "micro:bit"
  },
  "pt-PT": {
    "smartteamAnalogInputs.microbitLightLevel|block": "Nível de luz do sensor do micro:bit",
    "smartteamAnalogInputs|block": "Entradas (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Botão no pin $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "O logo está premido",
    "smartteamDigitalInputs.microbitButtonPressed|block": "O botão $button está premido",
    "smartteamDigitalInputs.obstaclePin|block": "Obstáculo no pin $pin",
    "smartteamDigitalInputs|block": "Entradas (D)",
    "{id:group}External": "Externo",
    "{id:group}micro:bit": "micro:bit"
  },
  fr: {
    "smartteamAnalogInputs.microbitLightLevel|block": "Niveau de lumière du capteur micro:bit",
    "smartteamAnalogInputs|block": "Entrées (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Bouton sur la broche $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "Le logo est pressé",
    "smartteamDigitalInputs.microbitButtonPressed|block": "Le bouton $button est pressé",
    "smartteamDigitalInputs.obstaclePin|block": "Obstacle sur la broche $pin",
    "smartteamDigitalInputs|block": "Entrées (D)",
    "{id:group}External": "Externe",
    "{id:group}micro:bit": "micro:bit"
  },
  de: {
    "smartteamAnalogInputs.microbitLightLevel|block": "Lichtlevel am micro:bit-Sensor",
    "smartteamAnalogInputs|block": "Eingänge (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Taste an Pin $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "Logo ist gedrückt",
    "smartteamDigitalInputs.microbitButtonPressed|block": "Taste $button ist gedrückt",
    "smartteamDigitalInputs.obstaclePin|block": "Hindernis an Pin $pin",
    "smartteamDigitalInputs|block": "Eingänge (D)",
    "{id:group}External": "Extern",
    "{id:group}micro:bit": "micro:bit"
  },
  it: {
    "smartteamAnalogInputs.microbitLightLevel|block": "Livello di luce sul sensore micro:bit",
    "smartteamAnalogInputs|block": "Ingressi (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Pulsante sul pin $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "Il logo è premuto",
    "smartteamDigitalInputs.microbitButtonPressed|block": "Il pulsante $button è premuto",
    "smartteamDigitalInputs.obstaclePin|block": "Ostacolo sul pin $pin",
    "smartteamDigitalInputs|block": "Ingressi (D)",
    "{id:group}External": "Esterno",
    "{id:group}micro:bit": "micro:bit"
  },
  ja: {
    "smartteamAnalogInputs.microbitLightLevel|block": "micro:bit センサーの明るさ",
    "smartteamAnalogInputs|block": "入力 (~A)",
    "smartteamDigitalInputs.buttonPin|block": "ピン $pin のボタン",
    "smartteamDigitalInputs.logoIsPressed|block": "ロゴが押されている",
    "smartteamDigitalInputs.microbitButtonPressed|block": "ボタン $button が押されている",
    "smartteamDigitalInputs.obstaclePin|block": "ピン $pin の障害物センサー",
    "smartteamDigitalInputs|block": "入力 (D)",
    "{id:group}External": "外部",
    "{id:group}micro:bit": "micro:bit"
  },
  "zh-CN": {
    "smartteamAnalogInputs.microbitLightLevel|block": "micro:bit 传感器亮度",
    "smartteamAnalogInputs|block": "输入 (~A)",
    "smartteamDigitalInputs.buttonPin|block": "引脚 $pin 上的按钮",
    "smartteamDigitalInputs.logoIsPressed|block": "徽标被按下",
    "smartteamDigitalInputs.microbitButtonPressed|block": "按钮 $button 被按下",
    "smartteamDigitalInputs.obstaclePin|block": "引脚 $pin 上的障碍物",
    "smartteamDigitalInputs|block": "输入 (D)",
    "{id:group}External": "外部",
    "{id:group}micro:bit": "micro:bit"
  },
  nl: {
    "smartteamAnalogInputs.microbitLightLevel|block": "Lichtniveau op micro:bit-sensor",
    "smartteamAnalogInputs|block": "Invoer (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Knop op pin $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "Logo is ingedrukt",
    "smartteamDigitalInputs.microbitButtonPressed|block": "Knop $button is ingedrukt",
    "smartteamDigitalInputs.obstaclePin|block": "Obstakel op pin $pin",
    "smartteamDigitalInputs|block": "Invoer (D)",
    "{id:group}External": "Extern",
    "{id:group}micro:bit": "micro:bit"
  },
  pl: {
    "smartteamAnalogInputs.microbitLightLevel|block": "Poziom światła czujnika micro:bit",
    "smartteamAnalogInputs|block": "Wejścia (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Przycisk na pinie $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "Logo jest wciśnięte",
    "smartteamDigitalInputs.microbitButtonPressed|block": "Przycisk $button jest wciśnięty",
    "smartteamDigitalInputs.obstaclePin|block": "Przeszkoda na pinie $pin",
    "smartteamDigitalInputs|block": "Wejścia (D)",
    "{id:group}External": "Zewnętrzny",
    "{id:group}micro:bit": "micro:bit"
  },
  ru: {
    "smartteamAnalogInputs.microbitLightLevel|block": "Уровень освещённости датчика micro:bit",
    "smartteamAnalogInputs|block": "Входы (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Кнопка на контакте $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "Логотип нажат",
    "smartteamDigitalInputs.microbitButtonPressed|block": "Кнопка $button нажата",
    "smartteamDigitalInputs.obstaclePin|block": "Препятствие на контакте $pin",
    "smartteamDigitalInputs|block": "Входы (D)",
    "{id:group}External": "Внешний",
    "{id:group}micro:bit": "micro:bit"
  },
  ko: {
    "smartteamAnalogInputs.microbitLightLevel|block": "micro:bit 센서 밝기",
    "smartteamAnalogInputs|block": "입력 (~A)",
    "smartteamDigitalInputs.buttonPin|block": "핀 $pin의 버튼",
    "smartteamDigitalInputs.logoIsPressed|block": "로고가 눌림",
    "smartteamDigitalInputs.microbitButtonPressed|block": "버튼 $button이 눌림",
    "smartteamDigitalInputs.obstaclePin|block": "핀 $pin의 장애물",
    "smartteamDigitalInputs|block": "입력 (D)",
    "{id:group}External": "외부",
    "{id:group}micro:bit": "micro:bit"
  },
  tr: {
    "smartteamAnalogInputs.microbitLightLevel|block": "micro:bit sensörü ışık seviyesi",
    "smartteamAnalogInputs|block": "Girişler (~A)",
    "smartteamDigitalInputs.buttonPin|block": "$pin pininde düğme",
    "smartteamDigitalInputs.logoIsPressed|block": "Logo basılı",
    "smartteamDigitalInputs.microbitButtonPressed|block": "$button düğmesi basılı",
    "smartteamDigitalInputs.obstaclePin|block": "$pin pininde engel",
    "smartteamDigitalInputs|block": "Girişler (D)",
    "{id:group}External": "Harici",
    "{id:group}micro:bit": "micro:bit"
  },
  ca: {
    "smartteamAnalogInputs.microbitLightLevel|block": "Nivell de llum del sensor micro:bit",
    "smartteamAnalogInputs|block": "Entrades (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Botó al pin $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "El logo està premut",
    "smartteamDigitalInputs.microbitButtonPressed|block": "El botó $button està premut",
    "smartteamDigitalInputs.obstaclePin|block": "Obstacle al pin $pin",
    "smartteamDigitalInputs|block": "Entrades (D)",
    "{id:group}External": "Extern",
    "{id:group}micro:bit": "micro:bit"
  },
  "sv-SE": {
    "smartteamAnalogInputs.microbitLightLevel|block": "Ljusnivå på micro:bit-sensor",
    "smartteamAnalogInputs|block": "Inmatningar (~A)",
    "smartteamDigitalInputs.buttonPin|block": "Knapp på pinne $pin",
    "smartteamDigitalInputs.logoIsPressed|block": "Logotypen är nedtryckt",
    "smartteamDigitalInputs.microbitButtonPressed|block": "Knapp $button är nedtryckt",
    "smartteamDigitalInputs.obstaclePin|block": "Hinder på pinne $pin",
    "smartteamDigitalInputs|block": "Inmatningar (D)",
    "{id:group}External": "Extern",
    "{id:group}micro:bit": "micro:bit"
  }
};

const INPUTS_JSDOC = {
  "es-ES": {
    smartteamAnalogInputs: "Bloques de entradas analógicas SmartTeam.",
    "smartteamAnalogInputs.microbitLightLevel": "Lee el nivel de luz del micro:bit.",
    smartteamDigitalInputs: "Bloques de entradas digitales SmartTeam.",
    "smartteamDigitalInputs.buttonPin": "Lee un pulsador externo en un pin digital.",
    "smartteamDigitalInputs.buttonPin|param|pin": "pin de entrada",
    "smartteamDigitalInputs.logoIsPressed": "Comprueba si el logo del micro:bit está pulsado.",
    "smartteamDigitalInputs.microbitButtonPressed": "Comprueba si un botón del micro:bit está pulsado.",
    "smartteamDigitalInputs.microbitButtonPressed|param|button": "botón a leer",
    "smartteamDigitalInputs.obstaclePin": "Lee un sensor de obstáculos en un pin digital.",
    "smartteamDigitalInputs.obstaclePin|param|pin": "pin de entrada"
  }
};

function mergeDeep(base, extra) {
  const out = { ...base };
  if (extra) for (const k of Object.keys(extra)) out[k] = extra[k];
  return out;
}

function writeMerged(pkgDir, pkgName, lang, partialStr, partialJsdoc, enStrPath, enJsdocPath) {
  const enStr = JSON.parse(fs.readFileSync(path.join(pkgDir, enStrPath), "utf8"));
  const enJs = JSON.parse(fs.readFileSync(path.join(pkgDir, enJsdocPath), "utf8"));
  const outDir = path.join(pkgDir, "_locales", lang);
  fs.mkdirSync(outDir, { recursive: true });
  const strOut = mergeDeep(enStr, partialStr);
  const jsOut = mergeDeep(enJs, partialJsdoc || {});
  fs.writeFileSync(path.join(outDir, `${pkgName}-strings.json`), JSON.stringify(strOut, null, 2) + "\n");
  fs.writeFileSync(path.join(outDir, `${pkgName}-jsdoc-strings.json`), JSON.stringify(jsOut, null, 2) + "\n");
}

function fillMissingJsdoc(lang, pkg, enPath, basePartial) {
  const en = JSON.parse(fs.readFileSync(path.join(root, "libs", pkg, enPath), "utf8"));
  const out = { ...(basePartial[lang] || {}) };
  for (const k of Object.keys(en)) {
    if (out[k] === undefined) out[k] = en[k];
  }
  return out;
}

for (const lang of LANGS) {
  const coreJ = fillMissingJsdoc(lang, "smartteam-core", "_locales/smartteam-core-jsdoc-strings.json", CORE_JSDOC);
  writeMerged(path.join(root, "libs/smartteam-core"), "smartteam-core", lang, CORE_STR[lang], coreJ, "_locales/smartteam-core-strings.json", "_locales/smartteam-core-jsdoc-strings.json");

  const outJ = fillMissingJsdoc(lang, "smartteam-outputs", "_locales/smartteam-outputs-jsdoc-strings.json", OUTPUT_JSDOC);
  writeMerged(path.join(root, "libs/smartteam-outputs"), "smartteam-outputs", lang, OUTPUT_STR[lang], outJ, "_locales/smartteam-outputs-strings.json", "_locales/smartteam-outputs-jsdoc-strings.json");

  const motJ = fillMissingJsdoc(lang, "smartteam-motors", "_locales/smartteam-motors-jsdoc-strings.json", MOTORS_JSDOC);
  writeMerged(path.join(root, "libs/smartteam-motors"), "smartteam-motors", lang, MOTORS_STR[lang], motJ, "_locales/smartteam-motors-strings.json", "_locales/smartteam-motors-jsdoc-strings.json");

  const inJ = fillMissingJsdoc(lang, "smartteam-inputs", "_locales/smartteam-inputs-jsdoc-strings.json", INPUTS_JSDOC);
  writeMerged(path.join(root, "libs/smartteam-inputs"), "smartteam-inputs", lang, INPUTS_STR[lang], inJ, "_locales/smartteam-inputs-strings.json", "_locales/smartteam-inputs-jsdoc-strings.json");
}

for (const pkg of ["smartteam-core", "smartteam-outputs", "smartteam-motors", "smartteam-inputs"]) {
  const p = path.join(root, "libs", pkg, "pxt.json");
  const cfg = JSON.parse(fs.readFileSync(p, "utf8"));
  const pkgLocaleFiles = LANGS.flatMap((lang) => [
    `_locales/${lang}/${pkg}-strings.json`,
    `_locales/${lang}/${pkg}-jsdoc-strings.json`
  ]);
  const baseFiles = ["README.md", "main.ts"];
  const existing = new Set([...baseFiles, ...pkgLocaleFiles]);
  cfg.files = Array.from(existing);
  cfg.files.sort((a, b) => {
    if (a === "README.md") return -1;
    if (b === "README.md") return 1;
    if (a === "main.ts") return b === "README.md" ? 1 : -1;
    if (b === "main.ts") return 1;
    return a.localeCompare(b);
  });
  fs.writeFileSync(p, JSON.stringify(cfg, null, 4) + "\n");
}

console.log("Wrote locales for:", LANGS.join(", "));
console.log("Updated pxt.json for smartteam-* packages.");
