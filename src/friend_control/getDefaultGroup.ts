import { Group } from '../utils/types';
import { getGroupsList } from './getGroupsList';

export async function getDefaultGroup(): Promise<Group> {
  const groups = await getGroupsList();

  // const smallestGroupId = Math.min(...groups.map((group) => group.group_id));
  // return groups.find((group) => group.group_id === smallestGroupId);

  // The default group's name is empty string
  return groups.find((group) => group.group_name === '')!;
}
