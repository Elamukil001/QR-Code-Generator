document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('qrForm');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    
    const qrPlaceholder = document.getElementById('qrPlaceholder');
    const qrImage = document.getElementById('qrImage');
    const actionButtons = document.getElementById('actionButtons');
    const downloadBtn = document.getElementById('downloadBtn');
    
    const logoInput = document.getElementById('logoInput');
    const fileNameDisplay = document.getElementById('fileName');
    const fileUploadWrapper = document.querySelector('.file-upload-wrapper');

    // Handle file input change to show filename
    fileUploadWrapper.addEventListener('click', () => logoInput.click());
    
    logoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
            fileNameDisplay.style.color = 'var(--text-color)';
        } else {
            fileNameDisplay.textContent = 'Choose a PNG or JPG file';
            fileNameDisplay.style.color = 'var(--text-muted)';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        setLoading(true);

        const formData = new FormData(form);

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to generate QR code');
            }

            const data = await response.json();
            
            // Display QR Code
            displayQR(data.image);

        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    });

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = qrImage.src;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    function setLoading(isLoading) {
        generateBtn.disabled = isLoading;
        if (isLoading) {
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
            generateBtn.style.opacity = '0.8';
        } else {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            generateBtn.style.opacity = '1';
        }
    }

    function displayQR(base64Image) {
        // Hide placeholder
        qrPlaceholder.classList.add('hidden');
        
        // Show image
        qrImage.src = base64Image;
        qrImage.classList.remove('hidden');
        
        // Show actions
        actionButtons.classList.remove('hidden');
    }
});
