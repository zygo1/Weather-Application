export async function getArea(url) {
    const response = await fetch(url);
    const data = await response.json();
    return {
        city: data.address.city
    }
}