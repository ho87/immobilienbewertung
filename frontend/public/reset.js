export function initReset() {
  const btn = document.getElementById("btn-reset");
  if (!btn) return;

  btn.addEventListener("click", () => {
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
      if (el) el.value = "";
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
  });
}
