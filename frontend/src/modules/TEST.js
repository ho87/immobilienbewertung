export function initTest() {
  // Get the test button element
  const testButton = document.querySelector('.btn-warning');
  
  // Add click event listener to test button
  if (testButton) {
    testButton.addEventListener('click', handleTestButtonClick);
  }
}

/**
 * Handle test button click by filling form fields with test data
 * @param {Event} e - Click event
 */
function handleTestButtonClick(e) {
  e.preventDefault(); // Prevent form submission
  
  console.log('Test button clicked - filling form with test data');
  
  // Fill URL field
  const urlField = document.getElementById('input-listingUrl');
  if (urlField) {
    urlField.value = 'https://www.immobilienscout24.de/expose/155676535?NavigationBarType=SHORTLIST&referrer=SHORTLIST#/';
  }
  
  // Set building type dropdown to apartment
  const buildingTypeDropdown = document.getElementById('dropdown-buildingType');
  if (buildingTypeDropdown) {
    buildingTypeDropdown.value = 'apartment';
  }
  
  // Set agent type dropdown to privat
  const agentTypeDropdown = document.getElementById('dropdown-agentType');
  if (agentTypeDropdown) {
    agentTypeDropdown.value = 'privat';
  }
  
  // Additional fields as requested
  
  // Building Size
  const buildingSizeField = document.getElementById('input-buildingSize');
  if (buildingSizeField) {
    buildingSizeField.value = '85';
  }
  
  // Rooms dropdown
  const roomsDropdown = document.getElementById('dropdown-rooms');
  if (roomsDropdown) {
    roomsDropdown.value = '3';
  }
  
  // Purchase Price
  const purchasePriceField = document.getElementById('input-purchasePrice');
  if (purchasePriceField) {
    purchasePriceField.value = '390000';
  }
  
  // Rent per m²
  const rentPerM2Field = document.getElementById('input-rentPerM2');
  if (rentPerM2Field) {
    rentPerM2Field.value = '12.50';
  }
  
  // HOA fees
  const hoaField = document.getElementById('input-hoa');
  if (hoaField) {
    hoaField.value = '200';
  }
  
  // Location dropdown
  const locationDropdown = document.getElementById('dropdown-location');
  if (locationDropdown) {
    locationDropdown.value = 'medium';
  }
  
  // Interest rate
  const interestField = document.getElementById('input-interest');
  if (interestField) {
    interestField.value = '3.5';
  }
  
  // Depreciation Rate
  const depreciationRateField = document.getElementById('input-depreciationRate');
  if (depreciationRateField) {
    depreciationRateField.value = '2.0';
  }
  
  // Equity
  const equityField = document.getElementById('input-equity');
  if (equityField) {
    equityField.value = '100000';
  }
  
  // Year Built dropdown
  const yearBuiltDropdown = document.getElementById('dropdown-yearBuilt');
  if (yearBuiltDropdown) {
    yearBuiltDropdown.value = '1970-1999';
  }
  
  // Energy Class dropdown
  const energyClassDropdown = document.getElementById('dropdown-energyClass');
  if (energyClassDropdown) {
    energyClassDropdown.value = 'd';
  }
  
  // Condition dropdown
  const conditionDropdown = document.getElementById('dropdown-condition');
  if (conditionDropdown) {
    conditionDropdown.value = 'good';
  }
  
  // Trigger change events for all dropdowns to update any dependent fields
  const dropdowns = [
    buildingTypeDropdown,
    agentTypeDropdown,
    roomsDropdown,
    locationDropdown,
    yearBuiltDropdown,
    energyClassDropdown,
    conditionDropdown
  ];
  
  dropdowns.forEach(dropdown => {
    if (dropdown) {
      dropdown.dispatchEvent(new Event('change'));
    }
  });
  
  console.log('Test data filled successfully');
}