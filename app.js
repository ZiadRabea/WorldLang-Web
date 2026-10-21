/* WorldLang Web Playground
 * Configure API endpoint in Settings. Expected response:
 * { "python": "print('hello')", "result": null, "error": null }
 * Accepted aliases: transpiled_code, python_code, output, message.
 */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const codeInput = $("codeInput");
  const highlightCode = $("highlightCode");
  const highlightLayer = $("highlightLayer");
  const lineNumbers = $("lineNumbers");
  const editorBody = $("editorBody");
  const editorPanel = $("editorPanel");
  const outputPanel = $("outputPanel");
  const languageSelect = $("languageSelect");
  const runBtn = $("runBtn");
  const runLabel = $("runLabel");
  const consoleStream = $("consoleStream");
  const consoleWelcome = $("consoleWelcome");
  const stdinForm = $("stdinForm");
  const stdinInput = $("stdinInput");
  const settingsDialog = $("settingsDialog");
  const endpointInput = $("endpointInput");
  const filenameInput = $("filenameInput");
  const toast = $("toast");

  const keywordGroups = {
    Arabic_KW: `متغير|و|او|ليس|اذا|أما_اذا|والا|من|الي|خطوة|بينما|دالة|نفذ|نهاية|ارجاع|استمر|توقف|صحيح|خطأ|لاشئ`,
    Chinese_KW: `变量|且|或者|非|如果|否则اگر|否则|从|到|步长|当|函数|执行|结束|返回|继续|中断|空|真|假`,
    Dutch_KW: `variabele|en|of|niet|als|andersals|anders|van|tot|stap|terwijl|functie|doe|einde|terug|doorgaan|stop|nul|waar|onwaar`,
    English_KW: `var|and|or|not|if|elif|else|from|to|step|while|func|do|end|return|continue|break|null|true|false`,
    French_KW: `variable|et|ou|non|si|sinon_si|sinon|de|à|pas|tant_que|fonc|faire|fin|retour|continuer|arrêter|nul|vrai|faux`,
    German_KW: `variable|und|oder|nicht|wenn|sonst_wenn|anders|aus|zu|Schritt|während|Funktion|tun|ende|rückkehr|fortsetzen|unterbrechung|null|STIMMT|FALSCH`,
    Indonesian_KW: `variabel|dan|atau|bukan|jika|kalau|jika_tidak|dari|untuk|langkah|ketika|fungsi|melakukan|akhir|kembali|melanjutkan|berhenti|batal|benar|palsu`,
    Italian_KW: `variabile|e|o|non|se|altrimenti_se|altrimenti|da|a|passo|mentre|funzione|fare|fine|ritorno|continua|interrompi|nullo|vero|falso`,
    Japanese_KW: `へんすう|と|また|でない|いう|エルイフ|そうでなければ|から|まで|きょり|わいる|かんすう|する|おわり|もどる|つづける|やめる|はい|いいえ`,
    Kazakh_KW: `премен|және|әлде|жоқ|егер|жыныма_тисең|егер_тағы|дан|үшін|қадам|пока|функция|істеу|бітіру|қайтару|жалғастыру|үзіліс|түсүніксіз|бұрыс|дұрыс`,
    Korean_KW: `변수|그리고|또는|아니다|만약에|그렇지_않고_만약에|아니면|에서|까지|간격|하는_동안|함수|수행|끝|반환|계속|중단|빈|참|거짓`,
    Persian_KW: `متغیر|و|یا|نه|اگر|درغیراینصورتاگر|وگرنه|از|تا|گام|تازمانیکه|تابع|انجام_بده|پایان|برگردان|ادامه_بده|شکست_بده|نامعلوم|درست|غلط`,
    Polish_KW: `zmienna|i|lub|nie|jezeli|inaczej|wpp|od|do|co|podczas|funkcja|rob|koniec|zwroc|kontynuuj|przerwij|pusta|prawda|falsz`,
    Portuguese_KW: `var|e|ou|não|se|senão_se|senão|de|para|passo|enquanto|função|faça|fim|retornar|continuar|quebrar|nulo|verdadeiro|falso`,
    Romanian_KW: `variabila|si|sau|nu|daca|daca_alta|alta|de_la|pana_la|pas|cat_timp|functie|executa|sfarsit|returneaza|continua|opreste|nul|adevarat|fals`,
    Russian_KW: `переменная|и|или|не|если|иначе_если|иначе|от|до|шаг|пока|функция|выполнить|конец|вернуть|продолжить|прервать|пусто|истина|ложь`,
    Spanish_KW: `var|y|o|no|si|sino_si|sino|desde|a|paso|mientras|func|hacer|fin|retornar|continuar|romper|nulo|verdadero|falso`,
    Turkish_KW: `değişken|ve|veya|değil|eğer|ama_eğer|aksi_halde|itibaren|ila|bir_adım|süre|işlev|yapmak|son|dönüş|devamet|dur|hiç|doğru|yanlış`,
    Ukrainian_KW: `змінна|та|або|не|якщо|інакше_якщо|інакше|з|до|крок|поки|функція|виконати|кінець|повернути|продовжити|перервати|нуль|істина|хиба`,
    Urdu_KW: `متغیر|اور|یا|نہیں|اگر|ورنہ_اگر|ورنہ|سے|تک|قدم|جب_تک|فنکشن|کریں|ختم|واپسی|جاری_رکھیں|توڑیں|خالی|سچ|غلط`,
    Vietnamese_KW: `biến|và|hoặc|không|nếu|ngược_lại_nếu|ngược_lại|từ|đến|bước|trong_khi|hàm|thực_hiện|kết_thúc|trả_về|tiếp_tục|phá_vỡ|rỗng|đúng|sai`,
    Azerbaijani_KW: `dəyişən|və|və_ya|deyil|əgər|əks_halda|yoxsa|dən|ilə|addım|dövrədən|funksiya|et|son|qaytar|davam_et|qır|boş|doğru|yalan`,
    Greek_KW: `μεταβλητή|και|ή|όχι|αν|αλλιώς_αν|διαφορετικά|από|έως|βήμα|όσο_διαρκεί|συνάρτηση|κάνε|τέλος|επιστροφή|συνέχισε|διακόπτω|κενό|αληθές|ψευδές`,
    Irish_KW: `athrú|agus|nó|ní|má|nó_má|seachas|ó|go|céim|ag_fad|feidhm|déan|deireadh|aisigh|lean_ar_aghaidh|briseadh|ná|fíor|bréagach`,
    Kurdish_KW: `guhertin|û|an|ne|heger|heger_ne|bêguman|ji|heta|der|dem|fonsiyon|kirin|end|bêjêre|dema_ji_berdewam|vêrekirin|vala|raşt|girêk`,
    Latvian_KW: `mainīgais|un|vai|nav|ja|citādi_ja|citādi|no|līdz|solis|kamēr|funkcija|dari|beigas|atgriezt|turpināt|pārtraukt|nulle|patiess|aplams`,
    Malay_KW: `perubahan|dan|atau|bukan|jika|atau_jika|lain|dari|ke|langkah|sementara|fungsi|lakukan|akhir|pulangkan|teruskan|henti|kosong|benar|salah`,
    Uzbek_KW: `o_zgaruvchi|va|yoki|emas|agar|yoki_aks_holda|aks_holda|dan|gacha|bosqich|vaqtgacha|funksiya|bajar|oxiri|qaytarish|davom_etish|to_xtatish|bo_sh|to_g_ri|yolg_on`,
    Finnish_KW: `muuttuja|ja|tai|ei|jos|muuten_jos|muuten|väliltä|asti|askel|kunnes|funktio|tee|loppu|palauta|jatka|keskeytä|tyhjä|tosi|epätosi`,
    Hindi_KW: `चर|और|या|नहीं|अगर|अन्य_अगर|अन्यथा|से|तक|चरण|जबतक|कार्य|करो|अंत|वापस|जारी_रखो|रोकें|रिक्त|सत्य|असत्य`
  };

  const builtinGroups = {
    Arabic_KW: `طباعة|استقبل_رقم|استقبل|هل_رقم|هل_نص|هل_قائمة|هل_معجم|هل_دالة|عدد_صحيح|عدد_عشري|المعرف|نظف|اضف|مدد|احذف|حجم|قراءة_ملف|كتابة_ملف|استدعاء|مجموع|اعلي|اقل|قيمة_مطلقة|نص|تحميل|حفظ_صورة|ارسال|تنفيذ|استمع|تحدث|تشغيل|نم|لنص|مفاتيح|مسار_مطلق|توليد|استلم|اكتب|انقر|عنوان_المؤشر|ضع_المؤشر|ضغط|تغيير_مسار|انشاء_مسار|معالج|نظام_تشغيل|زيارة|بنية_النظام|قائمة_الملفات|هل_مسار|انقل|افتح|توليد_رقم_عشوائي|مسار_العمل|تقسيم|يحتوي|حروف_كبيرة|حروف_صغيرة|تجميل|مخطط_بياني|نوع_المخطط|تبديل`,
    Chinese_KW: `打印|整数输入|输入|是整数|是字符串|是列表|是字典|是函数|整数|浮点数|标识符|清空|追加|扩展|弹出|长度|读取文件|写入文件|导入|求和|最大值|最小值|绝对值|字符串|加载|保存图像|发送|监听|说话|评估|睡眠|转为字符串|键|绝对路径|生成|接收|写|点击|鼠标位置|设置位置|按|切换目录|创建目录|处理器|操作系统|访问|架构|目录列表|是否目录|移动|系统|生成随机|当前工作目录|拆分|包含|大写字母|小写字母|首字母大写|图形|绘图模式|替换`,
    English_KW: `print|int_input|input|is_int|is_str|is_lst|is_dict|is_func|int|float|identifier|clear|append|extend|pop|len|readf|writef|import|sum|max|min|abs|str|load|save_img|send|exec|listen|speak|eval|sleep|to_string|keys|abspath|generate|receive|write|click|mouse_location|set_location|press|chdir|mkdir|processor|os|visit|architecture|list_dir|is_dir|move|system|gen_random|cwd|split|contains|uppercase|lowercase|capitalize|plot|plotting_mode|replace`,
    Persian_KW: `چاپ|ورودی_عدد_صحیح|ورودی|آیا_عدد|آیا_رشته|آیا_لیست|آیا_دیکشنری|آیا_تابع|عدد_صحیح|عدد_اعشاری|شناسه|پاک_کن|الحاق|توسعه|حذف|طول|خواندن_فایل|نوشتن_فایل|وارد_کردن|جمع|بیشترین|کمترین|مقدار_مطلق|رشته|بارگذاری|ذخیره_تصویر|ارسال|اجرا|گوش_کن|صحبت_کن|ارزیابی|خواب|به_رشته|کلیدها|مسیر_مطلق|تولید|دریافت|نوشتن|کلیک|مکان_ماوس|تنظیم_مکان|فشردن|تغییر_دایرکتوری|ایجاد_دایرکتوری|پردازنده|سیستم_عامل|بازدید|معماری|فهرست_دایرکتوری|آیا_دایرکتوری_است|حرکت|سیستم|تولید_تصادفی|دایرکتوری_کاری_فعلی|تقسیم|شامل|حروف_بزرگ|حروف_کوچک|حرف_اول_بزرگ|نقشه|حالت_نقشه|جایگزین`
  };

  // Use complete supplied language lists where available; fallback keeps language-aware highlighting.
  const suppliedBuiltins = {
    Dutch_KW: `afdrukken|int_invoer|invoer|is_int|is_tekst|is_lijst|is_dict|is_functie|int|float|identificatie|wissen|toevoegen|uitbreiden|verwijderen|lengte|leesf|schrijff|importeren|som|max|min|abs|tekst|laden|beeld_opslaan|verstuur|uitvoeren|luister|spreken|evalueren|slapen|naar_tekenreeks|sleutels|absoluut_pad|genereren|ontvangen|schrijven|klik|muizlocatie|stel_locatie_in|druk|verander_directory|maak_directory|processor|besturingssysteem|bezoek|architectuur|lijst_directory|is_directory|verplaats|systeem|genereer_random|huidige_werk_directory|splits|bevat|hoofdletters|kleine_letters|hoofdletter_groot|plot|plotmodus|vervangen`,
    French_KW: `imprimer|entrer_entier|entrer|est_entier|est_chaîne|est_liste|est_dict|est_fonc|entier|décimal|identifiant|effacer|ajouter|étendre|retirer|langueur|lire_fichier|écrire_fichier|importer|somme|max|min|abs|chaîne|charger|enregistrer_img|envoyer|écouter|parler|éval|sommeil|en_chaîne|clés|chemin_absolu|générer|recevoir|écrire|cliquer|emplacement_de_la_souris|définir_l'emplacement|appuyer|changer_de_répertoire|créer_un_répertoire|processeur|système|visiter|architecture|lister_le_répertoire|est_un_répertoire|déplacer|générer_au_hasard|répertoire_de_travail_courant|diviser|contient|majuscules|minuscules|mettre_en_majuscule|tracé|mode_de_tracé|remplacer`,
    Spanish_KW: `imprimir|entrada_int|entrada|es_entero|es_cadena|es_lista|es_diccionario|es_funcion|entero|flotante|identificador|nulo|verdadero|falso|limpiar|agregar|extender|eliminar|longitud|leerf|escribirf|importar|suma|maximo|minimo|absoluto|cadena|cargar|guardar_img|enviar|ejecutar|escuchar|hablar|evaluar|esperar|a_stringa|chiavi|ruta_absoluta|generar|recibir|escribir|clicar|ubicación_del_mouse|establecer_ubicación|presionar|cambiar_directorio|crear_directorio|procesador|sistema|visitar|arquitectura|listar_directorio|es_directorio|mover|generar_aleatorio|directorio_de_trabajo_actual|dividir|contiene|mayúsculas|minúsculas|capitalizar|gráfico|modo_de_graficar|reemplazar`,
    German_KW: `drucken|eingang|ganzzahleingabe|ganze_zahl|schweben|kennung|ist_ganzzahl|ist_string|ist_die_diste|ist_die_dict|ist_funktion|sauber|anhängen|erweitern|pop|größe|lesen_sie_die_datei|schreiben_sie_die_datei|anrufen|summe|maximal|minimum|absolutwert|text|belastung|bild_speichern|schicken|ausführen|hören|sprechen|anstellung|schlafen|bespannen|schlüssel|absoluter_pfad|erzeugen|empfangen|schreiben|klicken|maus_position|standort_setzen|drücken|verzeichnis_wechseln|verzeichnis_erstellen|prozessor|betriebssystem|besuchen|architektur|verzeichnis_auflisten|ist_verzeichnis|bewegen|system|zufällig_erzeugen|aktuelles_arbeitsverzeichnis|teilen|enthält|großbuchstaben|kleinbuchstaben|großschreiben|grafik|grafik_modus|ersetzen`,
    Italian_KW: `stampare|input_intero|input|è_intero|è_stringa|è_lista|è_dizionario|è_funzione|intero|virgola_mobile|identificatore|pulisci|aggiungi|estendi|elimina|lunghezza|leggif|scrivif|importa|somma|massimo|minimo|assoluto|stringa|carica|salva_img|invia|esegui|ascolta|parla|valuta|dormi|a_cadena|claves|ruta_absoluta|generare|ricevere|scrivere|cliccare|posizione_del_mouse|imposta_posizione|premere|cambia_directory|crea_directory|processore|sistema_operativo|visitare|architettura|elenco_directory|è_directory|muovere|sistema|genera_random|directory_di_lavoro_corrente|dividere|contiene|maiuscole|minuscole|metti_in_maiuscolo|grafico|modalità_di_grafico|sostituire`
  };
  Object.assign(builtinGroups, suppliedBuiltins);

  const rtlLanguages = new Set(["Arabic_KW", "Persian_KW", "Urdu_KW"]);
  const state = {
    endpoint: "https://worldlang-web.vercel.app/api/worldlang/run",
    filename: "untitled.world",
    dirty: false,
    running: false,
    mobileView: "editor",
    outputTab: "console",
    lastOutput: "",
    lastRun: "",
    stdinQueue: [],
    stdinWaiter: null,
    runId: 0
  };

  const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  function getLanguage() { return languageSelect.value; }
  function getTokens(group, lang) {
    const source = group[lang] || group.English_KW || "";
    return source.split("|").filter(Boolean);
  }
  function makeAlternation(tokens) {
    return tokens.slice().sort((a, b) => b.length - a.length).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  }
  
  function tokenRegex(lang) {
    const keywords = getTokens(keywordGroups, lang);
    const builtins = getTokens(builtinGroups, lang);

    const keywordPart = makeAlternation(keywords);
    const builtinPart = makeAlternation(builtins);

    // Unicode-aware identifier boundaries.
    // Supports Arabic, Persian, Japanese, Chinese, Cyrillic,
    // Hindi, and other Unicode scripts.
    const identifierStart = String.raw`(?<![\p{L}\p{N}_])`;
    const identifierEnd = String.raw`(?![\p{L}\p{N}_])`;

    const alternatives = [
      String.raw`"(?:\\.|[^"\\])*"`,
      String.raw`'(?:\\.|[^'\\])*'`,
      String.raw`#.*$`,
      String.raw`//.*$`,
      keywordPart
        ? `${identifierStart}(?:${keywordPart})${identifierEnd}`
        : null,
      builtinPart
        ? `${identifierStart}(?:${builtinPart})${identifierEnd}`
        : null,
      String.raw`\p{N}+(?:\.\p{N}+)?`,
      String.raw`[+\-*\/%=<>!&|^~]+`
    ].filter(Boolean);

    return new RegExp(alternatives.join("|"), "gmu");
  }

  function renderHighlighted() {
    const text = codeInput.value;
    const lang = getLanguage();
    let html = "";
    let lastIndex = 0;
    const regex = tokenRegex(lang);
    for (const match of text.matchAll(regex)) {
      const token = match[0];
      const index = match.index;
      html += escapeHtml(text.slice(lastIndex, index));
      let className = "tok-operator";
      if (token.startsWith('"') || token.startsWith("'")) className = "tok-string";
      else if (token.startsWith("#") || token.startsWith("//")) className = "tok-comment";
      else if (/^\d/.test(token)) className = "tok-number";
      else if (getTokens(keywordGroups, lang).includes(token)) {
        className = ["true", "false", "null", "true", "false", "صحيح", "خطأ", "لاشئ", "درست", "غلط"].includes(token) ? "tok-bool" : "tok-keyword";
      } else if (getTokens(builtinGroups, lang).includes(token)) className = "tok-function";
      html += `<span class="${className}">${escapeHtml(token)}</span>`;
      lastIndex = index + token.length;
    }
    html += escapeHtml(text.slice(lastIndex));
    highlightCode.innerHTML = html + (text.endsWith("\n") ? " " : "");
    lineNumbers.textContent = Array.from({ length: Math.max(1, text.split("\n").length) }, (_, i) => i + 1).join("\n");
    $("editorPlaceholder").classList.toggle("hidden", text.length > 0);
    $("lineCountLabel").textContent = `${Math.max(1, text.split("\n").length)} ${text.split("\n").length === 1 ? "line" : "lines"}`;
    $("charCountLabel").textContent = `${text.length} chars`;
    updateCursor();
    syncScroll();
  }
  function syncScroll() {
    highlightLayer.scrollTop = codeInput.scrollTop;
    highlightLayer.scrollLeft = codeInput.scrollLeft;
    lineNumbers.scrollTop = codeInput.scrollTop;
  }
  function updateCursor() {
    const before = codeInput.value.slice(0, codeInput.selectionStart);
    const lines = before.split("\n");
    $("cursorPosition").textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
  }
  function markDirty() {
    state.dirty = true;
    $("unsavedDot").classList.add("visible");
  }
  function setLanguageDirection() {
    const lang = getLanguage();
    const rtl = rtlLanguages.has(lang);
    const dir = rtl ? "rtl" : "ltr";
    editorBody.dir = dir;
    $("consoleView").dir = dir;
    $("detailsView").dir = dir;
    $("editorLanguageLabel").textContent = languageSelect.options[languageSelect.selectedIndex].text.split(" — ")[0].toLocaleUpperCase();
    $("editorModeLabel").textContent = languageSelect.options[languageSelect.selectedIndex].text.split(" — ")[0];
    $("detailLanguage").textContent = languageSelect.options[languageSelect.selectedIndex].text;
    $("detailDirection").textContent = rtl ? "RTL" : "LTR";
    renderHighlighted();
  }
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
  }
  function decodeWlIdentifiers(text) {
    if (typeof text !== "string") return text;

    // Find all instances matching your encoded pattern (with or without 'wl_var_')
    // Match 'wl_var_' followed by a series of alpha-numeric and hex byte representations
    return text.replace(/wl_var_[a-zA-Z0-9_]*(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})[a-zA-Z0-9_]*/g, (matched) => {
      // 1. Strip the wl_var_ prefix
      const cleanString = matched.slice(7);

      // 2. Put backslashes back in front of hex byte patterns (e.g., xff -> \xff)
      const escapedJsonString = cleanString.replace(/(x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/g, '\\$1');

      // 3. Let JSON.parse naturally handle the unicode/hex expansion
      try {
        return JSON.parse(`"${escapedJsonString}"`);
      } catch (e) {
        // Fallback if parsing fails for malformed values
        return matched; 
      }
    });
  }
  function appendOutput(text, type = "normal") {
    consoleWelcome.style.display = "none";
    consoleStream.classList.add("has-content");
    
    // Decode any hidden Python-encoded variable names in errors or prints
    const decodedText = decodeWlIdentifiers(String(text));
    
    const lines = decodedText.replace(/\r\n/g, "\n").split("\n");
    lines.forEach((line) => {
      const div = document.createElement("div");
      div.className = `console-line ${type}`;
      div.textContent = line || " ";
      consoleStream.appendChild(div);
    });
    state.lastOutput += (state.lastOutput ? "\n" : "") + decodedText;
    consoleStream.scrollTop = consoleStream.scrollHeight;
    $("mobileViewTabs").querySelector('[data-view="output"] .mobile-output-dot')?.classList.add("has-output");
  }
  function clearOutput() {
    consoleStream.innerHTML = "";
    consoleStream.classList.remove("has-content");
    consoleWelcome.style.display = "";
    state.lastOutput = "";
    stdinForm.hidden = true;
    $("outputStatusText").textContent = "Waiting for execution";
    $("outputStatusDot").className = "footer-live-dot";
  }
  function setRunStatus(status, message) {
    $("outputStatusText").textContent = message;
    $("outputStatusDot").className = `footer-live-dot ${status}`;
    $("runtimeStatus").textContent = status === "running" ? "RUNNING" : status === "success" ? "READY" : status === "error" ? "ERROR" : "READY";
    $("runtimeStatus").style.color = status === "error" ? "var(--red)" : status === "running" ? "var(--orange)" : "var(--green)";
  }
  function switchMobileView(view) {
    state.mobileView = view;
    document.body.classList.toggle("mobile-output-view", view === "output");
    document.body.classList.toggle("mobile-editor-view", view === "editor");
    $("mobileViewTabs").querySelectorAll(".mobile-view-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
    runLabel.textContent = view === "output" ? "Editor </>" : (state.running ? "Running…" : "Run");
    runBtn.querySelector(".run-icon").textContent = view === "output" ? "‹" : "▶";
  }
  function isMobile() { return window.matchMedia("(max-width: 680px)").matches; }

  async function requestWorldLang(source, lang) {
    if (!state.endpoint.trim()) {
      throw new Error("Set your WorldLang API endpoint in Settings before running code.");
    }
    const response = await fetch(state.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ code: source, lang: lang })
    });
    const raw = await response.text();
    let data;
    try { data = raw ? JSON.parse(raw) : {}; }
    catch { throw new Error(`API returned non-JSON (${response.status}). Check your endpoint and CORS configuration.`); }
    if (!response.ok) throw new Error(data.error || `API request failed (${response.status}).`);
    if (data.error) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
    return data;
  }

  function extractPython(data) {
    if (typeof data === "string") return data;
    const code = data.python;
    if (typeof code !== "string") {
      throw new Error("API response did not include Python source. Expected `python` or `transpiled_code`.");
    }
    return code;
  }

  function requestInput(promptText) {
    return new Promise((resolve) => {
      state.stdinWaiter = resolve;
      $("stdinPromptText").textContent = promptText || "Program is waiting for input";
      stdinForm.hidden = false;
      stdinInput.value = "";
      stdinInput.focus();
      if (isMobile()) switchMobileView("output");
    });
  }

  function submitInput(value) {
    if (!state.stdinWaiter) return;
    const resolve = state.stdinWaiter;
    state.stdinWaiter = null;
    stdinForm.hidden = true;
    appendOutput(`› ${value}`, "system");
    resolve(value);
  }

  async function executePython(pythonSource, runId) {
    if (typeof window.Sk !== "object") throw new Error("Skulpt failed to load. Check your internet connection or host Skulpt locally.");
    const outputBefore = state.lastOutput;
    const pendingInputs = [];
    let resolvePending = null;
    let rejectPending = null;
    let finished = false;

    const readInput = (promptText) => new Promise((resolve, reject) => {
      if (state.runId !== runId) return reject(new Error("Execution cancelled."));
      // Show prompts in the console and request input through a non-blocking form.
      if (promptText) appendOutput(promptText, "system");
      requestInput(promptText).then(resolve, reject);
    });

    window.Sk.configure({
      python3: true,
      output: (text) => appendOutput(text, "normal"),

      inputfun: (promptText) => requestInput(promptText),

      inputfunTakesPrompt: true
    });

    try {
      await window.Sk.misceval.asyncToPromise(() => window.Sk.importMainWithBody("<stdin>", false, pythonSource, true));
    } finally {
      stdinForm.hidden = true;
      state.stdinWaiter = null;
    }
  }

  async function runProgram() {
    if (state.mobileView === "output" && isMobile()) {
      switchMobileView("editor");
      return;
    }
    if (state.running) return;
    const source = codeInput.value;
    if (!source.trim()) {
      showToast("Write a little WorldLang first.");
      codeInput.focus();
      return;
    }
    const lang = getLanguage();
    const runId = ++state.runId;
    state.running = true;
    runBtn.disabled = true;
    runLabel.textContent = "Running…";
    setRunStatus("running", "Processing WorldLang source");
    clearOutput();
    $("detailLastRun").textContent = new Date().toLocaleTimeString();
    state.lastRun = new Date().toISOString();
    if (isMobile()) switchMobileView("output");
    try {
      const data = await requestWorldLang(source, lang);
      if (runId !== state.runId) return;
      // If API supplies a direct result, show it, but still execute Python if present.
      const pythonSource = extractPython(data);
      if (data.result !== undefined && data.result !== null && String(data.result).length) {
        appendOutput(String(data.result), "system");
      }
      await executePython(pythonSource, runId);
      if (runId === state.runId) {
        setRunStatus("success", "Execution completed");
        if (!state.lastOutput.trim()) appendOutput("Program finished without output.", "success");
      }
    } catch (error) {
      if (runId === state.runId) {
        appendOutput(error && error.message ? error.message : String(error), "error");
        setRunStatus("error", "Execution failed");
      }
    } finally {
      if (runId === state.runId) {
        state.running = false;
        runBtn.disabled = false;
        runLabel.textContent = isMobile() && state.mobileView === "output" ? "Editor </>" : "Run";
        runBtn.querySelector(".run-icon").textContent = isMobile() && state.mobileView === "output" ? "‹" : "▶";
      }
    }
  }

  function downloadSource() {
    const filename = (state.filename || "untitled.world").replace(/[\\/:*?"<>|]/g, "_");
    const blob = new Blob([codeInput.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename.toLowerCase().endsWith(".world") ? filename : `${filename}.world`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    state.dirty = false;
    $("unsavedDot").classList.remove("visible");
    showToast(`Downloaded ${anchor.download || filename}`);
  }

  function newFile() {
    if (state.dirty && !confirm("You have unsaved changes. Start a new file anyway?")) return;
    codeInput.value = "";
    state.filename = "untitled.world";
    filenameInput.value = state.filename;
    $("fileNameLabel").textContent = state.filename;
    state.dirty = false;
    $("unsavedDot").classList.remove("visible");
    clearOutput();
    renderHighlighted();
    codeInput.focus();
  }

  function saveSettings() {
    state.endpoint = endpointInput.value.trim();
    const name = filenameInput.value.trim() || "untitled.world";
    state.filename = name.toLowerCase().endsWith(".world") ? name : `${name}.world`;
    $("fileNameLabel").textContent = state.filename;
    settingsDialog.close();
    showToast(state.endpoint ? "Settings saved. Ready to run." : "Filename saved. Add an API endpoint to run code.");
  }

  codeInput.addEventListener("input", () => { renderHighlighted(); markDirty(); });
  codeInput.addEventListener("scroll", syncScroll);
  ["keyup", "click", "select"].forEach(eventName => codeInput.addEventListener(eventName, updateCursor));
  codeInput.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const start = codeInput.selectionStart, end = codeInput.selectionEnd;
      codeInput.setRangeText("    ", start, end, "end");
      codeInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  languageSelect.addEventListener("change", () => {
    setLanguageDirection();
    $("detailLanguage").textContent = languageSelect.options[languageSelect.selectedIndex].text;
    if (rtlLanguages.has(getLanguage())) showToast("RTL mode enabled for editor and output.");
  });
  runBtn.addEventListener("click", runProgram);
  $("downloadBtn").addEventListener("click", downloadSource);
  $("newFileBtn").addEventListener("click", newFile);
  $("clearBtn").addEventListener("click", () => { codeInput.value = ""; renderHighlighted(); markDirty(); codeInput.focus(); });
  $("clearOutputBtn").addEventListener("click", clearOutput);
  $("copyOutputBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(state.lastOutput); showToast("Output copied."); }
    catch { showToast("Clipboard access is unavailable in this browser."); }
  });
  $("settingsBtn").addEventListener("click", () => {
    endpointInput.value = state.endpoint;
    filenameInput.value = state.filename;
    settingsDialog.showModal();
  });
  $("saveSettingsBtn").addEventListener("click", saveSettings);
  $("resetSettingsBtn").addEventListener("click", () => {
    endpointInput.value = "";
    filenameInput.value = "untitled.world";
  });
  $("stdinForm").addEventListener("submit", (event) => {
    event.preventDefault();
    submitInput(stdinInput.value);
  });
  $("mobileViewTabs").querySelectorAll(".mobile-view-tab").forEach(btn => {
    btn.addEventListener("click", () => switchMobileView(btn.dataset.view));
  });
  document.querySelectorAll("[data-output-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.outputTab = btn.dataset.outputTab;
      document.querySelectorAll("[data-output-tab]").forEach(tab => tab.classList.toggle("active", tab === btn));
      $("consoleView").hidden = state.outputTab !== "console";
      $("detailsView").hidden = state.outputTab !== "details";
    });
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      if (isMobile() && state.mobileView === "output") switchMobileView("editor");
      else runProgram();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      downloadSource();
    }
  });
  window.addEventListener("resize", () => {
    if (!isMobile()) {
      document.body.classList.remove("mobile-output-view", "mobile-editor-view");
      runLabel.textContent = state.running ? "Running…" : "Run";
    } else switchMobileView(state.mobileView);
  });
  // Tiny starter sample; language selection changes highlighting/direction, not source translation.
  codeInput.value = 'var greeting = "Hello, WorldLang!"\nprint(greeting)';
  state.dirty = false;
  renderHighlighted();
  setLanguageDirection();
  switchMobileView("editor");
})();
codeInput.addEventListener('input', function(){
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});