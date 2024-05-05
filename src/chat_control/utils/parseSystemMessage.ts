import { systemMessages } from '../../utils/consts/SystemValues';

export function parseSystemMessage(message: string) {
  const splitMessage = message.split(' ');
  let result: splitPair[] = [];
  if (message.match(systemMessages[0]) !== null) {
    result.push({ wordMessage: splitMessage[0], shouldEmphasize: false });
    result.push({ wordMessage: ' ' + splitMessage[1], shouldEmphasize: true });
    result.push({ wordMessage: ' created by', shouldEmphasize: false });
    result.push({ wordMessage: ' ' + splitMessage[4], shouldEmphasize: true });
    result.push({ wordMessage: ' with', shouldEmphasize: false });
    for (let i = 6; i < splitMessage.length; i++) {
      let thisWord = splitMessage[i];
      let hasComma = false;
      if (thisWord[thisWord.length - 1] === ',') {
        hasComma = true;
        thisWord = thisWord.slice(0, thisWord.length - 1);
      }
      if (hasComma) {
        result.push({ wordMessage: ' ' + thisWord, shouldEmphasize: true });
        result.push({ wordMessage: ',', shouldEmphasize: false });
      } else {
        result.push({ wordMessage: ' ' + thisWord, shouldEmphasize: true });
      }
    }
  } else if (message.match(systemMessages[1]) !== null) {
    result.push({ wordMessage: splitMessage[0], shouldEmphasize: true });
    result.push({ wordMessage: ' added', shouldEmphasize: false });
    result.push({ wordMessage: ' ' + splitMessage[2], shouldEmphasize: true });
    result.push({ wordMessage: ' as a friend', shouldEmphasize: false });
  } else if (message.match(systemMessages[2]) !== null) {
    result.push({ wordMessage: splitMessage[0], shouldEmphasize: true });
    result.push({ wordMessage: ' removed', shouldEmphasize: false });
    result.push({ wordMessage: ' ' + splitMessage[2], shouldEmphasize: true });
    result.push({ wordMessage: ' from the group', shouldEmphasize: false });
  } else if (message.match(systemMessages[3]) !== null) {
    result.push({ wordMessage: splitMessage[0], shouldEmphasize: true });
    result.push({ wordMessage: ' left the chat', shouldEmphasize: false });
  } else if (message.match(systemMessages[4]) !== null) {
    result.push({ wordMessage: splitMessage[0], shouldEmphasize: true });
    result.push({ wordMessage: ' approved', shouldEmphasize: false });
    result.push({ wordMessage: ' ' + splitMessage[2], shouldEmphasize: true });
    result.push({ wordMessage: ' to join the group, invited by', shouldEmphasize: false });
    result.push({ wordMessage: ' ' + splitMessage[9], shouldEmphasize: true });
  } else {
    // The default case:
    result.push({ wordMessage: splitMessage[0], shouldEmphasize: false });
    for (let i = 1; i < splitMessage.length; i++) {
      result.push({ wordMessage: ' ' + splitMessage[i], shouldEmphasize: false });
    }
  }
  return result;
}

interface splitPair {
  wordMessage: string;
  shouldEmphasize: boolean;
}
