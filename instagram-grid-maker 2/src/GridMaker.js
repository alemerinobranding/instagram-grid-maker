import React from 'react';
import JSZip from 'jszip';

export default function GridMaker() {

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const zip = new JSZip();
            const overlap = 150;
            const sliceWidth = 1080;
            const sliceHeight = 1350;
            let index = 1;

            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    canvas.width = sliceWidth;
                    canvas.height = sliceHeight;

                    const sx = col * (sliceWidth - overlap);
                    const sy = row * (sliceHeight - overlap);

                    ctx.clearRect(0, 0, sliceWidth, sliceHeight);
                    ctx.drawImage(img, sx, sy, sliceWidth, sliceHeight, 0, 0, sliceWidth, sliceHeight);

                    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
                    zip.file(`Grid-${index.toString().padStart(2, '0')}.jpg`, blob);
                    index++;
                }
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'Instagram-Grid.zip';
            link.click();
        };
    };

    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'sans-serif', padding:'20px', textAlign:'center'}}>
            <h1>✨ Instagram Grid Maker ✨</h1>
            <p>Upload your 3045x4050 image, and this tool will generate 9 overlapping 1080x1350 images ready for your Instagram grid.</p>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{marginTop:'20px'}} />
        </div>
    );
}
