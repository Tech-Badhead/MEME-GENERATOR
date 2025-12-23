(function () {
  const canvas =
    document.getElementById(
      'memeCanvas'
    );
  const ctx = canvas.getContext('2d');
  const topIn =
    document.getElementById('topText');
  const botIn = document.getElementById(
    'bottomText'
  );
  const topY =
    document.getElementById('topY');
  const botY =
    document.getElementById('bottomY');
  const textSize =
    document.getElementById('textSize');
  const textColor =
    document.getElementById(
      'textColor'
    );
  const imageIn =
    document.getElementById(
      'imageUpload'
    );
  const downloadBtn =
    document.getElementById(
      'downloadBtn'
    );

  let bg = null;
  const CANVAS_SIZE = 800;

  /**
   * Core drawing function
   */
  function drawMeme() {
    // Clear background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(
      0,
      0,
      CANVAS_SIZE,
      CANVAS_SIZE
    );

    if (bg) {
      const ratio = Math.max(
        CANVAS_SIZE / bg.width,
        CANVAS_SIZE / bg.height
      );
      const w = bg.width * ratio;
      const h = bg.height * ratio;
      ctx.drawImage(
        bg,
        (CANVAS_SIZE - w) / 2,
        (CANVAS_SIZE - h) / 2,
        w,
        h
      );
    } else {
      ctx.fillStyle = '#334155';
      ctx.textAlign = 'center';
      ctx.font =
        'bold 20px Space Grotesk';
      ctx.fillText(
        'SELECT OR PASTE AN IMAGE',
        CANVAS_SIZE / 2,
        CANVAS_SIZE / 2
      );
    }

    // Text Styles setup
    const fontSize = parseInt(
      textSize.value
    );
    ctx.font = `900 ${fontSize}px Space Grotesk, sans-serif`;
    ctx.fillStyle = textColor.value;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize / 6;
    ctx.lineJoin = 'round';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tText =
      topIn.value.toUpperCase();
    const bText =
      botIn.value.toUpperCase();

    // Render Top Text based on slider Y
    if (tText) {
      const ty =
        (topY.value / 100) *
        CANVAS_SIZE;
      ctx.strokeText(
        tText,
        CANVAS_SIZE / 2,
        ty
      );
      ctx.fillText(
        tText,
        CANVAS_SIZE / 2,
        ty
      );
      document.getElementById(
        'topYVal'
      ).textContent = topY.value + '%';
    }

    // Render Bottom Text based on slider Y
    if (bText) {
      const by =
        (botY.value / 100) *
        CANVAS_SIZE;
      ctx.strokeText(
        bText,
        CANVAS_SIZE / 2,
        by
      );
      ctx.fillText(
        bText,
        CANVAS_SIZE / 2,
        by
      );
      document.getElementById(
        'botYVal'
      ).textContent = botY.value + '%';
    }
  }

  /**
   * Handles image file processing for both upload and paste
   */
  function handleFile(file) {
    if (
      !file ||
      !file.type.startsWith('image/')
    )
      return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        bg = img;
        drawMeme();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Clipboard Paste Event Listener
   */
  window.addEventListener(
    'paste',
    (e) => {
      const items = (
        e.clipboardData ||
        e.originalEvent.clipboardData
      ).items;
      for (let index in items) {
        const item = items[index];
        if (
          item.kind === 'file' &&
          item.type.startsWith('image/')
        ) {
          const blob = item.getAsFile();
          handleFile(blob);
          break;
        }
      }
    }
  );

  /**
   * Listeners for sliders and text inputs
   */
  [
    topIn,
    botIn,
    topY,
    botY,
    textSize,
    textColor,
  ].forEach((el) => {
    el.addEventListener(
      'input',
      drawMeme
    );
  });

  /**
   * File input listener
   */
  imageIn.addEventListener(
    'change',
    (e) => {
      handleFile(e.target.files[0]);
    }
  );

  /**
   * Download functionality
   */
  downloadBtn.addEventListener(
    'click',
    () => {
      const link =
        document.createElement('a');
      link.download = `vibe-meme-${Date.now()}.png`;
      link.href = canvas.toDataURL(
        'image/png'
      );
      link.click();
    }
  );

  // Fix: Re-implemented Reset logic
  resetBtn.addEventListener(
    'click',
    () => {
      bg = null;
      topIn.value = '';
      botIn.value = '';
      topY.value = 15;
      bottomY.value = 85;
      textSize.value = 60;
      textColor.value = '#ffffff';
      imageIn.value = ''; // Clear file input
      drawMeme();
    }
  );

  // Initial Draw
  drawMeme();
})();
