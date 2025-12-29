export const ToCm = (height) => {
    if(!height){
        return 'N/A';
    }
    const [feet,inches] =height.split("-").map(Number)
    return ((feet*12+inches)*2.54).toFixed(1);
}

export const ToKg = (weight) => {
    if(!weight){
        return 'N/A';
    }
    return ((weight * 0.453592).toFixed(1));
}