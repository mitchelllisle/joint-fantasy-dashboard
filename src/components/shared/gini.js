/**
 * Calculates the Gini coefficient for an array of numbers.
 * The Gini coefficient measures statistical dispersion, commonly used for inequality measurement.
 * Returns a value between 0 (perfect equality) and 1 (perfect inequality).
 *
 * @param values - Array of non-negative numbers to calculate inequality for
 * @returns Gini coefficient as a number between 0 and 1
 *
 * @example
 * calculateGini([10, 45, 23, 67, 89, 34]);
 */
export function calculateGini(values) {
    if (values.length === 0) return 0;

    const sortedValues = [...values].sort((a, b) => a - b);
    const n = sortedValues.length;
    const mean = sortedValues.reduce((a, b) => a + b) / n;

    let sumNumerator = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            sumNumerator += Math.abs(sortedValues[i] - sortedValues[j]);
        }
    }
    return sumNumerator / (2 * n * n * mean);
}
