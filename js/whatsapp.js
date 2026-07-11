/* ============================================
   WHATSAPP PREFILL
   ============================================ */
const WhatsAppController = {
  init: function () {
    const waBtn = document.getElementById('whatsappBtn');
    if (!waBtn) return;
    const waMessage = 'Hey Ayush \uD83D\uDC4B\n\nJust visited your portfolio. Let\'s connect \uD83D\uDE80';
    waBtn.href = 'https://wa.me/917390841128?text=' + encodeURIComponent(waMessage);
  }
};
