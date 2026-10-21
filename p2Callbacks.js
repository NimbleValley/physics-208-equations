
const p2Buttons = [
    {
        'name': "Magnetic force & RHR",
        'left': '241.5px',
        'top': '202px',
        'width': '245px',
        'height': '35px',
        'callback': () => {
            createP5JSModel("https://editor.p5js.org/NimbleValley/full/s_r_Z1E7L", "Magnetic Force & RHR");
        }
    }
]

async function getBody() {
    return new Promise((resolve, reject) => {
        const iframe = document.getElementsByTagName('iframe')[0];
        
        // If the iframe is already loaded, resolve immediately
        if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
            const body = iframe.contentDocument.children[0].querySelectorAll('#pf2')[0];
            resolve(body);
            return;
        }

        // Otherwise, wait for the load event
        iframe.addEventListener('load', () => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                const body = doc.children[0].querySelectorAll('#pf2')[0];
                if (body) {
                    resolve(body);
                } else {
                    reject(new Error('#pf2 element not found in iframe'));
                }
            } catch (error) {
                reject(error);
            }
        });
    });
}

async function setUpLinks() {
    try {
        const body = await getBody();
        body.addEventListener('click', (event) => {
            console.log('Body clicked at point');
            const rect = body.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            console.log(`Clicked at: (${x}, ${y})`);
            navigator.clipboard.writeText(`'left': '${x}px',
        'top': '${y}px',`);
        });
        console.log('Target element found:', body);

        p2Buttons.forEach(buttonInfo => {
            const button = createButton(buttonInfo.name, buttonInfo.callback);
            button.style.position = 'absolute';
            button.style.left = buttonInfo.left;
            button.style.top = buttonInfo.top;
            button.style.width = buttonInfo.width;
            button.style.height = buttonInfo.height;
            body.appendChild(button);
        });
        
    } catch (error) {
        console.error('Error retrieving external elements:', error);
    }
}

function createButton(name, callback) {
    const button = document.createElement('button');
    button.className = 'callback-button';
    if (SHOW_DEBUG_NAMES) {
        button.textContent = name;
        button.style.border = '2px solid rebeccaPurple';
    } else {
    }
    button.style.backgroundColor = 'transparent';
    button.addEventListener('click', callback);
    return button;
}

// Initialize
setUpLinks();

async function createP5JSModel(url, title) {
    try {
        const container = document.getElementById('p5js-container');
        container.style.display = 'flex';
        const element = document.getElementById('p5js-iframe');
        element.src = url;
        element.className = 'p5js-iframe';
        element.style.width = '800px';
        element.style.height = '800px';
        element.style.border = 'none';
        container.getElementsByTagName('h1')[0].innerText = title || 'Demo';
    } catch (error) {
        console.error('Error fetching or parsing the p5.js sketch:', error);
        alert('Failed to load the p5.js sketch. Please check the console for details.');
    }
}