export function initReset() {
  const btn = document.getElementById("btn-reset");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // Get the form element
    const form = document.querySelector("form");
    if (form) {
      // Native form reset to clear browser's form history
      form.reset();
    }

    // Input fields to clear
    [
      "listingUrl",
      "size",
      "purchasePrice",
      "rentPerM2",
      "hoa",
      "equity",
      "interestRate",
      "repaymentRate",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.value = "";
        // Clear browser's autocomplete history for this field
        el.setAttribute("autocomplete", "off");
      }
    });

    // Dropdowns to reset
    [
      "propertyType",
      "agentType",
      "rooms",
      "location",
      "yearBuilt",
      "energyClass",
      "condition",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });

    // Output fields to clear (use "–" as placeholder)
    [
      "output-qmPreis",
      "output-annualRent",
      "output-effPurchasePrice",
      "output-addCosts",
      "output-loanPayment",
      "output-renoCost",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "–";
    });

    // Hide all warnings
    document.querySelectorAll(".warning").forEach((warn) => {
      warn.textContent = "";
      warn.style.display = "none";
    });

    // Hide the result form
    const resultDiv = document.getElementById("form-result");
    if (resultDiv) resultDiv.style.display = "none";

    // Reset progress bar
    const progressContainer = document.getElementById("progress-bar-container");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    if (progressContainer) {
      progressContainer.classList.remove("active");
    }
    if (progressBar) {
      progressBar.style.width = "0%";
    }
    if (progressText) {
      progressText.textContent = "0%";
    }
  });
}
