import { existsSync, readFileSync } from 'fs';

/**
 * Reads the JSON file
 * 
 * @param {Object} params - Parameters for reading the JSON file
 * @param {string} params.filePath - The path to the JSON file
 * @returns {Object} The JSON file
 * @throws {Error} If the JSON file does not exist
 */
const readJsonFile = ({filePath}) => {
    if (!existsSync(filePath)) {
      throw new Error(`Project file not found: ${filePath}`);
    }
  
    return JSON.parse(readFileSync(filePath, 'utf8'));
  }

export default readJsonFile;