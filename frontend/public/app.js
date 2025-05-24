// app.js
document.addEventListener("DOMContentLoaded", function () {
  // Register Chart plugins
  Chart.register(ChartDataLabels);

  let chartInstance = null;

  // Helper function to get metric status with icons
  function getMetricStatus(
    value,
    goodThreshold,
    mediumThreshold,
    higherIsBetter = true
  ) {
    if (higherIsBetter) {
      if (value >= goodThreshold)
        return { icon: "✅", className: "icon-green" };
      if (value >= mediumThreshold)
        return { icon: "🟠", className: "icon-orange" };
      return { icon: "❌", className: "icon-red" };
    } else {
      if (value <= goodThreshold)
        return { icon: "✅", className: "icon-green" };
      if (value <= mediumThreshold)
        return { icon: "🟠", className: "icon-orange" };
      return { icon: "❌", className: "icon-red" };
    }
  }

  // Helper function to format numbers
  function formatCurrency(value) {
    return value.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  }

  // Reset form function
  function resetForm() {
    document.getElementById("form").reset();
    document.getElementById("result").className = "score-box";
    document.getElementById("result").innerHTML = "";
    document
      .querySelectorAll(".error")
      .forEach((el) => el.classList.remove("error"));
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  // Load test data function
  function loadTestData() {
    resetForm();

    const testData = {
      price: "116000",
      area: "39",
      rentPerSqm: "10",
      hausgeld: "130",
      interest: "3",
      repayment: "2",
      commissionType: "privat",
      year: ">=2000",
      energy: "C",
      location: "mittel",
      condition: "gut",
    };

    // Set values for all fields
    for (const [id, value] of Object.entries(testData)) {
      const element = document.getElementById(id);
      if (element) {
        if (element.type === "select-one") {
          element.value = value;
        } else {
          element.value = value;
        }
      }
    }
  }

  // Add event listeners for new buttons
  document.getElementById("resetBtn").addEventListener("click", resetForm);
  document.getElementById("testBtn").addEventListener("click", loadTestData);

  // Main form submission handler
  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous errors
    document
      .querySelectorAll(".error")
      .forEach((el) => el.classList.remove("error"));
    const resultBox = document.getElementById("result");
    resultBox.className = "score-box";
    resultBox.innerHTML = "";

    // Validate inputs
    const requiredFields = [
      { id: "price", name: "Kaufpreis", min: 0.01 },
      { id: "area", name: "Größe", min: 0.01 },
      { id: "rentPerSqm", name: "Mietpreis pro m²", min: 0 },
      { id: "hausgeld", name: "Hausgeld", min: 0 },
      { id: "interest", name: "Zinssatz", min: 0 },
      { id: "repayment", name: "Tilgung", min: 0 },
    ];

    const errors = [];
    const inputValues = {};

    // Validate each field
    for (const field of requiredFields) {
      const input = document.getElementById(field.id);
      const value = parseFloat(input.value.replace(",", "."));

      if (isNaN(value)) {
        errors.push(`❌ ${field.name}: Bitte gültige Zahl eingeben`);
        input.classList.add("error");
      } else if (value < field.min) {
        errors.push(`❌ ${field.name}: Muss mindestens ${field.min} sein`);
        input.classList.add("error");
      } else {
        inputValues[field.id] = value;
      }
    }

    // Check dropdown selections
    const dropdowns = [
      "commissionType",
      "year",
      "energy",
      "location",
      "condition",
    ];
    dropdowns.forEach((id) => {
      inputValues[id] = document.getElementById(id).value;
    });

    // Show errors if any
    if (errors.length > 0) {
      resultBox.className = "score-box show red";
      resultBox.innerHTML = `
                <div class="error-box">
                    <h2>Fehler</h2>
                    <ul class="error-list">
                        ${errors.map((error) => `<li>${error}</li>`).join("")}
                    </ul>
                </div>
            `;
      return;
    }

    // Calculations
    const commission =
      inputValues.commissionType === "makler" ? inputValues.price * 0.0357 : 0;
    const effectivePrice = inputValues.price + commission;
    const annualRent = inputValues.area * inputValues.rentPerSqm * 12;
    const grossYield = (annualRent / effectivePrice) * 100;
    const monthlyPayment =
      (((inputValues.interest + inputValues.repayment) / 100) *
        effectivePrice) /
      12;
    const ownerHausgeld = inputValues.hausgeld * 0.3;
    const netMonthlyRent = annualRent / 12 - ownerHausgeld;
    const paymentRatio = monthlyPayment / netMonthlyRent;
    const hausgeldRatio = ownerHausgeld / (annualRent / 12);

    // Score calculation
    let score = 0;
    score +=
      grossYield >= 5 ? 40 : grossYield >= 4 ? 30 : grossYield >= 3 ? 25 : 20;
    score +=
      monthlyPayment <= netMonthlyRent
        ? 10
        : monthlyPayment <= netMonthlyRent * 1.1
        ? 9
        : monthlyPayment <= netMonthlyRent * 1.3
        ? 8
        : monthlyPayment <= netMonthlyRent * 1.5
        ? 7
        : 5;
    score +=
      inputValues.year === ">=2000"
        ? 10
        : inputValues.year === "1970-1999"
        ? 7
        : 4;
    score += ["A", "C"].includes(inputValues.energy)
      ? 10
      : inputValues.energy === "D"
      ? 5
      : 2;
    score +=
      inputValues.location === "top"
        ? 20
        : inputValues.location === "gut"
        ? 15
        : inputValues.location === "mittel"
        ? 12
        : 4;
    score +=
      inputValues.condition === "neu"
        ? 10
        : inputValues.condition === "gut"
        ? 8
        : 3;

    // Target calculations
    const targetYield = 5;
    const targetPrice = annualRent / (targetYield / 100);
    const priceDiff = effectivePrice - targetPrice;
    const reductionPct = (priceDiff / effectivePrice) * 100;

    // Prepare results
    const scoreIcon = score >= 85 ? "🏆" : score >= 70 ? "👍" : "⚠️";
    const scoreText =
      score >= 85
        ? "Hervorragend"
        : score >= 70
        ? "Gut"
        : score >= 55
        ? "Mittel"
        : "Schlecht";
    const chartColor =
      score >= 85 ? "#4caf50" : score >= 70 ? "#ff9f40" : "#f44336";

    // Get status icons for metrics
    const priceStatus = getMetricStatus(
      effectivePrice,
      targetPrice * 0.95,
      targetPrice * 1.2,
      false
    );
    const rentStatus = getMetricStatus(grossYield, 5.5, 4.0);
    const hausgeldStatus = getMetricStatus(hausgeldRatio, 0.2, 0.35, false);
    const rateStatus = getMetricStatus(paymentRatio, 0.9, 1.1, false);

    // Build results HTML
    resultBox.className = "score-box show";
    resultBox.innerHTML = `
            <div class="fazit-container metric-background ${
              score >= 85 ? "green" : score >= 70 ? "orange" : "red"
            }">
                <h3>Fazit und Kaufpreisanalyse</h3>
                <p class="fazit-content">
                    ${
                      priceDiff > 0
                        ? `Um eine Bruttorendite von ${targetYield}% zu erreichen, wäre ein Kaufpreis von <strong>${formatCurrency(
                            targetPrice
                          )}</strong> rentabel.<br>
                        Das entspricht einer Reduzierung von <strong>${reductionPct.toFixed(
                          2
                        )}%</strong> (${formatCurrency(priceDiff)}).`
                        : `Der effektive Kaufpreis von <strong>${formatCurrency(
                            effectivePrice
                          )}</strong> ist bereits rentabel.`
                    }
                </p>
                <p class="fazit-content"><strong>Gesamtwertung: </strong>${scoreIcon} ${scoreText} (${score} Punkte)</p>
            </div>

            <div class="details-box">
                <h3>Detaillierte Analyse</h3>
                <div class="metric-item">
                    <span class="metric-icon ${priceStatus.className}">${
      priceStatus.icon
    }</span>
                    <div class="metric-content">
                        <div class="metric-title">Kaufpreis</div>
                        <div class="metric-value">${formatCurrency(
                          inputValues.price
                        )}</div>
                        ${
                          inputValues.commissionType === "makler"
                            ? `<div class="metric-target">Inkl. ${formatCurrency(
                                commission
                              )} Provision</div>`
                            : ""
                        }
                    </div>
                </div>
                <div class="metric-item">
                    <span class="metric-icon ${rentStatus.className}">${
      rentStatus.icon
    }</span>
                    <div class="metric-content">
                        <div class="metric-title">Bruttorendite</div>
                        <div class="metric-value">${grossYield.toFixed(
                          2
                        )}%</div>
                        <div class="metric-target">Ziel: ≥5%</div>
                    </div>
                </div>
                <div class="metric-item">
                    <span class="metric-icon ${hausgeldStatus.className}">${
      hausgeldStatus.icon
    }</span>
                    <div class="metric-content">
                        <div class="metric-title">Hausgeld (Eigentümeranteil)</div>
                        <div class="metric-value">${ownerHausgeld.toFixed(
                          2
                        )} €</div>
                        <div class="metric-target">${(
                          hausgeldRatio * 100
                        ).toFixed(1)}% der Miete</div>
                    </div>
                </div>
                <div class="metric-item">
                    <span class="metric-icon ${rateStatus.className}">${
      rateStatus.icon
    }</span>
                    <div class="metric-content">
                        <div class="metric-title">Kreditrate vs. Miete</div>
                        <div class="metric-value">${paymentRatio.toFixed(
                          2
                        )}</div>
                        <div class="metric-target">Idealerweise ≤1.0</div>
                    </div>
                </div>
            </div>

            <div class="chart-container-wrapper">
                <div class="chart-container">
                    <canvas id="scoreChart"></canvas>
                    <div class="chart-label">${score}%</div>
                    <div class="chart-description">Gesamtwertung</div>
                    <div class="chart-legend">
                        <div class="chart-legend-item">
                            <span class="chart-legend-color" style="background: ${chartColor}"></span>
                            <span>Erreicht</span>
                        </div>
                        <div class="chart-legend-item">
                            <span class="chart-legend-color" style="background: #2c2c2c"></span>
                            <span>Fehlend</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Create the chart
    const ctx = document.getElementById("scoreChart").getContext("2d");
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Erreicht", "Fehlend"],
        datasets: [
          {
            data: [score, 100 - score],
            backgroundColor: [chartColor, "#2c2c2c"],
            borderWidth: 0,
            borderRadius: score === 100 ? 0 : 10,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: { display: false },
        },
        cutout: "75%",
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  });

  // Add input validation on blur
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener("blur", function () {
      const value = parseFloat(this.value.replace(",", "."));
      const min = this.id === "price" || this.id === "area" ? 0.01 : 0;

      if (isNaN(value) || value < min) {
        this.classList.add("error");
      } else {
        this.classList.remove("error");
      }
    });
  });
});
