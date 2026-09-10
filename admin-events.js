(function () {
  "use strict";

  var PASSCODE = "abc123";
  var STORAGE_KEY = "joy2la-custom-events";
  var REMOVED_KEY = "joy2la-removed-events";
  var AUTH_KEY = "joy2la-admin-auth";

  var BUILT_IN_EVENTS = [
    {
      title: "2nd Sundays on Skid Row",
      repeat: "2nd-sunday",
      start: "2:00 PM",
      end: "5:00 PM",
      location: "Gladys Park, 808 East 6th St., Los Angeles, CA 90021",
      description:
        "With Love In Action & Joy2LA — serving with love, compassion, and a shared sense of humanity. Always a blessing to connect and share smiles with the community because we make a difference together. Support resources available while supplies last: hot meals, pantry, essentials & haircuts.",
      link: "https://www.soulsavingproductions.com/events/2nd-sunday-may-ag43y-fclh6-tp9p9-9mkxb-bceen-f9fwy-shesr-jj6g2-y9plr-aked5-ncfwg-ybxh6-8f9jp-wnmdd-59ykh"
    }
  ];

  function eventKey(ev) {
    if (ev.repeat) {
      return "repeat:" + String(ev.repeat).toLowerCase() + "|" + ev.title;
    }
    return "date:" + (ev.date || "") + "|" + ev.title;
  }

  function loadCustomEvents() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCustomEvents(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("joy2la-events-updated"));
  }

  function loadRemovedKeys() {
    try {
      var raw = localStorage.getItem(REMOVED_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveRemovedKeys(list) {
    localStorage.setItem(REMOVED_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("joy2la-events-updated"));
  }

  function isRemoved(ev) {
    return loadRemovedKeys().indexOf(eventKey(ev)) !== -1;
  }

  function isAuthed() {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setAuthed(on) {
    try {
      if (on) sessionStorage.setItem(AUTH_KEY, "1");
      else sessionStorage.removeItem(AUTH_KEY);
    } catch (e) {}
  }

  function ensureMarkup() {
    if (document.getElementById("admin-lock-btn")) return;

    var copyright = document.querySelector(".footer-copyright");
    if (copyright) {
      var lock = document.createElement("button");
      lock.type = "button";
      lock.id = "admin-lock-btn";
      lock.className = "admin-lock-btn";
      lock.setAttribute("aria-label", "Event admin");
      lock.title = "Event admin";
      lock.innerHTML = "🔒";
      copyright.appendChild(lock);
    }

    if (document.getElementById("admin-pass-modal")) return;

    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="admin-modal" id="admin-pass-modal" hidden>' +
      '  <div class="admin-modal-backdrop" data-admin-close="pass"></div>' +
      '  <div class="admin-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-pass-title">' +
      '    <button type="button" class="admin-modal-close" data-admin-close="pass" aria-label="Close">×</button>' +
      '    <h2 id="admin-pass-title">Admin</h2>' +
      '    <p class="admin-modal-lead">Enter the passcode to manage calendar events.</p>' +
      '    <form id="admin-pass-form" class="admin-pass-form">' +
      '      <label for="admin-pass-input">Passcode</label>' +
      '      <input id="admin-pass-input" type="password" autocomplete="current-password" required>' +
      '      <p class="admin-status" id="admin-pass-status" hidden></p>' +
      '      <button type="submit" class="btn btn-primary">Unlock →</button>' +
      "    </form>" +
      "  </div>" +
      "</div>" +
      '<div class="admin-modal" id="admin-panel-modal" hidden>' +
      '  <div class="admin-modal-backdrop" data-admin-close="panel"></div>' +
      '  <div class="admin-modal-dialog admin-modal-dialog-wide" role="dialog" aria-modal="true" aria-labelledby="admin-panel-title">' +
      '    <button type="button" class="admin-modal-close" data-admin-close="panel" aria-label="Close">×</button>' +
      '    <h2 id="admin-panel-title">Add Calendar Event</h2>' +
      '    <p class="admin-modal-lead">Events save on this browser right away. Download <code>events.json</code> and replace the file in your project to publish them for everyone.</p>' +
      '    <form id="admin-event-form" class="admin-event-form">' +
      '      <div class="admin-field">' +
      "        <label for=\"admin-title\">Title</label>" +
      '        <input id="admin-title" name="title" type="text" required placeholder="Event name">' +
      "      </div>" +
      '      <div class="admin-field-row">' +
      '        <div class="admin-field">' +
      '          <label for="admin-date">Date</label>' +
      '          <input id="admin-date" name="date" type="date" required>' +
      "        </div>" +
      '        <div class="admin-field">' +
      '          <label for="admin-start">Start</label>' +
      '          <input id="admin-start" name="start" type="text" placeholder="2:00 PM">' +
      "        </div>" +
      '        <div class="admin-field">' +
      '          <label for="admin-end">End</label>' +
      '          <input id="admin-end" name="end" type="text" placeholder="5:00 PM">' +
      "        </div>" +
      "      </div>" +
      '      <div class="admin-field">' +
      '        <label for="admin-location">Location</label>' +
      '        <input id="admin-location" name="location" type="text" placeholder="Address or place">' +
      "      </div>" +
      '      <div class="admin-field">' +
      '        <label for="admin-link">Link <span class="gi-optional">optional</span></label>' +
      '        <input id="admin-link" name="link" type="url" placeholder="https://">' +
      "      </div>" +
      '      <div class="admin-field">' +
      '        <label for="admin-description">Description <span class="gi-optional">optional</span></label>' +
      '        <textarea id="admin-description" name="description" rows="3" placeholder="Details…"></textarea>' +
      "      </div>" +
      '      <div class="admin-actions">' +
      '        <button type="submit" class="btn btn-primary">Add event →</button>' +
      '        <button type="button" class="btn btn-outline" id="admin-download-btn">Download events.json</button>' +
      "      </div>" +
      '      <p class="admin-status" id="admin-form-status" hidden></p>' +
      "    </form>" +
      '    <div class="admin-list-wrap">' +
      "      <h3>Manage events</h3>" +
      '      <p class="admin-list-lead">Use Delete to remove an event from this browser’s calendar. Then download a fresh <code>events.json</code> to publish the change.</p>' +
      '      <div id="admin-event-list" class="admin-event-list"></div>' +
      "    </div>" +
      "  </div>" +
      "</div>";

    while (wrap.firstChild) {
      document.body.appendChild(wrap.firstChild);
    }
  }

  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.hidden = true;
    if (
      document.getElementById("admin-pass-modal").hidden &&
      document.getElementById("admin-panel-modal").hidden
    ) {
      document.body.style.overflow = "";
    }
  }

  function setStatus(el, message, type) {
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || "";
    el.className = "admin-status" + (type ? " is-" + type : "");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderList() {
    var list = document.getElementById("admin-event-list");
    if (!list) return;

    var rows = [];

    BUILT_IN_EVENTS.forEach(function (ev) {
      if (isRemoved(ev)) return;
      var meta = [
        ev.repeat ? "Recurring · " + ev.repeat : ev.date,
        ev.start,
        ev.location
      ]
        .filter(Boolean)
        .join(" · ");
      rows.push({
        kind: "built-in",
        key: eventKey(ev),
        title: ev.title,
        meta: meta
      });
    });

    loadCustomEvents().forEach(function (ev, i) {
      var meta = [ev.date, ev.start, ev.location].filter(Boolean).join(" · ");
      rows.push({
        kind: "custom",
        index: i,
        title: ev.title,
        meta: meta
      });
    });

    if (!rows.length) {
      list.innerHTML = '<p class="admin-empty">No events to manage.</p>';
      return;
    }

    list.innerHTML = rows
      .map(function (row) {
        var deleteAttrs =
          row.kind === "custom"
            ? 'data-delete-kind="custom" data-index="' + row.index + '"'
            : 'data-delete-kind="built-in" data-key="' +
              escapeHtml(row.key) +
              '"';
        return (
          '<div class="admin-event-item">' +
          "<div>" +
          "<strong>" +
          escapeHtml(row.title) +
          "</strong>" +
          (row.meta ? "<span>" + escapeHtml(row.meta) + "</span>" : "") +
          "</div>" +
          '<button type="button" class="admin-delete-btn" ' +
          deleteAttrs +
          ">Delete</button>" +
          "</div>"
        );
      })
      .join("");
  }

  function openAdmin() {
    if (
      !document.getElementById("cal-grid") &&
      !/events\.html/i.test(location.pathname + location.href)
    ) {
      location.href = "events.html#admin";
      return;
    }
    openModal("admin-panel-modal");
    renderList();
  }

  function downloadEventsJson() {
    var base = BUILT_IN_EVENTS.filter(function (ev) {
      return !isRemoved(ev);
    });
    var custom = loadCustomEvents().map(function (ev) {
      return {
        title: ev.title,
        date: ev.date,
        start: ev.start || "",
        end: ev.end || "",
        location: ev.location || "",
        description: ev.description || "",
        link: ev.link || ""
      };
    });
    var blob = new Blob([JSON.stringify(base.concat(custom), null, 2)], {
      type: "application/json"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "events.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function bind() {
    ensureMarkup();

    var lockBtn = document.getElementById("admin-lock-btn");
    var passModal = document.getElementById("admin-pass-modal");
    var panelModal = document.getElementById("admin-panel-modal");
    var passForm = document.getElementById("admin-pass-form");
    var passInput = document.getElementById("admin-pass-input");
    var passStatus = document.getElementById("admin-pass-status");
    var eventForm = document.getElementById("admin-event-form");
    var formStatus = document.getElementById("admin-form-status");
    var downloadBtn = document.getElementById("admin-download-btn");
    var eventList = document.getElementById("admin-event-list");

    if (lockBtn) {
      lockBtn.addEventListener("click", function () {
        if (isAuthed()) openAdmin();
        else {
          setStatus(passStatus, "", "");
          if (passInput) passInput.value = "";
          openModal("admin-pass-modal");
          if (passInput) passInput.focus();
        }
      });
    }

    document.querySelectorAll("[data-admin-close]").forEach(function (el) {
      el.addEventListener("click", function () {
        var which = el.getAttribute("data-admin-close");
        if (which === "pass") closeModal("admin-pass-modal");
        if (which === "panel") closeModal("admin-panel-modal");
      });
    });

    if (passForm) {
      passForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var value = (passInput && passInput.value) || "";
        if (value === PASSCODE) {
          setAuthed(true);
          closeModal("admin-pass-modal");
          openAdmin();
        } else {
          setStatus(passStatus, "Incorrect passcode.", "error");
        }
      });
    }

    if (eventForm) {
      eventForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var title = document.getElementById("admin-title").value.trim();
        var date = document.getElementById("admin-date").value;
        var start = document.getElementById("admin-start").value.trim();
        var end = document.getElementById("admin-end").value.trim();
        var locationVal = document.getElementById("admin-location").value.trim();
        var link = document.getElementById("admin-link").value.trim();
        var description = document.getElementById("admin-description").value.trim();

        if (!title || !date) {
          setStatus(formStatus, "Title and date are required.", "error");
          return;
        }

        var list = loadCustomEvents();
        list.push({
          title: title,
          date: date,
          start: start,
          end: end,
          location: locationVal,
          link: link,
          description: description
        });
        saveCustomEvents(list);
        eventForm.reset();
        renderList();
        setStatus(formStatus, "Event added to the calendar.", "success");
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener("click", downloadEventsJson);
    }

    if (eventList) {
      eventList.addEventListener("click", function (e) {
        var btn = e.target.closest(".admin-delete-btn");
        if (!btn) return;
        if (!window.confirm("Delete this event from the calendar?")) return;

        var kind = btn.getAttribute("data-delete-kind");
        if (kind === "custom") {
          var idx = parseInt(btn.getAttribute("data-index"), 10);
          var customList = loadCustomEvents();
          if (isNaN(idx) || idx < 0 || idx >= customList.length) return;
          customList.splice(idx, 1);
          saveCustomEvents(customList);
        } else if (kind === "built-in") {
          var key = btn.getAttribute("data-key");
          if (!key) return;
          var removed = loadRemovedKeys();
          if (removed.indexOf(key) === -1) {
            removed.push(key);
            saveRemovedKeys(removed);
          } else {
            window.dispatchEvent(new CustomEvent("joy2la-events-updated"));
          }
        }

        renderList();
        setStatus(formStatus, "Event deleted.", "success");
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (passModal && !passModal.hidden) closeModal("admin-pass-modal");
      if (panelModal && !panelModal.hidden) closeModal("admin-panel-modal");
    });

    if (location.hash === "#admin" && isAuthed()) {
      openAdmin();
    } else if (location.hash === "#admin") {
      openModal("admin-pass-modal");
    }
  }

  window.loadCustomEvents = loadCustomEvents;
  window.loadRemovedEventKeys = loadRemovedKeys;
  window.Joy2LAAdmin = {
    loadCustomEvents: loadCustomEvents,
    loadRemovedEventKeys: loadRemovedKeys,
    eventKey: eventKey
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
