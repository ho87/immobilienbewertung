import { initNumberFormatting } from "./numberFormatting.js";
import { initValidation } from "./validation.js";
import { initCalculations } from "./calculations.js";
import { initEventHandlers } from "./eventHandlers.js";
import { initTest } from "./TEST.js";
import { initReset } from "./reset.js";
import { initBewerten } from "./bewerten.js";
import { initProgressBar } from "./progressBar.js";

document.addEventListener("DOMContentLoaded", () => {
  initNumberFormatting();
  initValidation();
  initCalculations();
  initEventHandlers();
  initTest();
  initReset();
  initBewerten();
  initProgressBar();
});
