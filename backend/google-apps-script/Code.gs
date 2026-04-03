/*
  Backend gratis para tracking de aperturas/entradas desde GitHub Pages.
  Registra en Google Sheets y envia correo por cada evento.

  PASOS RAPIDOS:
  1) Crea una hoja de calculo en Google Sheets.
  2) Abre Extensions > Apps Script, pega este archivo y guarda.
  3) Cambia las constantes SHEET_NAME y NOTIFY_EMAIL.
  4) Deploy > New deployment > Web app:
     - Execute as: Me
     - Who has access: Anyone
  5) Copia la URL /exec y pegala en EVENT_CONFIG.trackingEndpoint en index.html.
*/

const SHEET_NAME = "Entradas";
const NOTIFY_EMAIL = "TU_CORREO@gmail.com";

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet_(ss, SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "receivedAt",
        "eventType",
        "playerName",
        "page",
        "referrer",
        "userAgent",
        "clientTimestamp"
      ]);
    }

    const row = [
      new Date(),
      safe_(data.eventType),
      safe_(data.playerName),
      safe_(data.page),
      safe_(data.referrer),
      safe_(data.userAgent),
      safe_(data.timestamp)
    ];

    sheet.appendRow(row);

    sendNotificationEmail_(data);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_(ss, name) {
  const existing = ss.getSheetByName(name);
  if (existing) return existing;
  return ss.insertSheet(name);
}

function safe_(value) {
  return value == null ? "" : String(value);
}

function sendNotificationEmail_(data) {
  if (!NOTIFY_EMAIL || NOTIFY_EMAIL.indexOf("@") === -1) return;

  const eventType = safe_(data.eventType) || "unknown";
  const playerName = safe_(data.playerName) || "(sin nombre)";

  const subject = "[LA JUGADA] Nuevo acceso: " + eventType;
  const body = [
    "Evento: " + eventType,
    "Jugador: " + playerName,
    "Hora cliente: " + safe_(data.timestamp),
    "Pagina: " + safe_(data.page),
    "Referrer: " + safe_(data.referrer)
  ].join("\n");

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subject,
    body: body
  });
}
