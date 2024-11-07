export class NumberInputHelper {

  constructor(){}

  static addNumber(props: {value: string; newNumber: string}):string {
    let value = props.value

    value = (parseFloat(value) * 10).toString();

    let newValue = props.newNumber;

    newValue = (parseFloat(newValue) / 100).toFixed(2)

    return (parseFloat(value) + parseFloat(newValue)).toFixed(2);
  }

  static removeNumber(props: {value: string}) {
    let value = props.value;
    let arr = value.split("");
    arr.pop();
    let newValue = (parseFloat(arr.join("")) / 10).toFixed(2);
    return parseFloat(newValue).toFixed(2);
  }

  static handleChange(e: React.KeyboardEvent<HTMLInputElement>, originalValue: string) {
    const { key } = e;

    if (key === " ")
      return originalValue;

    if (key === 'Backspace')
      return (new NumberInputHelper())._forBackspacePressedCase(originalValue)

    return (new NumberInputHelper())._forOtherThanBackspaceAndValidKeyPressedCase(key, originalValue)
  }

  private _forBackspacePressedCase(originalValue: string) {
    if (originalValue !== "0.00") {
      const newValue = NumberInputHelper.removeNumber({value: originalValue});
      return newValue;
    }

    return originalValue;
  }

  private _forOtherThanBackspaceAndValidKeyPressedCase(key: string, originalValue: string) {
    const number = Number(key);
    if (!isNaN(number)) {
      const newValue = NumberInputHelper.addNumber({value: originalValue, newNumber: number.toString()});
      return newValue;
    }

    return originalValue;
  }

}
