export function isValidPath(pathStr: string) {
    const paths = pathStr.split(",").map(p => p.trim());
    return paths.every(p => p.startsWith("/") || /^[A-Za-z]:\\/.test(p));
}