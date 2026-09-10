(function () {
  "use strict";

  /**
   * How to update events without changing code:
   *
   * OPTION A — Google Sheet (recommended)
   * 1. Create a Sheet with header row exactly:
   *    title, date, start, end, location, description, link, repeat
   * 2. Dates as YYYY-MM-DD (example: 2026-09-13)
   * 3. For monthly 2nd-Sunday events, leave date blank and set repeat to: 2nd-sunday
   * 4. File → Share → Publish to web → pick the sheet → CSV
   * 5. Paste that CSV URL into EVENTS_SHEET_CSV_URL below
   *
   * OPTION B — Edit events.json in this project (works when the site is
   * served over http/https; file:// pages may block fetching JSON)
   */
  var EVENTS_SHEET_CSV_URL = "";

  var SECOND_SUNDAY_LINK =
    "https://www.soulsavingproductions.com/events/2nd-sunday-may-ag43y-fclh6-tp9p9-9mkxb-bceen-f9fwy-shesr-jj6g2-y9plr-aked5-ncfwg-ybxh6-8f9jp-wnmdd-59ykh";

  var SAMPLE_EVENTS = [
    {
      title: "2nd Sundays on Skid Row",
      repeat: "2nd-sunday",
      start: "2:00 PM",
      end: "5:00 PM",
      location: "Gladys Park, 808 East 6th St., Los Angeles, CA 90021",
      description:
        "With Love In Action & Joy2LA — serving with love, compassion, and a shared sense of humanity. Always a blessing to connect and share smiles with the community because we make a difference together. Support resources available while supplies last: hot meals, pantry, essentials & haircuts.",
      link: SECOND_SUNDAY_LINK
    }
  ];

  var calGrid = document.getElementById("cal-grid");
  var calMonth = document.getElementById("cal-month");
  var calPrev = document.getElementById("cal-prev");
  var calNext = document.getElementById("cal-next");
  var calToday = document.getElementById("cal-today");
  var dayDetail = document.getElementById("events-day-detail");
  var mobileList = document.getElementById("events-mobile-list");
  var eventModal = document.getElementById("event-modal");
  var eventModalTitle = document.getElementById("event-modal-title");
  var eventModalLocation = document.getElementById("event-modal-location");
  var eventModalDate = document.getElementById("event-modal-date");
  var eventModalTime = document.getElementById("event-modal-time");
  var eventModalLink = document.getElementById("event-modal-link");
  var eventModalClose = document.getElementById("event-modal-close");

  if (!calGrid || !dayDetail) return;

  function isMobileCal() {
    return window.matchMedia("(max-width: 700px)").matches;
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }

  var allEvents = [];
  var today = startOfDay(new Date());
  var viewYear = today.getFullYear();
  var viewMonth = today.getMonth();
  var selectedKey = null;

  function parseDateKey(value) {
    if (!value) return null;
    var raw = String(value).trim();
    var m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[1] + "-" + m[2] + "-" + m[3];
    var parsed = new Date(raw);
    if (isNaN(parsed.getTime())) return null;
    return (
      parsed.getFullYear() +
      "-" +
      pad2(parsed.getMonth() + 1) +
      "-" +
      pad2(parsed.getDate())
    );
  }

  function keyToDate(key) {
    var parts = key.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function normalizeEvent(raw) {
    if (!raw || !raw.title) return null;
    var repeat = String(raw.repeat || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
    var key = parseDateKey(raw.date);
    if (!key && repeat !== "2nd-sunday") return null;
    return {
      title: String(raw.title).trim(),
      date: key,
      repeat: repeat === "2nd-sunday" ? "2nd-sunday" : "",
      start: (raw.start || "").toString().trim(),
      end: (raw.end || "").toString().trim(),
      location: (raw.location || "").toString().trim(),
      description: (raw.description || "").toString().trim(),
      link: (raw.link || "").toString().trim()
    };
  }

  function secondSundayKey(year, monthIndex) {
    var first = new Date(year, monthIndex, 1);
    var firstSunday = 1 + ((7 - first.getDay()) % 7);
    var day = firstSunday + 7;
    return year + "-" + pad2(monthIndex + 1) + "-" + pad2(day);
  }

  function expandEvents(list) {
    var out = [];
    var startMonth = today.getFullYear() * 12 + today.getMonth() - 1;
    var endMonth = startMonth + 18;

    list.forEach(function (ev) {
      if (!ev) return;
      if (ev.repeat === "2nd-sunday") {
        for (var m = startMonth; m <= endMonth; m++) {
          var y = Math.floor(m / 12);
          var mo = m % 12;
          out.push({
            title: ev.title,
            date: secondSundayKey(y, mo),
            start: ev.start,
            end: ev.end,
            location: ev.location,
            description: ev.description,
            link: ev.link
          });
        }
        return;
      }
      if (ev.date) {
        out.push({
          title: ev.title,
          date: ev.date,
          start: ev.start,
          end: ev.end,
          location: ev.location,
          description: ev.description,
          link: ev.link
        });
      }
    });
    return out;
  }

  function parseCsv(text) {
    var rows = [];
    var row = [];
    var cell = "";
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      var next = text[i + 1];
      if (inQuotes) {
        if (ch === '"' && next === '"') {
          cell += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          cell += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(cell);
        cell = "";
      } else if (ch === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else if (ch !== "\r") {
        cell += ch;
      }
    }
    if (cell.length || row.length) {
      row.push(cell);
      rows.push(row);
    }
    return rows.filter(function (r) {
      return r.some(function (c) { return String(c).trim() !== ""; });
    });
  }

  function eventsFromCsv(text) {
    var rows = parseCsv(text);
    if (!rows.length) return [];
    var headers = rows[0].map(function (h) {
      return String(h).trim().toLowerCase();
    });
    var out = [];
    for (var r = 1; r < rows.length; r++) {
      var obj = {};
      for (var c = 0; c < headers.length; c++) {
        obj[headers[c]] = rows[r][c] != null ? rows[r][c] : "";
      }
      var normalized = normalizeEvent(obj);
      if (normalized) out.push(normalized);
    }
    return out;
  }

  function loadEvents() {
    var chain = Promise.resolve(null);

    if (EVENTS_SHEET_CSV_URL) {
      chain = fetch(EVENTS_SHEET_CSV_URL, { cache: "no-store" })
        .then(function (res) {
          if (!res.ok) throw new Error("Sheet fetch failed");
          return res.text();
        })
        .then(function (text) {
          var parsed = eventsFromCsv(text);
          if (!parsed.length) throw new Error("Sheet empty");
          return parsed;
        })
        .catch(function () {
          return null;
        });
    }

    return chain
      .then(function (fromSheet) {
        if (fromSheet) return fromSheet;
        return fetch("events.json", { cache: "no-store" })
          .then(function (res) {
            if (!res.ok) throw new Error("JSON fetch failed");
            return res.json();
          })
          .then(function (data) {
            if (!Array.isArray(data)) throw new Error("Invalid JSON");
            return data.map(normalizeEvent).filter(Boolean);
          })
          .catch(function () {
            return SAMPLE_EVENTS.map(normalizeEvent).filter(Boolean);
          });
      })
      .then(function (events) {
        var custom = [];
        if (typeof window.loadCustomEvents === "function") {
          custom = window.loadCustomEvents().map(normalizeEvent).filter(Boolean);
        } else {
          try {
            var raw = localStorage.getItem("joy2la-custom-events");
            if (raw) {
              var parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                custom = parsed.map(normalizeEvent).filter(Boolean);
              }
            }
          } catch (e) {}
        }

        var removed = [];
        if (typeof window.loadRemovedEventKeys === "function") {
          removed = window.loadRemovedEventKeys();
        } else {
          try {
            var removedRaw = localStorage.getItem("joy2la-removed-events");
            if (removedRaw) {
              var removedParsed = JSON.parse(removedRaw);
              if (Array.isArray(removedParsed)) removed = removedParsed;
            }
          } catch (e) {}
        }

        function isRemovedSource(ev) {
          if (!ev) return true;
          var key = ev.repeat
            ? "repeat:" + ev.repeat + "|" + ev.title
            : "date:" + (ev.date || "") + "|" + ev.title;
          return removed.indexOf(key) !== -1;
        }

        var sources = events.concat(custom).filter(function (ev) {
          return !isRemovedSource(ev);
        });

        var merged = expandEvents(sources);
        var seen = {};
        allEvents = merged
          .filter(function (ev) {
            var k = ev.title + "|" + ev.date;
            if (seen[k]) return false;
            seen[k] = true;
            return true;
          })
          .sort(function (a, b) {
            if (a.date === b.date) return a.title.localeCompare(b.title);
            return a.date < b.date ? -1 : 1;
          });
        renderCalendar();
        renderDayDetail();
        renderMobileList();
      });
  }

  function eventsOnDay(key) {
    return allEvents.filter(function (ev) { return ev.date === key; });
  }

  function formatLongDate(key) {
    return keyToDate(key).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function formatTimeRange(ev) {
    if (ev.start && ev.end) return ev.start + " – " + ev.end;
    if (ev.start) return ev.start;
    if (ev.end) return ev.end;
    return "";
  }

  function renderCalendar() {
    var label = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric"
    });
    calMonth.textContent = label;

    var firstDay = new Date(viewYear, viewMonth, 1).getDay();
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    var daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
    var totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    var html = "";

    for (var cell = 0; cell < totalCells; cell++) {
      var dayNum = cell - firstDay + 1;
      var isLeading = dayNum < 1;
      var isTrailing = dayNum > daysInMonth;

      if (isLeading || isTrailing) {
        var outsideDay = isLeading
          ? daysInPrev + dayNum
          : dayNum - daysInMonth;
        var outsideClass = isTrailing ? "cal-cell is-outside is-trailing" : "cal-cell is-outside";
        html +=
          '<div class="' +
          outsideClass +
          '" aria-hidden="true">' +
          (isLeading
            ? '<span class="cal-day-num">' + outsideDay + "</span>"
            : "") +
          "</div>";
        continue;
      }

      var key = viewYear + "-" + pad2(viewMonth + 1) + "-" + pad2(dayNum);
      var dayEvents = eventsOnDay(key);
      var weekday = cell % 7;
      var isWeekend = weekday === 0 || weekday === 6;
      var isToday = keyToDate(key).getTime() === today.getTime();
      var isSelected = selectedKey === key;
      var classes = ["cal-cell"];
      if (isWeekend) classes.push("is-weekend");
      if (isToday) classes.push("is-today");
      if (isSelected) classes.push("is-selected");
      if (dayEvents.length) classes.push("has-events");

      var chipTones = ["tone-brand", "tone-sand", "tone-teal", "tone-peach"];
      var chips = "";
      if (dayEvents.length) {
        chips += '<div class="cal-events">';
        var mobile = isMobileCal();
        var showCount = Math.min(dayEvents.length, mobile ? 4 : 2);
        for (var e = 0; e < showCount; e++) {
          var ev = dayEvents[e];
          var sub = ev.location || formatTimeRange(ev) || "";
          var tone = chipTones[e % chipTones.length];
          chips +=
            '<button type="button" class="cal-event-chip ' +
            tone +
            '" data-event-index="' +
            allEvents.indexOf(ev) +
            '" aria-label="' +
            escapeAttr(ev.title) +
            '">' +
            '<span class="cal-event-title">' +
            escapeHtml(ev.title) +
            "</span>" +
            (sub
              ? '<span class="cal-event-sub">' + escapeHtml(sub) + "</span>"
              : "") +
            "</button>";
        }
        if (!mobile && dayEvents.length > 2) {
          chips +=
            '<span class="cal-event-more">+' +
            (dayEvents.length - 2) +
            " more</span>";
        } else if (mobile && dayEvents.length > showCount) {
          chips +=
            '<span class="cal-event-more">+' +
            (dayEvents.length - showCount) +
            "</span>";
        }
        chips += "</div>";
      }

      html +=
        '<div class="' +
        classes.join(" ") +
        '" role="button" tabindex="0" data-date="' +
        key +
        '" aria-pressed="' +
        (isSelected ? "true" : "false") +
        '" aria-label="' +
        escapeAttr(
          dayNum +
            (dayEvents.length
              ? ", " + dayEvents.length + " event" + (dayEvents.length > 1 ? "s" : "")
              : "")
        ) +
        '">' +
        '<span class="cal-day-num">' +
        dayNum +
        "</span>" +
        chips +
        "</div>";
    }

    calGrid.innerHTML = html;
  }

  function renderDayDetail() {
    if (!selectedKey) {
      dayDetail.hidden = true;
      dayDetail.innerHTML = "";
      return;
    }

    var items = eventsOnDay(selectedKey);
    dayDetail.hidden = false;

    if (!items.length) {
      dayDetail.innerHTML =
        '<h2 class="events-day-detail-title">' +
        escapeHtml(formatLongDate(selectedKey)) +
        "</h2>" +
        '<p class="events-empty">No events on this day.</p>';
      return;
    }

    dayDetail.innerHTML =
      '<h2 class="events-day-detail-title">' +
      escapeHtml(formatLongDate(selectedKey)) +
      "</h2>" +
      items
        .map(function (ev) {
          var time = formatTimeRange(ev);
          var meta = [];
          if (time) meta.push(time);
          if (ev.location) meta.push(ev.location);

          return (
            '<article class="event-card">' +
            '<div class="event-card-date" aria-hidden="true">' +
            '<span class="event-card-month">' +
            keyToDate(ev.date).toLocaleDateString(undefined, { month: "short" }) +
            "</span>" +
            '<span class="event-card-day">' +
            keyToDate(ev.date).getDate() +
            "</span>" +
            "</div>" +
            '<div class="event-card-body">' +
            "<h3>" +
            escapeHtml(ev.title) +
            "</h3>" +
            (meta.length
              ? '<p class="event-card-meta">' + escapeHtml(meta.join(" · ")) + "</p>"
              : "") +
            (ev.description ? "<p>" + escapeHtml(ev.description) + "</p>" : "") +
            (ev.link
              ? '<a class="link-arrow" href="' +
                escapeAttr(ev.link) +
                '">Details →</a>'
              : "") +
            "</div>" +
            "</article>"
          );
        })
        .join("");
  }

  function renderMobileList() {
    if (!mobileList) return;

    var todayKey =
      today.getFullYear() +
      "-" +
      pad2(today.getMonth() + 1) +
      "-" +
      pad2(today.getDate());
    var title = "Upcoming";
    var items = [];

    if (selectedKey) {
      items = eventsOnDay(selectedKey);
      title = formatLongDate(selectedKey);
      if (!items.length) {
        mobileList.innerHTML =
          '<h2 class="events-mobile-list-title">' +
          escapeHtml(title) +
          "</h2>" +
          '<p class="events-mobile-empty">No events on this day.</p>';
        return;
      }
    } else {
      items = allEvents
        .filter(function (ev) {
          return ev.date >= todayKey;
        })
        .slice(0, 8);
    }

    if (!items.length) {
      mobileList.innerHTML =
        '<h2 class="events-mobile-list-title">' +
        escapeHtml(title) +
        "</h2>" +
        '<p class="events-mobile-empty">No upcoming events yet. Check back soon.</p>';
      return;
    }

    mobileList.innerHTML =
      '<h2 class="events-mobile-list-title">' +
      escapeHtml(title) +
      "</h2>" +
      items
        .map(function (ev) {
          var d = keyToDate(ev.date);
          var month = d.toLocaleDateString(undefined, { month: "short" });
          var day = String(d.getDate());
          var meta = [];
          var time = formatTimeRange(ev);
          if (time) meta.push(time);
          if (ev.location) meta.push(ev.location);
          return (
            '<button type="button" class="events-mobile-card" data-event-index="' +
            allEvents.indexOf(ev) +
            '">' +
            '<span class="events-mobile-date">' +
            '<span class="events-mobile-month">' +
            escapeHtml(month) +
            "</span>" +
            '<span class="events-mobile-day">' +
            escapeHtml(day) +
            "</span>" +
            "</span>" +
            '<span class="events-mobile-body">' +
            "<h3>" +
            escapeHtml(ev.title) +
            "</h3>" +
            (meta.length
              ? '<p class="events-mobile-meta">' +
                escapeHtml(meta.join(" · ")) +
                "</p>"
              : "") +
            "</span>" +
            "</button>"
          );
        })
        .join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function changeMonth(delta) {
    viewMonth += delta;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    } else if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    if (calMonth) calMonth.classList.add("is-swapping");
    window.setTimeout(function () {
      renderCalendar();
      if (calMonth) calMonth.classList.remove("is-swapping");
      calGrid.classList.remove("is-animating");
      void calGrid.offsetWidth;
      calGrid.classList.add("is-animating");
    }, 120);
  }

  function openEventModal(ev) {
    if (!eventModal || !ev) return;
    eventModalTitle.textContent = ev.title || "";
    eventModalLocation.textContent = ev.location || "Location TBA";
    eventModalDate.textContent = formatLongDate(ev.date);
    var time = formatTimeRange(ev);
    if (time) {
      eventModalTime.hidden = false;
      eventModalTime.textContent = time;
    } else {
      eventModalTime.hidden = true;
      eventModalTime.textContent = "";
    }
    if (ev.link) {
      eventModalLink.hidden = false;
      eventModalLink.href = ev.link;
    } else {
      eventModalLink.hidden = true;
      eventModalLink.removeAttribute("href");
    }
    eventModal.hidden = false;
    document.body.style.overflow = "hidden";
    if (eventModalClose) eventModalClose.focus();
  }

  function closeEventModal() {
    if (!eventModal) return;
    eventModal.hidden = true;
    document.body.style.overflow = "";
  }

  calGrid.addEventListener("click", function (e) {
    var chip = e.target.closest(".cal-event-chip");
    if (chip) {
      e.preventDefault();
      e.stopPropagation();
      var idx = parseInt(chip.getAttribute("data-event-index"), 10);
      if (!isNaN(idx) && allEvents[idx]) openEventModal(allEvents[idx]);
      return;
    }
    var btn = e.target.closest(".cal-cell[data-date]");
    if (!btn) return;
    var key = btn.getAttribute("data-date");
    selectedKey = selectedKey === key ? null : key;
    renderCalendar();
    renderDayDetail();
    renderMobileList();
  });

  calGrid.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.target.classList.contains("cal-event-chip")) return;
    var cell = e.target.closest(".cal-cell[data-date]");
    if (!cell) return;
    e.preventDefault();
    cell.click();
  });

  if (eventModal) {
    eventModal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close-modal")) closeEventModal();
    });
  }
  if (eventModalClose) {
    eventModalClose.addEventListener("click", closeEventModal);
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && eventModal && !eventModal.hidden) {
      closeEventModal();
    }
  });

  calPrev.addEventListener("click", function () {
    changeMonth(-1);
  });

  calNext.addEventListener("click", function () {
    changeMonth(1);
  });

  if (calToday) {
    calToday.addEventListener("click", function () {
      viewYear = today.getFullYear();
      viewMonth = today.getMonth();
      selectedKey =
        today.getFullYear() +
        "-" +
        pad2(today.getMonth() + 1) +
        "-" +
        pad2(today.getDate());
      renderCalendar();
      renderDayDetail();
      renderMobileList();
      calGrid.classList.remove("is-animating");
      void calGrid.offsetWidth;
      calGrid.classList.add("is-animating");
    });
  }

  if (mobileList) {
    mobileList.addEventListener("click", function (e) {
      var card = e.target.closest(".events-mobile-card");
      if (!card) return;
      var idx = parseInt(card.getAttribute("data-event-index"), 10);
      if (!isNaN(idx) && allEvents[idx]) openEventModal(allEvents[idx]);
    });
  }

  window.addEventListener("resize", function () {
    clearTimeout(window.__joyCalResize);
    window.__joyCalResize = setTimeout(function () {
      renderCalendar();
    }, 150);
  });

  // Paint the full month grid immediately, then load event markers
  renderCalendar();
  renderDayDetail();
  renderMobileList();
  calGrid.classList.add("is-animating");
  loadEvents();

  window.addEventListener("joy2la-events-updated", function () {
    loadEvents();
  });
})();
