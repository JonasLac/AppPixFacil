
import { calculateCRC16 } from './crcCalculator';
import { PixKey } from '../components/PixKeyForm';

export const generateBRCode = (pixKey: PixKey, amount: string, description: string): string => {
  // Payload Format Indicator (ID 00)
  const payloadFormatIndicator = "000201";
  
  // Point of Initiation Method (ID 01) - opcional para pagamento único
  const pointOfInitiation = "010211";
  
  // Merchant Account Information (ID 26)
  const pixKeyValue = pixKey.value.trim();
  const gui = "0014BR.GOV.BCB.PIX";
  const keyField = `01${pixKeyValue.length.toString().padStart(2, '0')}${pixKeyValue}`;
  const merchantAccountInfo = gui + keyField;
  const merchantAccountField = `26${merchantAccountInfo.length.toString().padStart(2, '0')}${merchantAccountInfo}`;
  
  // Merchant Category Code (ID 52)
  const merchantCategoryCode = "52040000";
  
  // Transaction Currency (ID 53) - 986 = BRL
  const transactionCurrency = "5303986";
  
  // Transaction Amount (ID 54) - apenas se valor for informado
  let transactionAmount = "";
  if (amount && parseFloat(amount) > 0) {
    const amountValue = parseFloat(amount).toFixed(2);
    transactionAmount = `54${amountValue.length.toString().padStart(2, '0')}${amountValue}`;
  }
  
  // Country Code (ID 58)
  const countryCode = "5802BR";
  
  // Merchant Name (ID 59)
  const merchantName = pixKey.label.substring(0, 25);
  const merchantNameField = `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`;
  
  // Merchant City (ID 60)
  const merchantCity = "6009SAO PAULO";
  
  // Additional Data Field Template (ID 62) - Correção aplicada
  let additionalDataField = "";
  if (description && description.trim()) {
    const desc = description.trim().substring(0, 99);
    const txidField = `05${desc.length.toString().padStart(2, '0')}${desc}`;
    additionalDataField = `62${(txidField.length).toString().padStart(2, '0')}${txidField}`;
  } else {
    // Campo obrigatório mesmo que vazio (TXID = ***)
    const txidField = "0503***"; // ID 05 (TXID), Length 03, Value ***
    additionalDataField = `62${(txidField.length).toString().padStart(2, '0')}${txidField}`;
  }
  
  // CRC16 Placeholder (ID 63)
  const crcPlaceholder = "6304";
  
  // Montar payload sem CRC
  const payloadWithoutCrc = payloadFormatIndicator + 
                           pointOfInitiation + 
                           merchantAccountField + 
                           merchantCategoryCode + 
                           transactionCurrency + 
                           transactionAmount + 
                           countryCode + 
                           merchantNameField + 
                           merchantCity + 
                           additionalDataField + 
                           crcPlaceholder;
  
  // Calcular CRC16
  const crc16 = calculateCRC16(payloadWithoutCrc);
  const finalPayload = payloadWithoutCrc + crc16;
  
  return finalPayload;
};

export const generateQRCodeUrl = (brCode: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(brCode)}`;
};
