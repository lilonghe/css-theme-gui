import { ChromePicker } from "react-color";

const decimalToHex = (alpha) => {
    let aHex = Math.round(255 * alpha).toString(16);
    return alpha === 1 ? '' : aHex.length < 2 ? `0${aHex}` : aHex;
}

export default function FormColorPicker({ value, onChange }) {

    const handleColorChange = (color) => {
        let hex = color.hex + decimalToHex(color.rgb.a);
        onChange(hex)
    }

    return <ChromePicker color={value} onChange={handleColorChange} />;
}