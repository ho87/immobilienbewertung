# 🏘️ Immobilienbewertung – German Real Estate Evaluation Tool

This project is a **prototype web app** that helps buyers and small-scale investors in Germany evaluate residential real estate listings. The tool is built with simple HTML, CSS, and JavaScript (no backend required). It is aimed at making property investment decisions easier and more transparent by providing relevant financial metrics and a friendly user interface—all in German.

## Features

- **User-friendly web form** for entering key property details
- **Investment metric calculations** (effective purchase price, yield, annual rent, price per square meter, and more)
- **Monthly loan payment calculator** based on user financing details
- **Simple financial summary** with a concise interpretation (in German)
- **Logical grouping of input/output fields** for clarity
- **All labels and UI text in German** (but code comments and documentation in English)
- **Ready for expansion:** easily add more logic, design, or backend as needed

## Demo

![Screenshot of the app](./screenshot.png)  
*Example UI (Prototype)*

## Getting Started

1. **Clone this repository:**
    ```sh
    git clone https://github.com/your-username/immobilienbewertung.git
    ```
2. **Open `index.html` in your browser:**  
   No build or server needed – just open the file directly.

## File Structure

- `index.html` – Main HTML file with all UI and (initially) calculation logic
- *(To be added)* `app.js` – JavaScript for calculation logic (future)
- *(To be added)* `global.css` – CSS for layout and design (future)
- `README.md` – Project documentation

## How it works

- Enter property listing details, prices, rental income, and financing assumptions in German
- The app calculates important metrics such as:
  - **Price per square meter**
  - **Net annual rent**
  - **Effective purchase price** (including taxes, notary, agent fee)
  - **Monthly loan payment**
  - **Equity ratio**
  - **Investment summary** (profitable / borderline / not recommended)
- All outputs are explained and shown in a summary box

## Why use this tool?

- **For buyers:** Quickly see if a listing is reasonably priced for your needs
- **For investors:** Estimate if the property can deliver attractive returns
- **For anyone:** Make more informed property decisions in the German real estate market

## Roadmap

- Move all calculation logic to `app.js`
- Improve error handling and validation
- Add mobile-friendly and responsive CSS (`global.css`)
- Support for additional property types and financial scenarios
- Save or export evaluations
- (Optional) Add a backend or connect to real listing APIs

## Contributing

Contributions are welcome!  
Open an issue or submit a pull request to suggest changes or improvements.

## License

This project is licensed under the MIT License.




