export const EN_TO_FA_PLATE_MAP = {
  'A': 'ا',
  'B': 'ب',
  'P': 'پ',
  'T': 'ت',
  'J': 'ج',
  'D': 'د',
  'Z': 'ز',
  'S': 'س',
  'E': 'ع',
  'F': 'ف',
  'G': 'ق',
  'L': 'ل',
  'M': 'م',
  'N': 'ن',
  'V': 'و',
  'H': 'ه',
  'Y': 'ی',
  'c': 'ث',
  'K': 'ک',
  'R': 'ر',
  'I': 'ص',
  'O': 'ش',
  'Q': 'ط',
  'U': 'چ',
  'W': 'گ',
  '*': '*',
  'X': 'سایر'
};

export const convertEnToFa = (plateString) => {
  if (!plateString) return '';

  const letters = plateString.match(/[A-Za-z*]/g) || [];
  const numbers = plateString.match(/\d/g) || [];

  if (letters.length === 0) return plateString;

  const faLetters = letters.map(letter => EN_TO_FA_PLATE_MAP[letter] || letter).join('');

  let result = plateString;
  letters.forEach((letter, index) => {
    result = result.replace(letter, faLetters[index]);
  });

  return result;
};

export const formatPlateForDisplay = (plateString) => {
  if (!plateString) return '';

  const faPlate = convertEnToFa(plateString);

  const hasLetter = /[آ-ی]/g.test(faPlate);
  
  if (faPlate.length === 8 && hasLetter) {
    const part1 = faPlate.substring(0, 2);
    const letter = faPlate.substring(2, 3);
    const part2 = faPlate.substring(3, 6);
    const part3 = faPlate.substring(6, 8);

    return `${part1} (${letter}) ${part2} ${part3}`;
  }

  return faPlate;
};

export const formatPlateForTable = (plateString) => {
  if (!plateString) return '-';
  
  const formatted = formatPlateForDisplay(plateString);

  return (
    <span style={{ 
      direction: 'ltr', 
      display: 'inline-block',
      unicodeBidi: 'embed'
    }}>
      {formatted}
    </span>
  );
};