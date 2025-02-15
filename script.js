document.addEventListener("DOMContentLoaded", function() {
    const svg = document.getElementById('spiralSVG');
    const downloadButton = document.getElementById('download');
    
    // Default values
    let text = "This is a spiral of text! This is a spiral of text! This is a spiral of text! This is a spiral of text! This is a spiral of text! This is a spiral of text!";
    let title = "Spiral Text Example";
    let subtitle = "A creative spiral graphic";
    
    // Parameters for the spiral text
    let textSpacing = 3.3;
    let textScale = 9;
    let textSize = 22;
    let titleSize = 40;
    let subtitleSize = 25;
    let idxStart = 3;
    let theta0 = 90;
    let ballSize = 5.5;
    let lineHeight = 0.215
    let lineWidth = 0.7;
    let lineThickness = 2;
    let fontColor = "#23001E";
    let bgColor = "#20A39E";
    let ballColor = "#FFBA49";
    let lineColor = "#EF5B5B";
    // let font_family = document.getElementById("fontUpload").files.length > 0 ? 'CustomFont' : "Arial";

    let width = 500;
    let height = 700

    // Global variable to store the uploaded font URL
    let fontBase64 = null;

    // Function to render the spiral graphic
    function renderSpiral() {

        let ball_cx = width/2;
        let ball_cy = width/2;
    
        let line_y = (1-lineHeight) * height
        let line_x1 = width * ((1-lineWidth)/2)
        let line_x2 = width * (1- (1-lineWidth)/2)

        let title_y = height - 90
        let subtitle_y = height - 50
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
        background.setAttribute("width", "100%");
        background.setAttribute("height", "100%");
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
        titleText.setAttribute("x", "50%");
        titleText.setAttribute("y", title_y);
        titleText.setAttribute("fill", fontColor);
        titleText.setAttribute("font-size", titleSize);
        titleText.setAttribute("font-family", font_family);
        titleText.setAttribute("text-anchor", "middle");
        titleText.textContent = title;
        svg.appendChild(titleText);

        if (subtitle) {
            let subtitleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            subtitleText.setAttribute("x", "50%");
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

    // Event listeners for input fields
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", function() {
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
            renderSpiral();
        });
    });

    // Event listeners for input fields
    document.querySelectorAll("textarea").forEach(input => {
        input.addEventListener("input", function() {
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
            renderSpiral();
        });
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
                renderSpiral();
            };

            reader.readAsArrayBuffer(file);
        } else {
            alert("Please upload a valid TTF font file.");
        }
    });    

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

    // Initial render
    renderSpiral();

    // Download the SVG
    downloadButton.addEventListener("click", function() {
        // const svgData = new XMLSerializer().serializeToString(svg);
        // const blob = new Blob([svgData], { type: "image/svg+xml" });
        // const link = document.createElement('a');
        // link.href = URL.createObjectURL(blob);
        // link.download = "spiral-text.svg";
        // link.click();

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
    });
});

function auto_height(elem) {  /* javascript */
    elem.style.height = '1px';
    console.log("elem.scrollHeight:", elem.scrollHeight )
    elem.style.height = `${elem.scrollHeight}px`;
}
