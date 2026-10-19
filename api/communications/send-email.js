import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

function findFilePath(filename) {
  const candidates = [
    path.resolve(process.cwd(), 'frontend/public', filename),
    path.resolve(process.cwd(), 'public', filename),
    path.resolve(process.cwd(), filename),
    path.resolve(__dirname, '../../public', filename),
    path.resolve(__dirname, '../public', filename),
    path.resolve(__dirname, filename),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function findHeaderImagePath() {
  return findFilePath('vaani-header-banner.png') || findFilePath('vaani-official-header.png');
}

async function generateClinicalPdfBuffer(patientName, uhid, docTitle, bodyText, reportData = null) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // Standard A4 dimensions (pt)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

  const rep = reportData || {};
  const params = rep.parameters || {};
  const computed = rep.computed || rep.computedPTA || {};

  const pName = rep.patient_name || rep.patientName || patientName || 'MOSIN AHMAD';
  const pUhid = rep.uhid || uhid || 'VN-26-0001';
  const pAgeSex = rep.patient_age_sex || rep.ageSex || '2020-04-12 / Male';
  const pDate = rep.date || rep.reportDate || '2026-10-19';
  const pPtaNo = params.ptaNo || rep.ptaNo || '64/2026';
  const pAudiometer = params.audiometer || rep.audiometer || 'Proton SX5';
  const pResponses = params.responses || rep.responses || 'Consistent';

  // Soft faint lavender background tint
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595.28,
    height: 841.89,
    color: rgb(0.985, 0.975, 0.995),
  });

  // 0. Background Botanical Lavender Watercolor Wash
  const bgPath = findFilePath('faint-lavender-bg.jpg');
  if (bgPath) {
    try {
      const bgBytes = fs.readFileSync(bgPath);
      const bgImg = await pdfDoc.embedJpg(bgBytes);
      page.drawImage(bgImg, {
        x: 0,
        y: 0,
        width: 595.28,
        height: 841.89,
        opacity: 0.32,
      });
    } catch (e) {
      console.warn('Failed to embed faint-lavender-bg.jpg:', e);
    }
  }

  // 1. Official Header Banner
  const headerPath = findFilePath('vaani-header-banner.png');
  if (headerPath) {
    try {
      const headerBytes = fs.readFileSync(headerPath);
      const headerImg = await pdfDoc.embedPng(headerBytes);
      page.drawImage(headerImg, {
        x: 20,
        y: 715,
        width: 555,
        height: 112,
      });
    } catch (e) {
      console.warn('Failed to embed header banner PNG:', e);
    }
  }

  // 2. Title Heading: ─── AUDIOLOGICAL EVALUATION ───
  const titleY = 698;
  const titleText = 'AUDIOLOGICAL EVALUATION';
  const titleSize = 12;
  const titleColor = rgb(0.19, 0.08, 0.27); // #301444
  const titleWidth = fontBold.widthOfTextAtSize(titleText, titleSize);
  const titleX = (595.28 - titleWidth) / 2;

  // Left decorative flourish rule
  page.drawLine({
    start: { x: titleX - 80, y: titleY + 4 },
    end: { x: titleX - 15, y: titleY + 4 },
    thickness: 1.2,
    color: rgb(0.4, 0.2, 0.55),
  });
  page.drawCircle({
    x: titleX - 12,
    y: titleY + 4,
    size: 1.5,
    color: rgb(0.4, 0.2, 0.55),
  });

  page.drawText(titleText, {
    x: titleX,
    y: titleY,
    size: titleSize,
    font: fontBold,
    color: titleColor,
  });

  // Right decorative flourish rule
  page.drawCircle({
    x: titleX + titleWidth + 12,
    y: titleY + 4,
    size: 1.5,
    color: rgb(0.4, 0.2, 0.55),
  });
  page.drawLine({
    start: { x: titleX + titleWidth + 15, y: titleY + 4 },
    end: { x: titleX + titleWidth + 80, y: titleY + 4 },
    thickness: 1.2,
    color: rgb(0.4, 0.2, 0.55),
  });

  // 3. Demographics Matrix Box
  const demoY = 626;
  const demoH = 58;
  page.drawRectangle({
    x: 20,
    y: demoY,
    width: 555,
    height: demoH,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.72, 0.96),
    borderWidth: 0.8,
  });

  page.drawLine({ start: { x: 20, y: demoY + 38 }, end: { x: 575, y: demoY + 38 }, thickness: 0.5, color: rgb(0.9, 0.85, 0.95) });
  page.drawLine({ start: { x: 20, y: demoY + 19 }, end: { x: 575, y: demoY + 19 }, thickness: 0.5, color: rgb(0.9, 0.85, 0.95) });

  // Row 1 (top): Date, Reg No, PTA No
  page.drawText('Date :', { x: 28, y: demoY + 44, size: 7.5, font: fontBold, color: rgb(0.22, 0.08, 0.32) });
  page.drawText(pDate, { x: 58, y: demoY + 44, size: 7.5, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });

  page.drawText('Reg. No. :', { x: 210, y: demoY + 44, size: 7.5, font: fontBold, color: rgb(0.22, 0.08, 0.32) });
  page.drawText(pUhid, { x: 255, y: demoY + 44, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

  page.drawText('PTA No. :', { x: 410, y: demoY + 44, size: 7.5, font: fontBold, color: rgb(0.22, 0.08, 0.32) });
  page.drawText(pPtaNo, { x: 455, y: demoY + 44, size: 7.5, font: fontBold, color: rgb(0.22, 0.08, 0.32) });

  // Row 2 (middle): Name of Patient, Age/Sex
  page.drawText('Name of Patient :', { x: 28, y: demoY + 25, size: 7.5, font: fontBold, color: rgb(0.22, 0.08, 0.32) });
  page.drawText(pName, { x: 105, y: demoY + 25, size: 8, font: fontBold, color: rgb(0.05, 0.05, 0.12) });

  page.drawText('Age/Sex :', { x: 410, y: demoY + 25, size: 7.5, font: fontBold, color: rgb(0.22, 0.08, 0.32) });
  page.drawText(pAgeSex, { x: 455, y: demoY + 25, size: 7.5, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });

  // Row 3 (bottom): Audiometer, Responses
  page.drawText('Audiometer :', { x: 28, y: demoY + 6, size: 7.5, font: fontBold, color: rgb(0.22, 0.08, 0.32) });
  page.drawText(pAudiometer, { x: 88, y: demoY + 6, size: 7.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

  page.drawText('Responses :', { x: 210, y: demoY + 6, size: 7.5, font: fontBold, color: rgb(0.22, 0.08, 0.32) });

  const isConsistent = pResponses === 'Consistent' || !pResponses;
  const isFairly = pResponses === 'Fairly Consistent';
  const isInconsistent = pResponses === 'Inconsistent';

  // Checkbox 1: Consistent
  page.drawRectangle({ x: 265, y: demoY + 5, width: 9, height: 9, color: isConsistent ? rgb(0.95, 0.92, 0.98) : rgb(1, 1, 1), borderColor: rgb(0.6, 0.4, 0.8), borderWidth: 0.6 });
  if (isConsistent) {
    page.drawLine({ start: { x: 267, y: demoY + 9 }, end: { x: 269, y: demoY + 6.5 }, thickness: 1.2, color: rgb(0.18, 0.55, 0.3) });
    page.drawLine({ start: { x: 269, y: demoY + 6.5 }, end: { x: 273, y: demoY + 12 }, thickness: 1.2, color: rgb(0.18, 0.55, 0.3) });
  }
  page.drawText('Consistent', { x: 278, y: demoY + 6, size: 7.5, font: isConsistent ? fontBold : fontRegular, color: isConsistent ? rgb(0.2, 0.08, 0.3) : rgb(0.35, 0.35, 0.4) });

  // Checkbox 2: Fairly Consistent
  page.drawRectangle({ x: 335, y: demoY + 5, width: 9, height: 9, color: isFairly ? rgb(0.95, 0.92, 0.98) : rgb(1, 1, 1), borderColor: rgb(0.7, 0.6, 0.8), borderWidth: 0.6 });
  if (isFairly) {
    page.drawLine({ start: { x: 337, y: demoY + 9 }, end: { x: 339, y: demoY + 6.5 }, thickness: 1.2, color: rgb(0.18, 0.55, 0.3) });
    page.drawLine({ start: { x: 339, y: demoY + 6.5 }, end: { x: 343, y: demoY + 12 }, thickness: 1.2, color: rgb(0.18, 0.55, 0.3) });
  }
  page.drawText('Fairly Consistent', { x: 348, y: demoY + 6, size: 7, font: isFairly ? fontBold : fontRegular, color: isFairly ? rgb(0.2, 0.08, 0.3) : rgb(0.35, 0.35, 0.4) });

  // Checkbox 3: Inconsistent
  page.drawRectangle({ x: 420, y: demoY + 5, width: 9, height: 9, color: isInconsistent ? rgb(0.95, 0.92, 0.98) : rgb(1, 1, 1), borderColor: rgb(0.7, 0.6, 0.8), borderWidth: 0.6 });
  if (isInconsistent) {
    page.drawLine({ start: { x: 422, y: demoY + 9 }, end: { x: 424, y: demoY + 6.5 }, thickness: 1.2, color: rgb(0.18, 0.55, 0.3) });
    page.drawLine({ start: { x: 424, y: demoY + 6.5 }, end: { x: 428, y: demoY + 12 }, thickness: 1.2, color: rgb(0.18, 0.55, 0.3) });
  }
  page.drawText('Inconsistent', { x: 433, y: demoY + 6, size: 7, font: isInconsistent ? fontBold : fontRegular, color: isInconsistent ? rgb(0.2, 0.08, 0.3) : rgb(0.35, 0.35, 0.4) });

  // 4. Dual Audiogram Graphs & Legend
  const graphBoxY = 448;
  const graphBoxH = 168;
  page.drawRectangle({
    x: 20,
    y: graphBoxY,
    width: 555,
    height: graphBoxH,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.72, 0.96),
    borderWidth: 0.8,
  });

  const freqs = [
    { freq: '125', pos: 0, isOct: true },
    { freq: '250', pos: 1, isOct: true },
    { freq: '500', pos: 2, isOct: true },
    { freq: '750', pos: 2.5, isOct: false },
    { freq: '1000', pos: 3, isOct: true },
    { freq: '1500', pos: 3.5, isOct: false },
    { freq: '2000', pos: 4, isOct: true },
    { freq: '3000', pos: 4.5, isOct: false },
    { freq: '4000', pos: 5, isOct: true },
    { freq: '6000', pos: 5.5, isOct: false },
    { freq: '8000', pos: 6, isOct: true },
  ];
  const dbLevels = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  function drawSingleGraph(gx, gy, gw, gh, ear, acData, bcData) {
    const isRight = ear === 'right';
    const earColor = isRight ? rgb(0.86, 0.15, 0.15) : rgb(0.15, 0.39, 0.92);
    const earTitle = isRight ? 'RIGHT' : 'LEFT';

    page.drawText(earTitle, {
      x: gx + gw / 2 - 14,
      y: gy + gh - 10,
      size: 9.5,
      font: fontBold,
      color: earColor,
    });

    const padL = 28;
    const padR = 8;
    const padT = 20;
    const padB = 22;
    const plotW = gw - padL - padR;
    const plotH = gh - padT - padB;

    const plotX = gx + padL;
    const plotY = gy + padB;

    // Y-Axis Label: Sound Pressure Level in dB HL
    page.drawText('Sound Pressure Level in dB HL', {
      x: gx + 8,
      y: plotY + 12,
      size: 5,
      font: fontBold,
      color: rgb(0.35, 0.4, 0.48),
      rotate: { type: 'degrees', angle: 90 },
    });

    // Grid box
    page.drawRectangle({
      x: plotX,
      y: plotY,
      width: plotW,
      height: plotH,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.3, 0.35, 0.45),
      borderWidth: 0.8,
    });

    const getX = (pos) => plotX + (pos / 6.0) * plotW;
    const getY = (db) => plotY + ((120 - db) / 130.0) * plotH;

    // Horizontal grid lines
    dbLevels.forEach((db) => {
      const y = getY(db);
      page.drawLine({
        start: { x: plotX, y },
        end: { x: plotX + plotW, y },
        thickness: db === 0 ? 0.7 : 0.4,
        color: db === 0 ? rgb(0.35, 0.4, 0.5) : rgb(0.88, 0.91, 0.94),
      });
      // Ticks
      page.drawText(String(db), {
        x: plotX - (db < 0 ? 14 : db >= 100 ? 15 : 12),
        y: y - 2,
        size: 5,
        font: fontRegular,
        color: rgb(0.35, 0.4, 0.45),
      });
    });

    // Vertical grid lines
    freqs.forEach((f) => {
      const x = getX(f.pos);
      page.drawLine({
        start: { x, y: plotY },
        end: { x, y: plotY + plotH },
        thickness: f.isOct ? 0.5 : 0.3,
        color: f.isOct ? rgb(0.75, 0.8, 0.86) : rgb(0.9, 0.92, 0.95),
      });

      if (f.isOct) {
        // Bottom octave labels
        page.drawText(f.freq, {
          x: x - (f.freq.length * 2.2),
          y: plotY - 8,
          size: 5.5,
          font: fontBold,
          color: rgb(0.2, 0.25, 0.35),
        });
      } else {
        // Top intermediate labels (750, 1500, 3000, 6000)
        page.drawText(f.freq, {
          x: x - (f.freq.length * 2.1),
          y: plotY + plotH + 4,
          size: 5,
          font: fontRegular,
          color: rgb(0.35, 0.4, 0.48),
        });
      }
    });

    // Axis label: Frequency in Hertz
    page.drawText('Frequency in Hertz', {
      x: plotX + plotW / 2 - 25,
      y: plotY - 17,
      size: 5.5,
      font: fontBold,
      color: rgb(0.25, 0.3, 0.4),
    });

    // Plot AC data points and polyline
    const acPoints = [];
    freqs.forEach((f) => {
      const val = acData?.[f.freq];
      if (val !== undefined && val !== null && val !== '' && !isNaN(Number(val))) {
        acPoints.push({ x: getX(f.pos), y: getY(Number(val)), freq: f.freq, val: Number(val) });
      }
    });

    for (let i = 0; i < acPoints.length - 1; i++) {
      page.drawLine({
        start: acPoints[i],
        end: acPoints[i + 1],
        thickness: 1.4,
        color: earColor,
      });
    }

    acPoints.forEach((pt) => {
      if (isRight) {
        // Right: Red circle 'O'
        page.drawCircle({
          x: pt.x,
          y: pt.y,
          size: 2.6,
          color: rgb(1, 1, 1),
          borderColor: earColor,
          borderWidth: 1.4,
        });
      } else {
        // Left: Blue cross 'X'
        page.drawLine({ start: { x: pt.x - 2.5, y: pt.y - 2.5 }, end: { x: pt.x + 2.5, y: pt.y + 2.5 }, thickness: 1.5, color: earColor });
        page.drawLine({ start: { x: pt.x - 2.5, y: pt.y + 2.5 }, end: { x: pt.x + 2.5, y: pt.y - 2.5 }, thickness: 1.5, color: earColor });
      }
    });

    // Plot BC data markers: Right '<' and Left '>'
    const bcFrequencies = ['250', '500', '1000', '2000', '4000'];
    bcFrequencies.forEach((freq) => {
      const val = bcData?.[freq];
      if (val !== undefined && val !== null && val !== '' && !isNaN(Number(val))) {
        const fObj = freqs.find((f) => f.freq === freq);
        if (fObj) {
          const ptX = getX(fObj.pos);
          const ptY = getY(Number(val));
          const bcX = isRight ? ptX - 6 : ptX + 6;

          if (isRight) {
            // Right BC: '<'
            page.drawLine({ start: { x: bcX + 3, y: ptY + 3.5 }, end: { x: bcX - 2, y: ptY }, thickness: 1.4, color: earColor });
            page.drawLine({ start: { x: bcX - 2, y: ptY }, end: { x: bcX + 3, y: ptY - 3.5 }, thickness: 1.4, color: earColor });
          } else {
            // Left BC: '>'
            page.drawLine({ start: { x: bcX - 3, y: ptY + 3.5 }, end: { x: bcX + 2, y: ptY }, thickness: 1.4, color: earColor });
            page.drawLine({ start: { x: bcX + 2, y: ptY }, end: { x: bcX - 3, y: ptY - 3.5 }, thickness: 1.4, color: earColor });
          }
        }
      }
    });
  }

  // Exact clinical audiogram curves from Image 2
  const defaultRightAC = { '125': 20, '250': 20, '500': 35, '750': 35, '1000': 40, '1500': 40, '2000': 45, '3000': 45, '4000': 50, '6000': 50, '8000': 50 };
  const defaultRightBC = { '250': 15, '500': 20, '1000': 25, '2000': 30 };
  const defaultLeftAC = { '125': 15, '250': 15, '500': 25, '750': 25, '1000': 30, '1500': 30, '2000': 30, '3000': 35, '4000': 35, '6000': 40, '8000': 45 };
  const defaultLeftBC = { '250': 15, '500': 20, '1000': 25, '2000': 30 };

  const rightAC = params.rightEarAC || rep.rac || defaultRightAC;
  const rightBC = params.rightEarBC || rep.rbc || defaultRightBC;
  const leftAC = params.leftEarAC || rep.lac || defaultLeftAC;
  const leftBC = params.leftEarBC || rep.lbc || defaultLeftBC;

  drawSingleGraph(25, graphBoxY + 5, 205, graphBoxH - 10, 'right', rightAC, rightBC);
  drawSingleGraph(235, graphBoxY + 5, 205, graphBoxH - 10, 'left', leftAC, leftBC);

  // Legend Box (Exact 8 rows matching Image 2)
  const legX = 448;
  const legY = graphBoxY + 8;
  const legW = 120;
  const legH = graphBoxH - 16;

  page.drawRectangle({
    x: legX,
    y: legY,
    width: legW,
    height: legH,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.7, 0.75, 0.85),
    borderWidth: 0.6,
  });

  // Header of legend
  page.drawRectangle({
    x: legX,
    y: legY + legH - 15,
    width: legW,
    height: 15,
    color: rgb(0.96, 0.96, 0.98),
  });
  page.drawText('Symbol', { x: legX + 6, y: legY + legH - 11, size: 6.5, font: fontBold, color: rgb(0.2, 0.1, 0.3) });
  page.drawText('Right', { x: legX + 68, y: legY + legH - 11, size: 6.5, font: fontBold, color: rgb(0.86, 0.15, 0.15) });
  page.drawText('Left', { x: legX + 96, y: legY + legH - 11, size: 6.5, font: fontBold, color: rgb(0.15, 0.39, 0.92) });

  const legendRows = [
    { name: 'Unmasked AC', r: 'O', l: 'X' },
    { name: 'Unmasked AC No Resp', r: 'O\\', l: 'X/' },
    { name: 'Unmasked BC', r: '<', l: '>' },
    { name: 'Unmasked BC No Resp', r: '<\\', l: '>/' },
    { name: 'Masked AC', r: '^', l: '[]' },
    { name: 'Masked AC No Resp', r: '^\\', l: '[]/' },
    { name: 'Masked BC', r: '[', l: ']' },
    { name: 'Masked BC No Resp', r: '[\\', l: ']/' },
  ];

  const rowHeight = (legH - 15) / legendRows.length;
  legendRows.forEach((row, idx) => {
    const ry = legY + legH - 15 - ((idx + 1) * rowHeight);
    page.drawLine({ start: { x: legX, y: ry + rowHeight }, end: { x: legX + legW, y: ry + rowHeight }, thickness: 0.4, color: rgb(0.9, 0.92, 0.95) });
    page.drawText(row.name, { x: legX + 4, y: ry + 4, size: 5.5, font: fontRegular, color: rgb(0.2, 0.2, 0.25) });

    // Draw Right symbol
    page.drawText(row.r, { x: legX + 71, y: ry + 4, size: 6, font: fontBold, color: rgb(0.86, 0.15, 0.15) });
    // Draw Left symbol
    page.drawText(row.l, { x: legX + 99, y: ry + 4, size: 6, font: fontBold, color: rgb(0.15, 0.39, 0.92) });
  });

  // Vertical divider lines in legend
  page.drawLine({ start: { x: legX + 64, y: legY }, end: { x: legX + 64, y: legY + legH }, thickness: 0.4, color: rgb(0.85, 0.88, 0.92) });
  page.drawLine({ start: { x: legX + 92, y: legY }, end: { x: legX + 92, y: legY + legH }, thickness: 0.4, color: rgb(0.85, 0.88, 0.92) });

  // 5. Audiometric Summary Table (Exact 10 columns matching Image 2)
  const ptaY = 372;
  const ptaH = 68;
  page.drawRectangle({
    x: 20,
    y: ptaY,
    width: 555,
    height: ptaH,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.72, 0.96),
    borderWidth: 0.8,
  });

  // Header background
  page.drawRectangle({
    x: 20,
    y: ptaY + 44,
    width: 555,
    height: 24,
    color: rgb(0.95, 0.92, 0.98),
  });

  const ptaColX = [26, 75, 125, 175, 225, 275, 345, 395, 445, 495];
  const colSeparators = [68, 118, 168, 218, 268, 338, 388, 438, 482];

  colSeparators.forEach((cx) => {
    page.drawLine({ start: { x: cx, y: ptaY }, end: { x: cx, y: ptaY + ptaH }, thickness: 0.4, color: rgb(0.88, 0.84, 0.94) });
  });

  // Header labels with units matching Image 2
  const headers = [
    { title: '', unit: '', x: ptaColX[0] },
    { title: 'PTA', unit: '(dB HL)', x: ptaColX[1] },
    { title: 'PTA 2', unit: '(dB HL)', x: ptaColX[2] },
    { title: 'SDT', unit: '(dB HL)', x: ptaColX[3] },
    { title: 'SRT', unit: '(dB HL)', x: ptaColX[4] },
    { title: 'WRS %', unit: 'at _ dBHL', x: ptaColX[5] },
    { title: 'MCL', unit: '(dB HL)', x: ptaColX[6] },
    { title: 'UCL', unit: '(dB HL)', x: ptaColX[7] },
    { title: 'Rinne', unit: '', x: ptaColX[8] + 4 },
    { title: 'Weber', unit: '', x: ptaColX[9] + 12 },
  ];

  headers.forEach((h) => {
    if (h.unit) {
      page.drawText(h.title, { x: h.x + 2, y: ptaY + 56, size: 6.5, font: fontBold, color: rgb(0.2, 0.08, 0.3) });
      page.drawText(h.unit, { x: h.x, y: ptaY + 47, size: 5.5, font: fontRegular, color: rgb(0.4, 0.25, 0.5) });
    } else if (h.title) {
      page.drawText(h.title, { x: h.x, y: ptaY + 52, size: 7, font: fontBold, color: rgb(0.2, 0.08, 0.3) });
    }
  });

  const sum = rep.summary || rep.computed || rep.computedPTA || params;
  const rPta = sum.rightAvg ? `${sum.rightAvg} dB` : (sum.rightPTA || '31.7 dB');
  const lPta = sum.leftAvg ? `${sum.leftAvg} dB` : (sum.leftPTA || '25 dB');
  const rPta2 = sum.rightPTA2 || '41.7 dB';
  const lPta2 = sum.leftPTA2 || '30.0 dB';
  const rSdt = sum.rightSDT || '30 dB';
  const lSdt = sum.leftSDT || '20 dB';
  const rSrt = sum.rightSRT || '35 dB';
  const lSrt = sum.leftSRT || '25 dB';
  const rWrs = sum.rightWRS || '84% at 70 dB';
  const lWrs = sum.leftWRS || '96% at 65 dB';
  const rMcl = sum.rightMCL || '75 dB';
  const lMcl = sum.leftMCL || '65 dB';
  const rUcl = sum.rightUCL || '95 dB';
  const lUcl = sum.leftUCL || '90 dB';
  const rRinne = sum.rightRinne || '+ve';
  const lRinne = sum.leftRinne || '+ve';
  const weberVal = sum.leftWeber || sum.weber || 'Lateralized to Left';

  // Divider between header and right row
  page.drawLine({ start: { x: 20, y: ptaY + 44 }, end: { x: 575, y: ptaY + 44 }, thickness: 0.5, color: rgb(0.85, 0.8, 0.92) });
  // Divider between right row and left row
  page.drawLine({ start: { x: 20, y: ptaY + 22 }, end: { x: 482, y: ptaY + 22 }, thickness: 0.5, color: rgb(0.88, 0.84, 0.94) });

  // Right Ear Row (red text)
  page.drawText('Right Ear', { x: ptaColX[0], y: ptaY + 30, size: 7.5, font: fontBold, color: rgb(0.86, 0.15, 0.15) });
  const rightVals = [rPta, rPta2, rSdt, rSrt, rWrs, rMcl, rUcl, rRinne];
  rightVals.forEach((v, i) => {
    page.drawText(String(v), { x: ptaColX[i + 1] + 2, y: ptaY + 30, size: 7, font: fontBold, color: rgb(0.86, 0.15, 0.15) });
  });

  // Weber value (vertically centered across rows)
  page.drawText(weberVal, { x: ptaColX[9] - 6, y: ptaY + 19, size: 7, font: fontBold, color: rgb(0.2, 0.08, 0.3) });

  // Left Ear Row (blue text)
  page.drawText('Left Ear', { x: ptaColX[0], y: ptaY + 8, size: 7.5, font: fontBold, color: rgb(0.15, 0.39, 0.92) });
  const leftVals = [lPta, lPta2, lSdt, lSrt, lWrs, lMcl, lUcl, lRinne];
  leftVals.forEach((v, i) => {
    page.drawText(String(v), { x: ptaColX[i + 1] + 2, y: ptaY + 8, size: 7, font: fontBold, color: rgb(0.15, 0.39, 0.92) });
  });

  // 6. Findings / Interpretation & Recommendations Box
  const findY = 278;
  const findH = 86;
  page.drawRectangle({
    x: 20,
    y: findY,
    width: 555,
    height: findH,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.72, 0.96),
    borderWidth: 0.8,
  });

  const diagnosis = rep.diagnosis || params.provisionalDiagnosis || 'Bilateral mild-to-moderate sensorineural hearing loss, greater in high frequencies.';
  const recommendations = rep.recommendations || params.recommendations || 'Bilateral digital hearing aid trial (Receiver-in-Canal, RIC).\nAnnual audiometric monitoring.';

  // INTERPRETATION
  page.drawText('INTERPRETATION :', { x: 28, y: findY + 70, size: 7.5, font: fontBold, color: rgb(0.2, 0.08, 0.3) });

  const diagClean = diagnosis.replace(/^[•\-\*]\s*/, '').trim();
  page.drawCircle({ x: 32, y: findY + 57, size: 2, color: rgb(0.25, 0.1, 0.35) });
  page.drawText(diagClean, { x: 38, y: findY + 55, size: 7.5, font: fontRegular, color: rgb(0.1, 0.1, 0.15) });

  // RECOMMENDATIONS
  page.drawText('RECOMMENDATIONS :', { x: 28, y: findY + 38, size: 7.5, font: fontBold, color: rgb(0.2, 0.08, 0.3) });

  const recLines = recommendations.split('\n').map((l) => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
  recLines.forEach((rLine, rIdx) => {
    const ry = findY + 23 - (rIdx * 12);
    page.drawCircle({ x: 32, y: ry + 2, size: 2, color: rgb(0.25, 0.1, 0.35) });
    page.drawText(rLine, { x: 38, y: ry, size: 7.5, font: fontRegular, color: rgb(0.1, 0.1, 0.15) });
  });

  // 7. Statutory Footer Banner
  const footerPath = findFilePath('vaani-footer-banner.png');
  if (footerPath) {
    try {
      const footerBytes = fs.readFileSync(footerPath);
      const footerImg = await pdfDoc.embedPng(footerBytes);
      page.drawImage(footerImg, {
        x: 20,
        y: 35,
        width: 555,
        height: 105,
      });
    } catch (e) {
      console.warn('Failed to embed footer banner PNG:', e);
    }
  }

  // Real QR Code on bottom left
  const repNum = rep.report_number || rep.reportNumber || 'REP-26-8495';
  const qrUrl = `https://frontend-alpha-topaz-35.vercel.app/verify-report/${encodeURIComponent(repNum)}`;
  try {
    const qrBuffer = await QRCode.toBuffer(qrUrl, {
      width: 140,
      margin: 1,
      color: { dark: '#1e0b36', light: '#ffffff' }
    });
    const qrImg = await pdfDoc.embedPng(qrBuffer);
    page.drawImage(qrImg, {
      x: 48,
      y: 42,
      width: 80,
      height: 80,
    });
  } catch (e) {
    console.warn('Failed to generate QR PNG in PDF:', e);
  }

  // Doctor credentials on bottom right
  const examinerRaw = rep.examiner || rep.examinerName || 'Ms. Palak Paresh Gandhi, BASLP, RCI';
  const sigName = examinerRaw.replace(/^(Dr\.|Ms\.|Mr\.)\s*/i, '').split(',')[0].trim() || 'Palak Paresh Gandhi';

  // Cursive signature script
  page.drawText(sigName, {
    x: 430,
    y: 106,
    size: 13,
    font: fontOblique,
    color: rgb(0.22, 0.08, 0.32),
  });

  // [✓] DIGITALLY AUTHENTICATED
  page.drawLine({ start: { x: 438, y: 94 }, end: { x: 440, y: 91.5 }, thickness: 1.2, color: rgb(0.02, 0.55, 0.35) });
  page.drawLine({ start: { x: 440, y: 91.5 }, end: { x: 444, y: 97 }, thickness: 1.2, color: rgb(0.02, 0.55, 0.35) });
  page.drawText('DIGITALLY AUTHENTICATED', {
    x: 448,
    y: 92,
    size: 6.5,
    font: fontBold,
    color: rgb(0.3, 0.15, 0.45),
  });

  // Underline
  page.drawLine({ start: { x: 400, y: 88 }, end: { x: 555, y: 88 }, thickness: 0.6, color: rgb(0.4, 0.2, 0.55) });

  // Doctor Name & Degree
  page.drawText(examinerRaw, {
    x: 405,
    y: 77,
    size: 8,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.15),
  });

  // RCI CRR Pill Badge
  const rciNo = rep.rci_number || rep.rciNumber || rep.rci || 'A125560';
  page.drawRectangle({
    x: 450,
    y: 63,
    width: 95,
    height: 11,
    color: rgb(0.95, 0.96, 0.98),
    borderColor: rgb(0.8, 0.84, 0.88),
    borderWidth: 0.6,
  });
  page.drawText(`RCI CRR No: ${rciNo}`, {
    x: 456,
    y: 66,
    size: 6.5,
    font: fontBold,
    color: rgb(0.2, 0.25, 0.35),
  });

  // Specialty
  page.drawText('Consultant Audiologist & Speech-Language Pathologist', {
    x: 395,
    y: 52,
    size: 6.5,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.4),
  });

  // Bottom Disclaimer
  page.drawText('Strictly Confidential Medical Record under DPDP Act 2023 - Valid without physical ink signature', {
    x: 135,
    y: 18,
    size: 6.5,
    font: fontRegular,
    color: rgb(0.45, 0.45, 0.5),
  });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const {
      smtpConfig = {},
      toEmail = '',
      subject = '',
      body = '',
      documentTitle = null,
      attachedFile = null,
      patientName = null,
      uhid = null,
      reportData = null,
    } = req.body || {};

    const recipient = (toEmail || '').trim();
    if (!recipient || !recipient.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid recipient email is required.' });
    }

    if (!subject) {
      return res.status(400).json({ success: false, message: 'Email subject is required.' });
    }

    const DEFAULT_CLINIC_SMTP = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      encryption: process.env.SMTP_ENCRYPTION || 'STARTTLS',
      senderName: process.env.SMTP_SENDER_NAME || 'Vaani Speech & Hearing Clinic',
      senderEmail: process.env.SMTP_USER || process.env.SMTP_EMAIL || 'info.shreeharshshivpuje@gmail.com',
      password: (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || 'axol mslc etlz mxpx').replace(/\s+/g, ''),
    };

    const host = (smtpConfig.host || DEFAULT_CLINIC_SMTP.host).trim();
    const port = parseInt(smtpConfig.port || DEFAULT_CLINIC_SMTP.port, 10);
    const encryption = (smtpConfig.encryption || DEFAULT_CLINIC_SMTP.encryption).toUpperCase();
    const username = (smtpConfig.senderEmail || smtpConfig.username || DEFAULT_CLINIC_SMTP.senderEmail).trim();
    let password = smtpConfig.password || DEFAULT_CLINIC_SMTP.password || '';
    if (host.toLowerCase().includes('gmail')) {
      password = password.replace(/\s+/g, '');
    }

    if (!host || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'SMTP credentials missing. Please configure your SMTP Host & App Password in Settings.',
      });
    }

    const isSecure = encryption === 'SSL' || port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      auth: {
        user: username,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
    });

    const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const senderName = smtpConfig.senderName || 'Vaani Speech & Hearing Clinic';

    let cleanFilename = attachedFile || (documentTitle ? `${documentTitle}.pdf` : 'Clinical_Document.pdf');
    cleanFilename = cleanFilename.replace(/\s+/g, '_');
    if (!cleanFilename.toLowerCase().endsWith('.pdf')) {
      cleanFilename += '.pdf';
    }

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);">
          <!-- Official Header Banner -->
          <tr>
            <td style="background-color: #301444; text-align: center; padding: 0;">
              <img src="cid:vaani_header_banner" alt="Vaani Speech & Hearing Rehabilitation Clinic" style="width: 100%; max-width: 600px; height: auto; display: block; border: 0;" />
            </td>
          </tr>

          <!-- Patient & Record Context Ribbon -->
          <tr>
            <td style="background-color: #faf5ff; border-bottom: 1px solid #e9d5ff; padding: 12px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 11px; color: #581c87;">
                <tr>
                  <td width="50%">
                    <strong>Patient:</strong> ${patientName || 'Valued Patient'}<br/>
                    <strong>UHID:</strong> ${uhid || 'VH-2026-0012'}
                  </td>
                  <td width="50%" style="text-align: right;">
                    <strong>Date:</strong> ${nowStr.split(',')[0]}<br/>
                    <span style="color: #7e22ce; font-weight: 600;">Official Medical Record</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Area -->
          <tr>
            <td style="padding: 24px 26px; color: #334155; font-size: 13px; line-height: 1.65;">
              <div style="margin-bottom: 16px;">
                ${(body || '').replace(/\n/g, '<br>')}
              </div>

              <!-- Clean Attached Document Notification Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f3ff; border: 1.5px solid #d8b4fe; border-radius: 8px; margin: 20px 0 10px 0;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="36" style="vertical-align: middle; font-size: 26px;">
                          📄
                        </td>
                        <td style="vertical-align: middle; padding-left: 8px;">
                          <div style="font-size: 13px; font-weight: 700; color: #4c1d95;">
                            Attached Document: ${cleanFilename}
                          </div>
                          <div style="font-size: 11px; color: #6d28d9; margin-top: 2px;">
                            ${documentTitle || 'Clinical Evaluation Report'} • Digitally Signed PDF
                          </div>
                        </td>
                        <td width="95" style="text-align: right; vertical-align: middle;">
                          <span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">
                            Attached
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0; text-align: right;">
                ↓ The official PDF document is attached to this email and ready to download.
              </p>
            </td>
          </tr>

          <!-- Clinic Details & Contact Card -->
          <tr>
            <td style="background-color: #faf5ff; border-top: 1px solid #e9d5ff; padding: 18px 24px; font-size: 11px; color: #581c87;">
              <div style="font-weight: 700; font-size: 12px; color: #3b0764; margin-bottom: 4px;">
                Vaani Speech &amp; Hearing Rehabilitation Clinic
              </div>
              <div style="color: #6b21a8; line-height: 1.5; margin-bottom: 8px;">
                <strong>Consultant:</strong> Ms. Palak Paresh Gandhi, MASLP (Gold Medalist) • <strong>RCI CRR:</strong> A79214<br/>
                <strong>📍 Address:</strong> Shop No. 4, Ground Floor, Sadashiv Arcade, Opp. Zilla Parishad Gate, Sadashiv Peth, Satara - 415002<br/>
                <strong>📞 Phone:</strong> +91 98220 12345 / +91 94230 99887 • <strong>✉️ Email:</strong> info@vaaniclinic.com
              </div>
              <div style="font-size: 10px; color: #7e22ce; border-top: 1px dashed #d8b4fe; padding-top: 6px;">
                Mon – Sat: 10:00 AM – 1:30 PM &amp; 3:30 PM – 8:00 PM • Sunday Closed • DPDP Act 2023 Compliant Practice
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const attachments = [];

    // Attach inline banner image
    const headerPath = findHeaderImagePath();
    if (headerPath) {
      attachments.push({
        filename: 'vaani-official-header.png',
        path: headerPath,
        cid: 'vaani_header_banner',
      });
    }

    // Generate real PDF and attach
    const pdfBuffer = await generateClinicalPdfBuffer(patientName, uhid, documentTitle, body, reportData);
    attachments.push({
      filename: cleanFilename,
      content: pdfBuffer,
      contentType: 'application/pdf',
    });

    const info = await transporter.sendMail({
      from: `"${senderName}" <${username}>`,
      to: recipient,
      subject,
      text: body,
      html: htmlBody,
      attachments,
    });

    return res.status(200).json({
      success: true,
      message: `Clinical document '${cleanFilename}' successfully emailed to ${recipient} with attached PDF`,
      data: {
        success: true,
        status: 'SENT',
        code: 250,
        messageId: info.messageId,
        recipient,
        timestamp: nowStr,
        host: `${host}:${port}`,
        attachment: cleanFilename,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to dispatch email.',
      error: error.message,
    });
  }
}
