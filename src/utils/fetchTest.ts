export async function fetchTest() {
  return new Promise((resolve) => resolve({ testObj: [1, 'test1'] }));
}
