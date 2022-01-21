export const generateCSSCode = (code) => {
    return `:root {
${code}
}`
}

export const saveVariableList = (data) => {
    localStorage.setItem('variableList', JSON.stringify(data));
}

export const readVariableList = () => {
    let data = localStorage.getItem('variableList');
    if (data) {
        return JSON.parse(data);
    }
    return [];
}