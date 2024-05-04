import { listApplicationsForChat } from './listApplicationsForChat';
import { getChats } from './getChats';
import { ApplicationForChat } from '../utils/Types';

/**
 * @description List applications for all the chats.
 */
export async function listApplicationsForAllChats() {
  const chats = await getChats();
  let allApplications: ApplicationForChat[] = [];
  for (const chat of chats) {
    const applications = await listApplicationsForChat({ chatId: chat.chat_id });
    allApplications = allApplications.concat(applications);
  }
  return allApplications;
}
