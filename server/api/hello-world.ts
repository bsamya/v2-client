export default defineEventHandler((event) => {
    const host = getRequestHeader(event, 'host');
    return { domain: host };
})
