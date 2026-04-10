window.addEventListener("DOMContentLoaded", () => {
    const CURATED_WISH_LINES = [
        "愿你在奔赴远方的路上，也始终被温柔回响。",
        "愿你把每一次跌宕，都走成自己的星光。",
        "愿你与热爱并肩，和岁月握手言欢。",
        "愿你在平凡日子里，也能写出灿烂章节。",
        "愿你眼里有山海，心中有松风与明月。",
        "愿你不惧慢行，终会在自己的节奏里盛放。",
        "愿你被真诚拥抱，也被世界轻轻偏爱。",
        "愿你把今天的笑意，收藏成未来的勇气。",
        "愿你走过四季，都有新故事值得珍藏。",
        "愿你在每个清晨醒来，都仍然相信热望。",
        "愿你把答案写在脚步里，把光亮藏在眼睛里。",
        "愿你拥抱辽阔，也珍惜眼前细碎的幸福。",
        "愿你在喧嚣之后，仍能听见内心的潮声。",
        "愿你把疲惫折成纸船，让它顺流而去。",
        "愿你在每一次重启里，都遇见更好的自己。",
        "愿你把温柔分给世界，也分给自己。",
        "愿你把脚下的路，走成心中想要的诗。",
        "愿你在长夜尽头，迎来属于自己的晨曦。",
        "愿你眉间有风，眼底有光，心上有花。",
        "愿你把每次勇敢，都兑换成更辽阔的自由。",
        "愿你在未知里不慌张，在热爱里有方向。",
        "愿你和重要的人，年年都有好光景。",
        "愿你仍有少年心，也有披荆斩棘的锋芒。",
        "愿你把生活过成散文，也过成史诗。"
    ];

    const CHAPTER_TITLES = {
        first: [
            "晨光与你",
            "风把心意写满",
            "给你的一封序言",
            "花开时节的注脚"
        ],
        second: [
            "山海回信",
            "给时光的回礼",
            "把勇敢写进行囊",
            "向远方缓缓启程"
        ],
        third: [
            "星河落款",
            "温柔有声",
            "愿望在此停留",
            "把明天轻轻点亮"
        ]
    };

    const CURATED_ENDINGS = [
        "愿你在新一岁，把喜欢都过成日常。",
        "愿你把今天的光，带去更远的地方。",
        "愿你被岁月轻放，也被梦想郑重接住。",
        "愿你在每一个明天，都比今天更自在。"
    ];

    const CURATED_TAILS = [
        "在四季流转里仍然闪亮。",
        "让每个平凡时刻都长出光。",
        "把热爱写进每一个清晨。",
        "把勇敢活成你最自然的模样。"
    ];

    const form = document.getElementById("wishForm");
    const sharePanel = document.getElementById("sharePanel");
    const generatedLinkInput = document.getElementById("generatedLink");
    const copyButton = document.getElementById("copyButton");
    const previewButton = document.getElementById("previewButton");
    const statusText = document.getElementById("statusText");
    const birthdayInput = document.getElementById("birthdayDate");
    const dateField = document.getElementById("dateField");
    const datePreview = document.getElementById("datePreview");
    const calendarTrigger = document.getElementById("calendarTrigger");
    const datePickerPanel = document.getElementById("datePickerPanel");
    const calendarPrev = document.getElementById("calendarPrev");
    const calendarNext = document.getElementById("calendarNext");
    const calendarMonthLabel = document.getElementById("calendarMonthLabel");
    const calendarGrid = document.getElementById("calendarGrid");
    const calendarToday = document.getElementById("calendarToday");
    const calendarClear = document.getElementById("calendarClear");

    if (!form || !sharePanel || !generatedLinkInput || !copyButton || !previewButton || !statusText || !birthdayInput || !dateField || !datePreview || !calendarTrigger || !datePickerPanel || !calendarPrev || !calendarNext || !calendarMonthLabel || !calendarGrid || !calendarToday || !calendarClear) {
        return;
    }

    let latestLink = "";
    let calendarYear = new Date().getFullYear();
    let calendarMonth = new Date().getMonth();

    function setStatus(message) {
        statusText.textContent = message;
    }

    function normalizeDateText(dateText) {
        const raw = String(dateText || "").trim();
        if (!raw) {
            return "";
        }

        const normalized = raw
            .replace(/[./]/g, "-")
            .replace(/年/g, "-")
            .replace(/月/g, "-")
            .replace(/日/g, "")
            .replace(/\s+/g, "")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        const parts = normalized.split("-");
        if (parts.length !== 3) {
            return "";
        }

        const [year, month, day] = parts;
        if (!/^\d{4}$/.test(year) || !/^\d{1,2}$/.test(month) || !/^\d{1,2}$/.test(day)) {
            return "";
        }

        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    function randomPick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function randomUnique(list, count) {
        const pool = [...list];
        const picked = [];
        const limit = Math.min(count, pool.length);
        for (let i = 0; i < limit; i += 1) {
            const index = Math.floor(Math.random() * pool.length);
            picked.push(pool[index]);
            pool.splice(index, 1);
        }
        return picked;
    }

    function uniqueKeepOrder(list) {
        const seen = new Set();
        const result = [];
        list.forEach((item) => {
            const key = String(item).trim();
            if (!key || seen.has(key)) {
                return;
            }
            seen.add(key);
            result.push(key);
        });
        return result;
    }

    function toLineKey(line) {
        return removeBlessingPrefix(String(line || ""))
            .replace(/[\s，。！？、；：,.!?:·|]/gu, "")
            .toLowerCase();
    }

    function buildUniqueBodyLines(candidates, requiredCount) {
        const selected = [];
        const used = new Set();

        candidates.forEach((line) => {
            if (selected.length >= requiredCount) {
                return;
            }
            const text = String(line || "").trim();
            if (!text) {
                return;
            }
            const key = toLineKey(text);
            if (!key || used.has(key)) {
                return;
            }
            used.add(key);
            selected.push(text);
        });

        while (selected.length < requiredCount) {
            const fallback = randomPick(CURATED_WISH_LINES) || "愿你此刻与未来，都有温暖回音。";
            const key = toLineKey(fallback);
            if (key && !used.has(key)) {
                used.add(key);
                selected.push(fallback);
            }
        }

        return selected;
    }

    function removeBlessingPrefix(text) {
        return text
            .replace(/^(愿你|愿|祝你|祝)\s*/u, "")
            .replace(/^[，。！？、；：,.!?:\s]+/u, "")
            .trim();
    }

    function extractWishFragments(rawText) {
        return rawText
            .split(/\r?\n|[，。！？；、,.!?:：]/)
            .map((line) => line.trim())
            .filter((line) => line.length > 1)
            .slice(0, 8);
    }

    function formatDateForPreview(dateText) {
        const normalizedDate = normalizeDateText(dateText);
        if (!normalizedDate) {
            return "尚未选择日期";
        }

        const date = new Date(`${normalizedDate}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            return "尚未选择日期";
        }

        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${date.getFullYear()}年${month}月${day}日 · 纪念日星光已点亮`;
    }

    function parseISODate(dateText) {
        const normalizedDate = normalizeDateText(dateText);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
            return null;
        }

        const date = new Date(`${normalizedDate}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date;
    }

    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function openCalendar() {
        const selected = parseISODate(birthdayInput.value);
        const base = selected || new Date();
        calendarYear = base.getFullYear();
        calendarMonth = base.getMonth();
        renderCalendar();
        datePickerPanel.hidden = false;
    }

    function closeCalendar() {
        datePickerPanel.hidden = true;
    }

    function renderCalendar() {
        calendarMonthLabel.textContent = `${calendarYear}年${String(calendarMonth + 1).padStart(2, "0")}月`;
        calendarGrid.innerHTML = "";

        const firstDay = new Date(calendarYear, calendarMonth, 1);
        const firstWeekDay = firstDay.getDay();
        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
        const selectedText = normalizeDateText(birthdayInput.value);
        const todayText = formatDateForInput(new Date());

        for (let i = 0; i < firstWeekDay; i += 1) {
            const empty = document.createElement("div");
            empty.className = "calendar-day-empty";
            calendarGrid.appendChild(empty);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const dateText = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayButton = document.createElement("button");
            dayButton.type = "button";
            dayButton.className = "calendar-day";
            if (dateText === selectedText) {
                dayButton.classList.add("is-selected");
            }
            if (dateText === todayText) {
                dayButton.classList.add("is-today");
            }
            dayButton.textContent = String(day);
            dayButton.addEventListener("click", () => {
                birthdayInput.value = dateText;
                refreshDateState();
                triggerDateBurst();
                closeCalendar();
            });
            calendarGrid.appendChild(dayButton);
        }
    }

    function ensureBlessingTone(fragment, starter) {
        if (!fragment) {
            return "";
        }

        const trimmed = String(fragment).trim();
        if (!trimmed) {
            return "";
        }

        // Normalize to a single blessing prefix and avoid cases like "愿你愿你...".
        const core = removeBlessingPrefix(trimmed);
        if (!core) {
            return `${starter}平安喜乐`;
        }

        if (/^(愿你|祝你)/u.test(trimmed)) {
            return `愿你${core}`;
        }

        if (/^(愿|祝)/u.test(trimmed)) {
            return `愿你${core}`;
        }

        return `${starter}${core}`;
    }

    function buildWishFromFragment(fragment) {
        const normalized = ensureBlessingTone(fragment, "愿你");
        const core = removeBlessingPrefix(normalized);
        const tail = randomPick(CURATED_TAILS);
        return `愿你${core}，${tail}`;
    }

    function composePoem({ name, age, birthday, signature, fragments }) {
        const safeFragments = fragments.length > 0 ? fragments : ["勇敢", "热爱", "闪光", "自由"];
        const generatedFromInput = safeFragments.slice(0, 5).map((item) => buildWishFromFragment(item));
        const randomFillers = randomUnique(CURATED_WISH_LINES, CURATED_WISH_LINES.length);
        const bodyLines = buildUniqueBodyLines(uniqueKeepOrder([...generatedFromInput, ...randomFillers]), 5);
        const displayDate = birthday.replace(/-/g, ".");
        const stanzaOneTitle = `第一章 | ${randomPick(CHAPTER_TITLES.first) || `致 ${name}`}`;
        const stanzaOneLine1 = bodyLines[0] || "愿你一路生花，在晨光里遇见答案。";
        const stanzaOneLine2 = bodyLines[1] || "愿你心有热爱，步履所至皆有回响。";

        const stanzaTwoTitle = `第二章 | ${randomPick(CHAPTER_TITLES.second) || "写给你"} · ${age}岁`;
        const stanzaTwoLine1 = bodyLines[2] || "愿你眼里有光，心里有海。";
        const stanzaTwoLine2 = bodyLines[3] || "愿你向前的时候，也被温柔照亮。";

        const stanzaThreeTitle = `第三章 | ${randomPick(CHAPTER_TITLES.third) || "星河落款"} · ${displayDate}`;
        const stanzaThreeLine1 = bodyLines[4] || `${displayDate}，愿这一天永远被温柔记住。`;
        const stanzaThreeLine2 = `${randomPick(CURATED_ENDINGS) || "愿你把今天的光带去更远的地方。"} 落款：${signature}`;

        return [
            stanzaOneTitle,
            stanzaOneLine1,
            stanzaOneLine2,
            stanzaTwoTitle,
            stanzaTwoLine1,
            stanzaTwoLine2,
            stanzaThreeTitle,
            stanzaThreeLine1,
            stanzaThreeLine2
        ];
    }

    function validateFormData(name, age, birthday, fragments, signature) {
        if (!name || name.length > 30) {
            return "请输入被祝福者姓名（1-30字）。";
        }

        const ageNumber = Number(age);
        if (!Number.isInteger(ageNumber) || ageNumber < 1 || ageNumber > 150) {
            return "年龄需为 1-150 的整数。";
        }

        if (!birthday) {
            return "请选择生日日期。";
        }

        const birthdayDate = parseISODate(birthday);
        if (!birthdayDate) {
            return "生日日期无效，请重新选择。";
        }

        const minDate = new Date("1900-01-01T00:00:00");
        const maxDate = new Date("2100-12-31T00:00:00");
        if (birthdayDate < minDate || birthdayDate > maxDate) {
            return "生日日期超出可用范围（1900-2100）。";
        }

        if (fragments.length < 2) {
            return "请输入至少两段心意关键词或短句。";
        }

        const fragmentTooLong = fragments.some((line) => line.length > 40);
        if (fragmentTooLong) {
            return "单条心意请控制在 40 字以内。";
        }

        if (!signature || signature.length > 40) {
            return "请输入落款（1-40字）。";
        }

        return "";
    }

    function buildWishUrl(data) {
        const wishUrl = new URL("wish.html", window.location.href);
        const params = new URLSearchParams();
        params.set("name", data.name);
        params.set("age", String(data.age));
        params.set("birthday", data.birthday);
        params.set("signature", data.signature);
        params.set("wishes", JSON.stringify(data.wishes));
        params.set("source", data.source || "mixed");
        wishUrl.search = params.toString();
        return wishUrl.toString();
    }

    async function copyLinkToClipboard(link) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(link);
            return true;
        }

        generatedLinkInput.focus();
        generatedLinkInput.select();
        generatedLinkInput.setSelectionRange(0, generatedLinkInput.value.length);
        return document.execCommand("copy");
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = (document.getElementById("recipientName")?.value || "").trim();
        const age = (document.getElementById("recipientAge")?.value || "").trim();
        const birthday = normalizeDateText((document.getElementById("birthdayDate")?.value || "").trim());
        const signature = (document.getElementById("signature")?.value || "").trim();
        const fragments = extractWishFragments((document.getElementById("wishLines")?.value || "").trim());

        const validationError = validateFormData(name, age, birthday, fragments, signature);
        if (validationError) {
            setStatus(validationError);
            previewButton.disabled = true;
            sharePanel.hidden = true;
            latestLink = "";
            return;
        }

        const poem = composePoem({
            name,
            age,
            birthday,
            signature,
            fragments
        });

        const link = buildWishUrl({
            name,
            age,
            birthday,
            signature,
            wishes: poem,
            source: "mixed"
        });

        // Keep URLs shareable across browsers and chat apps.
        if (link.length > 1800) {
            setStatus("内容过长，链接无法稳定分享。请精简祝福语后重试。");
            previewButton.disabled = true;
            sharePanel.hidden = true;
            latestLink = "";
            return;
        }

        latestLink = link;
        birthdayInput.value = birthday;
        generatedLinkInput.value = link;
        sharePanel.hidden = false;
        previewButton.disabled = false;
        setStatus("专属链接已生成，可直接复制并分享。");
    });

    function refreshDateState() {
        const formatted = formatDateForPreview(birthdayInput.value);
        datePreview.textContent = formatted;
        dateField.classList.toggle("is-active", birthdayInput.value.length > 0);
    }

    function triggerDateBurst() {
        dateField.classList.remove("is-burst");
        // Force reflow so repeated date changes can replay the burst animation.
        void dateField.offsetWidth;
        dateField.classList.add("is-burst");
    }

    birthdayInput.addEventListener("focus", () => {
        dateField.classList.add("is-active");
    });

    birthdayInput.addEventListener("input", refreshDateState);

    birthdayInput.addEventListener("change", () => {
        refreshDateState();
        if (normalizeDateText(birthdayInput.value)) {
            triggerDateBurst();
        }
    });
    birthdayInput.addEventListener("blur", () => {
        const normalized = normalizeDateText(birthdayInput.value);
        if (normalized) {
            birthdayInput.value = normalized;
            triggerDateBurst();
        }
        refreshDateState();
    });

    calendarTrigger.addEventListener("click", () => {
        if (datePickerPanel.hidden) {
            openCalendar();
        } else {
            closeCalendar();
        }
    });

    calendarPrev.addEventListener("click", () => {
        calendarMonth -= 1;
        if (calendarMonth < 0) {
            calendarMonth = 11;
            calendarYear -= 1;
        }
        renderCalendar();
    });

    calendarNext.addEventListener("click", () => {
        calendarMonth += 1;
        if (calendarMonth > 11) {
            calendarMonth = 0;
            calendarYear += 1;
        }
        renderCalendar();
    });

    calendarToday.addEventListener("click", () => {
        const todayText = formatDateForInput(new Date());
        birthdayInput.value = todayText;
        refreshDateState();
        triggerDateBurst();
        renderCalendar();
    });

    calendarClear.addEventListener("click", () => {
        birthdayInput.value = "";
        refreshDateState();
        renderCalendar();
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        if (!dateField.contains(target) && !datePickerPanel.hidden) {
            closeCalendar();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !datePickerPanel.hidden) {
            closeCalendar();
        }
    });

    refreshDateState();

    copyButton.addEventListener("click", async () => {
        if (!latestLink) {
            setStatus("请先生成链接。");
            return;
        }

        try {
            const copied = await copyLinkToClipboard(latestLink);
            setStatus(copied ? "链接已复制。" : "复制失败，请手动复制输入框中的链接。");
        } catch (error) {
            setStatus("复制失败，请手动复制输入框中的链接。");
        }
    });

    previewButton.addEventListener("click", () => {
        if (!latestLink) {
            setStatus("请先生成链接。");
            return;
        }
        window.location.href = latestLink;
    });
});
