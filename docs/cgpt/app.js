function highlightError(id, state) {
  const el = document.getElementById(id);
  if (state) el.classList.add('invalid');
  else el.classList.remove('invalid');
}
function resetForm() {
  document.getElementById('form').reset();
  document.getElementById('fazit').innerHTML = '';
  document.getElementById('analysis').innerHTML = '';
  document.getElementById('scoreChart').style.display = 'none';
  ['price','size','rent','hoa','interest','repayment'].forEach(id => highlightError(id, false));
}
function fillTest() {
  document.getElementById('price').value = 116000;
  document.getElementById('size').value = 70;
  document.getElementById('rent').value = 5.57;
  document.getElementById('hoa').value = 130;
  document.getElementById('interest').value = 3.5;
  document.getElementById('repayment').value = 2;
  document.getElementById('agent').selectedIndex = 0;
  document.getElementById('year').selectedIndex = 0;
  document.getElementById('efficiency').selectedIndex = 0;
  document.getElementById('location').selectedIndex = 1;
  document.getElementById('condition').selectedIndex = 1;
  // Chart und Fazit zurücksetzen
  document.getElementById('fazit').innerHTML = '';
  document.getElementById('analysis').innerHTML = '';
  document.getElementById('scoreChart').style.display = 'none';
}
function formatCurrency(num) {
  return parseFloat(num).toLocaleString('de-DE', {style:'currency', currency:'EUR'});
}
document.getElementById('reset').onclick = resetForm;
document.getElementById('test').onclick = fillTest;

document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();

  let error = false;
  ['price','size','rent','hoa','interest','repayment'].forEach(id => {
    const val = document.getElementById(id).value;
    if (val === '' || isNaN(Number(val)) || Number(val) <= 0) {
      highlightError(id, true);
      error = true;
    } else {
      highlightError(id, false);
    }
  });
  if (error) return;

  const price = parseFloat(document.getElementById('price').value);
  const size = parseFloat(document.getElementById('size').value);
  const rent = parseFloat(document.getElementById('rent').value);
  const hoa = parseFloat(document.getElementById('hoa').value);
  const interest = parseFloat(document.getElementById('interest').value) / 100;
  const repayment = parseFloat(document.getElementById('repayment').value) / 100;
  const provisionRate = parseFloat(document.getElementById('agent').value);
  const condition = document.getElementById('condition').value;

  const tax = price * 0.035;
  const notar = price * 0.015;
  const provision = price * provisionRate;
  const additionalCosts = tax + notar + provision;
  const effectivePrice = price + additionalCosts;
  const annualRent = rent * size * 12;
  const pricePerM2 = price / size;
  const renovationCost = condition === 'Neuwertig' ? 0 : condition === 'Gut' ? 100 * size : 300 * size;
  const loanAmount = effectivePrice - 10000;
  const monthlyRate = (loanAmount * (interest + repayment)) / 12;
  const yieldPercent = (annualRent / effectivePrice) * 100;
  const eigenkapitalquote = 10000 / effectivePrice * 100;

  let score = 0;
  let analysis = [];

  if (price < 100000) { score += 25; analysis.push('<span class="bad">✗</span> <b>Aktueller Kaufpreis:</b> ' + formatCurrency(price)); }
  else { score += 15; analysis.push('<span class="bad">✗</span> <b>Aktueller Kaufpreis:</b> ' + formatCurrency(price)); }
  if (annualRent > 5000) { score += 18; analysis.push('<span class="ok">✓</span> <b>Jahresnetto-Miete:</b> ' + formatCurrency(annualRent)); }
  else { score += 10; analysis.push('<span class="warn">●</span> <b>Jahresnetto-Miete:</b> ' + formatCurrency(annualRent)); }
  if (hoa <= 150) { score += 15; analysis.push('<span class="ok">✓</span> <b>Monatliches Hausgeld:</b> ' + formatCurrency(hoa)); }
  else { score += 7; analysis.push('<span class="bad">✗</span> <b>Monatliches Hausgeld:</b> ' + formatCurrency(hoa)); }
  if (monthlyRate < 700) { score += 19; analysis.push('<span class="ok">✓</span> <b>Monatliche Kreditrate:</b> ' + formatCurrency(monthlyRate)); }
  else { score += 8; analysis.push('<span class="bad">✗</span> <b>Monatliche Kreditrate:</b> ' + formatCurrency(monthlyRate)); }

  const scorePct = Math.round(score/77*100);

  let rating, icon, color;
  if (scorePct >= 80) { rating = "Empfehlenswert"; icon = "👍"; color = "#16e176"; }
  else if (scorePct >= 65) { rating = "Gut"; icon = "⚠️"; color = "#fbbf24"; }
  else if (scorePct >= 45) { rating = "Grenzwertig"; icon = "⚠️"; color = "#fbbf24"; }
  else { rating = "Nicht empfehlenswert"; icon = "👎"; color = "#ef4444"; }

  const zielRendite = 5.0;
  const zielPreis = annualRent / (zielRendite/100);
  const preisDiff = effectivePrice - zielPreis;
  const preisDiffPct = preisDiff / effectivePrice * 100;

  document.getElementById('fazit').innerHTML =
    `<div class="fazit-container" style="border-left: 8px solid ${color};">
      <div style="display:flex;align-items:center;gap:1rem;">
        <span style="font-size:2.4rem;">${icon}</span>
        <span style="font-size:1.3rem;font-weight:bold;">${scorePct}% – ${rating}</span>
      </div>
      <div style="margin-top:0.7rem;">
        Um eine Bruttorendite von <b>5%</b> zu erreichen, wäre ein Kaufpreis von <b>${formatCurrency(zielPreis)}</b> rentabel.<br>
        Dies würde eine Reduzierung des effektiven Kaufpreises um <b>${Math.abs(preisDiffPct).toFixed(2)}%</b> (${formatCurrency(Math.abs(preisDiff))}) bedeuten.
      </div>
    </div>`;

  // Chart.js Donut
  const chartEl = document.getElementById('scoreChart');
  const ctx = chartEl.getContext('2d');
  chartEl.style.display = 'block';
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [scorePct, 100-scorePct],
        backgroundColor: [color, '#23283a'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      }
    }
  });
  // Prozent-Zahl mittig
  setTimeout(()=>{
    ctx.font = "2.4rem Rubik";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.fillText(scorePct + "%", chartEl.width/2, chartEl.height/2+13);
  }, 350);

  document.getElementById('analysis').innerHTML =
    `<div class="analysis"><b>🩺 Detaillierte Analyse</b><ul class="analysis-list">${analysis.join('')}</ul></div>`;
});
