export const copyObject = async (obj: Object) => {
    await navigator.clipboard.writeText(JSON.stringify(obj));
}

export const getPastedObject = async () => {
    try {
        return JSON.parse(await navigator.clipboard.readText());
    } catch (error) {
        console.error(error)
    }
}