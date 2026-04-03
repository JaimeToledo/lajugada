# Backend gratis (Google Apps Script)

## 1) Crear la hoja
- Crea una hoja nueva en Google Sheets (puede llamarse `lajugada-tracking`).

## 2) Pegar el codigo
- En la hoja: `Extensions > Apps Script`.
- Borra el contenido de ejemplo y pega `Code.gs`.
- Cambia estas constantes:
  - `SHEET_NAME` (ej: `Entradas`)
  - `NOTIFY_EMAIL` (tu correo real)

## 3) Desplegar web app
- `Deploy > New deployment`
- Tipo: `Web app`
- `Execute as`: **Me**
- `Who has access`: **Anyone**
- `Deploy`
- Copia la URL que termina en `/exec`

## 4) Conectar con la landing
- Abre `index.html`
- Busca `trackingEndpoint` en `EVENT_CONFIG`
- Pega tu URL `/exec` en esa variable.

Ejemplo:
```js
trackingEndpoint: "https://script.google.com/macros/s/AKfycbxxxx/exec",
```

## 5) Publicar cambios
- Sube el `index.html` actualizado a GitHub.
- Al abrir la pagina se registrara:
  - `page_open`: cuando alguien abre la pagina
  - `entered_experience`: cuando mete nombre y entra

## 6) Ver resultados
- En la hoja veras filas nuevas con fecha, evento, nombre y metadatos.
- Te llegara un correo por cada evento.

## Notas
- Es gratis con limites de Google Apps Script.
- Si un dia no quieres correos por cada evento, comenta `sendNotificationEmail_(data);` en `Code.gs`.
