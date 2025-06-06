import { initNumberFormatting, formatNumber } from "./numberFormatting.js";
import { initValidation } from "./validation.js";
import { initCalculations } from "./calculations.js";

export function initTest() {
  const btn = document.getElementById("btn-test");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // 1. Populate fields
    document.getElementById("listingUrl").value =
      "https://www.immobilienscout24.de/expose/155676535?NavigationBarType=SHORTLIST&referrer=SHORTLIST#/";
    document.getElementById("propertyType").value = "apartment";
    document.getElementById("agentType").value = "privat";
    document.getElementById("size").value = "39";
    document.getElementById("rooms").value = "1";
    document.getElementById("purchasePrice").value = "116000";
    document.getElementById("rentPerM2").value = "10";
    document.getElementById("hoa").value = "120";
    document.getElementById("location").value = "medium";
    document.getElementById("equity").value = "10000";
    document.getElementById("interestRate").value = "3";
    document.getElementById("repaymentRate").value = "2";
    document.getElementById("yearBuilt").value = "post2000";
    document.getElementById("energyClass").value = "c";
    document.getElementById("condition").value = "good";

    // 2. Trigger formatting and validation
    initNumberFormatting();
    initValidation();

    // 3. Calculate outputs
    // Get numeric values
    const size = parseFloat(
      document.getElementById("size").value.replace(/,/g, "")
    );
    const purchasePrice = parseFloat(
      document.getElementById("purchasePrice").value.replace(/,/g, "")
    );
    const rentPerM2 = parseFloat(
      document.getElementById("rentPerM2").value.replace(/,/g, "")
    );
    const equity = parseFloat(
      document.getElementById("equity").value.replace(/,/g, "")
    );
    const interestRate = parseFloat(
      document.getElementById("interestRate").value.replace(/,/g, "")
    );
    const repaymentRate = parseFloat(
      document.getElementById("repaymentRate").value.replace(/,/g, "")
    );
    const agentType = document.getElementById("agentType").value;

    // 4. Derived calculations
    const qmPreis = purchasePrice / size;
    const annualRent = rentPerM2 * size * 12;
    const loanBase = purchasePrice - equity;
    const loanPayment =
      (loanBase * (interestRate / 100 + repaymentRate / 100)) / 12;

    // Kaufnebenkosten: 10% if Makler, 5% if Privat
    const addCosts =
      agentType === "Makler" ? purchasePrice * 0.1 : purchasePrice * 0.05;

    const renoCost = purchasePrice * 0.08;
    const effPurchasePrice = purchasePrice + addCosts + renoCost;

    // 5. Output results (formatted)
    document.getElementById("output-qmPreis").textContent = formatNumber(
      Math.round(qmPreis)
    );
    document.getElementById("output-annualRent").textContent = formatNumber(
      Math.round(annualRent)
    );
    document.getElementById("output-loanPayment").textContent = formatNumber(
      Math.round(loanPayment)
    );
    document.getElementById("output-addCosts").textContent = formatNumber(
      Math.round(addCosts)
    );
    document.getElementById("output-renoCost").textContent = formatNumber(
      Math.round(renoCost)
    );
    document.getElementById("output-effPurchasePrice").textContent =
      formatNumber(Math.round(effPurchasePrice));

    // Optionally, trigger calculations module if it does more
    if (typeof initCalculations === "function") {
      initCalculations();
    }
  });
}
