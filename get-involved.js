(function () {
  "use strict";

  /**
   * Paste your Formspree endpoint here after creating a form at
   * https://formspree.io (email it to hello@joy2la.org).
   * Example: "https://formspree.io/f/abcdwxyz"
   */
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

  var form = document.getElementById("volunteer-form");
  var statusEl = document.getElementById("volunteer-status");
  var submitBtn = document.getElementById("volunteer-submit");

  if (!form || !statusEl || !submitBtn) return;

  if (FORMSPREE_ENDPOINT && FORMSPREE_ENDPOINT.indexOf("YOUR_FORM_ID") === -1) {
    form.setAttribute("action", FORMSPREE_ENDPOINT);
  }

  function setStatus(message, type) {
    statusEl.hidden = !message;
    statusEl.textContent = message || "";
    statusEl.className = "form-status" + (type ? " is-" + type : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (FORMSPREE_ENDPOINT.indexOf("YOUR_FORM_ID") !== -1) {
      setStatus(
        "Formspree isn’t connected yet. Add your form ID in get-involved.js (see the comment at the top).",
        "error"
      );
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    setStatus("", "");

    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        setStatus(
          "Thank you for using your talent to serve our community. We can’t wait to serve alongside you!",
          "success"
        );
      })
      .catch(function () {
        setStatus(
          "Something went wrong. Please email hello@joy2la.org or try again.",
          "error"
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Join the Team →";
      });
  });
})();
