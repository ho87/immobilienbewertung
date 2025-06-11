export function initBewerten() {
  const btn = document.getElementById("btn-bewerten");
  const resultDiv = document.getElementById("form-result");
  const iconSpan = document.getElementById("result-icon");
  const fazitDiv = document.getElementById("result-fazit");

  function getResultValue() {
    // Replace with actual calculation
    return {
      score: 85,
      currentPrice: 300000,
      targetPrice: 250000,
      grossYield: 4.5
    };
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(price);
  }

  function formatPercent(value) {
    return new Intl.NumberFormat('de-DE', { 
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1 
    }).format(value / 100);
  }

  function getScoreIcon(score) {
    if (score > 90) return "🔥 Sehr Gut";
    if (score >= 80) return "👍 Gut";
    if (score >= 70) return "🤷 Ok";
    return "👎 Schlecht";
  }

  if (btn && resultDiv && iconSpan && fazitDiv) {
    btn.addEventListener("click", () => {
      // Get evaluation results
      const result = getResultValue();
      
      // Calculate price difference
      const priceDiff = result.currentPrice - result.targetPrice;
      const priceDiffPercent = (priceDiff / result.currentPrice) * 100;

      // Format text with proper line breaks
      const fazitText = [
        `Um eine Bruttorendite von ${formatPercent(result.grossYield)} zu erreichen, wäre ein Kaufpreis von ${formatPrice(result.targetPrice)} rentabel.`,
        `Dafür muss der Kaufpreis um ${formatPrice(priceDiff)} (${formatPercent(priceDiffPercent)}) reduziert werden.`,
        ``,
        `Score: ${getScoreIcon(result.score)} (${result.score} Punkte)`
      ].join('\n');

      // Show results
      resultDiv.style.display = "block";
      fazitDiv.style.whiteSpace = "pre-line"; // Preserve line breaks
      fazitDiv.textContent = fazitText;

      // Set icon
      iconSpan.textContent = getScoreIcon(result.score).split(' ')[0]; // Only get the emoji
      iconSpan.setAttribute("aria-label", getScoreIcon(result.score));
    });
  }
}
