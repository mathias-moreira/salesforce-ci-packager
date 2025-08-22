import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

async function executeCommand(command) {
    try {
        const { stdout, stderr } = await execPromise(command);
        return { success: true, data: stdout, error: stderr };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export default executeCommand;