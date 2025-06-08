export function initBewerten() {
  const btn = document.getElementById("btn-bewerten");
  const resultDiv = document.getElementById("form-result");
  const iconSpan = document.getElementById("result-icon");

  // Example: get result value from your logic, here hardcoded for demo
  function getResultValue() {
    // Replace this with your actual evaluation logic
    // Possible return values: "very good", "good", "ok", "bad"
    return window.formResultValue || "ok";
  }

  function getIcon(result) {
    switch (result) {
      case "very good":
        return { icon: "⭐", label: "Sehr gut" };
      case "good":
        return { icon: "👍", label: "Gut" };
      case "bad":
        return { icon: "👎", label: "Schlecht" };
      case "ok":
      default:
        return { icon: "👌", label: "Okay" };
    }
  }

  if (btn && resultDiv && iconSpan) {
    btn.addEventListener("click", () => {
      // Show the result section
      resultDiv.style.display = "block";

      // Set icon according to result
      const result = getResultValue();
      const { icon, label } = getIcon(result);
      iconSpan.textContent = icon;
      iconSpan.setAttribute("aria-label", label);

      // Optionally clear or fill the content containers
      document.getElementById("result-fazit").textContent = "";
      document.getElementById("result-analyse").textContent = "";
      document.getElementById("result-empfehlung").textContent = "";
    });
  }
}
