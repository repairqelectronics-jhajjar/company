/**
 * Repair Q Electronics — Production Client Script
 * Powers interactive hero bench, ROI calculator, drawer navigation,
 * multi-open FAQs, quote modal, and GA4 conversion tracking.
 * Scope: VFDs, Soft Starters, HMI Panels, PLC Systems, and Industrial Electronics.
 */

// ============================================================
// GA4 CONVERSION TRACKING HELPERS
// ============================================================
function trackEvent(eventName, params) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params || {});
  }
}

// Track all data-track anchor clicks (phone, WhatsApp, quote) anywhere in the page
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-track]');
  if (!el) return;
  const trackId = el.getAttribute('data-track');
  if (!trackId) return;

  if (trackId.includes('phone') || el.href && el.href.startsWith('tel:')) {
    trackEvent('phone_call_click', { event_category: 'CTA', event_label: trackId });
  } else if (trackId.includes('whatsapp') || (el.href && el.href.includes('wa.me'))) {
    trackEvent('whatsapp_click', { event_category: 'CTA', event_label: trackId });
  } else if (trackId.includes('quote') || trackId.includes('modal')) {
    trackEvent('quote_modal_open', { event_category: 'CTA', event_label: trackId });
  } else {
    trackEvent('cta_click', { event_category: 'CTA', event_label: trackId });
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. MOBILE DRAWER NAVIGATION
  // ============================================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobilePanel = document.getElementById('mobileNavPanel');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  function openMobileMenu() {
    if (!mobileOverlay || !mobilePanel) return;
    mobileOverlay.classList.add('open');
    mobilePanel.classList.add('open');
    mobilePanel.setAttribute('aria-hidden', 'false');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileOverlay || !mobilePanel) return;
    mobileOverlay.classList.remove('open');
    mobilePanel.classList.remove('open');
    mobilePanel.setAttribute('aria-hidden', 'true');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobilePanel && mobilePanel.classList.contains('open')) {
      closeMobileMenu();
    }
  });


  // ============================================================
  // 2. INTERACTIVE HERO DIAGNOSTIC BENCH SIMULATOR
  // ============================================================
  const benchTabs = document.querySelectorAll('.bench-tab-btn');
  const benchUrl = document.getElementById('benchUrlDisplay');
  const oemBadge = document.getElementById('benchOemBadge');
  const deviceTitle = document.getElementById('benchDeviceTitle');
  const statusBadge = document.getElementById('benchStatusBadge');
  const statusText = document.getElementById('benchStatusText');
  const oscChannel = document.getElementById('oscChannelTitle');
  const oscFreq = document.getElementById('oscFreqTitle');
  const wavePath = document.getElementById('waveformPath');
  const wavePoint1 = document.getElementById('wavePoint1');
  const wavePoint2 = document.getElementById('wavePoint2');

  const statLabel1 = document.getElementById('statLabel1');
  const statVal1 = document.getElementById('statVal1');
  const statLabel2 = document.getElementById('statLabel2');
  const statVal2 = document.getElementById('statVal2');
  const statLabel3 = document.getElementById('statLabel3');
  const statVal3 = document.getElementById('statVal3');
  const statLabel4 = document.getElementById('statLabel4');
  const statVal4 = document.getElementById('statVal4');

  const rigData = {
    vfd: {
      url: 'bench-rig-01.repairq.lab // vfd-inverter-drive-diagnostic',
      oem: 'VFD DRIVE',
      device: 'Variable Frequency Drive & AC Inverter (50HP)',
      status: 'MOTOR LOAD TEST PASSED',
      channel: 'OSCILLOSCOPE CH1: 3-PHASE OUTPUT SINE WAVE',
      freq: 'FREQ: 50.0 Hz | CURRENT: 44.5A RMS',
      path: 'M0 34 Q 28.75 6, 57.5 34 T 115 34 T 172.5 34 T 230 34 T 287.5 34 T 345 34 T 402.5 34 T 460 34',
      p1: { cx: 172.5, cy: 12 },
      p2: { cx: 230, cy: 56 },
      s1: { label: 'IGBT Power Stage Condition', val: 'Replaced & Balanced' },
      s2: { label: 'DC Bus Capacitor Bank Health', val: '0.04Ω Low ESR (Nominal)' },
      s3: { label: 'Gate Driver Optocouplers', val: '100% Galvanic Isolation' },
      s4: { label: 'Continuous Full-Load Thermals', val: '43.6°C (Optimal Threshold)' }
    },
    softstarter: {
      url: 'bench-rig-02.repairq.lab // soft-starter-scr-diagnostic',
      oem: 'SOFT STARTER',
      device: 'Reduced-Voltage Motor Starter & Controller (75kW)',
      status: 'RAMP-UP CYCLE VERIFIED',
      channel: 'OSCILLOSCOPE CH2: SCR FIRING PULSE TRAIN',
      freq: 'FIRING ANGLE: 35°–180° | Vgate: 3.2V',
      path: 'M0 50 H20 V18 H50 V50 H70 V18 H100 V50 H120 V18 H150 V50 H170 V18 H200 V50 H220 V18 H250 V50 H270 V18 H300 V50 H320 V18 H350 V50 H370 V18 H400 V50 H460',
      p1: { cx: 200, cy: 18 },
      p2: { cx: 220, cy: 50 },
      s1: { label: 'Anti-Parallel SCR Thyristors', val: 'Forward/Reverse Voltage OK' },
      s2: { label: 'Internal Bypass Contactor', val: 'Zero Contact Resistance' },
      s3: { label: 'Current Limit Sensor Loop', val: 'CT Feedback Calibrated' },
      s4: { label: 'Phase Loss / Imbalance Trip', val: 'Protection Relays Active' }
    },
    plc: {
      url: 'bench-rig-03.repairq.lab // plc-cpu-rack-diagnostic',
      oem: 'PLC SYSTEM',
      device: 'PLC CPU & Modular I/O Rack Controller',
      status: 'LOGIC & BUS RUNNING',
      channel: 'OSCILLOSCOPE CH3: BACKPLANE BUS CLOCK & DATA',
      freq: 'BUS CLK: 12.0 MHz | JITTER: <0.1%',
      path: 'M0 34 H35 L50 14 H90 L105 34 H140 L155 54 H195 L210 34 H250 L265 14 H305 L320 34 H360 L375 54 H415 L430 34 H460',
      p1: { cx: 90, cy: 14 },
      p2: { cx: 195, cy: 54 },
      s1: { label: 'Internal SMPS Power Rail', val: '+5V, +24V DC Regulated' },
      s2: { label: 'Modular I/O Optical Isolation', val: 'All 32 Channels Validated' },
      s3: { label: 'Industrial Ethernet / Profinet', val: '0 Packet Drops (Full Duplex)' },
      s4: { label: 'EEPROM Program Integrity', val: 'Flash Checksum Matched' }
    },
    hmi: {
      url: 'bench-rig-04.repairq.lab // hmi-touchscreen-diagnostic',
      oem: 'HMI PANEL',
      device: 'Industrial Touchscreen & Operator Terminal (12.1")',
      status: 'TOUCH GRID CALIBRATED',
      channel: 'OSCILLOSCOPE CH4: BACKLIGHT INVERTER PWM VOLTAGE',
      freq: 'FREQ: 45.0 kHz | Vrms: 620V AC',
      path: 'M0 34 H30 L45 8 H75 L90 60 H120 L135 34 H160 L175 8 H205 L220 60 H250 L265 34 H290 L305 8 H335 L350 60 H380 L395 34 H460',
      p1: { cx: 205, cy: 8 },
      p2: { cx: 220, cy: 60 },
      s1: { label: 'Resistive / Capacitive Touch Glass', val: 'Replaced & 9-Point Mapped' },
      s2: { label: 'CCFL / LED Backlight Circuit', val: 'Uniform Luminance (450 nits)' },
      s3: { label: 'Serial RS232/485 Comm Ports', val: 'Transceiver ICs Restored' },
      s4: { label: 'Front Bezel Environmental Seal', val: 'IP65 Gasket Installed' }
    }
  };

  function updateBench(rigKey) {
    const data = rigData[rigKey];
    if (!data) return;

    benchTabs.forEach(btn => {
      const isSelected = btn.getAttribute('data-rig') === rigKey;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected);
    });

    if (benchUrl) benchUrl.textContent = data.url;
    if (oemBadge) oemBadge.textContent = data.oem;
    if (deviceTitle) deviceTitle.textContent = data.device;
    if (statusText) statusText.textContent = data.status;
    if (oscChannel) oscChannel.textContent = data.channel;
    if (oscFreq) oscFreq.textContent = data.freq;
    if (wavePath) wavePath.setAttribute('d', data.path);
    if (wavePoint1) {
      wavePoint1.setAttribute('cx', data.p1.cx);
      wavePoint1.setAttribute('cy', data.p1.cy);
    }
    if (wavePoint2) {
      wavePoint2.setAttribute('cx', data.p2.cx);
      wavePoint2.setAttribute('cy', data.p2.cy);
    }

    if (statLabel1) statLabel1.textContent = data.s1.label;
    if (statVal1) statVal1.querySelector('span').textContent = data.s1.val;

    if (statLabel2) statLabel2.textContent = data.s2.label;
    if (statVal2) statVal2.querySelector('span').textContent = data.s2.val;

    if (statLabel3) statLabel3.textContent = data.s3.label;
    if (statVal3) statVal3.querySelector('span').textContent = data.s3.val;

    if (statLabel4) statLabel4.textContent = data.s4.label;
    if (statVal4) statVal4.querySelector('span').textContent = data.s4.val;
  }

  benchTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const rig = btn.getAttribute('data-rig');
      updateBench(rig);
    });
  });


  // ============================================================
  // 3. INTERACTIVE SAVINGS & ROI CALCULATOR
  // ============================================================
  const calcDeviceSelect = document.getElementById('calcDeviceSelect');
  const calcOemCostInput = document.getElementById('calcOemCostInput');
  const calcResetBtn = document.getElementById('calcResetBtn');
  const calcSavedAmount = document.getElementById('calcSavedAmount');
  const calcSavedPercent = document.getElementById('calcSavedPercent');
  const barOemCost = document.getElementById('barOemCost');
  const barRepairCost = document.getElementById('barRepairCost');
  const barFillRepair = document.getElementById('barFillRepair');
  const calcOemLead = document.getElementById('calcOemLead');
  const calcQLead = document.getElementById('calcQLead');

  function formatCurrency(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
  }

  function calculateSavings() {
    if (!calcDeviceSelect || !calcOemCostInput) return;
    const selectedOption = calcDeviceSelect.options[calcDeviceSelect.selectedIndex];
    const defaultOem = parseFloat(selectedOption.getAttribute('data-oem')) || 120000;
    const defaultRepair = parseFloat(selectedOption.getAttribute('data-repair')) || 42000;
    const oemTime = selectedOption.getAttribute('data-oemtime') || '30';
    const qTime = selectedOption.getAttribute('data-qtime') || '2';

    let oemCost = parseFloat(calcOemCostInput.value);
    if (isNaN(oemCost) || oemCost <= 0) oemCost = defaultOem;

    const repairRatio = defaultRepair / defaultOem;
    const repairCost = Math.round(oemCost * repairRatio);
    const savedAmount = Math.max(0, oemCost - repairCost);
    const savedPercent = Math.round((savedAmount / oemCost) * 100);

    if (calcSavedAmount) calcSavedAmount.textContent = formatCurrency(savedAmount);
    if (calcSavedPercent) calcSavedPercent.textContent = `${savedPercent}% Less Than Buying New OEM`;
    if (barOemCost) barOemCost.textContent = formatCurrency(oemCost);
    if (barRepairCost) barRepairCost.textContent = formatCurrency(repairCost);
    if (barFillRepair) barFillRepair.style.width = `${Math.min(100, Math.round((repairCost / oemCost) * 100))}%`;

    if (calcOemLead) calcOemLead.textContent = `${oemTime} Days`;
    if (calcQLead) calcQLead.textContent = `${qTime === '1' ? '24 Hours' : qTime === '2' ? '48 Hours' : '72 Hours'}`;
  }

  if (calcDeviceSelect) {
    calcDeviceSelect.addEventListener('change', () => {
      const opt = calcDeviceSelect.options[calcDeviceSelect.selectedIndex];
      const oemVal = opt.getAttribute('data-oem');
      if (calcOemCostInput && oemVal) calcOemCostInput.value = oemVal;
      calculateSavings();
    });
  }

  if (calcOemCostInput) {
    calcOemCostInput.addEventListener('input', calculateSavings);
  }

  if (calcResetBtn) {
    calcResetBtn.addEventListener('click', () => {
      if (calcDeviceSelect) {
        const opt = calcDeviceSelect.options[calcDeviceSelect.selectedIndex];
        calcOemCostInput.value = opt.getAttribute('data-oem');
        calculateSavings();
      }
    });
  }


  // ============================================================
  // 4. EXPANDABLE FAQ ACCORDIONS (Multi-open supported)
  // ============================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        item.classList.toggle('open');
        btn.setAttribute('aria-expanded', !isOpen);
      });
    }
  });


  // ============================================================
  // 5. REPAIR QUOTE INTAKE MODAL
  // ============================================================
  const quoteModal = document.getElementById('quoteModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openQuoteBtns = document.querySelectorAll('.open-quote-modal');
  const quoteForm = document.getElementById('quoteForm');
  const formFeedback = document.getElementById('formFeedback');

  function openModal() {
    if (quoteModal) {
      quoteModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      const firstInput = quoteModal.querySelector('input, select');
      if (firstInput) firstInput.focus();
    }
  }

  function closeModal() {
    if (quoteModal) {
      quoteModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quoteModal && quoteModal.classList.contains('open')) {
      closeModal();
    }
  });

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const equip = document.getElementById('equipType').value;
      const brand = document.getElementById('equipBrand').value;
      const name = document.getElementById('contactName').value;
      const phone = document.getElementById('contactPhone').value;
      const desc = document.getElementById('faultDesc').value;

      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.innerHTML = `<strong>Inquiry Logged!</strong> Thank you ${name}. Ajay will review your <strong>${brand} ${equip}</strong> diagnostic report and contact you at <strong>${phone}</strong> shortly. Opening WhatsApp...`;
      }

      // Track quote form submission
      trackEvent('quote_form_submit', {
        event_category: 'Lead',
        event_label: `${brand} ${equip}`,
        value: 1
      });

      // Automatically construct and open WhatsApp message to Ajay
      setTimeout(() => {
        const msg = encodeURIComponent(
          `Hello Ajay,\nI would like to request an industrial automation repair quote from Repair Q Electronics:\n\n` +
          `• Equipment Category: ${equip}\n` +
          `• Brand & Model: ${brand}\n` +
          `• Observed Fault: ${desc}\n` +
          `• Name / Company: ${name}\n` +
          `• Contact Phone: ${phone}`
        );
        window.open(`https://wa.me/918307193825?text=${msg}`, '_blank');
        closeModal();
        quoteForm.reset();
        if (formFeedback) formFeedback.style.display = 'none';
      }, 1400);
    });
  }

});
