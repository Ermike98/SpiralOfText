function download_svg() {
    const svg = document.getElementById("spiralSVG");
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spiral_text.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function download_png() {
    const svgElement = document.getElementById("spiralSVG");
    const svgData = new XMLSerializer().serializeToString(svgElement);
    
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
  
    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = svgElement.viewBox.baseVal.width || svgElement.clientWidth;
        canvas.height = svgElement.viewBox.baseVal.height || svgElement.clientHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
    
        canvas.toBlob(function (blob) {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "spiral_text.png";
            a.click();
        });
    };
    img.src = url;
}

function refresh_graphics() {
    // Update parameters based on input field values
    text = document.getElementById("textInput").value;
    title = document.getElementById("titleInput").value;
    subtitle = document.getElementById("subtitleInput").value;
    textSpacing = parseFloat(document.getElementById("textSpacingInput").value);
    textScale = parseFloat(document.getElementById("textScaleInput").value);
    textSize = parseInt(document.getElementById("textSizeInput").value);
    titleSize = parseInt(document.getElementById("titleSizeInput").value);
    subtitleSize = parseInt(document.getElementById("subtitleSizeInput").value);
    idxStart = parseInt(document.getElementById("idxStartInput").value);
    theta0 = parseFloat(document.getElementById("theta0Input").value);
    ballSize = parseFloat(document.getElementById("ballSizeInput").value);
    lineHeight = parseFloat(document.getElementById("lineHeightInput").value);
    lineWidth = parseFloat(document.getElementById("lineWidthInput").value);
    lineThickness = parseInt(document.getElementById("lineThicknessInput").value);
    fontColor = document.getElementById("fontColorInput").value;
    bgColor = document.getElementById("bgColorInput").value;
    ballColor = document.getElementById("ballColorInput").value;
    lineColor = document.getElementById("lineColorInput").value;

    // Re-render the spiral
    render_spiral();

    // Save parameters
    saveParams();
}

// Save function (call this after user makes changes)
function saveParams() {
    params = {
        text: text,
        title: title,
        subtitle: subtitle,
        textSpacing: textSpacing,
        textScale: textScale,
        textSize: textSize,
        titleSize: titleSize,
        subtitleSize: subtitleSize,
        idxStart: idxStart,
        theta0: theta0,
        ballSize: ballSize,
        lineHeight: lineHeight,
        lineWidth: lineWidth,
        lineThickness: lineThickness,
        fontColor: fontColor,
        bgColor: bgColor,
        ballColor: ballColor,
        lineColor: lineColor,
        width: width,
        height: height,
        fontBase64: fontBase64,
    }
    localStorage.setItem("spiralOfTextParams", JSON.stringify(params));
    console.log("Parameters saved.");
}

// Load function
function loadParams() {
    const saved = localStorage.getItem("spiralOfTextParams");
    console.log("saved: ", saved)
    if (saved) {
        try {
            return { ...default_params, ...JSON.parse(saved) }; // Merge defaults with saved values
        } catch (e) {
            console.error("Failed to parse saved params. Using defaults.");
        }
    }
    return {...default_params};
}

// Optional: reset parameters and clear storage
function reset_params() {
    localStorage.removeItem("spiralOfTextParams");

    text = default_params.text;
    title = default_params.title;
    subtitle = default_params.subtitle;
    textSpacing = default_params.textSpacing;
    textScale = default_params.textScale;
    textSize = default_params.textSize;
    titleSize = default_params.titleSize;
    subtitleSize = default_params.subtitleSize;
    idxStart = default_params.idxStart;
    theta0 = default_params.theta0;
    ballSize = default_params.ballSize;
    lineHeight = default_params.lineHeight;
    lineWidth = default_params.lineWidth;
    lineThickness = default_params.lineThickness;
    fontColor = default_params.fontColor;
    bgColor = default_params.bgColor;
    ballColor = default_params.ballColor;
    lineColor = default_params.lineColor;
    width = default_params.width;
    height = default_params.height;
    fontBase64 = default_params.fontBase64;
}

function set_form_values() {
    document.getElementById("textInput").value = text;
    document.getElementById("titleInput").value = title;
    document.getElementById("subtitleInput").value = subtitle;
    document.getElementById("textSpacingInput").value = textSpacing;
    document.getElementById("textScaleInput").value = textScale;
    document.getElementById("textSizeInput").value = textSize;
    document.getElementById("titleSizeInput").value = titleSize;
    document.getElementById("subtitleSizeInput").value = subtitleSize;
    document.getElementById("idxStartInput").value = idxStart;
    document.getElementById("theta0Input").value = theta0;
    document.getElementById("ballSizeInput").value = ballSize;
    document.getElementById("lineWidthInput").value = lineWidth;
    document.getElementById("lineHeightInput").value = lineHeight;
    document.getElementById("lineThicknessInput").value = lineThickness;
    document.getElementById("fontColorInput").value = fontColor;
    document.getElementById("bgColorInput").value = bgColor;
    document.getElementById("ballColorInput").value = ballColor;
    document.getElementById("lineColorInput").value = lineColor;   
}

// Function to render the spiral graphic
function render_spiral() {
    const svg = document.getElementById('spiralSVG');

    let ball_cx = width/2;
    let ball_cy = width/2;

    let line_y = (1-lineHeight) * height
    let line_x1 = width * ((1-lineWidth)/2)
    let line_x2 = width * (1- (1-lineWidth)/2)

    let title_y = 0.875 * height
    let subtitle_y = 0.925 * height
    const font_family = fontBase64 ? 'CustomFont' : "Courier New";

    // Clear the existing SVG content
    svg.innerHTML = '';

    // Embed the font using a style tag in the SVG
    if (fontBase64) {
        const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
        style.textContent = `
            @font-face {
                font-family: 'CustomFont';
                src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
            }
            text {
                font-family: 'CustomFont';
            }
        `;
        svg.appendChild(style);
    }

    const nPoints = text.length;
    let theta = new Array(nPoints).fill(0);
    theta[0] = -theta0 * Math.PI / 180 + idxStart * 2 * Math.PI; // + idxStart * 2 * Math.PI;
    
    // Generate theta values for the spiral
    for (let i = 1; i < nPoints; i++) {
        let deltaTheta = textSpacing / Math.sqrt(1 + Math.pow(theta[i - 1], 2));
        theta[i] = theta[i - 1] + deltaTheta;
    }

    // Convert to polar coordinates and map to x, y for the spiral
    // let r = theta.map(t => t / Math.PI);
    let r = theta.map(t => t / theta[0]);
    let x = r.map((r_i, i) => r_i * Math.cos(theta[i]) * textScale * 10);
    let y = r.map((r_i, i) => r_i * Math.sin(theta[i]) * textScale * 10);

    const rMax = Math.max(...r) * 1.05;

    // Create the SVG background
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("x", 0);
    background.setAttribute("y", 0);
    background.setAttribute("width", width);
    background.setAttribute("height", height);
    background.setAttribute("fill", bgColor);
    svg.appendChild(background);

    // Draw the spiral text
    chars = text.split("")// .reverse()
    for (let i = 0; i < nPoints; i++) {
        const xPos = ball_cx + x[i]; //*ballSize/10;
        const yPos = ball_cy + y[i]; //*ballSize/10;
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute("x", xPos);
        textElement.setAttribute("y", yPos);
        textElement.setAttribute("fill", fontColor);
        textElement.setAttribute("font-size", textSize);
        textElement.setAttribute("font-family", font_family);
        textElement.setAttribute("text-anchor", "middle");
        // textElement.setAttribute("dominant-baseline", "central");
        textElement.setAttribute("transform", `rotate(${(theta[i] * 180 / Math.PI) + 90}, ${xPos}, ${yPos})`);
        textElement.textContent = chars[i];
        svg.appendChild(textElement);


        // Create the circle element
        // const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        // circleElement.setAttribute("cx", xPos);
        // circleElement.setAttribute("cy", yPos);
        // circleElement.setAttribute("r", 2);  // Radius of the circle (adjust this for size)
        // circleElement.setAttribute("fill", fontColor);  // Set the fill color of the dot
        // circleElement.setAttribute("stroke", "none");  // Optional: Set stroke if you need border color
        // svg.appendChild(circleElement);
    }

    // Add the title and subtitle
    let titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    titleText.setAttribute("x", width / 2);
    titleText.setAttribute("y", title_y);
    titleText.setAttribute("fill", fontColor);
    titleText.setAttribute("font-size", titleSize);
    titleText.setAttribute("font-family", font_family);
    titleText.setAttribute("text-anchor", "middle");
    titleText.textContent = title;
    svg.appendChild(titleText);

    if (subtitle) {
        let subtitleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        subtitleText.setAttribute("x", width / 2);
        subtitleText.setAttribute("y", subtitle_y);
        subtitleText.setAttribute("fill", fontColor);
        subtitleText.setAttribute("font-size", subtitleSize);
        subtitleText.setAttribute("font-family", font_family);
        subtitleText.setAttribute("text-anchor", "middle");
        subtitleText.textContent = subtitle;
        svg.appendChild(subtitleText);
    }

    // Add the ball in the center
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", ball_cx);
    circle.setAttribute("cy", ball_cy);
    circle.setAttribute("r", ballSize*10);
    circle.setAttribute("fill", ballColor);
    svg.appendChild(circle);

    // Add the line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", line_x1);
    line.setAttribute("x2", line_x2);
    line.setAttribute("y1", line_y);
    line.setAttribute("y2", line_y);
    line.setAttribute("stroke", lineColor);
    line.setAttribute("stroke-width", lineThickness);
    svg.appendChild(line);
}

// Default values
var text = "This is a spiral of text! This is a spiral of text! This is a spiral of text! This is a spiral of text! This is a spiral of text! This is a spiral of text!";
var title = "Spiral Text Example";
var subtitle = "A creative spiral graphic";

// Parameters for the spiral text
var textSpacing = 3.3;
var textScale = 18;
var textSize = 45;
var titleSize = 80;
var subtitleSize = 50;
var idxStart = 3;
var theta0 = 90;
var ballSize = 11;
var lineHeight = 0.215
var lineWidth = 0.7;
var lineThickness = 3;
var fontColor = "#23001E";
var bgColor = "#20A39E";
var ballColor = "#FFBA49";
var lineColor = "#EF5B5B";

var width = 1000;
var height = 1400

// Global variable to store the uploaded font URL
var fontBase64 = null;

// Default values
const default_params = {
    text: "This is a spiral of text! This is a spiral of text! This is a spiral of text! This is a spiral of text! This is a spiral of text! This is a spiral of text!",
    title: "Spiral Text Example",
    subtitle: "A creative spiral graphic",
    textSpacing: 3.3,
    textScale: 18,
    textSize: 45,
    titleSize: 80,
    subtitleSize: 50,
    idxStart: 3,
    theta0: 90,
    ballSize: 11,
    lineHeight: 0.215,
    lineWidth: 0.7,
    lineThickness: 3,
    fontColor: "#23001E",
    bgColor: "#20A39E",
    ballColor: "#FFBA49",
    lineColor: "#EF5B5B",
    width: 1000,
    height: 1400,
    fontBase64: null
};

document.addEventListener("DOMContentLoaded", function() {
    // Load parameters from localStorage or use defaults
    let params = loadParams();

    text = params.text;
    title = params.title;
    subtitle = params.subtitle;
    textSpacing = params.textSpacing;
    textScale = params.textScale;
    textSize = params.textSize;
    titleSize = params.titleSize;
    subtitleSize = params.subtitleSize;
    idxStart = params.idxStart;
    theta0 = params.theta0;
    ballSize = params.ballSize;
    lineHeight = params.lineHeight;
    lineWidth = params.lineWidth;
    lineThickness = params.lineThickness;
    fontColor = params.fontColor;
    bgColor = params.bgColor;
    ballColor = params.ballColor;
    lineColor = params.lineColor;
    width = params.width;
    height = params.height;
    fontBase64 = params.fontBase64;

    // Example usage: access like `params.text`, `params.textSize`, etc.
    console.log("Loaded parameters:", params);

    // Event listeners for input fields
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", refresh_graphics);
    });

    // Event listeners for input fields
    document.querySelectorAll("textarea").forEach(input => {
        input.addEventListener("input", refresh_graphics);
    });

    document.getElementById("fontUpload").addEventListener("change", function(event) {
        const file = event.target.files[0];
        console.log(file)
        // console.log(file.type)
        if (file) {
            const reader = new FileReader();
        
            reader.onload = function(e) {
                // Convert the font file to a Base64-encoded string
                fontBase64 = btoa(new Uint8Array(e.target.result).reduce(function (data, byte) {return data + String.fromCharCode(byte);}, ''));

                // Create a new @font-face rule dynamically with Base64 encoding
                const style = document.createElement('style');
                style.textContent = `
                    @font-face {
                        font-family: 'CustomFont';
                        src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
                        font-weight: normal;
                        font-style: normal;
                    }
                `;
                document.head.appendChild(style);

                // Re-render the spiral after the font is loaded
                render_spiral();
            };

            reader.readAsArrayBuffer(file);
        } else {
            alert("Please upload a valid TTF font file.");
        }
    });    

    set_form_values();

    // Initial render
    render_spiral();

    // Download the SVG
    const downloadSVGButton = document.getElementById('download-svg');
    downloadSVGButton.addEventListener("click", download_svg);
    
    // Download the PNG
    const downloadPNGButton = document.getElementById('download-png');
    downloadPNGButton.addEventListener("click", download_png);
    
    // Reset Parameters
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener("click", function() {
        reset_params();
        set_form_values();
        render_spiral();
    });
});

function auto_height(elem) {  /* javascript */
    elem.style.height = '1px';
    console.log("elem.scrollHeight:", elem.scrollHeight )
    elem.style.height = `${elem.scrollHeight}px`;
}
