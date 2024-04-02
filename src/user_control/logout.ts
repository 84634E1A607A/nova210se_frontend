export async function logout() {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat(`/user/logout`), {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to logout');
    return true;
  } catch (e) {
    console.error(e);
    window.alert('Failed to logout');
    return false;
  }
}
