// fail messages
export const tooLong = name => `${name} is too long`;
export const tooShort = name => `${name} is too short`;
export const atLeastCharacters = (name, count) => `${name} must have at least ${count} characters`;

// rules[
export const maxLengthRule = (maxCount, fieldName) => {
    const maxLength = maxCount;
    return [{check: (str) => str.length <= maxLength, fail: tooLong(fieldName) }];
}

export const minLengthRule = (minCount, fieldName) => {
    const minLength = minCount;
    return [{check: (str) => str.length >= minLength, fail: tooShort(fieldName) }];
}