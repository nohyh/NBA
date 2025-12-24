export const ToCm = (height) => {
    const [feet,inches] =height.split("-").map(Number)
    return ((feet*12+inches)*2.54).toFixed(1);
}

export const ToKg = (weight) => {
    return ((weight * 0.453592).toFixed(1));
}