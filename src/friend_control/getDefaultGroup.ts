import { Group } from '../utils/Types';
import { getGroupsList } from './getGroupsList';

export async function getDefaultGroup(): Promise<Group> {
  const groups = await getGroupsList();

  // The default group's name is empty string
  return groups.find((group) => group.group_name === '')!;
}
