document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("evaluationForm");
  const summary = document.getElementById("summary");
  const selects = form.querySelectorAll("select");

  // Add required attribute to all select elements
  selects.forEach((select) => {
    select.setAttribute("required", "true");
    // Add empty default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Bitte auswählen";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.prepend(defaultOption);
  });

  // Test button fills form with sample data
  document.getElementById("testBtn").addEventListener("click", function () {
    // Fill URL
    document.getElementById("url").value =
      "https://www.immobilienscout24.de/expose/159052211?referrer=NOT_FOUND_LAST_SEARCH#/";

    // Fill dropdowns
    document.getElementById("type").value = "Eigentumswohnung";
    document.getElementById("agent").value = "0"; // Privat
    document.getElementById("rooms").value = "1";
    document.getElementById("location").value = "Mittel";
    document.getElementById("year").value = "≥2000";
    document.getElementById("efficiency").value = "C";
    document.getElementById("condition").value = "Gut";

    // Remove invalid class from all selects
    selects.forEach((select) => select.classList.remove("invalid"));

    // Fill numeric inputs
    document.getElementById("size").value = "39";
    document.getElementById("price").value = "116000";
    document.getElementById("rent").value = "10";
    document.getElementById("hoa").value = "120";
    document.getElementById("equity").value = "10000";
    document.getElementById("interest").value = "3.5";
    document.getElementById("repayment").value = "2";
  });

  // Handle reset button - updated version
  document.getElementById("resetBtn").addEventListener("click", function () {
    // Reset the form
    form.reset();

    // Reset all select elements to their initial state
    selects.forEach((select) => {
      // Reset to first (default) option
      select.selectedIndex = 0;
      select.classList.remove("invalid");

      // Ensure the default option is selected
      const defaultOption = select.querySelector("option[value='']");
      if (defaultOption) {
        defaultOption.selected = true;
      }
    });

    // Clear all input fields
    form.querySelectorAll("input").forEach((input) => {
      input.value = "";
      input.classList.remove("invalid");
    });

    // Hide summary if visible
    document.getElementById("summary").classList.remove("show");
  });

  // Handle validation before form submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Check if all selects are valid
    let isValid = true;
    selects.forEach((select) => {
      if (!select.value) {
        select.classList.add("invalid");
        isValid = false;
      } else {
        select.classList.remove("invalid");
      }
    });

    if (isValid) {
      evaluateProperty();
    }
  });

  function evaluateProperty() {
    // Get input values and validate each field
    const inputs = {};
    const errors = [];

    try {
      // Validate size
      const size = parseFloat(document.getElementById("size").value);
      if (isNaN(size) || size <= 0) {
        errors.push("Bitte geben Sie eine gültige Wohnfläche ein (> 0 m²)");
      }
      inputs.size = size;

      // Validate price
      const price = parseFloat(document.getElementById("price").value);
      if (isNaN(price) || price <= 0) {
        errors.push("Bitte geben Sie einen gültigen Kaufpreis ein (> 0 €)");
      }
      inputs.price = price;

      // Validate rent
      const rent = parseFloat(document.getElementById("rent").value);
      if (isNaN(rent) || rent < 0) {
        errors.push("Bitte geben Sie einen gültigen Mietpreis ein (≥ 0 €/m²)");
      }
      inputs.rent = rent;

      // Validate HOA fees
      const hoa = parseFloat(document.getElementById("hoa").value);
      if (isNaN(hoa) || hoa < 0) {
        errors.push("Bitte geben Sie gültige Hausgeldkosten ein (≥ 0 €)");
      }
      inputs.hoa = hoa;

      // Validate equity
      const equity = parseFloat(document.getElementById("equity").value);
      if (isNaN(equity) || equity < 0) {
        errors.push("Bitte geben Sie ein gültiges Eigenkapital ein (≥ 0 €)");
      }
      inputs.equity = equity;

      // Validate interest rate
      const interest = parseFloat(document.getElementById("interest").value);
      if (isNaN(interest) || interest < 0 || interest > 15) {
        errors.push("Bitte geben Sie einen gültigen Zinssatz ein (0-15%)");
      }
      inputs.interest = interest / 100;

      // Validate repayment rate
      const repayment = parseFloat(document.getElementById("repayment").value);
      if (isNaN(repayment) || repayment < 0 || repayment > 15) {
        errors.push("Bitte geben Sie eine gültige Tilgungsrate ein (0-15%)");
      }
      inputs.repayment = repayment / 100;

      // Get other values
      inputs.provisionRate = parseFloat(document.getElementById("agent").value);
      inputs.condition = document.getElementById("condition").value;

      // Show errors if any
      if (errors.length > 0) {
        summary.innerHTML = `
                <h3>⚠️ Bitte korrigieren Sie folgende Fehler:</h3>
                <ul class="error-list">
                    ${errors.map((error) => `<li>${error}</li>`).join("")}
                </ul>
            `;
        summary.classList.add("show");
        return;
      }

      // Calculate metrics and update UI if no errors
      const calculations = calculateMetrics(inputs);
      updateSummary(calculations);
    } catch (e) {
      summary.innerHTML = `
            <h3>⚠️ Ein Fehler ist aufgetreten:</h3>
            <p class="error">Bitte überprüfen Sie alle Eingabefelder auf gültige Werte.</p>
        `;
      summary.classList.add("show");
    }
  }

  function calculateMetrics(inputs) {
    const tax = inputs.price * 0.035; // 3.5% Grunderwerbsteuer
    const notar = inputs.price * 0.015; // 1.5% Notarkosten
    const provision = inputs.price * inputs.provisionRate;
    const additionalCosts = tax + notar + provision;
    const effectivePrice = inputs.price + additionalCosts;

    const annualRent = inputs.rent * inputs.size * 12;
    const pricePerM2 = inputs.price / inputs.size;

    const renovationCost =
      inputs.condition === "Neuwertig"
        ? 0
        : inputs.condition === "Gut"
        ? 100 * inputs.size
        : 300 * inputs.size;

    const loanAmount = effectivePrice - inputs.equity;
    const monthlyRate =
      (loanAmount * (inputs.interest + inputs.repayment)) / 12;
    const yieldPercent = (annualRent / effectivePrice) * 100;

    let rating = "nicht empfehlenswert";
    let ratingColor = "var(--error)";

    if (yieldPercent > 4) {
      rating = "rentabel";
      ratingColor = "var(--success)";
    } else if (yieldPercent >= 3) {
      rating = "grenzwertig";
      ratingColor = "var(--warning)";
    }

    return {
      tax,
      notar,
      provision,
      effectivePrice,
      annualRent,
      pricePerM2,
      renovationCost,
      monthlyRate,
      yieldPercent,
      rating,
      ratingColor,
      equityRatio: (inputs.equity / effectivePrice) * 100,
    };
  }

  function updateSummary(calc) {
    summary.innerHTML = `
      <h3>📋 Auswertung</h3>
      <p><strong>Quadratmeterpreis:</strong> ${calc.pricePerM2.toLocaleString(
        "de-DE"
      )} €/m²</p>
      <p><strong>Effektiver Kaufpreis:</strong> ${calc.effectivePrice.toLocaleString(
        "de-DE"
      )} €</p>
      <p><strong>Jahresnettomiete:</strong> ${calc.annualRent.toLocaleString(
        "de-DE"
      )} €</p>
      <p><strong>Monatliche Kreditrate:</strong> ${calc.monthlyRate.toLocaleString(
        "de-DE"
      )} €</p>
      <p><strong>Eigenkapitalquote:</strong> ${calc.equityRatio.toFixed(2)}%</p>
      <p><strong>Renovierungskosten:</strong> ${calc.renovationCost.toLocaleString(
        "de-DE"
      )} €</p>
      <p><strong>Bruttorendite:</strong> ${calc.yieldPercent.toFixed(2)}%</p>
      <p><strong>Investitions-Fazit:</strong> <span style="color: ${
        calc.ratingColor
      }">${calc.rating}</span></p>
      <p><em>Diese Immobilie ist aufgrund ihrer Daten aktuell ${
        calc.rating
      }.</em></p>
    `;
    summary.classList.add("show");
  }
});
