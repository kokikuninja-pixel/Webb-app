
/**
 * RMJ (Rental Motor Jakarta) - Branch Backend
 * Database: Google Sheets
 */

// ID Spreadsheet dari link yang diberikan user
const SPREADSHEET_ID = '1FrrsyHN0P4Rrkm6rFjf_O0_bxf1uipXYkW1bSqsFhB0';

function getSS() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    // Fallback ke active spreadsheet jika ID tidak dapat diakses
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('RMJ - Rental Motor Jakarta')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSettings() {
  const ss = getSS();
  return {
    url: ss.getUrl(),
    name: ss.getName(),
    id: ss.getId()
  };
}

function initDatabase() {
  const ss = getSS();
  
  const sheets = {
    'Motors': ['id', 'plateNumber', 'type', 'status', 'lastService'],
    'Rentals': [
      'id', 'createdAt', 'motorId', 'startDate', 'endDate', 'customerName', 
      'customerPhone', 'customerAddress', 'locationDetails', 'basePrice', 
      'outOfTownFee', 'pickupDropoffFee', 'totalPrice', 'dpAmount', 
      'settlementAmount', 'paymentType', 'bankName', 'htgAmount', 
      'htgNotes', 'htgStatus', 'officerName', 'helmets', 'raincoats'
    ],
    'Transactions': ['id', 'date', 'type', 'category', 'amount', 'notes']
  };

  let initialized = [];
  for (let name in sheets) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.getRange(1, 1, 1, sheets[name].length).setValues([sheets[name]])
           .setFontWeight('bold')
           .setBackground('#f3f4f6');
      sheet.setFrozenRows(1);
      initialized.push(name);
    }
  }
  
  const motorSheet = ss.getSheetByName('Motors');
  if (motorSheet.getLastRow() === 1) {
    const sampleMotors = [
      ['M1', 'B 1234 ABC', 'Honda Vario 160', 'Ready', ''],
      ['M2', 'B 5678 DEF', 'Yamaha NMAX', 'Ready', ''],
      ['M3', 'B 9012 GHI', 'Honda Beat', 'Ready', '']
    ];
    motorSheet.getRange(2, 1, sampleMotors.length, 5).setValues(sampleMotors);
  }

  return "Database Ready";
}

function getAllData() {
  try {
    initDatabase();
    return {
      motors: getSheetData('Motors'),
      rentals: getSheetData('Rentals'),
      transactions: getSheetData('Transactions'),
      settings: getSettings()
    };
  } catch (e) {
    return { error: e.toString() };
  }
}

function getSheetData(sheetName) {
  const sheet = getSS().getSheetByName(sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values.shift();
  
  return values.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

function addRecord(sheetName, data) {
  const sheet = getSS().getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(h => data[h] !== undefined ? data[h] : "");
  sheet.appendRow(newRow);
  return "Success";
}

function updateRecord(sheetName, id, updatedData) {
  const sheet = getSS().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == id) {
      const rowNum = i + 1;
      headers.forEach((h, j) => {
        if (updatedData[h] !== undefined) {
          sheet.getRange(rowNum, j + 1).setValue(updatedData[h]);
        }
      });
      break;
    }
  }
  return "Success";
}

function deleteRecord(sheetName, id) {
  const sheet = getSS().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == id) {
      sheet.deleteRow(i + 1);
      return "Deleted";
    }
  }
  return "Not Found";
}
