from flask import Flask, render_template, request, jsonify, send_file
import qrcode
from PIL import Image
import io
import base64
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_qr():
    try:
        data = request.form.get('data')
        logo_file = request.files.get('logo')

        if not data:
            return jsonify({'error': 'No text or URL provided'}), 400

        # Create QR Code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H, # High error correction for logo
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)

        qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

        # Embed Logo if provided
        if logo_file:
            try:
                logo = Image.open(logo_file)
                
                # Calculate logo size (e.g., 20% of QR size)
                qr_width, qr_height = qr_img.size
                logo_size = int(min(qr_width, qr_height) * 0.25)
                
                # Resize logo with high quality
                logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
                
                # Calculate position to center the logo
                pos = ((qr_width - logo_size) // 2, (qr_height - logo_size) // 2)
                
                # Paste logo
                qr_img.paste(logo, pos)
                
            except Exception as e:
                print(f"Error processing logo: {e}")
                # Continue without logo if it fails, or return error? 
                # Let's return error to inform user.
                return jsonify({'error': 'Invalid logo file'}), 400

        # Save to buffer
        img_io = io.BytesIO()
        qr_img.save(img_io, 'PNG')
        img_io.seek(0)
        
        # Encode to base64 for display
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
        
        return jsonify({'image': f'data:image/png;base64,{img_base64}'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)